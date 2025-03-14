const { generateModuleReport } = require('./index');
const { generateLink } = require('../common/utils/generatePrLink');
const path = require('path');

const basePathPrefix = path.resolve(__dirname, 'mocks');
const basePrUrl =
  'https://github.com/example-organization/example-repository/pull/123';

function generateLinkFor(fileRelPath) {
  return generateLink({
    truncatedPath: path.resolve(__dirname, fileRelPath),
    prUrl: basePrUrl,
  });
}

describe('generateModuleReport()', () => {
  it('generates a complete module report for valid application modules', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/valid-app-modules/app-modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/hooks/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/hooks/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/components/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/components/ExampleComponent/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module/components/ExampleComponent/ExampleComponent.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/another-module/AnotherValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/another-module/AnotherValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/another-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/another-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/another-module/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/another-module/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/ValidWithDisabledStorybookModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/ValidVariationWithDisabledStorybookModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/hooks/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/hooks/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/components/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/components/ExampleComponent/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/components/ExampleComponent/ExampleComponent.tsx',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
    });

    const linkValidModule = generateLinkFor(
      'mocks/valid-app-modules/app-modules/src/lib/valid-module/ValidModule.tsx',
    );
    const linkAnotherModule = generateLinkFor(
      'mocks/valid-app-modules/app-modules/src/lib/another-module/AnotherValidModule.tsx',
    );
    const linkValidModuleWithDisabledStorybook = generateLinkFor(
      'mocks/valid-app-modules/app-modules/src/lib/valid-module-with-disabled-storybook/ValidWithDisabledStorybookModule.tsx',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}/src/lib/valid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const expectedResultForAnotherModule =
      `## Module report for ${pathPrefix}/src/lib/another-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[another-module](${linkAnotherModule}) | **AnotherValidModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const expectedResultForValidModuleWithDisabledStorybook =
      `## Module report for ${pathPrefix}/src/lib/valid-module-with-disabled-storybook\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module-with-disabled-storybook](${linkValidModuleWithDisabledStorybook}) | **ValidWithDisabledStorybookModule**: :white_check_mark:<hr>**ValidVariationWithDisabledStorybookModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [
      validModuleReport,
      anotherModuleReport,
      validmModuleWithDisabledStorybookReport,
    ] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(anotherModuleReport.report).toEqual(expectedResultForAnotherModule);
    expect(validmModuleWithDisabledStorybookReport.report).toEqual(
      expectedResultForValidModuleWithDisabledStorybook,
    );
    expect(validModuleReport.success).toBe(true);
    expect(anotherModuleReport.success).toBe(true);
    expect(validmModuleWithDisabledStorybookReport.success).toBe(true);
  });

  it('throws declaration error for invalid application modules', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-app-modules-no-declaration/app-modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/invalid-module/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/invalid-module/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/invalid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/invalid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/invalid-module/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
    });

    const linkValidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/valid-module/ValidModule.tsx',
    );
    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-declaration/app-modules/src/lib/invalid-module/InvalidModule.tsx',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}/src/lib/valid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}/src/lib/invalid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :red_circle: Module is not declared with "createGeneModule" or "extendGeneModule" factory! <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a> | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [validModuleReport, anotherModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(anotherModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(validModuleReport.success).toBe(true);
    expect(anotherModuleReport.success).toBe(false);
  });

  it('throws export delegates for invalid application modules', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-app-modules-export-delegates/app-modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
    });

    const linkIndex = generateLinkFor(
      'mocks/invalid-app-modules-export-delegates/app-modules/src/index.ts',
    );
    const linkValidModule = generateLinkFor(
      'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/ValidModule.tsx',
    );
    const linkValidModuleIndex = generateLinkFor(
      'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/valid-module/index.ts',
    );

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/InvalidModule.tsx',
    );
    const linkInvalidModuleIndex = generateLinkFor(
      'mocks/invalid-app-modules-export-delegates/app-modules/src/lib/invalid-module/index.ts',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}/src/lib/valid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | [/src/index.ts](${linkIndex}): :red_circle: Please reexport certain variables instead of using asterisk. <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a><hr>[/src/lib/valid-module/index.ts](${linkValidModuleIndex}): :white_check_mark: | :white_check_mark:`;

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}/src/lib/invalid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | [/src/index.ts](${linkIndex}): :red_circle: Please reexport certain variables instead of using asterisk. <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a><hr>[/src/lib/invalid-module/index.ts](${linkInvalidModuleIndex}): :red_circle: Non-core module libraries can only export modules and types. <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a> | :white_check_mark:`;

    const [validModuleReport, anotherModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(anotherModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(validModuleReport.success).toBe(false);
    expect(anotherModuleReport.success).toBe(false);
  });

  it('throws no spec error for invalid application modules', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-app-modules-no-spec/app-modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
    });

    const linkValidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-spec/app-modules/src/lib/valid-module/ValidModule.tsx',
    );

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/InvalidModule.tsx',
    );

    const linkInvalidModuleDelegate = generateLinkFor(
      'mocks/invalid-app-modules-no-spec/app-modules/src/lib/invalid-module/delegates/useSomeLogic.ts',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}/src/lib/valid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}/src/lib/invalid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | [/src/lib/invalid-module/delegates/useSomeLogic.ts](${linkInvalidModuleDelegate}): :red_circle: Custom hook test file not found! Custom hook test file should be named useSomeLogic.spec.ts(x) or useSomeLogic.test.ts(x) and should be located in the same folder as the custom hook file. <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a> | :white_check_mark: | :white_check_mark:`;

    const [validModuleReport, anotherModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(anotherModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(validModuleReport.success).toBe(true);
    expect(anotherModuleReport.success).toBe(false);
  });

  it('throws no storybook error for invalid application modules', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-app-modules-no-storybook/app-modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
    });

    const linkValidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/valid-module/ValidModule.tsx',
    );

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-storybook/app-modules/src/lib/invalid-module/InvalidModule.tsx',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}/src/lib/valid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}/src/lib/invalid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | **InvalidModule**: Module is not present in storybook <br>`;

    const [validModuleReport, anotherModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(anotherModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(validModuleReport.success).toBe(true);
    expect(anotherModuleReport.success).toBe(false);
  });

  it('ignores no storybook error for invalid application modules by config', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
    });

    const linkValidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/valid-module/ValidModule.tsx',
    );

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-app-modules-no-storybook-ignore-by-config/app-modules/src/lib/invalid-module/InvalidModule.tsx',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}/src/lib/valid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}/src/lib/invalid-module\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [validModuleReport, anotherModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(anotherModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(validModuleReport.success).toBe(true);
    expect(anotherModuleReport.success).toBe(true);
  });

  it('generates a complete module report for valid core module', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/valid-core-module/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/ValidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/ValidVariationModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/ValidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/valid-core-module/modules/valid-module/src/lib/delegates/useSomeLogic.spec.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkValidModule = generateLinkFor(
      'mocks/valid-core-module/modules/valid-module/src/lib/ValidModule.tsx',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[valid-module](${linkValidModule}) | **ValidModule**: :white_check_mark:<hr>**ValidVariationModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [validModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(validModuleReport.success).toBe(true);
  });

  it('throws declaration error for invalid core module', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-core-module-extend-declaration/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/delegates/useSomeLogic.spec.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-core-module-extend-declaration/modules/invalid-module/src/lib/InvalidModule.tsx',
    );

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :red_circle: Module is not declared with "createGeneModule" factory! <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a> | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [invalidModuleReport] = reports;

    expect(invalidModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(invalidModuleReport.success).toBe(false);
  });

  it('throws export module error for invalid core module', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-core-module-export-module/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/delegates/useSomeLogic.spec.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkIndex = generateLinkFor(
      'mocks/invalid-core-module-export-module/modules/invalid-module/src/index.ts',
    );

    const linkLibIndex = generateLinkFor(
      'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/index.ts',
    );

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-core-module-export-module/modules/invalid-module/src/lib/InvalidModule.tsx',
    );

    const expectedResultForValidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | [/invalid-module/src/index.ts](${linkIndex}): :white_check_mark:<hr>[/invalid-module/src/lib/index.ts](${linkLibIndex}): :red_circle: Core modules can only export functions and types. <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a> | :white_check_mark:`;

    const [validModuleReport] = reports;

    expect(validModuleReport.report).toEqual(expectedResultForValidModule);
    expect(validModuleReport.success).toBe(false);
  });

  it('ignores export module error for invalid core module by config', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-core-module-export-module-ignore-by-config/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/delegates/useSomeLogic.spec.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-core-module-export-module-ignore-by-config/modules/invalid-module/src/lib/InvalidModule.tsx',
    );

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [invalidModuleReport] = reports;

    expect(invalidModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(invalidModuleReport.success).toBe(true);
  });

  it('throws no spec error for invalid core module', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-core-module-no-spec/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec/modules/invalid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/InvalidModule.tsx',
    );

    const linkInvalidModuleDelegate = generateLinkFor(
      'mocks/invalid-core-module-no-spec/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
    );

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | [/invalid-module/src/lib/delegates/useSomeLogic.ts](${linkInvalidModuleDelegate}): :red_circle: Custom hook test file not found! Custom hook test file should be named useSomeLogic.spec.ts(x) or useSomeLogic.test.ts(x) and should be located in the same folder as the custom hook file. <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a> | :white_check_mark: | :white_check_mark:`;

    const [invalidModuleReport] = reports;

    expect(invalidModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(invalidModuleReport.success).toBe(false);
  });

  it('ignores no spec error for invalid core module by config', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-core-module-no-spec-ignore-by-config/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/gene.config.yaml',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-core-module-no-spec-ignore-by-config/modules/invalid-module/src/lib/InvalidModule.tsx',
    );

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    const [invalidModuleReport] = reports;

    expect(invalidModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(invalidModuleReport.success).toBe(true);
  });

  it('throws no storybook error for invalid core module', () => {
    const pathPrefix = path.resolve(
      __dirname,
      'mocks/invalid-core-module-no-storybook/modules',
    );

    const reports = generateModuleReport({
      files: [
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/InvalidModule.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/InvalidModule.stories.tsx',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/delegates/index.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/delegates/useSomeLogic.ts',
        ),
        path.resolve(
          __dirname,
          'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/delegates/useSomeLogic.spec.ts',
        ),
      ],
      pathPrefix,
      prUrl: basePrUrl,
      isCoreModule: true,
    });

    const linkInvalidModule = generateLinkFor(
      'mocks/invalid-core-module-no-storybook/modules/invalid-module/src/lib/InvalidModule.tsx',
    );

    const expectedResultForInvalidModule =
      `## Module report for ${pathPrefix}\n` +
      `Name | Module declaration | Custom hooks (a.k.a delegates) | Exports | Stories\n` +
      `--- | --- | --- | --- | ---\n` +
      `[invalid-module](${linkInvalidModule}) | **InvalidModule**: :white_check_mark: | :white_check_mark: | :white_check_mark: | **InvalidModule**: Module is not present in storybook <br>`;

    const [invalidModuleReport] = reports;

    expect(invalidModuleReport.report).toEqual(expectedResultForInvalidModule);
    expect(invalidModuleReport.success).toBe(false);
  });
});
