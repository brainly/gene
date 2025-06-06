import { type Tree, joinPathFragments } from '@nx/devkit';
import { treeToString, filePathsToTree } from './file-paths-to-tree';

export function nxFileTreeSnapshotSerializer(tree: Tree) {
  const rootChildren = tree.children('./');

  function getFiles(
    tree: Tree,
    basePath = './',
    children: string[] = []
  ): string[] {
    return children.flatMap((child) => {
      const filePath = joinPathFragments(basePath, child);
      if (tree.isFile(filePath)) {
        return filePath;
      }
      return getFiles(tree, filePath, tree.children(filePath));
    });
  }

  const filePaths = getFiles(tree, './', rootChildren);

  return treeToString(filePathsToTree(filePaths));
}
