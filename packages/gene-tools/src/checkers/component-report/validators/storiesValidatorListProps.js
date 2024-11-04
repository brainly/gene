const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

const {isArrayProp} = require('../../common/utils/ast');
const {findPropTypesDeclaration} = require('../../common/utils/components');

function getListsFromStories({truncatedPath, declaredLists}) {
  const src = fs.readFileSync(`${truncatedPath}.stories.tsx`).toString();

  const baseName = path.basename(truncatedPath);

  const j = jscodeshift.withParser('tsx');
  const ast = j(src);

  const elementCollection = ast.findJSXElements(baseName);

  if (!elementCollection) {
    return [];
  }

  return declaredLists
    .map(item => {
      const propNodes = ast.find(j.JSXAttribute, {name: {name: item}}).nodes();

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
      const itemValue = item.value.expression;

      // for knob verification
      if (
        itemValue.type === 'CallExpression' &&
        itemValue.callee.name === 'array'
      ) {
        acc[itemName] = {
          isEmpty: true,
          isFulfilled: true,
        };
      }

      if (itemValue.type === 'ArrayExpression') {
        const elements = itemValue.elements;
        const existingItem = acc[itemName] || {};
        const isEmpty = existingItem.isEmpty || !elements.length;
        const isFulfilled = existingItem.isFulfilled || !!elements.length;

        acc[itemName] = {
          isEmpty,
          isFulfilled,
        };
      }

      return acc;
    }, {});
}

function getDeclaredLists({truncatedPath}) {
  const src = fs.readFileSync(`${truncatedPath}.tsx`).toString();

  const propsTypeDeclaration = findPropTypesDeclaration(
    src,
    `${truncatedPath}.tsx`
  );

  if (!propsTypeDeclaration) {
    return [];
  }

  const {typeParameters} = propsTypeDeclaration.typeAnnotation;

  const propsMembers = typeParameters ? typeParameters.params[0].members : null;

  return propsMembers
    ? propsMembers
        .map(
          member =>
            isArrayProp(member.typeAnnotation.typeAnnotation) && member.key.name
        )
        .filter(Boolean)
    : [];
}

function getMessagesFromListProps(props) {
  const keys = Object.keys(props);

  if (keys.length === 0) {
    return null;
  }

  return keys
    .map(prop => {
      const propObj = props[prop];

      let message = `Prop ${prop}: `;

      if (!propObj.isEmpty) {
        message += 'no empty list in story';
      }

      if (!propObj.isFulfilled) {
        const withAnd = !propObj.isEmpty;
        const isFulFilledMessage = 'no fulfilled list in story';

        message += withAnd ? ` and ${isFulFilledMessage}` : isFulFilledMessage;
      }

      return propObj.isEmpty && propObj.isFulfilled ? null : message;
    })
    .filter(Boolean)
    .join(', ');
}

module.exports = {
  getDeclaredLists,
  getMessagesFromListProps,
  getListsFromStories,
};
