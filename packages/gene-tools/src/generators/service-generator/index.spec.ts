import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import serviceGenerator from './index';
import { prompt } from 'inquirer';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';
jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

const mockCrudOptions = (options: string[]) => {
  (prompt as unknown as jest.Mock).mockImplementationOnce(() => {
    return { crudFunctions: options };
  });
};

describe('Service generator', () => {
  let appTree: Tree;
  let projectName: string;
  let directory: string;

  beforeEach(async () => {
    projectName = 'question';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    directory = 'libs/question/services';

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files and delete default files', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'apollo',
      tags: '',
    });

    expect(nxFileTreeSnapshotSerializer(appTree)).toMatchInlineSnapshot(`
      ".prettierrc
      package.json
      nx.json
      tsconfig.base.json
      apps
      └── .gitignore
      libs
      ├── .gitignore
      └── question
          └── services
              └── question-service
                  ├── project.json
                  ├── src
                  │   ├── index.ts
                  │   ├── README.md
                  │   └── lib
                  │       ├── queries.ts
                  │       ├── useQuestion.ts
                  │       └── useQuestionLazy.ts
                  ├── tsconfig.lib.json
                  ├── .babelrc
                  ├── tsconfig.json
                  ├── .eslintrc.json
                  ├── tsconfig.spec.json
                  └── jest.config.ts
      .prettierignore
      .eslintrc.json
      .eslintignore
      jest.preset.js
      jest.config.ts
      "
    `);
  });

  it('should generate apollo service', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'apollo',
      tags: '',
    });

    const hookContent = appTree
      .read('libs/question/services/question-service/src/lib/useQuestion.ts')
      ?.toString();

    expect(hookContent).toContain('useInjectedApolloClient');

    const queriesContent = appTree
      .read('libs/question/services/question-service/src/lib/queries.ts')
      ?.toString();

    expect(queriesContent).toContain('ApolloClient');
  });

  it('should generate react-query service', async () => {
    mockCrudOptions([
      'useQuestions',
      'useQuestion',
      'useCreateQuestion',
      'useUpdateQuestion',
      'useDeleteQuestion',
    ]);

    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      tags: '',
    });

    let hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestions.ts`)
      ?.toString();

    expect(hookContent).toContain('useQuestions');

    // useQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useQuestion');

    // useCreateQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useCreateQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useCreateQuestion');
    expect(hookContent).toContain(`method: 'POST'`);

    // useDeleteQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useDeleteQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useDeleteQuestion');
    expect(hookContent).toContain(`method: 'DELETE'`);

    // useUpdateQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useUpdateQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useUpdateQuestion');
    expect(hookContent).toContain(`method: 'PATCH'`);

    const indexFile = appTree
      .read(`${directory}/question-service/src/index.ts`)
      ?.toString();

    expect(indexFile).toMatchInlineSnapshot(`
      "export {
        useQuestion,
        queryQuestion,
        getQuestionQueryKey,
      } from './lib/useQuestion';
      export {
        useQuestions,
        queryQuestions,
        getQuestionsQueryKey,
      } from './lib/useQuestions';
      export { useCreateQuestion } from './lib/useCreateQuestion';
      export { useUpdateQuestion } from './lib/useUpdateQuestion';
      export { useDeleteQuestion } from './lib/useDeleteQuestion';
      "
    `);
  });

  it('should generate react-query service with only selected crud operations', async () => {
    mockCrudOptions(['useQuestions', 'useUpdateQuestion']);

    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      tags: '',
    });

    // useQuestions
    let hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestions.ts`)
      ?.toString();

    expect(hookContent).toContain('useQuestions');

    // useQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

    // useCreateQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useCreateQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

    // useDeleteQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useDeleteQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

    // useUpdateQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useUpdateQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useUpdateQuestion');
    expect(hookContent).toContain(`method: 'PATCH'`);

    const indexFile = appTree
      .read(`${directory}/question-service/src/index.ts`)
      ?.toString();

    expect(indexFile).toMatchInlineSnapshot(`
      "export {
        useQuestions,
        queryQuestions,
        getQuestionsQueryKey,
      } from './lib/useQuestions';
      export { useUpdateQuestion } from './lib/useUpdateQuestion';
      "
    `);
  });

  it('should camelize query name if service name includes "-"', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: 'service-name',
      serviceType: 'apollo',
      tags: '',
    });

    const queriesContent = appTree
      .read(`${directory}/service-name-service/src/lib/queries.ts`)
      ?.toString();

    expect(queriesContent).toContain('serviceNameQuery');
  });
});
