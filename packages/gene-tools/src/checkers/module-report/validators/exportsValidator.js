const fs = require('fs');
const jscodeshift = require('jscodeshift');
const j = jscodeshift.withParser('tsx');

function isExportingModule(path) {
  return path.value.specifiers.some((specifier) =>
    specifier.exported.name.includes('Module'),
  );
}

function isExportingType(path) {
  return path.node.exportKind === 'type';
}

function isInsideComponentsFolder(filePath) {
  return filePath.includes('/components/');
}

function validateExports({ filePaths, isCore, pathPrefix, checkerConfig }) {
  return filePaths.map((filePath) => {
    try {
      const src = fs.readFileSync(filePath).toString();
      const ast = j(src);
      const exportDeclarations = ast.find(j.ExportNamedDeclaration).paths();
      const exportAllDeclarations = ast.find(j.ExportAllDeclaration).paths();

      if (exportAllDeclarations.length > 0) {
        return {
          filePath,
          valid: false,
          error: 'Please reexport certain variables instead of using asterisk.',
        };
      }

      if (isCore) {
        const {
          no_modules_export_from_core_library: noModulesExportsFromCoreLibrary,
        } = checkerConfig.rules;
        const hasModuleExport = exportDeclarations.some((path) =>
          isExportingModule(path),
        );

        if (
          hasModuleExport &&
          (noModulesExportsFromCoreLibrary?.enabled ||
            noModulesExportsFromCoreLibrary === true)
        ) {
          return {
            filePath,
            valid: false,
            error: 'Core modules can only export functions and types.',
          };
        }
      } else {
        const hasInvalidExport = exportDeclarations.some(
          (path) => !isExportingModule(path) && !isExportingType(path),
        );
        const isFileInsideComponentsFolder = isInsideComponentsFolder(filePath);

        if (hasInvalidExport && !isFileInsideComponentsFolder) {
          return {
            filePath,
            valid: false,
            error:
              'Non-core module libraries can only export modules and types.',
          };
        }
      }

      return { filePath, valid: true, type: 'success' };
    } catch (e) {
      const displayFilePath = filePath.replace(pathPrefix, '');

      return { filePath, displayFilePath, valid: false, error: `${e.message}` };
    }
  });
}

module.exports = { validateExports };
