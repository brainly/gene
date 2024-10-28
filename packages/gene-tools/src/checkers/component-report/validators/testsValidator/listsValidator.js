const jscodeshift = require('jscodeshift');
const R = require('ramda');

const j = jscodeshift.withParser('tsx');

/**
 * @description
 * converts flatten array with all map accessess to
 * nested array with each map access as an item
 * @example
 * ['cmp', 'map', 'cmp2', 'prop', 'map'] => [['cmp', 'map'], ['cmp2', 'prop', 'map']]
 */
const splitMapAccesses = R.reduce((mapAccesses, accessMember) => {
  const [previousMaps, ...lastMap] = R.splitAt(-1, mapAccesses);

  const newMapAccesses = [
    ...previousMaps.map(R.flatten),
    R.flatten([...lastMap, accessMember]),
  ];

  if (accessMember !== 'map') {
    return newMapAccesses;
  }

  return [...newMapAccesses, []];
}, []);

const getFirstNodeArgument = R.path(['arguments', 0]);
const isNodeArgumentExisting = R.pipe(getFirstNodeArgument, R.isNil, R.not);
const getNodeArgumentValueOrName = node => {
  if (node.type === 'Identifier') {
    return node.name;
  }

  return node.value;
};

const getLengthAssertionArguments = R.pipe(
  R.filter(isNodeArgumentExisting),
  R.map(R.pipe(getFirstNodeArgument, getNodeArgumentValueOrName))
);

const getMapAccesses = R.map(R.prop('name'));

const parseForCodeInvocationMarkup = code => `\`${code}(...)\``;

const getMissingMapAccessesMessage = R.pipe(
  splitMapAccesses,
  R.filter(R.compose(R.not, R.isEmpty)),
  R.map(R.join('.')),
  R.map(parseForCodeInvocationMarkup),
  R.join(', '),
  R.concat(
    'Some lists lengths assertions are missing, use both `.toHaveLength(0)` and `.toHaveLength(n)` for lists: '
  )
);

/**
 * @description
 * Finds .map() invocation inside JSX expression (`{list.map(...)}`)
 */
const getMapInvocations = ({src}) => {
  const ast = j(src);

  return ast
    .find(j.MemberExpression, {
      property: {
        name: 'map',
      },
    })
    .find(j.Identifier)
    .nodes();
};

const getListAssertions = src => {
  const ast = j(src);

  return ast
    .find(j.CallExpression, {
      callee: {property: {name: 'toHaveLength'}},
    })
    .nodes();
};

/**
 * @description
 * Check if both empty and fulfilled (value or variable) list lengths were asserted
 */
const isListCovered = R.pipe(
  getListAssertions,
  getLengthAssertionArguments,
  R.both(
    R.any(R.equals(0)),
    R.any(R.either(lengthAssertion => lengthAssertion > 1, R.is(String)))
  )
);

const getMissingListsCoverage = ({testsSrc, cmpSrc}) => {
  const mapInvocations = getMapInvocations({src: cmpSrc});

  if (R.isEmpty(mapInvocations)) {
    return null;
  }

  const listCovered = isListCovered(testsSrc);

  if (listCovered) {
    return null;
  }

  return R.pipe(getMapAccesses, getMissingMapAccessesMessage)(mapInvocations);
};

module.exports = {getMissingListsCoverage};
