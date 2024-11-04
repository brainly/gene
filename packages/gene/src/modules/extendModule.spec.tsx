import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/matchers';
import { extendGeneModule } from './extendModule';
import { ModuleComponentType } from './types';
import { createGeneModule } from './createModule';


describe('extendModule', () => {
  const parentModuleComponent = () => (
    <div data-testid="parent-module">parent module</div>
  );

  const defaultParentModule = createGeneModule({
    module: parentModuleComponent as ModuleComponentType<any>,
    declarations: {},
  });

  it('should properly extend a module with no module component definition', () => {
    const ChildModule = extendGeneModule(
      defaultParentModule.declarations,
      {}
    );

    expect(ChildModule).not.toBeNull();

    render(<ChildModule />);

    expect(screen.getByTestId('parent-module')).toBeInTheDocument();
  });

  it('should properly extend a module with another module component definition', () => {
    const childModuleComponent = jest.fn(() => (
      <div data-testid="child-module">child module</div>
    ));

    const ChildModule = extendGeneModule(defaultParentModule.declarations, {
      declarations: {},
      module: childModuleComponent as ModuleComponentType<any>,
    });

    expect(ChildModule).not.toBeNull();

    render(<ChildModule />);

    expect(screen.getByTestId('child-module')).toBeInTheDocument();
  });
});
