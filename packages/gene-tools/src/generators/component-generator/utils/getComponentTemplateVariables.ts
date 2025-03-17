import { pipe, map } from 'ramda';

import {
  splitStringToArray,
  splitStringToEntries,
  parsePropsEntries,
  defaultPropValue,
  defaultStorybookInput,
  getStorybookKnobs,
  isPrimitiveType,
} from './typesUtils';
import {
  classify,
  underscore,
  camelize,
  capitalize,
} from '@nx/devkit/src/utils/string-utils';

export const getComponentTemplateVariables = (
  _options: Record<string, any>,
) => {
  const {
    props,
    events,
    copy,
    styles,
    'data-testid': dataTestId,
    'facade-events-mediation': facadeEventsMediation,
    'sg-components': sgComponents,
    'markup-content': markupContent,
  } = _options;

  const eventsPrefix = 'Gene-';
  const flowDeclaration = false;
  const readonlyUtilType = 'Readonly';
  const shouldAddFlowDeclaration = false;
  const defaultPropsType = 'unknown';
  const stylesExtension = 'scss';

  const propsArray = pipe(
    splitStringToEntries(defaultPropsType) as any,
    map(
      parsePropsEntries({
        defaultValue: defaultPropsType,
        shouldAddFlowDeclaration,
      }),
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  )(props as string);
  const eventsArray = splitStringToArray(events as string);
  const copyArray = splitStringToArray(copy as string);
  const stylesArray = splitStringToArray(styles as string);

  const storybookKnobs = getStorybookKnobs(propsArray, copyArray);
  const sgComponentsArray = splitStringToArray(sgComponents as string);

  const eventsObjectName = (name: string) =>
    `${underscore(name).toUpperCase()}_EVENTS_TYPE`;
  const eventsTypeName = (name: string) => `${classify(name)}EventsType`;
  const eventTypeName = (componentName: string, eventName: string) =>
    `${classify(componentName)}${classify(eventName)}Type`;
  const eventsKeyName = (event: string) => underscore(event).toUpperCase();
  const eventValueName = (event: string, name: string, eventsPrefix: string) =>
    `${eventsPrefix}${classify(name)}${classify(event)}`;
  const copyTypeName = (name: string) => `${classify(name)}CopyType`;
  const dataTestIdName = (name: string) => dataTestId || underscore(name);
  const valuesOfType = (typeName: string) =>
    `typeof ${typeName}[keyof typeof ${typeName}]`;

  return {
    propsArray,
    eventsArray,
    copyArray,
    stylesArray,
    readonlyUtilType,
    eventsPrefix,
    flowDeclaration,
    shouldAddFlowDeclaration,
    stylesExtension,
    storybookKnobs,
    facadeEventsMediation,
    sgComponents,
    sgComponentsArray,
    markupContent,
    valuesOfType,
    eventsObjectName,
    eventsTypeName,
    eventTypeName,
    eventsKeyName,
    eventValueName,
    copyTypeName,
    dataTestIdName,
    defaultPropValue,
    defaultStorybookInput,
    isPrimitiveType,
    classify,
    underscore,
    camelize,
    capitalize,
  };
};
