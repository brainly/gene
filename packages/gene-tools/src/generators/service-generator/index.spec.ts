import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import serviceGenerator from './index';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

describe('Service generator', () => {
  let appTree: Tree;
  let projectName: string;
  let directory: string;

  beforeEach(async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => jest.fn());
    jest.spyOn(logger, 'debug').mockImplementation(() => jest.fn());

    projectName = 'question';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    directory = 'libs/question/services';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate files and delete default files', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'apollo',
      useDefaultCrudFunctions: true,
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
      useDefaultCrudFunctions: true,
      tags: '',
    });

    const hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useInjectedApolloClient');

    const queriesContent = appTree
      .read(`${directory}/question-service/src/lib/queries.ts`)
      ?.toString();

    expect(queriesContent).toContain('ApolloClient');
  });

  it('should generate react-query service', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      crudOperations: ['get', 'create', 'update', 'delete'],
      tags: '',
    });

    // useQuestions - Note: the generator creates useQuestion for 'get', not useQuestions
    let hookContent = appTree
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
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      crudOperations: ['update'],
      tags: '',
    });

    // useQuestions - Note: the generator creates useQuestion for 'get', not useQuestions
    let hookContent = appTree
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
      "export { useUpdateQuestion } from './lib/useUpdateQuestion';
      "
    `);
  });

  it('should camelize query name if service name includes "-"', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: 'service-name',
      serviceType: 'apollo',
      useDefaultCrudFunctions: true,
      tags: '',
    });

    const queriesContent = appTree
      .read(`${directory}/service-name-service/src/lib/queries.ts`)
      ?.toString();

    expect(queriesContent).toContain('serviceNameQuery');
  });

  it('should generate react-query service with includeRead flag', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      includeRead: true,
      tags: '',
    });

    // Should have useQuestion
    let hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useQuestion');

    // Should NOT have create, update, delete operations
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useCreateQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useUpdateQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useDeleteQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

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
      "
    `);
  });

  it('should generate react-query service with includeCreate flag', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      includeCreate: true,
      tags: '',
    });

    // Should have useCreateQuestion
    let hookContent = appTree
      .read(`${directory}/question-service/src/lib/useCreateQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useCreateQuestion');
    expect(hookContent).toContain(`method: 'POST'`);

    // Should NOT have read, update, delete operations
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

    const indexFile = appTree
      .read(`${directory}/question-service/src/index.ts`)
      ?.toString();

    expect(indexFile).toMatchInlineSnapshot(`
      "export { useCreateQuestion } from './lib/useCreateQuestion';
      "
    `);
  });

  it('should generate react-query service with multiple include flags', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'react-query',
      includeRead: true,
      includeUpdate: true,
      includeDelete: true,
      tags: '',
    });

    // Should have useQuestion
    let hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useQuestion');

    // Should have useUpdateQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useUpdateQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useUpdateQuestion');
    expect(hookContent).toContain(`method: 'PATCH'`);

    // Should have useDeleteQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useDeleteQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useDeleteQuestion');
    expect(hookContent).toContain(`method: 'DELETE'`);

    // Should NOT have useCreateQuestion
    hookContent = appTree
      .read(`${directory}/question-service/src/lib/useCreateQuestion.ts`)
      ?.toString();

    expect(hookContent).toBe(undefined);

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
      export { useUpdateQuestion } from './lib/useUpdateQuestion';
      export { useDeleteQuestion } from './lib/useDeleteQuestion';
      "
    `);
  });

  it('should generate apollo service with includeRead flag', async () => {
    await serviceGenerator(appTree, {
      directory,
      name: projectName,
      serviceType: 'apollo',
      includeRead: true,
      tags: '',
    });

    const hookContent = appTree
      .read(`${directory}/question-service/src/lib/useQuestion.ts`)
      ?.toString();

    expect(hookContent).toContain('useInjectedApolloClient');

    const queriesContent = appTree
      .read(`${directory}/question-service/src/lib/queries.ts`)
      ?.toString();

    expect(queriesContent).toContain('ApolloClient');
  });
});
