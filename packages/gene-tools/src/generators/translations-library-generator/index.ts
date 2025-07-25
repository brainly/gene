import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
  readJson,
  writeJson,
} from '@nx/devkit';
import libraryGenerator from '../library-generator';

export default async function (tree: Tree) {
  const currentPackageJson = readJson(tree, 'package.json');

  await libraryGenerator(tree, {
    name: 'translations',
    directory: 'libs/translations',
    tags: 'type:utility',
  });

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    'libs/translations/src',
    {
      tmpl: '',
    },
  );

  const projectConfig = readProjectConfiguration(tree, 'translations');

  updateProjectConfiguration(tree, 'translations', {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      fetch: {
        executor: 'nx:run-commands',
        options: {
          command:
            "echo 'Create your own script to fetch translations and save them in the libs/translations/src/locales folder'",
        },
      },
    },
  });

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}
