import type { Tree } from '@nx/devkit';
import type { MDAST } from 'mdast';
import type { UNIST } from 'unist';
import visit = require('unist-util-visit');
import remark = require('remark');

const readmeAvailableWorkspaceExecutorsHeading =
  'Available workspace executors';

export function updateReadmeExecutorList(
  tree: Tree,
  executorName: string,
): void {
  const readmeContent = tree.read('tools/executors/README.md', 'utf-8');

  const updatedReadme = remark()
    .use(() => {
      return function transformer(tree: MDAST.Root) {
        let foundHeading = false;
        let foundList = false;

        visit(
          tree,
          ['heading', 'list'] as any,
          ((node: any) => {
            if (foundHeading && foundList) {
              return;
            }

            if (
              !foundHeading &&
              node.type === 'heading' &&
              (
                (node as MDAST.Heading).children[0] as unknown as {
                  value: unknown;
                }
              ).value === readmeAvailableWorkspaceExecutorsHeading
            ) {
              foundHeading = true;
            } else if (foundHeading && !foundList && node.type === 'list') {
              foundList = true;
              addExecutorListItemToNode(node as MDAST.List, executorName);
            }
          }) as any,
        );
      };
    })
    .processSync(readmeContent);

  tree.write('tools/executors/README.md', updatedReadme.contents.toString());
}

function addExecutorListItemToNode(node: MDAST.List, executorName: string) {
  node.children.push({
    type: 'listItem',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: `${executorName}/README.md`,
            children: [
              {
                type: 'text',
                value: executorName,
              },
            ],
          },
          {
            type: 'text',
            value: ': Add a meaningful description for the executor.',
          },
        ],
      },
    ],
  } as UNIST.Node);
}
