import { Tree } from '@nrwl/devkit';
import * as devkit from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import workspaceExecutorGenerator from './index';

describe('workspaceExecutor generator', () => {
  let tree: Tree;
  const executorName = 'fooBar';
  const expectedExecutorName = 'foo-bar';

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});

    tree.write(
      'tools/executors/executors.json',
      JSON.stringify({ executors: {} })
    );
    tree.write(
      'tools/executors/README.md',
      `# Executors

Some description

## Available workspace executors

- [some-executor](./some-executor/README.md)

## Other sections

Some text
`
    );
  });

  it('should throw when the executor already exists', async () => {
    tree.write(
      'tools/executors/executors.json',
      JSON.stringify({ executors: { [expectedExecutorName]: {} } })
    );

    expect(
      async () => await workspaceExecutorGenerator(tree, { name: executorName })
    ).rejects.toThrow();
  });

  it('should generate files', async () => {
    await workspaceExecutorGenerator(tree, { name: executorName });

    expect(
      tree.exists(`tools/executors/${expectedExecutorName}/impl.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`tools/executors/${expectedExecutorName}/README.md`)
    ).toBeTruthy();
    expect(
      tree.exists(`tools/executors/${expectedExecutorName}/schema.json`)
    ).toBeTruthy();
  });

  it('should add the executor to the executors.json', async () => {
    await workspaceExecutorGenerator(tree, { name: executorName });

    expect(
      devkit.readJson(tree, `tools/executors/executors.json`)
    ).toMatchSnapshot();
  });

  it('should add the executor to the list of available executors in the README', async () => {
    await workspaceExecutorGenerator(tree, { name: executorName });

    expect(tree.read(`tools/executors/README.md`, 'utf-8')).toMatchSnapshot();
  });

  it('should format files', async () => {
    jest.spyOn(devkit, 'formatFiles');

    await workspaceExecutorGenerator(tree, { name: executorName });

    expect(devkit.formatFiles).toHaveBeenCalled();
  });
});
