const fs = require('fs');
const jscodeshift = require('jscodeshift');

const {
  findFunctionDeclaration,
  findVariableDeclarator,
} = require('../../common/utils/ast');

const { shouldSkipNextLine } = require('../../common/utils/shouldSkipNextLine');

const {
  GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
} = require('.././constants/nextLineDisablers');

const { getComponentName } = require('../../common/utils/meta');

const j = jscodeshift.withParser('tsx');

const PROPS_ALLOWLIST = ['ref', 'className'];

function isDeclaredOutsideComponent(componentName, declaration) {
  return declaration.scope.declares(componentName);
}

function isMemoized(declaration) {
  const { init } = declaration;

  if (init.type === 'ArrowFunctionExpression') {
    return false;
  }

  if (init.type === 'ObjectExpression') {
    return false;
  }

  if (init.type === 'CallExpression') {
    const { callee } = init;

    if (callee.type === 'Identifier') {
      return (
        callee.name === 'useCallback' ||
        callee.name === 'useMemo' ||
        callee.name === 'useInjection'
      );
    }

    if (callee.type === 'MemberExpression') {
      return (
        callee.property.name === 'useInjection' ||
        callee.property.name === 'useCallback' ||
        callee.property.name === 'useMemo'
      );
    }
  }

  return true;
}

function validateMemoization(file) {
  const src = fs.readFileSync(file).toString();

  const ast = j(src);
  const componentName = getComponentName(ast);

  const jsxAttributesCollection = ast.find(j.JSXAttribute, {
    value: { type: 'JSXExpressionContainer' },
  });

  const styleGuideImportedElements = [];

  ast
    .find(j.ImportDeclaration)
    .filter((path) => {
      return path.value.source.value === 'brainly-style-guide';
    })
    .forEach((path) => {
      const importedElements = path.value.specifiers.map(
        (el) => el.imported.name,
      );

      styleGuideImportedElements.push(...importedElements);
    });

  const jsxElementsWithoutStyleGuideElements = jsxAttributesCollection.filter(
    (element) => {
      if (styleGuideImportedElements.length) {
        return !styleGuideImportedElements.includes(
          element.parentPath.parentPath.value.name.name,
        );
      }

      return true;
    },
  );

  for (const path of jsxElementsWithoutStyleGuideElements.paths()) {
    const {
      name: valueExpressionName,
      type: valueExpressionType,
      callee: valueExpressionCallee,
    } = path.node.value.expression;
    const { name: propName } = path.node.name;

    const arrayOfLines = path.node.loc.lines.infos;
    const lineNumberToCheck = path.node.loc.start.line;

    if (PROPS_ALLOWLIST.includes(propName)) {
      continue;
    }

    const skipNextLine = shouldSkipNextLine(
      arrayOfLines,
      lineNumberToCheck,
      GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
    );

    if (skipNextLine.error) {
      return skipNextLine;
    }
    if (skipNextLine.valid) {
      continue;
    }

    if (valueExpressionType === 'ArrowFunctionExpression') {
      return {
        valid: false,
        error: `Passing non-memoized inline arrow function as ${propName}`,
      };
    }

    if (valueExpressionType === 'ObjectExpression') {
      return {
        valid: false,
        error: `Passing non-memoized object as ${propName}`,
      };
    }

    if (valueExpressionType === 'CallExpression') {
      const calleeName = valueExpressionCallee.name;
      const variableDeclarator = findVariableDeclarator(path, calleeName);

      if (!variableDeclarator || !isMemoized(variableDeclarator.node)) {
        return {
          valid: false,
          error: `Passing non-memoized function call as ${propName}`,
        };
      }
    }

    if (valueExpressionType !== 'Identifier') {
      continue;
    }

    const functionDeclaration = findFunctionDeclaration(
      path,
      valueExpressionName,
    );

    if (functionDeclaration) {
      return {
        valid: false,
        error: `Passing non-memoized function ${valueExpressionName} as ${propName}`,
      };
    }

    const variableDeclarator = findVariableDeclarator(
      path,
      valueExpressionName,
    );

    if (!variableDeclarator) {
      // probably props forwarding
      continue;
    }

    const skipVariableDeclarator = shouldSkipNextLine(
      arrayOfLines,
      variableDeclarator.node.loc.start.line,
      GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
    );

    if (skipVariableDeclarator.error) {
      return skipVariableDeclarator;
    }
    if (skipVariableDeclarator.valid) {
      continue;
    }

    if (isDeclaredOutsideComponent(componentName, variableDeclarator)) {
      continue;
    }

    if (!isMemoized(variableDeclarator.node)) {
      return {
        valid: false,
        error: `Passing non-memoized variable ${valueExpressionName} as ${propName}`,
      };
    }
  }

  return { valid: true };
}

module.exports = { validateMemoization };
