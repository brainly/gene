const jscodeshift = require('jscodeshift');
const fs = require('fs');
const j = jscodeshift.withParser('tsx');
const path = require('path');

const {findComponentDefinition} = require('./ast');
const {getComponentMetadata} = require('./meta');

function getDeclarationFromAssignedTypeOrInterface(ast, file, type) {
  if (!type.typeAnnotation.typeName || !type.typeAnnotation.typeName.name) {
    return type;
  }

  const name = type.typeAnnotation.typeName.name;

  const declaration = getTypeOrInterfaceDeclaration(ast, file, name);
  if (declaration.type === 'TSInterfaceDeclaration') {
    return {
      ...declaration,
      typeAnnotation: {
        types: declaration.extends,
        typeParameters: {
          params: [
            {
              members: declaration.body.body,
            },
          ],
        },
      },
    };
  }

  if (
    declaration.type === 'TSTypeAliasDeclaration' &&
    declaration.typeAnnotation.typeParameters
  ) {
    return declaration;
  }

  return getDeclarationFromAssignedTypeOrInterface(ast, file, declaration);
}
function getTypeOrInterfaceDeclaration(ast, file, name) {
  const local = getLocalTypeOrInterfaceDeclaration(ast, name);
  if (local) {
    return local;
  }

  return getImportedTypeOrInterfaceDeclaration(ast, file, name);
}

function getLocalTypeOrInterfaceDeclaration(ast, name) {
  const typeDeclaration = ast
    .find(j.TSTypeAliasDeclaration, {
      id: {
        name,
      },
    })
    .nodes()[0];

  if (typeDeclaration) {
    return typeDeclaration;
  }

  const interfaceDeclaration = ast
    .find(j.TSInterfaceDeclaration, {
      id: {
        name,
      },
    })
    .nodes()[0];

  return interfaceDeclaration;
}

function getImportedTypeOrInterfaceDeclaration(ast, file, name) {
  const importDeclaration = ast
    .find(j.ImportDeclaration)
    .filter(({node}) =>
      node.specifiers.find(specifier => specifier.local.name === name)
    )
    .nodes()[0];

  const importedName = importDeclaration.specifiers[0].imported.name;
  const typeSource = importDeclaration.source.value;

  if (typeSource.includes('@')) {
    throw new Error('Importing types from other libs is not allowed');
  }

  const splitted = typeSource.split(/\/|\\/);

  const pathToTypes = path.join(file, '..', ...splitted);

  let pathWithExtension = pathToTypes + '.tsx';
  let typeSrc;

  try {
    typeSrc = fs.readFileSync(pathWithExtension).toString();
  } catch (err) {
    pathWithExtension = pathToTypes + '.ts';
    typeSrc = fs.readFileSync(pathWithExtension).toString();
  }

  const typeAst = j(typeSrc);

  const declaration = getLocalTypeOrInterfaceDeclaration(typeAst, importedName);
  declaration.typeAst = typeAst;
  declaration.filePath = pathWithExtension;

  return declaration;
}

function getMembersFromIntersectingTypes(ast, file, types) {
  const declarations = types.map(type => {
    if (
      (type.typeName && type.typeName.name === 'Readonly') ||
      type.type === 'TSTypeLiteral'
    ) {
      return {
        typeAnnotation: type,
      };
    }

    let name;

    if (type.typeName) {
      name = type.typeName.name;
    } else {
      name = type.expression.name;
    }

    if (name === 'T') {
      return null;
    }

    const declaration = getTypeOrInterfaceDeclaration(ast, file, name);

    return declaration;
  });

  const literal = declarations.find(({typeAnnotation}) => {
    if (!typeAnnotation) {
      return false;
    }
    return typeAnnotation.type === 'TSTypeLiteral';
  });

  if (literal) {
    throw new Error(
      `One of intersecting types declaration looks invalid (did you use Readonly?)`
    );
  }

  const members = declarations
    .map(type => {
      let typeAst = type.typeAst;

      if (!typeAst) {
        typeAst = ast;
      }

      let filePath = type.filePath;

      if (!filePath) {
        filePath = file;
      }

      if (type.types) {
        return getMembersFromIntersectingTypes(typeAst, filePath, type.types);
      }

      if (type.extends) {
        return [
          ...type.body.body,
          ...getMembersFromIntersectingTypes(typeAst, filePath, type.extends),
        ];
      }

      if (type.type === 'TSInterfaceDeclaration') {
        return type.body.body;
      }

      return type.typeAnnotation.typeParameters.params[0].members;
    })
    .flat();

  return members.filter(Boolean);
}

function findPropTypesDeclaration(src, file) {
  const ast = j(src);

  const defaultExportCollection = ast.find(j.ExportDefaultDeclaration);

  const {componentName} = getComponentMetadata(src);

  const componentDef = findComponentDefinition(
    defaultExportCollection.paths()[0],
    componentName
  );

  // TODO: Figure out if we want to valdiate props in HOCs
  if (componentDef === null) {
    return null;
  }

  const propsTypeAliasName =
    componentDef.params[0] &&
    componentDef.params[0].typeAnnotation &&
    componentDef.params[0].typeAnnotation.typeAnnotation.typeName.name;

  if (!propsTypeAliasName) {
    return null;
  }

  let propsType = ast
    .find(j.TSTypeAliasDeclaration, {
      id: {
        name: propsTypeAliasName,
      },
    })
    .nodes()[0];

  if (!propsType.typeAnnotation.typeParameters) {
    propsType = getDeclarationFromAssignedTypeOrInterface(ast, file, propsType);
  }

  if (propsType.typeAnnotation.types) {
    const types = propsType.typeAnnotation.types;

    let typeAst = propsType.typeAst;

    if (!typeAst) {
      typeAst = ast;
    }

    let filePath = propsType.filePath;

    if (!filePath) {
      filePath = file;
    }

    const members = getMembersFromIntersectingTypes(typeAst, filePath, types);

    const existingMembers =
      (propsType.typeAnnotation.typeParameters &&
        propsType.typeAnnotation.typeParameters.params[0].members) ||
      [];

    return {
      ...propsType,
      typeAnnotation: {
        ...propsType.typeAnnotation,
        typeParameters: {
          ...propsType.typeAnnotation.typeParameters,
          params: [
            {
              members: [...existingMembers, ...members],
            },
          ],
        },
      },
    };
  }

  return propsType;
}

module.exports = {findPropTypesDeclaration};
