import {
  Tree,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { render } from 'ejs';
import { readFileSync } from 'fs';

export const updateWorkspaceTarget = async ({
  tree,
  projectPath,
  projectName,
  e2e,
}: {
  tree: Tree;
  projectPath: string;
  projectName: string;
  e2e?: boolean;
}) => {
  const appTargetsTemplate = readFileSync(
    joinPathFragments(__dirname, './workspaceAppTargetTemplate.ejs')
  );

  const e2eTargetsTemplate = readFileSync(
    joinPathFragments(__dirname, './workspaceE2ETargetTemplate.ejs')
  );

  if (!appTargetsTemplate || !e2eTargetsTemplate) {
    return;
  }

  const updatedAppTargets = render(appTargetsTemplate.toString(), {
    projectName,
    projectPath,
  });

  const updatedE2ETargets = render(e2eTargetsTemplate.toString(), {
    projectName,
    projectPath,
  });

  const e2eProjectName = `${projectName}-e2e`;

  const currentProjectConfig = readProjectConfiguration(tree, projectName);

  const updatedProjectConfig = {
    ...currentProjectConfig,
    targets: {
      ...currentProjectConfig.targets,
      ...JSON.parse(updatedAppTargets),
    },
  };

  updateProjectConfiguration(tree, projectName, updatedProjectConfig);

  if (e2e !== false) {
    const currentE2EProjectConfig = readProjectConfiguration(
      tree,
      e2eProjectName
    );

    const updatedE2EProjectConfig = {
      ...currentE2EProjectConfig,
      targets: {
        ...currentE2EProjectConfig.targets,
        ...JSON.parse(updatedE2ETargets),
      },
    };

    updateProjectConfiguration(tree, e2eProjectName, updatedE2EProjectConfig);
  }
};
