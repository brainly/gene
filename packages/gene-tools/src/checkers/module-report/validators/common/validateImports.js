function validateImports(importDeclarations) {
  // check if inversify is imported
  const hasInversifyImportDeclaration = importDeclarations.some(
    (path) => path.value.source.value === 'inversify',
  );

  if (hasInversifyImportDeclaration) {
    return {
      error: `Detected import of "inversify" lib. Do not use inversify directly in modules.`,
      valid: false,
    };
  }

  return {
    valid: true,
  };
}

module.exports = { validateImports };
