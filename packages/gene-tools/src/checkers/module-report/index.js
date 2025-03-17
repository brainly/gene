const { existsSync, readFileSync } = require('fs');
const { getColumns: getModuleColumns } = require('./moduleColumnMapper');
const { parse } = require('yaml');

const REGEXES = {
  indexFile: /\/.+\/index\.ts?$/,
  delegatesIndexFile: /\/.+\/(delegates|hooks)\/(.+\/)*index\.ts?$/,
  moduleFile: /\/.+\/(?<fileName>.+)\.(ts|tsx)$/,
  storybookFile: /\/.+\/(?<fileName>.+)\.stories\.tsx?$/,
  delegateFile:
    /\/.+\/(?<fileName>.+)\/(delegates|hooks)\/(.+\/)*[\w-]+\.(ts|tsx|test\.ts|test\.tsx|spec\.ts|spec\.tsx)$/,
  adapterFile: /\/.+\/(?<fileName>.+)\/adapters\/[\w-]+\.(ts|tsx)$/,
  isModule: /(.+Module)\.(ts|tsx)$/,
  isDelegate: /(.+(delegates|hooks)\/)[\w-]+\.(ts|tsx)$/,
  appModule:
    /\/.+\/app-modules\/src\/lib\/(\*\*\/)?(?<moduleName>.+?)\/(\w+)Module\.tsx/,
  appModulesMainIndex: /\/.+\/app-modules\/src\/index\.ts/,
  coreModule:
    /\/.+\/(?<moduleName>.+)\/src\/((?<variant>[\w]+)\/)?(\w+)\.ts(x)$/,
  geneConfig: /\/.+\/gene\.config\.y(a)ml$/,
};

const GENE_CONFIG_RULES = {
  MEMOIZATION: 'memoization',
  NO_JSX_IN_DELEGATES: 'no_jsx_in_delegates', // Deprecated in favor of NO_JSX_IN_HOOKS
  NO_JSX_IN_HOOKS: 'no_jsx_in_hooks',
  NO_DIRECT_INVERSIFY_IMPORT: 'no_direct_inversify_import',
  STORYBOOK_REQUIRED: 'storybook_required',
  UNIT_TESTS_FOR_DELEGATES_REQUIRED: 'unit_tests_for_delegates_required', // Deprecated in favor of UNIT_TESTS_FOR_HOOKS_REQUIRED
  UNIT_TESTS_FOR_HOOKS_REQUIRED: 'unit_tests_for_hooks_required',
  NO_MODULES_EXPORTS_FROM_CORE_LIBRARY: 'no_modules_export_from_core_library',
};

const GENE_DEFAULT_APPS_CONFIG = {
  rules: {
    [GENE_CONFIG_RULES.MEMOIZATION]: {
      enabled: false,
    },
    // Deprecated in favor of NO_JSX_IN_HOOKS
    [GENE_CONFIG_RULES.NO_JSX_IN_DELEGATES]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.NO_JSX_IN_HOOKS]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.NO_DIRECT_INVERSIFY_IMPORT]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.STORYBOOK_REQUIRED]: {
      enabled: false,
    },
    // Deprecated in favor of UNIT_TESTS_FOR_HOOKS_REQUIRED
    [GENE_CONFIG_RULES.UNIT_TESTS_FOR_DELEGATES_REQUIRED]: {
      enabled: false,
    },
    [GENE_CONFIG_RULES.UNIT_TESTS_FOR_HOOKS_REQUIRED]: {
      enabled: false,
    },
    [GENE_CONFIG_RULES.NO_MODULES_EXPORTS_FROM_CORE_LIBRARY]: {
      enabled: true,
    },
  },
};

const GENE_DEFAULT_CORE_CONFIG = {
  rules: {
    [GENE_CONFIG_RULES.MEMOIZATION]: {
      enabled: true,
    },
    // Deprecated in favor of NO_JSX_IN_HOOKS
    [GENE_CONFIG_RULES.NO_JSX_IN_DELEGATES]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.NO_JSX_IN_HOOKS]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.NO_DIRECT_INVERSIFY_IMPORT]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.STORYBOOK_REQUIRED]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.UNIT_TESTS_FOR_DELEGATES_REQUIRED]: {
      enabled: true,
    },
    // Deprecated in favor of UNIT_TESTS_FOR_HOOKS_REQUIRED
    [GENE_CONFIG_RULES.UNIT_TESTS_FOR_HOOKS_REQUIRED]: {
      enabled: true,
    },
    [GENE_CONFIG_RULES.NO_MODULES_EXPORTS_FROM_CORE_LIBRARY]: {
      enabled: true,
    },
  },
};

function resolveConfig(configPath, isCore) {
  const defaultConfig = isCore
    ? GENE_DEFAULT_CORE_CONFIG
    : GENE_DEFAULT_APPS_CONFIG;

  try {
    const isConfigFile = existsSync(configPath);

    if (!isConfigFile) {
      return defaultConfig;
    }

    const configParsed = parse(readFileSync(configPath, 'utf8'));

    return {
      rules: {
        ...defaultConfig,
        ...(configParsed?.checker_config?.rules ?? {}),
      },
    };
  } catch {
    return defaultConfig;
  }
}

/**
 * Grouping files to structure:
 * [
 *   [variantName, {module: '', stories: '', tests: ''}]
 *   ['delegates', []]
 *   ['exports', []]
 *   ['config', '']
 * ]
 *
 * This grouping is described in README.md file of this action.
 */
function getFilesPerModulesVariants(files) {
  const moduleVariants = files.reduce((acc, currentFile) => {
    const moduleMatch = currentFile.match(REGEXES.moduleFile);

    if (
      moduleMatch &&
      REGEXES.isModule.test(currentFile) &&
      !REGEXES.storybookFile.test(currentFile)
    ) {
      const { fileName } = moduleMatch.groups;

      acc.push([fileName, currentFile]);
    }

    return acc;
  }, []);

  return files.reduce((acc, currentFile, index) => {
    const storybookMatch = currentFile.match(REGEXES.storybookFile);
    const delegateMatch = currentFile.match(REGEXES.delegateFile);
    const indexMatch = currentFile.match(REGEXES.indexFile);
    const geneConfigMatch = currentFile.match(REGEXES.geneConfig);
    const isLastItem = index === files.length - 1;

    if (indexMatch && !REGEXES.delegatesIndexFile.test(currentFile)) {
      const currentExport = acc.get('exports') || [];

      acc.set('exports', [...currentExport, currentFile]);
    }

    // in case of existig storybook file or it is a last item of iteration,
    // it is required to create items for all modules variants with that storybook file or empty string
    if (storybookMatch || isLastItem) {
      moduleVariants.forEach(([variant, variantMainFile]) => {
        if (!acc.has(variant)) {
          const storybookFile = storybookMatch ? currentFile : '';

          acc.set(variant, {
            module: variantMainFile,
            stories: storybookFile,
            tests: null,
          });
        }
      });
    }

    if (delegateMatch && !REGEXES.delegatesIndexFile.test(currentFile)) {
      const currentDelegate = acc.get('delegates') || [];

      acc.set('delegates', [...currentDelegate, currentFile]);
    }

    if (geneConfigMatch && !acc.has('config')) {
      acc.set('config', currentFile);
    }

    return acc;
  }, new Map());
}

function getAllAppModulesMeta(files) {
  return files.reduce((acc, currentFile) => {
    const appModuleMatch = currentFile.match(REGEXES.appModule);

    if (appModuleMatch) {
      const { moduleName } = appModuleMatch.groups;
      if (!acc.has(moduleName)) {
        const moduleFiles = files.filter(
          (file) =>
            file.includes(`/${moduleName}/`) ||
            REGEXES.appModulesMainIndex.test(file),
        );

        acc.set(moduleName, moduleFiles);
      }
    }

    return acc;
  }, new Map());
}

function getCoreModuleMeta(files) {
  const coreModuleMatch = files.find((file) => file.match(REGEXES.coreModule));

  if (coreModuleMatch) {
    const { moduleName } = coreModuleMatch.match(REGEXES.coreModule).groups;

    return new Map().set(moduleName, files);
  }

  return new Map();
}

function generateModuleReport({ files, pathPrefix, prUrl, isCoreModule }) {
  if (files.length === 0) {
    return {
      report: null,
      success: true,
    };
  }

  const modules = isCoreModule
    ? getCoreModuleMeta(files)
    : getAllAppModulesMeta(files);

  if (modules.size === 0) {
    return {
      report: null,
      success: true,
    };
  }

  const modulesWithFilesVariants = [...Array.from(modules.entries())].map(
    ([moduleName, files]) => {
      return [moduleName, getFilesPerModulesVariants(files)];
    },
  );

  return [...modulesWithFilesVariants.entries()].reduce(
    (acc, [, [moduleName, files]]) => {
      const exportFiles = files.get('exports') || [];
      const delegatesFiles = files.get('delegates') || [];
      const configFile = files.get('config');

      const moduleVariantFiles = [...files.entries()]
        .filter(
          ([key]) =>
            key !== 'exports' && key !== 'delegates' && key !== 'config',
        )
        .map(([variantName, files]) => {
          return [variantName, { ...files }];
        });

      const config = resolveConfig(configFile, isCoreModule);

      const columns = getModuleColumns();

      const errors = [];
      let errorsDetected = false;

      const rows = [
        columns
          .map((c) => {
            try {
              const { content, success } = c.run({
                moduleName,
                moduleFiles: moduleVariantFiles,
                delegates: delegatesFiles,
                exports: exportFiles,
                checkerConfig: config,
                prUrl,
                pathPrefix,
                isCore: isCoreModule,
              });

              if (!success) {
                acc.success = false;
                errorsDetected = true;
              }

              return content;
            } catch (e) {
              acc.success = false;
              errorsDetected = true;
              acc.report = `Error getting cell content: ${e.message}`;
              return `Error getting cell content: ${e.message}`;
            }
          })
          .join(' | '),
      ];

      const table = [
        columns.map((c) => c.name).join(' | '),
        columns.map(() => '---').join(' | '),
        ...rows.filter(Boolean),
      ].join('\n');

      const maybeErrors =
        errors.length > 0
          ? ['', '## Errors', ...errors.map((e) => `* ${e}`)].join('\n')
          : null;

      const modulePathResolved = isCoreModule
        ? pathPrefix
        : `${pathPrefix}/src/lib/${moduleName}`;

      const reportHeader = `## Module report for ${modulePathResolved}`;

      const report = {
        report: [reportHeader, table, maybeErrors].filter(Boolean).join('\n'),
        success: !errorsDetected,
      };

      return [...acc, report];
    },
    [],
  );
}

module.exports = { generateModuleReport };
