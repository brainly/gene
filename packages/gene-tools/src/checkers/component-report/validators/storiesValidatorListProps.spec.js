const {
  getMessagesFromListProps,
  getDeclaredLists,
  getListsFromStories,
} = require('./storiesValidatorListProps');
const path = require('path');

describe('getMessagesFromListProps()', () => {
  it('should not return message for one correct prop', () => {
    const result = getMessagesFromListProps({
      exampleList: {
        isEmpty: true,
        isFulfilled: true,
      },
    });

    expect(result).toEqual('');
  });

  it('should return message for one prop without empty list', () => {
    const result = getMessagesFromListProps({
      exampleList: {
        isEmpty: false,
        isFulfilled: true,
      },
    });

    expect(result).toEqual('Prop exampleList: no empty list in story');
  });

  it('should return message for one prop without empty list', () => {
    const result = getMessagesFromListProps({
      exampleList: {
        isEmpty: false,
        isFulfilled: true,
      },
    });

    expect(result).toEqual('Prop exampleList: no empty list in story');
  });

  it('should return message for one prop without filled list', () => {
    const result = getMessagesFromListProps({
      exampleList: {
        isEmpty: true,
        isFulfilled: false,
      },
    });

    expect(result).toEqual('Prop exampleList: no fulfilled list in story');
  });

  it('should return message for one prop without empty list and filled list', () => {
    const result = getMessagesFromListProps({
      exampleList: {
        isEmpty: false,
        isFulfilled: false,
      },
    });

    expect(result).toEqual(
      'Prop exampleList: no empty list in story and no fulfilled list in story',
    );
  });

  it('should return message for one more props without empty list and filled list', () => {
    const result = getMessagesFromListProps({
      exampleList: {
        isEmpty: false,
        isFulfilled: false,
      },
      exampleList2: {
        isEmpty: false,
        isFulfilled: false,
      },
      exampleList3: {
        isEmpty: false,
        isFulfilled: false,
      },
    });

    expect(result).toEqual(
      'Prop exampleList: no empty list in story and no fulfilled list in story, Prop exampleList2: no empty list in story and no fulfilled list in story, Prop exampleList3: no empty list in story and no fulfilled list in story',
    );
  });
});

describe('getDeclaredLists()', () => {
  it('should return list of array props', () => {
    const result = getDeclaredLists({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidListStories',
      ),
    });

    expect(result).toEqual(['list', 'second', 'third', 'fourth']);
  });

  it('should return empty array when there is no props', () => {
    const result = getDeclaredLists({
      truncatedPath: path.resolve(__dirname, '../mocks/components/NoProps'),
    });

    expect(result).toEqual([]);
  });
});

describe('getListsFromStories()', () => {
  it('should return proper object for correct story', () => {
    const result = getListsFromStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidListStories',
      ),
      declaredLists: ['list', 'second', 'third', 'fourth'],
    });

    expect(result).toEqual({
      list: {
        isEmpty: true,
        isFulfilled: true,
      },
      second: {
        isEmpty: true,
        isFulfilled: true,
      },
      third: {
        isEmpty: true,
        isFulfilled: true,
      },
      fourth: {
        isEmpty: true,
        isFulfilled: true,
      },
    });
  });

  it('should return proper object for incorrect story', () => {
    const result = getListsFromStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/MissingListStories',
      ),
      declaredLists: ['list', 'second', 'third', 'fourth'],
    });

    expect(result).toEqual({
      list: {
        isEmpty: false,
        isFulfilled: false,
      },
      second: {
        isEmpty: false,
        isFulfilled: false,
      },
      third: {
        isEmpty: false,
        isFulfilled: false,
      },
      fourth: {
        isEmpty: false,
        isFulfilled: false,
      },
    });
  });
});
