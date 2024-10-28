import { logger, readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import serviceGenerator from './index';

describe('Service generator', () => {
  let appTree: Tree;
  let projectName: string;

  beforeEach(async () => {
    projectName = 'my-service';
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});

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
        'libs/my-service/services/my-service-service/src/lib/useMyService.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        'libs/my-service/services/my-service-service/src/lib/queries.ts'
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        'libs/my-service/services/my-service-service/src/lib/my-service-service.ts'
      )
    ).not.toBeTruthy();
    expect(
      appTree.exists(
        'libs/my-service/services/my-service-service/src/lib/my-service-service.spec.ts'
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
      .read(
        'libs/my-service/services/my-service-service/src/lib/useMyService.ts'
      )
      ?.toString();

    expect(hookContent).toContain('useInjectedApolloClient');

    const queriesContent = appTree
      .read('libs/my-service/services/my-service-service/src/lib/queries.ts')
      ?.toString();

    expect(queriesContent).toContain('ApolloClient');
  });

  it('should generate react-query service', async () => {
    await serviceGenerator(appTree, {
      directory: '',
      name: projectName,
      serviceType: 'react-query',
      tags: '',
    });

    const hookContent = appTree
      .read(
        'libs/my-service/services/my-service-service/src/lib/useMyService.ts'
      )
      ?.toString();

    expect(hookContent).toContain('useInjectedReactQueryClient');

    const queriesContent = appTree
      .read('libs/my-service/services/my-service-service/src/lib/queries.ts')
      ?.toString();

    expect(queriesContent).toContain('QueryClient');
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
