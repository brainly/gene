import type { Tree} from '@nx/devkit';
import { updateJson } from '@nx/devkit';

export function addExecutor(tree: Tree, name: string): void {
  updateJson(tree, 'tools/executors/executors.json', (json) => {
    json.executors[name] = {
      implementation: `./${name}/impl`,
      schema: `./${name}/schema.json`,
      description: 'Add a meaningful description for the executor.',
    };
    return json;
  });
}
