import { classify } from '@nx/devkit/src/utils/string-utils';

import { map, uniq, pipe, ifElse, append, identity } from 'ramda';

export const splitStringToArray = (str: string | undefined) =>
  str ? str.split(',') : [];

export const getEntry = (defaultValue?: string) => (strPiece: string) => {
  const [key, value] = strPiece.split(':');

  return [key, value || defaultValue];
};

export const splitStringToEntries = (defaultValue?: string) =>
  pipe(splitStringToArray, map(getEntry(defaultValue)));

// Parse props entries name

export const parsePropsEntries =
  ({
    defaultValue,
    shouldAddFlowDeclaration,
  }: {
    defaultValue: string;
    shouldAddFlowDeclaration: boolean;
  }) =>
  (entries: string[]) => {
    const [prop, propType] = entries;

    switch (propType) {
      case 'boolean':
      case 'number':
      case 'string':
      case 'mixed':
      case 'unknown': {
        return [prop, propType];
      }
      case 'array': {
        return [prop, `${classify(propType)}<${defaultValue}>`];
      }
      case 'object': {
        return [
          prop,
          shouldAddFlowDeclaration
            ? classify(propType)
            : 'Record<string, unknown>',
        ];
      }
      default: {
        return [prop, defaultValue];
      }
    }
  };

// Provides storybook knob function name for given propType

export const parsePropTypeToKnob = (propType: string) => {
  if (propType.includes('Array')) {
    return 'array';
  }

  if (propType.includes('Record')) {
    return 'object';
  }

  switch (propType) {
    case 'string':
    case 'mixed':
    case 'unknown':
    default: {
      return 'text';
    }
    case 'Object': {
      return 'object';
    }
    case 'boolean':
    case 'number': {
      return propType;
    }
  }
};

// Accumulate all possible knob functions for props (for import purpose)

const maybeIncludeCopyType = ifElse(
  (_, copyArray) => copyArray.length > 0,
  append('string'),
  identity
);

export const getStorybookKnobs: (
  propsArray: (string | undefined)[][],
  copyArray: string[]
) => string[] = pipe(
  maybeIncludeCopyType,
  map(([, propType]: any) => parsePropTypeToKnob(propType)),
  uniq
);

export const defaultPropValue = (prop: string, propType: string) => {
  if (propType.includes('Array')) {
    return '[]';
  }

  if (propType.includes('Record')) {
    return '{}';
  }

  switch (propType) {
    case 'mixed':
    case 'unknown':
    case 'string':
    default: {
      return `"test ${prop} value"`;
    }
    case 'number': {
      return '0';
    }
    case 'boolean': {
      return 'false';
    }
    case 'Object': {
      return '{}';
    }
  }
};

export const defaultStorybookInput = (prop: string, propType: string) => {
  const assembleInput = (defaultInput: any, options?: any) =>
    `${parsePropTypeToKnob(propType)}('${prop}', ${defaultInput}${
      options ? `, ${options}` : ''
    })`;

  if (propType.includes('Array')) {
    return assembleInput('[]');
  }

  if (propType.includes('Record')) {
    return assembleInput('{}', `"${prop}-schema-id"`);
  }

  switch (propType) {
    case 'mixed':
    case 'unknown':
    case 'string':
    default: {
      return assembleInput(`"test ${prop} value"`);
    }
    case 'number': {
      return assembleInput(0);
    }
    case 'boolean': {
      return assembleInput(false);
    }
    case 'Object': {
      return assembleInput('{}', `"${prop}-schema-id"`);
    }
  }
};

export const isPrimitiveType = (type: string) => {
  const primitiveTypes = ['string', 'boolean', 'number'];

  return primitiveTypes.indexOf(type) > -1;
};
