import { isArrayProp } from './ast';

describe('isArrayProp', () => {
  it('should return false for other type than Array', () => {
    const mockStringTypeAnnotation = {
      type: 'TSStringKeyword',
      range: [86, 94],
    };

    expect(isArrayProp(mockStringTypeAnnotation)).toBe(false);
  });

  it('should return true for string[] - arrayType annotation', () => {
    const mockTypeAnnotation = {
      type: 'TSArrayType',
      elementType: {
        type: 'TSStringKeyword',
        range: [86, 92],
      },
      range: [86, 94],
    };

    expect(isArrayProp(mockTypeAnnotation)).toBe(true);
  });

  it('should return true for Reference Array Type arrayType annotation', () => {
    const mockArrayTypeAnnotation = {
      type: 'TSTypeReference',
      typeName: {
        type: 'Identifier',
        name: 'Array',
        range: [107, 112],
      },
      range: [86, 94],
    };

    const mockReadonlyArrayTypeAnnotation = {
      type: 'TSTypeReference',
      typeName: {
        type: 'Identifier',
        name: 'ReadonlyArray',
        range: [107, 112],
      },
      range: [86, 94],
    };

    expect(isArrayProp(mockArrayTypeAnnotation)).toBe(true);
    expect(isArrayProp(mockReadonlyArrayTypeAnnotation)).toBe(true);
  });

  it('should return true for union type with Array', () => {
    const mockUnionTypeAnnotation = {
      type: 'TSUnionType',
      types: [
        {
          type: 'TSTypeReference',
          typeName: {
            type: 'Identifier',
            name: 'Array',
            range: [132, 137],
          },
          typeParameters: {
            type: 'TSTypeParameterInstantiation',
            range: [137, 145],
            params: [
              {
                type: 'TSNumberKeyword',
                range: [138, 144],
              },
            ],
          },
          range: [132, 145],
        },
        {
          type: 'TSNullKeyword',
          range: [148, 152],
        },
      ],
    };

    expect(isArrayProp(mockUnionTypeAnnotation)).toBe(true);
  });

  it('should return false for union type without Array', () => {
    const mockUnionTypeAnnotation = {
      type: 'TSUnionType',
      types: [
        {
          type: 'TSStringKeyword',
          range: [132, 138],
        },
        {
          type: 'TSUndefinedKeyword',
          range: [141, 150],
        },
      ],
    };

    expect(isArrayProp(mockUnionTypeAnnotation)).toBe(false);
  });
});
