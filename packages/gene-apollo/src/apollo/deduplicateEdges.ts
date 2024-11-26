interface EdgeNode {
  node: {
    __ref: string;
  };
}

/**
 * During hot reload, paginated edges are duplicated,
 * we should remove duplication and has only one unique item
 * It should also protect us in case of wrong concatenation between server and client
 */
export function deduplicateEdges(elements: EdgeNode[]) {
  const uniqueRefs = new Set(elements.map((edge) => edge.node.__ref));
  return elements.filter((element) => {
    if (uniqueRefs.has(element.node.__ref)) {
      uniqueRefs.delete(element.node.__ref);
      return true;
    }

    return false;
  });
}
