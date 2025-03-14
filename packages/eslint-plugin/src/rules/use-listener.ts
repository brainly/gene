import type {
  TSESTree} from '@typescript-eslint/utils';
import {
  AST_NODE_TYPES,
  ESLintUtils
} from '@typescript-eslint/utils';

export type Options = [
  {
    ignorePaths?: string[];
  }
];
type MessageIds = 'useListenerInModule';

export const USE_LISTENER_RULE_NAME = 'use-listener';

export const useListenerRule = ESLintUtils.RuleCreator(
  () => `https://brainly.github.io/gene/gene/components/hooks/useListener`
)<Options, MessageIds>({
  name: USE_LISTENER_RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: `disallow the use of useListener inside a module. Each event should be managed by mediator, so by useMediator hook.
            useListener is designed for rare cases when we need to listen to events before it reaches the mediator.
            There should be always one mediator that should listen to event.
            There can be zero or more listeners that can listen to the event before it reaches the mediator`,
      recommended: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      useListenerInModule: [
        'useListener should not be used in module. Use useMediator instead.',
        'Each event should be managed by useMediator hook.',
        'useListener is designed for rare cases when we need to listen to events before it reaches the mediator.',
        'There should be always one mediator that should listen to event.',
        'There can be zero or more listeners that can listen to the event before it reaches the mediator.',
      ].join('\n'),
    },
  },
  defaultOptions: [
    {
      ignorePaths: [],
    },
  ],
  create(context, [{ ignorePaths }]) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        const isPathIgnored = ignorePaths?.some((path) =>
          context.getFilename().includes(path)
        );

        if (isPathIgnored) {
          return;
        }

        //Check if file is a module
        if (!context.getFilename().includes('-module')) {
          return;
        }

        // Check if it is under components directory
        if (context.getFilename().includes('/components/')) {
          return;
        }

        // Check if useListener is used
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === 'useListener'
        ) {
          context.report({
            node,
            messageId: 'useListenerInModule',
            fix(fixer) {
              // Replace useListener with useMediator
              return fixer.replaceText(node.callee, 'useMediator');
            },
          });
        }
      },
    };
  },
});
