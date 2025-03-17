const { validateStories } = require('./storiesValidator');
const path = require('path');

describe('validateStories()', () => {
  it('is valid if all events are tested', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidDispatch',
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('ignores missing event declaration', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/InvalidDispatch',
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects untested events', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/MissingDispatch',
      ),
    });

    expect(result).toEqual({
      valid: false,
      error: 'Missing events: ON_OTHER_DIV_CLICK',
    });
  });

  it('detects untested lists', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/MissingListStories',
      ),
    });

    expect(result).toEqual({
      valid: false,
      type: 'experimental',
      error:
        'Prop list: no empty list in story and no fulfilled list in story, Prop second: no empty list in story and no fulfilled list in story',
    });
  });

  it('detects uncovered conditional renders', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/InvalidConditionalRender',
      ),
    });

    expect(result).toEqual({
      valid: false,
      type: 'experimental',
      error:
        'Some conditional props are not covered in stories: "firstName" doesn\'t have negative render. "lastName" doesn\'t have positive render. ',
    });
  });

  it('is valid if all conditional prop renders', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidConditionalRender',
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('is valid if all lists are tested', () => {
    const result = validateStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidListStories',
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });
});
