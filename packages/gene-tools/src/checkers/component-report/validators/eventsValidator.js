const fs = require('fs');
const jscodeshift = require('jscodeshift');
const path = require('path');
const { getComponentMetadata } = require('../../common/utils/meta');
const {
  getWorkspaceLibConfigByPath,
  tsPathToWebpackAliases,
} = require('../../../scripts');
const { workspaceRoot } = require('@nx/devkit');

const j = jscodeshift.withParser('tsx');

const DISPATH_FUNC_NAME = 'dispatch';

function getDispatchedEvents(file) {
  const src = fs.readFileSync(file).toString();

  const ast = j(src);

  const dispatchCalls = ast
    .find(j.CallExpression, {
      callee: { name: DISPATH_FUNC_NAME },
    })
    .paths();

  return dispatchCalls
    .filter((path) => {
      const scope = path.scope.lookup(DISPATH_FUNC_NAME);

      if (!scope) {
        return false;
      }

      const identifiers = scope.getBindings()[DISPATH_FUNC_NAME];

      const isImported =
        identifiers.length === 1 &&
        identifiers[0].parent.node.type === 'ImportSpecifier';

      if (!isImported) {
        return false;
      }

      const importDeclaration = j(identifiers[0])
        .closest(j.ImportDeclaration)
        .nodes()[0];

      const importedFrom = importDeclaration.source.value;

      return importedFrom === '@brainly-gene/core';
    })
    .map((p) => p.node.arguments[1].elements[0]);
}

function isAcceptableImport(src, name, file) {
  const ast = j(src);
  const importDeclaration = ast
    .find(j.ImportDeclaration)
    .filter(({ node }) =>
      node.specifiers.find((specifier) => specifier.local.name === name),
    )
    .nodes()[0];

  const typeSource = importDeclaration
    ? importDeclaration.source.value
    : undefined;

  if (!typeSource) {
    return false;
  }

  const libsMap = tsPathToWebpackAliases(
    `${workspaceRoot}/tsconfig.base.json`,
    workspaceRoot,
  );
  const lib = libsMap[typeSource];

  if (!lib) {
    return false;
  }

  const normalizedPath = lib
    .replace(`${workspaceRoot}/`, '')
    .replace('/index.ts', '');

  const sourceTagsConfig = getWorkspaceLibConfigByPath(normalizedPath);
  const targetTagsConfig = getWorkspaceLibConfigByPath(file);

  const sourceTags = sourceTagsConfig ? sourceTagsConfig.tags : [];
  const targetTags = targetTagsConfig ? targetTagsConfig.tags : [];

  return isUtilityType(sourceTags) && isSameDomain(sourceTags, targetTags);
}

function isUtilityType(tags) {
  return tags.includes('type:utility');
}

function isSameDomain(sourceTags, targetTags) {
  const domainSourceTags = sourceTags.filter((tag) =>
    tag.startsWith('domain:'),
  );
  const domainTargetTags = targetTags.filter((tag) =>
    tag.startsWith('domain:'),
  );

  return (
    domainSourceTags.length > 0 &&
    domainTargetTags.length > 0 &&
    domainSourceTags.some((tag) => domainTargetTags.includes(tag))
  );
}

function validateEvents(file) {
  try {
    const src = fs.readFileSync(file).toString();
    const { isPrivate } = getComponentMetadata(src);

    const dispatchedEvents = getDispatchedEvents(file);
    const basename = path.basename(file).replace(/\.tsx$/, '');

    const expectedEventEnumName = `${basename}EventsType`;

    for (const dispatchCall of dispatchedEvents) {
      if (dispatchCall.type === 'StringLiteral') {
        return {
          valid: false,
          error: `Dispatching non-declared event: ${dispatchCall.value}`,
        };
      }

      if (dispatchCall.type !== 'MemberExpression') {
        return {
          valid: false,
          error: `Unexpected dispatch call type: ${dispatchCall.type}`,
        };
      }

      if (
        dispatchCall.object.name !== expectedEventEnumName &&
        !isPrivate &&
        !isAcceptableImport(src, dispatchCall.object.name, file)
      ) {
        return {
          valid: false,
          error: `Non-recognized event namespace: ${dispatchCall.object.name} (expected ${expectedEventEnumName})`,
        };
      }
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Validation error: ${e.message}` };
  }
}

module.exports = { validateEvents };
