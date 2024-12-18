import {
  RuleModule,
} from '@typescript-eslint/utils/eslint-utils';
import { USE_LISTENER_RULE_NAME, useListenerRule } from './use-listener';

export const rules: Record<string, RuleModule<string, any[]>> = {
  [USE_LISTENER_RULE_NAME]: useListenerRule,
};
