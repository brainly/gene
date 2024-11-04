const fs = require('fs');
const jscodeshift = require('jscodeshift');

const j = jscodeshift.withParser('tsx');

function getModuleStoriesMeta({storybookFile}) {
  const src = fs.readFileSync(storybookFile).toString();
  const ast = j(src);

  const oldStories = ast.find(jscodeshift.CallExpression, {
  callee: {
    type: 'MemberExpression',
    property: {
      name: 'add',
    },
  },
}).nodes().map(node => {
  if (node.arguments[1] && node.arguments[1].body && node.arguments[1].body.openingElement && node.arguments[1].body.openingElement.name) {
    const storybookLabel = node.arguments[0].value;
    const moduleVariantName = node.arguments[1].body.openingElement.name.name;
    return [moduleVariantName, storybookLabel];
  }
}).filter(Boolean);

  // Find stories in new Storybook format
  const newStories = ast.find(jscodeshift.ExportNamedDeclaration).nodes().map(node => {
    if (node.declaration && node.declaration.declarations[0] && node.declaration.declarations[0].init && node.declaration.declarations[0].init.body && node.declaration.declarations[0].init.body.openingElement && node.declaration.declarations[0].init.body.openingElement.name) {
      const storybookLabel = node.declaration.declarations[0].id.name;
      const moduleVariantName = node.declaration.declarations[0].init.body.openingElement.name.name;
      return [moduleVariantName, storybookLabel];
    }
  }).filter(Boolean);

  return [...oldStories, ...newStories];
}

module.exports = {getModuleStoriesMeta};
