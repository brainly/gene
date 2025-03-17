const fs = require('fs');
const jscodeshift = require('jscodeshift');

const {
  getUseInjectionIdentifiers,
  getIdentifiersFromModuleManifest,
  validateUseInjectionIdentifiers,
} = require('./common/useInjectionValidators');
const { validateImports } = require('./common/validateImports');

const j = jscodeshift.withParser('tsx');

function validateDelegates({
  filePath,
  moduleFiles,
  checkerConfig,
  allDelegatesFiles,
}) {
  try {
    const src = fs.readFileSync(filePath).toString();
    const ast = j(src);
    const delegateName = filePath.split('/').pop().split('.').shift();

    const {
      no_jsx_in_delegates,
      no_jsx_in_hooks,
      no_direct_inversify_import: noDirectInversifyImport,
      unit_tests_for_delegates_required,
      unit_tests_for_hooks_required,
    } = checkerConfig.rules;

    const noJsxInDelegates = no_jsx_in_delegates || no_jsx_in_hooks;

    const unitTestsForDelegatesRequired =
      unit_tests_for_delegates_required || unit_tests_for_hooks_required;

    const useInjectionIdentifiers = getUseInjectionIdentifiers(ast, j);

    const allModuleFiles = moduleFiles.map(([, { module }]) => module);

    for (const moduleFile of allModuleFiles) {
      const moduleSrc = fs.readFileSync(moduleFile).toString();
      const moduleAst = j(moduleSrc);

      const isDelegateUsedInModule = moduleAst.find(j.CallExpression, {
        callee: { name: delegateName },
      }).length;

      if (!isDelegateUsedInModule) {
        continue;
      }

      const bindingsInManifest = getIdentifiersFromModuleManifest(moduleAst, j);

      let bindingsInCoreManifest = [];

      const componentsAndMediatorsBindingsInManifest = [
        ...bindingsInManifest,
        ...bindingsInCoreManifest,
      ];

      const useInjectionValidationResult = validateUseInjectionIdentifiers(
        useInjectionIdentifiers,
        componentsAndMediatorsBindingsInManifest,
      );

      if (!useInjectionValidationResult.valid) {
        return useInjectionValidationResult;
      }
    }

    // check if there is no JSX elements
    const JSXElements = ast.find(j.JSXElement).paths();

    if (
      JSXElements.length > 0 &&
      (noJsxInDelegates?.enabled || noJsxInDelegates === true)
    ) {
      return {
        valid: false,
        error: `Detected JSX element! Custom hooks shouldn't have JSX elements.`,
      };
    }

    // check imports
    const importDeclarations = ast.find(j.ImportDeclaration).paths();

    const importsValidation = validateImports(importDeclarations);

    if (
      !importsValidation.valid &&
      (noDirectInversifyImport?.enabled || noDirectInversifyImport === true)
    ) {
      return importsValidation;
    }

    // check if unit tests are required
    if (
      unitTestsForDelegatesRequired?.enabled ||
      unitTestsForDelegatesRequired === true
    ) {
      const delegateTestFile = allDelegatesFiles.find(
        (file) =>
          (file.includes('.test.ts') || file.includes('.spec.ts')) &&
          file.includes(delegateName),
      );

      if (!delegateTestFile) {
        return {
          valid: false,
          error: `Custom hook test file not found! Custom hook test file should be named ${delegateName}.spec.ts(x) or ${delegateName}.test.ts(x) and should be located in the same folder as the custom hook file.`,
        };
      }
    }
  } catch (e) {
    return { valid: false, error: `${e.message}` };
  }

  return { valid: true, type: 'success' };
}

module.exports = { validateDelegates };
