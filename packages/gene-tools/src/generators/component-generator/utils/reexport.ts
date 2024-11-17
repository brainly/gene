import * as jscodeshift from 'jscodeshift';
import { Tree } from '@nx/devkit';

const j = jscodeshift.withParser('tsx');

interface PropsType {
  tree: Tree;
  componentName: string;
  reexportIndexPath: string;
  reexportRelativePath: string;
}

export const reexport = ({
  tree,
  componentName,
  reexportIndexPath,
  reexportRelativePath,
}: PropsType) => {
  const src = tree.read(reexportIndexPath)?.toString() || '';
  const ast = j(src);

  const exports = ast
    .find(j.ExportAllDeclaration)
    .filter(({ node }) =>
      String(node.source.value).endsWith(`/${componentName}`)
    )
    .nodes()[0];

  if (exports) {
    throw new Error(
      `Component with name ${componentName} already exists in this library`
    );
  }

  const path = `${reexportRelativePath}/${componentName}`;

  ast
    .get()
    .node.program.body.push(
      j.exportAllDeclaration(j.stringLiteral(path), null)
    );

  tree.write(reexportIndexPath, ast.toSource({ quote: 'single' }));
};
