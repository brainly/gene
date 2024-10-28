const {getComponentMetadata} = require('./meta');

describe('getComponentMetadata()', () => {
  it('extracts exported component name', () => {
    const source = `
      const Foo = () => {
        return null;
      };

      export default Foo;
    `;

    const result = getComponentMetadata(source);

    expect(result).toMatchObject({
      componentName: 'Foo',
      componentDisplayName: 'Foo',
      isPrivate: false,
    });
  });

  it('extracts exported component name when React.memo is used', () => {
    const source = `
      const Foo = () => {
        return null;
      };

      export default React.memo(Foo);
    `;

    const result = getComponentMetadata(source);

    expect(result).toMatchObject({
      componentName: 'Foo',
      hocs: ['React.memo'],
      isPrivate: false,
    });
  });

  it('extracts exported component name when HOC is used', () => {
    const source = `
      const Foo = () => {
        return null;
      };

      export default React.memo(withLogic(Foo));
    `;

    const result = getComponentMetadata(source);

    expect(result).toMatchObject({
      componentName: 'Foo',
      componentDisplayName: 'compose(React.memo, withLogic)(Foo)',
      hocs: ['React.memo', 'withLogic'],
      isPrivate: false,
    });
  });

  it('extracts exported component name when compose is used', () => {
    const source = `
      const Foo = () => {
        return null;
      };

      export default compose(withA, withB)(Foo);
    `;

    const result = getComponentMetadata(source);

    expect(result).toMatchObject({
      componentDisplayName: 'compose(withA, withB)(Foo)',
      hocs: ['withA', 'withB'],
      componentName: 'Foo',
      isPrivate: false,
    });
  });

  it('detects private arrow func component', () => {
    const source = `
      /* @private */
      const Bar = () => {
        return null;
      };

      export default Bar;
    `;

    const result = getComponentMetadata(source);

    expect(result).toMatchObject({
      componentName: 'Bar',
      isPrivate: true,
    });
  });

  it('detects private regular func component', () => {
    const source = `
      /* @private */
      function Baz() {
        return null;
      };

      export default Baz;
    `;

    const result = getComponentMetadata(source);

    expect(result).toMatchObject({
      componentName: 'Baz',
      isPrivate: true,
    });
  });
});
