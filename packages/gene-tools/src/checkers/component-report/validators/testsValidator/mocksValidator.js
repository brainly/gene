const jscodeshift = require('jscodeshift');

const j = jscodeshift.withParser('tsx');
const R = require('ramda');

/**
 * .nodes() is not usable here as parent path is required
 */
const getMockMemberExpressions = (ast) => {
  const memberMocksExpressions = [];

  ast
    .find(j.MemberExpression, {
      property: {
        name: 'mock',
      },
    })
    .forEach((nodePath) => memberMocksExpressions.push(nodePath));

  return memberMocksExpressions;
};

const getUnnecessaryMocks = R.pipe(
  R.prop('testsSrc'),
  j,
  getMockMemberExpressions,
  R.map(R.path(['parentPath', 'value', 'arguments', 0, 'value'])),
  R.filter(R.includes('@brainly-gene/core')),
  R.map((noAllowedMock) => `\`${noAllowedMock}\``),
  R.join(', '),
  R.ifElse(
    R.identity,
    R.concat('There are unnecessary mocks on modules: '),
    R.always(null),
  ),
);

module.exports = { getUnnecessaryMocks };
