const jscodeshift = require('jscodeshift');

const j = jscodeshift.withParser('tsx');

const {
  findFunctionDeclaration,
  findVariableDeclarator,
  isMarkedAsPrivate,
} = require('./ast');

function getDefaultExportDeclaration(ast) {
  const defaultExportCollection = ast.find(j.ExportDefaultDeclaration);

  const defaultExportDeclaration = defaultExportCollection.nodes()[0];

  if (!defaultExportDeclaration) {
    throw new Error('No default export found');
  }

  return defaultExportDeclaration.declaration;
}

function getNamedExportModuleDeclaration(ast) {
  const namedExportCollection = ast.find(j.ExportNamedDeclaration);

  for (const path of namedExportCollection.nodes()) {
    if (path.specifiers) {
      const moduleExport = path.specifiers.find(specifier => {
        return specifier.exported.name.includes('Module');
      });

      if (moduleExport) {
        return {name: moduleExport.exported.name};
      }
    }
  }

  return {name: null};
}

function getComponentName(ast) {
  let namedExportDeclaration = getNamedExportModuleDeclaration(ast);

  if (namedExportDeclaration.name) {
    return namedExportDeclaration.name;
  }

  let defaultExportDeclaration = getDefaultExportDeclaration(ast);

  while (defaultExportDeclaration.type === 'CallExpression') {
    defaultExportDeclaration = defaultExportDeclaration.arguments[0];
  }

  const componentName = defaultExportDeclaration.name;

  return componentName;
}

function formatHoc(hoc) {
  if (hoc.type === 'Identifier') {
    return hoc.name;
  } else if (hoc.type === 'MemberExpression') {
    return `${hoc.object.name}.${hoc.property.name}`;
  } else {
    throw new Error(`Unexpected hoc type: ${hoc.type}`);
  }
}

function getHOCs(ast) {
  let declaration = getDefaultExportDeclaration(ast);

  const hocs = [];

  while (declaration.type === 'CallExpression') {
    if (
      declaration.callee.type === 'CallExpression' &&
      declaration.callee.callee.name === 'compose'
    ) {
      for (const hoc of declaration.callee.arguments) {
        hocs.push(formatHoc(hoc));
      }
    } else {
      hocs.push(formatHoc(declaration.callee));
    }

    declaration = declaration.arguments[0];
  }

  return hocs;
}

function getComponentDisplayName(ast) {
  const componentName = getComponentName(ast);
  const hocs = getHOCs(ast);

  if (hocs.length === 0) {
    return componentName;
  }

  const displayName = `compose(${hocs.join(', ')})(${componentName})`;

  return displayName;
}

function getComponentIsPrivate(ast) {
  const defaultExportCollection = ast.find(j.ExportDefaultDeclaration);

  const componentName = getComponentName(ast);

  const componentAsFunction = findFunctionDeclaration(
    defaultExportCollection.paths()[0],
    componentName
  );

  const componentAsVariableDeclarator = findVariableDeclarator(
    defaultExportCollection.paths()[0],
    componentName
  );

  const isPrivate = Boolean(
    (componentAsVariableDeclarator &&
      isMarkedAsPrivate(componentAsVariableDeclarator.parent.node)) ||
      (componentAsFunction && isMarkedAsPrivate(componentAsFunction.node))
  );

  return isPrivate;
}

function getComponentMetadata(src) {
  const ast = j(src);

  const componentName = getComponentName(ast);
  const isPrivate = getComponentIsPrivate(ast);
  const componentDisplayName = getComponentDisplayName(ast);
  const hocs = getHOCs(ast);

  return {componentName, isPrivate, componentDisplayName, hocs};
}

module.exports = {
  getComponentMetadata,
  getComponentName,
};
