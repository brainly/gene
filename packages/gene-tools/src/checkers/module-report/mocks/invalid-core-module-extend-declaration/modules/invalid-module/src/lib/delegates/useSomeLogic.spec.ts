import { useSomeLogic, SomeLogicOptsType } from './useSomeLogic';

describe('useSomeLogic', () => {
  it('should return an object with someProps property', () => {
    const opts: SomeLogicOptsType = { questionId: 1 };
    const result = useSomeLogic(opts);
    expect(result).toHaveProperty('someProps');
  });
});
