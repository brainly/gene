const fs = require('fs');
const jscodeshift = require('jscodeshift');

const j = jscodeshift.withParser('tsx');

function getModuleStoriesMeta({ storybookFile }) {
  const src = fs.readFileSync(storybookFile).toString();
  const ast = j(src);

  /**
   * CSF1 format
   * storiesOf('ValidModule')
   *   .add('DefaultView', () => <ValidModule />);
   */
  const storiesOfStories = ast
    .find(jscodeshift.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'add',
        },
      },
    })
    .nodes()
    .map((node) => {
      if (
        node.arguments[1] &&
        node.arguments[1].body &&
        node.arguments[1].body.openingElement &&
        node.arguments[1].body.openingElement.name
      ) {
        const storybookLabel = node.arguments[0].value;
        const moduleVariantName =
          node.arguments[1].body.openingElement.name.name;
        return [moduleVariantName, storybookLabel];
      }
    })
    .filter(Boolean);

  /**
   * CSF2 format
   * export const DefaultView = () => <ValidModule />;
   */
  const csf2Stories = ast
    .find(jscodeshift.ExportNamedDeclaration)
    .nodes()
    .map((node) => {
      if (
        node.declaration &&
        node.declaration.declarations[0] &&
        node.declaration.declarations[0].init &&
        node.declaration.declarations[0].init.body &&
        node.declaration.declarations[0].init.body.openingElement &&
        node.declaration.declarations[0].init.body.openingElement.name
      ) {
        const storybookLabel = node.declaration.declarations[0].id.name;
        const moduleVariantName =
          node.declaration.declarations[0].init.body.openingElement.name.name;
        return [moduleVariantName, storybookLabel];
      }
    })
    .filter(Boolean);

  /**
   * CSF3 format
   * export const DefaultView = {
   *   render: () => <ValidModule />
   * };
   */
  const csf3Stories = ast
    .find(jscodeshift.ExportNamedDeclaration)
    .nodes()
    .map((node) => {
      if (
        node.declaration &&
        node.declaration.type === 'VariableDeclaration' &&
        node.declaration.declarations[0] &&
        node.declaration.declarations[0].init &&
        node.declaration.declarations[0].init.type === 'ObjectExpression'
      ) {
        const storyName = node.declaration.declarations[0].id.name;
        const renderProperty =
          node.declaration.declarations[0].init.properties.find(
            (prop) => prop.key.name === 'render'
          );

        if (
          renderProperty &&
          renderProperty.value &&
          renderProperty.value.body &&
          renderProperty.value.body.openingElement &&
          renderProperty.value.body.openingElement.name
        ) {
          const moduleVariantName =
            renderProperty.value.body.openingElement.name.name;
          return [moduleVariantName, storyName];
        }
      }
      return null;
    })
    .filter(Boolean);

  return [...storiesOfStories, ...csf2Stories, ...csf3Stories];
}

module.exports = { getModuleStoriesMeta };
