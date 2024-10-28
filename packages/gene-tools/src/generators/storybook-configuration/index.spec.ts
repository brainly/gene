import * as devkit from '@nrwl/devkit';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import { applicationGenerator } from '@nrwl/next';
import { libraryGenerator } from '@nrwl/react';
import { storybookConfigurationGenerator } from './index';

describe('storybookConfiguration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    // Create a tree with an empty workspace
    tree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
  });

  describe('application', () => {
    const application = 'my-app1';

    beforeEach(async () => {
      // Generate the application to add configuration to
      await applicationGenerator(tree, {
        name: application,
        linter: Linter.EsLint,
        skipFormat: false,
        style: 'css',
        unitTestRunner: 'jest',
      });

      jest.clearAllMocks();
    });

    it('should throw when passing a non-existent project', async () => {
      await expect(async () =>
        storybookConfigurationGenerator(tree, { name: 'non-existent-project' })
      ).rejects.toThrow();
    });

    it('should do nothing when the .storybook folder already exists and contains files', async () => {
      jest.spyOn(devkit, 'formatFiles');
      tree.write(`apps/${application}/.storybook/main.js`, '');
      const initialTreeChanges = tree.listChanges();

      await storybookConfigurationGenerator(tree, { name: application });

      expect(tree.listChanges()).toStrictEqual(initialTreeChanges);
      expect(devkit.formatFiles).not.toHaveBeenCalled();
    });

    it('should generate configuration files when .storybook folder exists without any files inside', async () => {
      jest.spyOn(devkit, 'formatFiles');
      tree.write(`apps/${application}/.storybook/`, '');

      await storybookConfigurationGenerator(tree, { name: application });

      expect(devkit.formatFiles).toHaveBeenCalled();
      expect(
        tree.read(`apps/${application}/.storybook/main.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`apps/${application}/.storybook/manager.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`apps/${application}/.storybook/preview.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`apps/${application}/.storybook/tsconfig.json`, 'utf-8')
      ).toMatchSnapshot();
    });

    it('should generate the .storybook folder with the configuration files', async () => {
      await storybookConfigurationGenerator(tree, { name: application });

      expect(
        tree.read(`apps/${application}/.storybook/main.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`apps/${application}/.storybook/manager.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`apps/${application}/.storybook/preview.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`apps/${application}/.storybook/tsconfig.json`, 'utf-8')
      ).toMatchSnapshot();
    });

    it('should exclude the stories from the project root tsconfig', async () => {
      await storybookConfigurationGenerator(tree, { name: application });

      const tsconfig = readJson(tree, `apps/${application}/tsconfig.json`);
      expect(tsconfig.exclude).toEqual(
        expect.arrayContaining([
          '**/*.stories.ts',
          '**/*.stories.js',
          '**/*.stories.jsx',
          '**/*.stories.tsx',
        ])
      );
    });

    it('should add storybook targets to the project configuration', async () => {
      await storybookConfigurationGenerator(tree, { name: application });

      const { targets } = readProjectConfiguration(tree, application);
      expect(targets).toBeTruthy();
      expect(targets!.storybook).toMatchSnapshot();
      expect(targets!['build-storybook']).toMatchSnapshot();
    });

    it('should format files', async () => {
      jest.spyOn(devkit, 'formatFiles');

      await storybookConfigurationGenerator(tree, { name: application });

      expect(devkit.formatFiles).toHaveBeenCalled();
    });
  });

  describe('library', () => {
    const library = 'my-lib1';

    beforeEach(async () => {
      // Generate the library to add configuration to
      await libraryGenerator(tree, {
        name: library,
        linter: Linter.EsLint,
        skipFormat: false,
        skipTsConfig: false,
        style: 'css',
        unitTestRunner: 'jest',
      });

      jest.clearAllMocks();
    });

    it('should throw when passing a non-existent project', async () => {
      await expect(async () =>
        storybookConfigurationGenerator(tree, { name: 'non-existent-project' })
      ).rejects.toThrow();
    });

    it('should do nothing when the .storybook folder already exists', async () => {
      jest.spyOn(devkit, 'formatFiles');
      tree.write(`libs/${library}/.storybook/main.js`, '');
      const initialTreeChanges = tree.listChanges();

      await storybookConfigurationGenerator(tree, { name: library });

      expect(tree.listChanges()).toStrictEqual(initialTreeChanges);
      expect(devkit.formatFiles).not.toHaveBeenCalled();
    });

    it('should generate the .storybook folder with the configuration files', async () => {
      await storybookConfigurationGenerator(tree, { name: library });

      expect(
        tree.read(`libs/${library}/.storybook/main.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`libs/${library}/.storybook/manager.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`libs/${library}/.storybook/preview.js`, 'utf-8')
      ).toMatchSnapshot();
      expect(
        tree.read(`libs/${library}/.storybook/tsconfig.json`, 'utf-8')
      ).toMatchSnapshot();
    });

    it('should exclude the stories from the project root tsconfig', async () => {
      await storybookConfigurationGenerator(tree, { name: library });

      const tsconfig = readJson(tree, `libs/${library}/tsconfig.lib.json`);
      expect(tsconfig.exclude).toEqual(
        expect.arrayContaining([
          '**/*.stories.ts',
          '**/*.stories.js',
          '**/*.stories.jsx',
          '**/*.stories.tsx',
        ])
      );
    });

    it('should add storybook targets to the project configuration', async () => {
      await storybookConfigurationGenerator(tree, { name: library });

      const { targets } = readProjectConfiguration(tree, library);
      expect(targets).toBeTruthy();
      expect(targets!.storybook).toMatchSnapshot();
      expect(targets!['build-storybook']).toMatchSnapshot();
    });

    it('should format files', async () => {
      jest.spyOn(devkit, 'formatFiles');

      await storybookConfigurationGenerator(tree, { name: library });

      expect(devkit.formatFiles).toHaveBeenCalled();
    });
  });
});
