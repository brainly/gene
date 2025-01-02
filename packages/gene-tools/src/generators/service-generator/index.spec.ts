import { logger, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import serviceGenerator from './index';
import * as inquirer from 'inquirer';
jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

const mockCrudOptions = (options: string[]) => {
  (inquirer.prompt as unknown as jest.Mock).mockImplementationOnce(
    ([{ name }]) => {
      return { crudFunctions: options };
    }
  );
};

describe('Service generator', () => {
  let appTree: Tree;
  let projectName: string;

  beforeEach(async () => {
    projectName = 'question';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files and delete default files', async () => {
    await serviceGenerator(appTree, {
      directory: '',
      name: projectName,
      serviceType: 'apollo',
      tags: '',
    });

    expect(
      appTree.exists(
        'libs/question/services/question-service/src/lib/useQuestion.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        'libs/question/services/question-service/src/lib/queries.ts'
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        'libs/question/services/question-service/src/lib/question-service.ts'
      )
    ).not.toBeTruthy();
    expect(
      appTree.exists(
        'libs/question/services/question-service/src/lib/question-service.spec.ts'
      )
    ).not.toBeTruthy();
  });

  it('should generate apollo service', async () => {
    await serviceGenerator(appTree, {
      directory: '',
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
      directory: '',
      name: projectName,
      serviceType: 'react-query',
      tags: '',
    });

    // useQuestions
    let hookContent = appTree
      .read('libs/question/services/question-service/src/lib/useQuestions.ts')
      ?.toString();

    expect(hookContent).toContain('useQuestions');

    // useQuestion
    hookContent = appTree
      .read('libs/question/services/question-service/src/lib/useQuestion.ts')
      ?.toString();

    expect(hookContent).toContain('useQuestion');

    // useCreateQuestion
    hookContent = appTree
      .read(
        'libs/question/services/question-service/src/lib/useCreateQuestion.ts'
      )
      ?.toString();

    expect(hookContent).toContain('useCreateQuestion');
    expect(hookContent).toContain(`method: 'POST'`);

    // useDeleteQuestion
    hookContent = appTree
      .read(
        'libs/question/services/question-service/src/lib/useDeleteQuestion.ts'
      )
      ?.toString();

    expect(hookContent).toContain('useDeleteQuestion');
    expect(hookContent).toContain(`method: 'DELETE'`);

    // useUpdateQuestion
    hookContent = appTree
      .read(
        'libs/question/services/question-service/src/lib/useUpdateQuestion.ts'
      )
      ?.toString();

    expect(hookContent).toContain('useUpdateQuestion');
    expect(hookContent).toContain(`method: 'PATCH'`);

    const indexFile = appTree
      .read('libs/question/services/question-service/src/index.ts')
      ?.toString();

    expect(indexFile).toMatchInlineSnapshot(`
      "export { useQuestion, queryQuestion, getQuestionQueryKey } from './lib/useQuestion';
      export { useQuestions, queryQuestions, getQuestionsQueryKey } from './lib/useQuestions';
      export { useCreateQuestion } from './lib/useCreateQuestion';
      export { useUpdateQuestion } from './lib/useUpdateQuestion';
      export { useDeleteQuestion } from './lib/useDeleteQuestion';"
    `);
  });

  it('should generate react-query service with only selected crud operations', async () => {
    mockCrudOptions(['useQuestions', 'useUpdateQuestion']);

    await serviceGenerator(appTree, {
      directory: '',
      name: projectName,
      serviceType: 'react-query',
      tags: '',
    });

    // useQuestions
    let hookContent = appTree
      .read('libs/question/services/question-service/src/lib/useQuestions.ts')
      ?.toString();

    expect(hookContent).toContain('useQuestions');

    // useQuestion
    hookContent = appTree
      .read('libs/question/services/question-service/src/lib/useQuestion.ts')
      ?.toString();

    expect(hookContent).toBe(undefined);

    // useCreateQuestion
    hookContent = appTree
      .read(
        'libs/question/services/question-service/src/lib/useCreateQuestion.ts'
      )
      ?.toString();

    expect(hookContent).toBe(undefined);

    // useDeleteQuestion
    hookContent = appTree
      .read(
        'libs/question/services/question-service/src/lib/useDeleteQuestion.ts'
      )
      ?.toString();

    expect(hookContent).toBe(undefined);

    // useUpdateQuestion
    hookContent = appTree
      .read(
        'libs/question/services/question-service/src/lib/useUpdateQuestion.ts'
      )
      ?.toString();

    expect(hookContent).toContain('useUpdateQuestion');
    expect(hookContent).toContain(`method: 'PATCH'`);

    const indexFile = appTree
      .read('libs/question/services/question-service/src/index.ts')
      ?.toString();

    expect(indexFile).toMatchInlineSnapshot(`
      "export { useQuestions, queryQuestions, getQuestionsQueryKey } from './lib/useQuestions';
      export { useUpdateQuestion } from './lib/useUpdateQuestion';"
    `);
  });

  it('should camelize query name if service name includes "-"', async () => {
    await serviceGenerator(appTree, {
      directory: '',
      name: 'service-name',
      serviceType: 'apollo',
      tags: '',
    });

    const queriesContent = appTree
      .read(
        'libs/service-name/services/service-name-service/src/lib/queries.ts'
      )
      ?.toString();

    expect(queriesContent).toContain('serviceNameQuery');
  });
});
