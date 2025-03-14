const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

const { findExpressionDeclaration } = require('../../common/utils/ast');
const { findPropTypesDeclaration } = require('../../common/utils/components');

function getDeclaredProps({ truncatedPath }) {
  const src = fs.readFileSync(`${truncatedPath}.tsx`).toString();

  const propsTypeDeclaration = findPropTypesDeclaration(
    src,
    `${truncatedPath}.tsx`,
  );

  if (!propsTypeDeclaration) {
    return [];
  }

  const { typeParameters } = propsTypeDeclaration.typeAnnotation;

  const propsMembers = typeParameters ? typeParameters.params[0].members : null;

  return propsMembers ? propsMembers.map((member) => member.key.name) : [];
}

function recursiveFindLogicalExpressionProps(expression) {
  switch (expression.type) {
    case 'LogicalExpression': {
      return [
        recursiveFindLogicalExpressionProps(expression.left),
        recursiveFindLogicalExpressionProps(expression.right),
      ];
    }
    case 'MemberExpression':
      return expression.object.name;
    case 'Identifier':
      return expression.name;
    default:
      return null;
  }
}

function getExpressionsInView({ truncatedPath }) {
  const src = fs.readFileSync(`${truncatedPath}.tsx`).toString();

  const expressions = findExpressionDeclaration(src);

  return expressions
    .map(({ test }) => {
      return recursiveFindLogicalExpressionProps(test);
    })
    .flat()
    .filter(Boolean);
}

function getPositivePropsFromStories({ truncatedPath, declaredProps }) {
  const src = fs.readFileSync(`${truncatedPath}.stories.tsx`).toString();

  const baseName = path.basename(truncatedPath);

  const j = jscodeshift.withParser('tsx');
  const ast = j(src);

  const elementCollection = ast.findJSXElements(baseName);

  if (!elementCollection) {
    return [];
  }

  return declaredProps
    .map((item) => {
      const propNodes = ast
        .find(j.JSXAttribute, { name: { name: item } })
        .nodes();

      return propNodes.length ? propNodes : item;
    })
    .flat()
    .reduce((acc, item) => {
      // if there is no Item Node it means that prop is missing is story
      if (typeof item === 'string') {
        acc[item] = {
          isEmpty: false,
          isFulfilled: false,
        };
        return acc;
      }

      const itemName = item.name.name;
      const itemValue = item.value;
      const itemExpression = itemValue && itemValue.expression;

      /**
       * @description
       * When itemValue is null it means that boolean prop was used without value
       * @example
       * <SomeComponent myBooleanProp />
       */
      if (!itemValue) {
        acc[itemName] = {
          hasPositive: true,
          hasNegative: acc[itemName] ? acc[itemName].hasNegative : false,
        };

        return acc;
      }
      if (
        itemExpression &&
        itemExpression.type === 'CallExpression' &&
        (itemExpression.callee.name === 'array' ||
          itemExpression.callee.name === 'text' ||
          itemExpression.callee.name === 'boolean' ||
          itemExpression.callee.name === 'number' ||
          itemExpression.callee.name === 'object')
      ) {
        acc[itemName] = {
          hasPositive: true,
          hasNegative: true,
        };
      }

      if (
        itemExpression &&
        itemExpression.type === 'UnaryExpression' &&
        (itemExpression.argument.type === 'ArrayLiteral' ||
          itemExpression.argument.type === 'TextLiteral' ||
          itemExpression.argument.type === 'BooleanLiteral' ||
          itemExpression.argument.type === 'NumericLiteral' ||
          itemExpression.argument.type === 'ObjectLiteral' ||
          itemExpression.argument.type === 'NullLiteral')
      ) {
        acc[itemName] = {
          hasPositive: true,
          hasNegative: true,
        };
      }
      if (itemValue.value) {
        acc[itemName] = {
          hasPositive: true,
          hasNegative: acc[itemName] ? acc[itemName].hasNegative : false,
        };
      } else {
        acc[itemName] = {
          hasPositive: acc[itemName] ? acc[itemName].hasPositive : false,
          hasNegative: true,
        };
      }
      return acc;
    }, {});
}

function getMessagesFromConditionalProps(propsDefs) {
  return Object.keys(propsDefs).reduce((acc, propName) => {
    const { hasNegative, hasPositive } = propsDefs[propName];
    let message = '';

    if (!acc && (!hasNegative || !hasPositive)) {
      message += 'Some conditional props are not covered in stories: ';
    }

    if (!hasNegative) {
      message += `"${propName}" doesn't have negative render. `;
    }

    if (!hasPositive) {
      message += `"${propName}" doesn't have positive render. `;
    }

    return `${acc}${message}`;
  }, '');
}

module.exports = {
  getDeclaredProps,
  getExpressionsInView,
  getPositivePropsFromStories,
  getMessagesFromConditionalProps,
};
