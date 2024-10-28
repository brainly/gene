import {bind, fromPairs, pipe, prop, toPairs} from 'ramda';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';

type SchemaPropertiesEntryType<TSchemaType> = [
  keyof TSchemaType,
  SchemaPropertyType
];

type MinimaSchemaType<TPromptsProfile> = Readonly<{
  'prompts-profile': TPromptsProfile;
}>;

type SchemaPropertyType = Readonly<{
  type: string;
  'x-custom-prompt'?: string;
  'x-custom-default'?: string;
  'x-custom-sample'?: string;
}>;

export type FileUtilsSaveOptsType = Readonly<{newFileContent: string}> &
  FileUtilsReadOptsType;

export type FileUtilsReadOptsType = Readonly<{fileContent: string}> &
  FileUtilsInputOptsType;

export type FileUtilsInputOptsType = Readonly<{filePath: string}>;

export type InquirerPromptType =
  | 'input'
  | 'number'
  | 'confirm'
  | 'list'
  | 'rawlist'
  | 'expand'
  | 'checkbox'
  | 'password'
  | 'editor';

export type PromptsProfileDefaultValueKeyType =
  | 'x-custom-default'
  | 'x-custom-sample';

type PromptOutputType =
  | {choice?: string; list?: string; input?: string; confirm?: boolean}
  | undefined;

const resolvePromptOutput = (promptOutput: PromptOutputType) =>
  promptOutput
    ? promptOutput.choice ||
      promptOutput.list ||
      promptOutput.input ||
      promptOutput.confirm ||
      null
    : null;

export async function getUserPromptInput({
  promptType,
  question,
  defaultAnswer,
  choices,
}: {
  promptType: InquirerPromptType;
  question: string;
  defaultAnswer?: string;
  choices?: string[];
}): Promise<boolean | string | null> {
  try {
    const promptOutput: PromptOutputType = await inquirer.prompt({
      type: promptType,
      name: promptType,
      message: question,
      default: defaultAnswer,
      choices,
    });

    return resolvePromptOutput(promptOutput);
  } catch (e: any) {
    if (e.isTtyError) {
      throw new Error("Prompt couldn't be rendered in the current environment");
    } else {
      throw new Error(e);
    }
  }
}

export const getElementFileContent = (opts: FileUtilsInputOptsType) => {
  const {filePath} = opts;

  const fileContent = fs
    .readFileSync(path.join(__dirname, filePath))
    .toString();

  return {
    ...opts,
    fileContent,
  };
};

const SchematicToInquirerPromptTypeMapping: Record<string, InquirerPromptType> =
  Object.freeze({
    string: 'input',
    boolean: 'confirm',
  });

const getSchemaPropertiesEntries = pipe(
  getElementFileContent,
  prop('fileContent'),
  bind(JSON.parse, JSON),
  prop('properties'),
  toPairs
);

const isPropertyIncludedInPromptsProfile = <
  TPromptsProfile extends string,
  TSchemaType extends MinimaSchemaType<TPromptsProfile>
>({
  promptsProfile,
  promptsProfileMapping,
  schemaPropEntry,
}: {
  promptsProfile: TPromptsProfile;
  promptsProfileMapping: Record<TPromptsProfile, (keyof TSchemaType)[]>;
  schemaPropEntry: SchemaPropertiesEntryType<TSchemaType>;
}) => {
  const [propKey] = schemaPropEntry;

  return promptsProfileMapping[promptsProfile].includes(propKey);
};

// Returns options for schema entry accordingly to scenario
// Possible scenarios:
// * return value if passed from from Schematic input (e.g. command-line arguments)
// * return empty string for option outside of prompts profile and without default value
// * return default value for option outside of prompts profile and with default value
// * return empty string for option within prompts profile without defined question or without mapping from schematic to inquirer prompt
// * return prompting result for optio within prompts profile with schematic-inquirer mapping and defined question

const resolveOption = async <
  TPromptsProfile extends string,
  TSchemaType extends MinimaSchemaType<TPromptsProfile>
>({
  schemaPropEntry,
  promptsProfile,
  promptsProfileMapping,
  initialOptions,
  defaultValueKey,
}: {
  schemaPropEntry: SchemaPropertiesEntryType<TSchemaType>;
  promptsProfile: TPromptsProfile;
  promptsProfileMapping: Record<TPromptsProfile, (keyof TSchemaType)[]>;
  initialOptions: TSchemaType;
  defaultValueKey: PromptsProfileDefaultValueKeyType;
}) => {
  const [schemaPropKey, schemaPropValue] = schemaPropEntry;

  if (initialOptions[schemaPropKey] !== undefined) {
    return [schemaPropKey, initialOptions[schemaPropKey]];
  }

  const {
    type: schematicPromptType,
    'x-custom-prompt': question,
    [defaultValueKey]: defaultAnswer,
  } = schemaPropValue;

  const propertyIncludedInPromptsProfile = isPropertyIncludedInPromptsProfile({
    schemaPropEntry,
    promptsProfile,
    promptsProfileMapping,
  });

  if (!propertyIncludedInPromptsProfile && !defaultAnswer) {
    return [schemaPropKey, ''];
  }

  if (!propertyIncludedInPromptsProfile && defaultAnswer) {
    return [schemaPropKey, defaultAnswer];
  }

  if (
    !question ||
    !(schematicPromptType in SchematicToInquirerPromptTypeMapping)
  ) {
    return [schemaPropKey, ''];
  }

  const inquirerPromptType =
    SchematicToInquirerPromptTypeMapping[schematicPromptType];

  const promptedOption =
    (await getUserPromptInput({
      promptType: inquirerPromptType,
      question,
      defaultAnswer,
    })) || '';

  return [schemaPropKey, promptedOption];
};

// Resolve all options from schema sequentially - required by Inquirer

const resolveAllOptions = async <
  TPromptsProfile extends string,
  TSchemaType extends MinimaSchemaType<TPromptsProfile>
>({
  schemaPropertiesEntries,
  initialOptions,
  promptsProfile,
  promptsProfileMapping,
  defaultValueKey,
}: {
  schemaPropertiesEntries: SchemaPropertiesEntryType<TSchemaType>[];
  initialOptions: TSchemaType;
  promptsProfile: TPromptsProfile;
  promptsProfileMapping: Record<TPromptsProfile, (keyof TSchemaType)[]>;
  defaultValueKey: PromptsProfileDefaultValueKeyType;
}) => {
  const resolvedOptions: SchemaPropertiesEntryType<TSchemaType>[] = [];

  for await (const schemaPropEntry of schemaPropertiesEntries) {
    resolvedOptions.push(
      (await resolveOption({
        initialOptions,
        schemaPropEntry,
        promptsProfile,
        promptsProfileMapping,
        defaultValueKey,
      })) as SchemaPropertiesEntryType<TSchemaType>
    );
  }

  return fromPairs(resolvedOptions as [string, SchemaPropertyType][]);
};

// Merge initial options (provided by schematics props with x-prompt arg or from arguments) with ones resolved using:
// * options resolved by custom prompts (x-custom-prompt)
// * default value (x-custom-default)

export const resolveGeneratorOptions = async <
  TPromptsProfile extends string,
  TSchemaType extends MinimaSchemaType<TPromptsProfile>
>({
  initialOptions,
  promptsProfileMapping,
  promptsProfileDefaultValueMapping,
  schemaPath,
}: {
  initialOptions: TSchemaType;
  promptsProfileMapping: Record<TPromptsProfile, (keyof TSchemaType)[]>;
  promptsProfileDefaultValueMapping: Record<
    TPromptsProfile,
    PromptsProfileDefaultValueKeyType
  >;
  schemaPath: string;
}): Promise<TSchemaType> => {
  try {
    const {'prompts-profile': promptsProfile} = initialOptions;
    const schemaPropertiesEntries = getSchemaPropertiesEntries({
      filePath: schemaPath,
    }) as SchemaPropertiesEntryType<TSchemaType>[];
    const defaultValueKey = promptsProfileDefaultValueMapping[promptsProfile];

    const resolvedOptions = await resolveAllOptions({
      schemaPropertiesEntries,
      initialOptions,
      promptsProfile,
      promptsProfileMapping,
      defaultValueKey,
    });

    return {
      ...initialOptions,
      ...resolvedOptions,
    };
  } catch (e: any) {
    throw new Error(
      `Failed to gather user options with error: ${e.message || e}`
    );
  }
};
