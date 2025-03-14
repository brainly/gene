import { withParser } from 'jscodeshift';
import type { Tree } from '@nx/devkit';

const j = withParser('tsx');

interface PropsType {
  tree: Tree;
  subappName: string;
  reexportIndexPath: string;
  reexportRelativePath: string;
}

export const reexport = ({
  tree,
  subappName,
  reexportIndexPath,
  reexportRelativePath,
}: PropsType) => {
  const src = tree.read(reexportIndexPath)?.toString() || '';
  const ast = j(src);

  const exports = ast
    .find(j.ExportAllDeclaration)
    .filter(({ node }) => String(node.source.value).endsWith(`/${subappName}`))
    .nodes()[0];

  if (exports) {
    throw new Error(
      `Sub app with name ${subappName} already exists in this library`
    );
  }

  const path = `${reexportRelativePath}/${subappName}`;

  ast
    .get()
    .node.program.body.push(
      j.exportAllDeclaration(j.stringLiteral(path), null)
    );

  tree.write(reexportIndexPath, ast.toSource({ quote: 'single' }));
};
