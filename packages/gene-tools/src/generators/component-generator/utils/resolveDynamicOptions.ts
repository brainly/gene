import type { PromptsProfileDefaultValueKeyType } from './resolveGeneratorOptions';
import { resolveGeneratorOptions } from './resolveGeneratorOptions';

export type ComponentPromptsProfileType = 'basic' | 'sample' | 'advanced';

export interface ComponentSchemaType {
  ['prompts-profile']: ComponentPromptsProfileType;
  name?: string;
  props?: string;
  events?: string;
  copy?: string;
  styles?: string;
  tests?: boolean | string;
  storybook?: boolean | string;
  reexport?: boolean | string;
  ['sg-components']?: string;
  ['data-testid']?: string;
  ['markup-content']?: string;
  directory?: string;
  reexportIndexPath?: string;
  reexportRelativePath?: string;
  libraryShortName?: string;
}

export const ComponentPromptsProfileMapping: Readonly<
  Record<ComponentPromptsProfileType, (keyof ComponentSchemaType)[]>
> = {
  basic: ['name'],
  sample: ['name'],
  advanced: [
    'name',
    'props',
    'events',
    'copy',
    'styles',
    'tests',
    'storybook',
    'data-testid',
  ],
};

export const ComponentPromptsProfileDefaultValueKeyMapping: Readonly<
  Record<ComponentPromptsProfileType, PromptsProfileDefaultValueKeyType>
> = {
  basic: 'x-custom-default',
  sample: 'x-custom-sample',
  advanced: 'x-custom-default',
};

export const resolveDynamicOptions = async (
  initialOptions: ComponentSchemaType,
): Promise<ComponentSchemaType> => {
  const options = await resolveGeneratorOptions<
    ComponentPromptsProfileType,
    ComponentSchemaType
  >({
    initialOptions,
    schemaPath: './dynamicSchema.json',
    promptsProfileMapping: ComponentPromptsProfileMapping,
    promptsProfileDefaultValueMapping:
      ComponentPromptsProfileDefaultValueKeyMapping,
  });

  return options;
};
