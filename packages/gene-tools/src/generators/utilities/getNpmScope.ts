import { readJson, Tree } from '@nx/devkit';

export function getNpmScope(tree: Tree): string | undefined | null {
  const { name } = tree.exists('package.json')
    ? readJson<{ name?: string }>(tree, 'package.json')
    : { name: null };

  return name;
}
