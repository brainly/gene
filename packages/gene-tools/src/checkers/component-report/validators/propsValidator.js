const fs = require('fs');
const jscodeshift = require('jscodeshift');

const { getComponentMetadata } = require('../../common/utils/meta');
const { findComponentDefinition } = require('../../common/utils/ast');
const { findPropTypesDeclaration } = require('../../common/utils/components');

const j = jscodeshift.withParser('tsx');

function validateProps(file) {
  try {
    const src = fs.readFileSync(file).toString();
    const ast = j(src);

    const { componentName, hocs, isPrivate } = getComponentMetadata(src);

    const defaultExportCollection = ast.find(j.ExportDefaultDeclaration);

    const componentDef = findComponentDefinition(
      defaultExportCollection.paths()[0],
      componentName
    );

    if (componentDef && componentDef.params.length === 0) {
      // a component does not accept props
      return { valid: true };
    }

    if (hocs[0] !== 'React.memo') {
      return { valid: false, error: 'React.memo is missing in default export' };
    }

    // we have some HOCs in the default export but the component is defined in a separate file
    if (hocs.length > 1 && componentDef === null) {
      return {
        valid: true,
      };
    }

    if (
      componentDef.params.length === 2 &&
      componentDef.params[0].typeAnnotation === null
    ) {
      return {
        valid: false,
        error: `PropsType should be added explicitly to the props. (props: PropsType, ref) => {}`,
      };
    }

    const propsTypeDeclaration = findPropTypesDeclaration(src, file);
    const { typeParameters, type } = propsTypeDeclaration.typeAnnotation;

    const propsMembers = typeParameters
      ? typeParameters.params[0].members
      : null;

    if (!propsMembers) {
      if (type === 'TSTypeLiteral') {
        return {
          valid: false,
          error: `PropsType declaration looks invalid (did you use Readonly?)`,
        };
      }

      return {
        valid: false,
        error: `PropsType declaration looks invalid (found ${type})`,
      };
    } else {
      for (const prop of propsMembers) {
        if (!prop.key) {
          return {
            valid: false,
            error: 'All props should be named',
          };
        }
      }

      if (isPrivate) {
        return { valid: true };
      }

      // Components should not accept callback props
      for (const prop of propsMembers) {
        if (prop.key.name.startsWith('render')) {
          // we allow render props
          continue;
        }

        if (prop.key.name.startsWith('on')) {
          return {
            valid: false,
            error: `A component should not accept a callback prop: ${prop.key.name}`,
          };
        }

        if (prop.typeAnnotation.typeAnnotation.type === 'TSFunctionType') {
          return {
            valid: false,
            error: `PropsType declaration includes a function property: ${prop.key.name}`,
          };
        }
      }
    }
  } catch (e) {
    return { valid: false, error: `Error validating props: ${e.message}` };
  }

  return { valid: true };
}

module.exports = { validateProps };
