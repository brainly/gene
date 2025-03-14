const fs = require('fs');
const jscodeshift = require('jscodeshift');

const {
  validateMemoization,
} = require('../../common/validators/memoizeValidator');
const { validateImports } = require('./common/validateImports');
const {
  getUseInjectionIdentifiers,
  getIdentifiersFromModuleManifest,
  validateUseInjectionIdentifiers,
} = require('./common/useInjectionValidators');

const j = jscodeshift.withParser('tsx');

function getModuleDeclarationFile(filePath) {
  try {
    const src = fs.readFileSync(filePath).toString();
    return j(src);
  } catch {
    return null;
  }
}

function isUsedcreateGeneModule(path) {
  return path.value.callee.name === 'createGeneModule';
}

function isUsedExtendGeneModule(path) {
  return path.value.callee.name === 'extendGeneModule';
}

function validateModuleDeclaration({ file, isCore, checkerConfig }) {
  try {
    const { memoization } = checkerConfig.rules;

    const fileAst = getModuleDeclarationFile(file);

    const callExpressionDeclarationsModuleFile = fileAst
      ?.find(j.CallExpression)
      .paths();

    if (!callExpressionDeclarationsModuleFile) {
      return {
        valid: false,
        error:
          'Module is not declared with "createGeneModule" or "extendGeneModule" factory!!',
      };
    }

    if (isCore) {
      const hascreateGeneModuleCallExpression =
        callExpressionDeclarationsModuleFile.some(isUsedcreateGeneModule);

      if (!hascreateGeneModuleCallExpression) {
        return {
          valid: false,
          error: 'Module is not declared with "createGeneModule" factory!',
        };
      }
    }

    if (!isCore) {
      const hasExtendGeneModuleCallExpression =
        callExpressionDeclarationsModuleFile.some(isUsedExtendGeneModule) ||
        callExpressionDeclarationsModuleFile.some(isUsedcreateGeneModule);

      if (!hasExtendGeneModuleCallExpression) {
        return {
          valid: false,
          error:
            'Module is not declared with "createGeneModule" or "extendGeneModule" factory!',
        };
      }
    }

    if (file) {
      /*
      check Module.tsx file
     */

      if (memoization?.enabled || memoization === true) {
        const memoizationCheck = validateMemoization(file);

        if (!memoizationCheck.valid) {
          return memoizationCheck;
        }
      }

      const src = fs.readFileSync(file).toString();
      const ast = j(src);

      const functionDeclarations = ast.find(j.FunctionDeclaration).paths();
      const importDeclarations = ast.find(j.ImportDeclaration).paths();

      // check if useInit is declared
      const hasUseInitDeclaration = functionDeclarations.some(
        (path) => path.value.id.name === 'useInit',
      );

      if (isCore && !hasUseInitDeclaration) {
        return {
          error: `useInit hook not found. You should define useInit hook`,
          valid: false,
        };
      }

      const importsValidation = validateImports(importDeclarations);

      if (!importsValidation.valid) {
        return importsValidation;
      }

      if (isCore) {
        /*
        check Module.tsx useInjection and index.ts declarations
       */

        const useInjectionIdentifiers = getUseInjectionIdentifiers(ast, j);

        const componentsAndMediatorsBindingsInManifest =
          getIdentifiersFromModuleManifest(fileAst, j);

        const useInjectionValidationResult = validateUseInjectionIdentifiers(
          useInjectionIdentifiers,
          componentsAndMediatorsBindingsInManifest,
        );

        if (!useInjectionValidationResult.valid) {
          return useInjectionValidationResult;
        }
      }
    }
  } catch (e) {
    return { valid: false, error: `${e.message}` };
  }

  return { valid: true, type: 'success' };
}

module.exports = { validateModuleDeclaration };
