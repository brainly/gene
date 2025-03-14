const fs = require('fs');
const jscodeshift = require('jscodeshift');
const j = jscodeshift.withParser('tsx');

function getUseMediatorQtt(file) {
  const src = fs.readFileSync(file).toString();
  const ast = j(src);

  const mediatorHooks = ast.find(j.Identifier).filter((path) => {
    return path.name === 'callee' && path.value.name === 'useMediator';
  });

  return mediatorHooks.length;
}

module.exports = { getUseMediatorQtt };
