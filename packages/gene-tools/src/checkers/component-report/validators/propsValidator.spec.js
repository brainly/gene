const { validateProps } = require('./propsValidator');
const path = require('path');
const { findPropTypesDeclaration } = require('../../common/utils/components');
const fs = require('fs');

describe('validateProps()', () => {
  it('passes a valid PropsType', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/ValidProps.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('supports React.forwardRef', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/ValidPropsForwardRef.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('gives appropriate React.forwardRef error message ', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/InvalidPropsForwardRef.tsx'),
    );

    expect(result).toEqual({
      error:
        'PropsType should be added explicitly to the props. (props: PropsType, ref) => {}',
      valid: false,
    });
  });

  it('supports compose in default export', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/ValidPropsCompose.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects callback props', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/CallbackProp.tsx'),
    );

    expect(result).toEqual({
      error: 'A component should not accept a callback prop: onClick',
      valid: false,
    });
  });

  it('allows render prop', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/RenderProp.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('allows callback props in private components', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/CallbackPropPrivate.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('allows intersection type as a prop type (using ampersand)', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithIntersectionType.tsx',
      ),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('allows intersection type as a prop type (using interfaces)', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithInterfaceExtension.tsx',
      ),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('should check all the existing members (inluding extended)', () => {
    const file = path.resolve(
      __dirname,
      '../mocks/components/PropsWithInterfaceExtension.tsx',
    );

    const src = fs.readFileSync(file).toString();

    const propsTypeDeclaration = findPropTypesDeclaration(src, file);
    const { typeParameters } = propsTypeDeclaration.typeAnnotation;

    const propsMembers = typeParameters
      ? typeParameters.params[0].members
      : null;

    const propsNames = propsMembers.map((member) => member.key.name);

    expect(propsNames).toEqual([
      'values',
      'id',
      'content',
      'zuzu',
      'foo',
      'nana',
      'dudu',
    ]);
  });

  it('detects errors in interface extensions', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithInvalidInterfaceExtension.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error: 'A component should not accept a callback prop: onClick',
    });
  });

  it('allows PropsType assigned to other type', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithAssignmentToOtherType.tsx',
      ),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('allows PropsType assigned to interface', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithAssignmentToInterface.tsx',
      ),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects literal types in intersection prop types', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithLiteralIntersectionType.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Error validating props: One of intersecting types declaration looks invalid (did you use Readonly?)',
    });
  });

  it('detects using types from other libraries in intersection type', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithTypesFromOtherLibs.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Error validating props: Importing types from other libs is not allowed',
    });
  });

  it('detects errors in imported types used in intersection type', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithImportedTypeWithCallback.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error: 'A component should not accept a callback prop: onClick',
    });
  });

  it('allows intersection type as a prop type (using ampersand)', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithIntersectionType.tsx',
      ),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects literal types in intersection prop types', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithLiteralIntersectionType.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Error validating props: One of intersecting types declaration looks invalid (did you use Readonly?)',
    });
  });

  it('detects using types from other libraries in intersection type', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithTypesFromOtherLibs.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Error validating props: Importing types from other libs is not allowed',
    });
  });

  it('detects errors in imported types used in intersection type', () => {
    const result = validateProps(
      path.resolve(
        __dirname,
        '../mocks/components/PropsWithImportedTypeWithCallback.tsx',
      ),
    );

    expect(result).toEqual({
      valid: false,
      error: 'A component should not accept a callback prop: onClick',
    });
  });

  it('detects functions in PropsType', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/FunctionProp.tsx'),
    );

    expect(result).toEqual({
      error: 'PropsType declaration includes a function property: doQuickMath',
      valid: false,
    });
  });

  it('detects missing memo', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/NoMemo.tsx'),
    );

    expect(result).toEqual({
      error: 'React.memo is missing in default export',
      valid: false,
    });
  });

  it('detects missing default export', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/NoDefaultExport.tsx'),
    );

    expect(result).toEqual({
      error: 'Error validating props: No default export found',
      valid: false,
    });
  });

  it('supports declaring a component as a function', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/FunctionDeclaration.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('handles components with no props', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/NoProps.tsx'),
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('validates props are readonly', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/NoReadonlyProps.tsx'),
    );

    expect(result).toEqual({
      valid: false,
      error: 'PropsType declaration looks invalid (did you use Readonly?)',
    });
  });

  it('complains about wildcard props', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/WildcardProps.tsx'),
    );

    expect(result).toEqual({
      valid: false,
      error: 'All props should be named',
    });
  });

  it('complains about wildcard props in private components', () => {
    const result = validateProps(
      path.resolve(__dirname, '../mocks/components/WildcardPropsPrivate.tsx'),
    );

    expect(result).toEqual({
      valid: false,
      error: 'All props should be named',
    });
  });
});
