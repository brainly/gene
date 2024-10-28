const jscodeshift = require('jscodeshift');

function findFunctionDeclaration(path, name) {
  const scope = path.scope.lookup(name);

  if (!scope) {
    return undefined;
  }

  const identifiers = scope.getBindings()[name];

  if (
    identifiers.length === 1 &&
    identifiers[0].parent.node.type === 'FunctionDeclaration'
  ) {
    return identifiers[0].parent;
  }
}

function findVariableDeclarator(path, name) {
  const scope = path.scope.lookup(name);

  if (!scope) {
    return undefined;
  }

  const identifiers = scope.getBindings()[name];

  if (
    identifiers.length === 1 &&
    identifiers[0].parent.node.type === 'VariableDeclarator'
  ) {
    return identifiers[0].parent;
  }
}

function isMarkedAsPrivate(node) {
  return (
    node &&
    node.comments &&
    node.comments.some(c => c.value.includes('@private'))
  );
}

function findComponentDefinition(path, componentName) {
  const componentAsFunction = findFunctionDeclaration(path, componentName);

  if (componentAsFunction) {
    return componentAsFunction.node;
  }

  const componentAsVariableDeclarator = findVariableDeclarator(
    path,
    componentName
  );

  if (!componentAsVariableDeclarator) {
    return null;
  }

  const {init} = componentAsVariableDeclarator.node;

  if (init.type === 'ArrowFunctionExpression') {
    return init;
  }

  // handle React.forwardRef
  if (
    init.type === 'CallExpression' &&
    init.callee.property.name === 'forwardRef'
  ) {
    return init.arguments[0];
  }

  throw new Error(
    `Unhandled component init type ${init.type} for component with name ${componentName}`
  );
}

function findExpressionDeclaration(src) {
  const j = jscodeshift.withParser('tsx');

  const ast = j(src);

  return ast.find(j.ConditionalExpression).nodes();
}

function isArrayProp(typeAnnotation) {
  const isArrayReferenceType = nodeType =>
    nodeType.type === 'TSTypeReference' &&
    (nodeType.typeName.name === 'Array' ||
      nodeType.typeName.name === 'ReadonlyArray');

  /**
   * @description
   * we have 3 possibility for array types:
   * element: string[]
   * element: Array<string>
   * element: ReadonlyArray<string>
   */
  const checkIfIsArrayType = nodeType =>
    nodeType.type === 'TSArrayType' || isArrayReferenceType(nodeType);

  /**
   * @description
   * When we have unions TSUnionType we need to check if one of type is array
   * We could have that type (and we have couple of them after migration from flow):
   * comments: Array<CommentType> | null | undefined;
   */
  if (typeAnnotation.type === 'TSUnionType') {
    const arrayTypes = typeAnnotation.types.filter(checkIfIsArrayType);

    return !!arrayTypes.length;
  }

  return checkIfIsArrayType(typeAnnotation);
}

module.exports = {
  findFunctionDeclaration,
  findVariableDeclarator,
  isArrayProp,
  isMarkedAsPrivate,
  findComponentDefinition,
  findExpressionDeclaration,
};
