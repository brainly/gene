const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

const j = jscodeshift.withParser('tsx');

const { findVariableDeclarator } = require('../../common/utils/ast');
const {
  getListsFromStories,
  getDeclaredLists,
  getMessagesFromListProps,
} = require('./storiesValidatorListProps');
const {
  getDeclaredProps,
  getExpressionsInView,
  getPositivePropsFromStories,
  getMessagesFromConditionalProps,
} = require('./storiesValidatorConditionalRender');

function getDeclaredEvents({ truncatedPath }) {
  const eventDeclarationPath = `${truncatedPath}EventsType.ts`;

  if (!fs.existsSync(eventDeclarationPath)) {
    return [];
  }

  const src = fs.readFileSync(eventDeclarationPath).toString();

  const baseName = path.basename(truncatedPath);

  const ast = j(src);

  const eventExport = ast
    .find(j.ExportNamedDeclaration, {
      declaration: { id: { name: `${baseName}EventsType` } },
    })
    .nodes()[0];

  if (!eventExport) {
    throw new Error(`${baseName}EventsType enum not found`);
  }

  const declaredEvents = eventExport.declaration.members.map((m) => m.id.name);

  return declaredEvents;
}

function getEventsFromStories({ truncatedPath }) {
  const storybookPath = `${truncatedPath}.stories.tsx`;

  if (!fs.existsSync(storybookPath)) {
    return [];
  }

  const src = fs.readFileSync(storybookPath).toString();

  const j = jscodeshift.withParser('tsx');
  const ast = j(src);

  const storybookMediatorCollection = ast.findJSXElements('StorybookMediator');

  const storybookMediator = storybookMediatorCollection.nodes()[0];

  if (!storybookMediator) {
    return [];
  }

  const eventListExpression = storybookMediator.openingElement.attributes.find(
    (a) => a.name.name === 'events',
  ).value.expression;

  if (
    eventListExpression.type === 'ArrayExpression' &&
    eventListExpression.elements.length === 0
  ) {
    return [];
  }

  if (eventListExpression.type !== 'Identifier') {
    throw new Error(
      `events prop should have type Identifier (found ${eventListExpression.type})`,
    );
  }

  const eventListVariableName = eventListExpression.name;

  const eventList = findVariableDeclarator(
    storybookMediatorCollection.paths()[0],
    eventListVariableName,
  );

  const events = eventList.node.init.elements.map(
    (e) => e.properties[0].value.property.name,
  );

  return events;
}

function validateStories({ truncatedPath }) {
  try {
    const declaredEvents = new Set(getDeclaredEvents({ truncatedPath }));

    const eventsInStories = new Set(getEventsFromStories({ truncatedPath }));

    const declaredLists = getDeclaredLists({ truncatedPath });
    const listsPropsFromStories = getListsFromStories({
      truncatedPath,
      declaredLists,
    });

    const declaredProps = getDeclaredProps({ truncatedPath });
    const declaredExpressions = getExpressionsInView({ truncatedPath });

    const declaredConditionalPropsInComponent = declaredProps.filter((prop) =>
      declaredExpressions.includes(prop),
    );

    const declaredConditionalPropsFromStories = getPositivePropsFromStories({
      truncatedPath,
      declaredProps: declaredConditionalPropsInComponent,
    });

    const diff = [...declaredEvents].filter((e) => !eventsInStories.has(e));

    const listPropMessages = getMessagesFromListProps(listsPropsFromStories);
    const conditionalPropMessages = getMessagesFromConditionalProps(
      declaredConditionalPropsFromStories,
    );

    if (diff.length !== 0) {
      return {
        valid: false,
        error: `Missing events: ${diff.join(', ')}`,
      };
    }

    if (listPropMessages) {
      return {
        valid: false,
        type: 'experimental',
        error: listPropMessages,
      };
    }

    if (conditionalPropMessages) {
      return {
        valid: false,
        type: 'experimental',
        error: conditionalPropMessages,
      };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Validation error: ${e.message}` };
  }
}

module.exports = { validateStories };
