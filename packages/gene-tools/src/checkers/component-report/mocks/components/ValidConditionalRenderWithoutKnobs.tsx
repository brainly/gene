import * as React from 'react';
import cx from 'classnames';
import {Text} from 'brainly-style-guide';

type PropsType = Readonly<{
  variation?: number;
}>;

const ValidConditionalRenderWithoutKnobs = ({variation}: PropsType) => {
  return (
    <div data-testid="test_classname">
      <Text
        size="xsmall"
        color="text-gray-60"
        className={cx({
          'some-test-class': !variation,
        })}
      >
        some text
      </Text>
    </div>
  );
};

export default React.memo<PropsType>(ValidConditionalRenderWithoutKnobs);
