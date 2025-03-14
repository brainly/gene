function getUseInjectionIdentifiers(ast, j) {
  const useInjectionsDeclarations = ast
    .find(j.CallExpression, {
      callee: { name: 'useModuleInjection' },
    })
    .paths();

  return useInjectionsDeclarations
    .map((path) => path.value.arguments)
    .map(([argument]) => ({
      type: argument.type,
      name: argument.name || argument.value,
    }));
}

function getIdentifiersFromModuleManifest(ast, j) {
  return ast
    .find(j.CallExpression, { callee: { name: 'createGeneModule' } })
    .find(j.ObjectExpression)
    .find(j.ObjectProperty)
    .filter((path) => path.value.key.name === 'declarations')
    .find(j.ObjectProperty)
    .filter(
      (path) =>
        path.value.key.name === 'mediators' ||
        path.value.key.name === 'components',
    )
    .nodes()
    .map((node) =>
      node.value.elements
        ? node.value.elements.map((element) => {
            const firstTupleElement = element.elements[0];

            if (!firstTupleElement) {
              return undefined;
            }

            return {
              type: firstTupleElement.type,
              name: firstTupleElement.value || firstTupleElement.name,
            };
          })
        : [],
    )
    .flat();
}

function validateUseInjectionIdentifiers(
  useInjectionIdentifiers,
  moduleManifestIdentifiers,
) {
  for (let i = 0; i <= useInjectionIdentifiers.length - 1; i++) {
    const useInjectionIdentifier = useInjectionIdentifiers[i];

    const hasBinding = moduleManifestIdentifiers.some(
      (item) =>
        item.type === useInjectionIdentifier.type &&
        item.name === useInjectionIdentifier.name,
    );

    if (!hasBinding) {
      return {
        valid: false,
        error: `Not detected default binding for injection identifier: ${useInjectionIdentifier.name}`,
      };
    }
  }

  return {
    valid: true,
  };
}

module.exports = {
  getUseInjectionIdentifiers,
  getIdentifiersFromModuleManifest,
  validateUseInjectionIdentifiers,
};
