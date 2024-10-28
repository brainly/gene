import {BrainlyCoreModuleGenerator} from '../schema';

export const resolveTags = (schema: BrainlyCoreModuleGenerator) => {
  if (!schema.tags) {
    return `type:core-module`;
  }

  return `type:core-module,${schema.tags}`;
};
