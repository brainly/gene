const fs = require('fs');
const jscodeshift = require('jscodeshift');

const j = jscodeshift.withParser('tsx');

function validateScss({ truncatedPath }) {
  const scssExists = fs.existsSync(`${truncatedPath}.module.scss`);
  const src = fs.readFileSync(`${truncatedPath}.tsx`).toString();
  const ast = j(src);

  const doesImportScss =
    ast
      .find(j.ImportDeclaration)
      .nodes()
      .filter((n) => n.source.value.endsWith('scss')).length > 0;

  return { valid: doesImportScss ? scssExists : true };
}

module.exports = {
  validateScss,
};
