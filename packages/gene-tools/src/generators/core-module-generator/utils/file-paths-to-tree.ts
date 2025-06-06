export type Node = {
  name: string;
  path: string;
  children: Node[];
  parent: Node | null;
};

export type Options = {
  formatLabel?: (node: Node) => string;
  separator?: string;
  connectors?: {
    tee?: string;
    elbow?: string;
    line?: string;
    padding?: string;
  };
};

const defaultOptions = {
  formatLabel: (node: Node) => node.name,
  separator: '/',
  connectors: {
    tee: '├── ',
    elbow: '└── ',
    line: '│',
    padding: '   ',
  },
};

/**
 * Takes a list of file path strings and turns it into a `Node[]`.
 */
export function filePathsToTree(paths: string[], options: Options = {}) {
  const separator = options.separator || defaultOptions.separator;
  const results: Node[] = [];

  return paths.reduce((currentResults, currentPath) => {
    const pathParts = currentPath.split(separator);
    const byPath: Record<string, Node> = {};

    pathParts.reduce((nodes, name, index, arr) => {
      let node: Node | undefined = nodes.find((node) => node.name === name);
      const path = arr.slice(0, index + 1).join(separator);
      const parentPath = arr.slice(0, index).join(separator);

      if (!node) {
        node = {
          name,
          path,
          parent: byPath[parentPath] || null,
          children: [],
        };

        nodes.push(node);
      }

      byPath[path] = node;

      return node.children;
    }, currentResults);

    return currentResults;
  }, results);
}

/**
 * Converts `Node[]` to a flat string.
 */
export function treeToString(
  nodes: Node[],
  options: Options = {},
  level = 0,
  prefix = ''
) {
  const nodesCount = nodes.length - 1;
  const formatLabel = options.formatLabel || defaultOptions.formatLabel;
  const connectors = options.connectors || defaultOptions.connectors;
  const tee = connectors.tee || defaultOptions.connectors.tee;
  const elbow = connectors.elbow || defaultOptions.connectors.elbow;
  const line = connectors.line || defaultOptions.connectors.line;
  let results = '';

  nodes.forEach((node, nodeIndex) => {
    let pointer = '';

    if (level > 0) {
      if (nodesCount > 0) {
        pointer = nodeIndex === nodesCount ? elbow : tee;
      } else {
        pointer = elbow;
      }
    }

    results += `${prefix + pointer + formatLabel(node)}\n`;

    if (node.children?.length) {
      let newPrefix = prefix;

      if (level > 0) {
        newPrefix += `${nodeIndex === nodesCount ? ' ' : line}   `;
      }

      results += treeToString(node.children, options, level + 1, newPrefix);
    }
  });

  return results;
}
