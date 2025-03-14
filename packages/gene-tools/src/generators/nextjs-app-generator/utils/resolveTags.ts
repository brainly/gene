import type { BrainlyNextJSAppGenerator } from '../schema';

export const resolveTags = (schema: BrainlyNextJSAppGenerator) => {
  if (!schema.tags) {
    return 'type:app';
  }

  return `type:app,${schema.tags}`;
};
