import {BrainlyComponentLibraryGenerator} from '../schema';

export const resolveTags = (schema: BrainlyComponentLibraryGenerator) => {
  if (!schema.tags) {
    return 'type:component';
  }

  return ['type:component', ...(schema.tags.split(',') || [])].join(',');
};
