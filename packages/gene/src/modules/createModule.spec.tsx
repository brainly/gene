import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/matchers';
import { createGeneModule } from './createModule';
import { ModuleComponentType } from './types';

describe('createGeneModule', () => {
  const SimpleModuleComponent = () => (
    <div data-testid="simple-module">simple module</div>
  );

  type SlotsLabelsTypes = 'adSlot' | 'nullSlot'

  const SlotsModuleComponent = ({ slots }: { slots?: Record<SlotsLabelsTypes, JSX.Element | null> }) => (
    <div data-testid="slots-module">{slots?.adSlot}</div>
  );

  it('should properly create a simple module', () => {
    const SimpleModule = createGeneModule({
      module: SimpleModuleComponent as ModuleComponentType<any>,
      declarations: {},
    });

    expect(SimpleModule).not.toBeNull();

    render(<SimpleModule.module />);

    expect(screen.getByTestId('simple-module')).toBeInTheDocument();
  });

  it('should properly create a module with slots', () => {
    const {module: SlotsModule} = createGeneModule<Record<string, unknown>, 'adSlot' | 'nullSlot'>({
      module: SlotsModuleComponent,
      declarations: {},
    });

    expect(SlotsModule).not.toBeNull();

    render(
      <SlotsModule slots={{adSlot: <div data-testid="ad-slot" />, nullSlot: null}} />
    );

    expect(screen.getByTestId('slots-module')).toBeInTheDocument();
    expect(screen.getByTestId('ad-slot')).toBeInTheDocument();
  });
});
