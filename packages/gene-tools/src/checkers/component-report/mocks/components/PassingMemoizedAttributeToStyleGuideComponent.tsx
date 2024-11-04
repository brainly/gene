import * as React from 'react';
import {Flex, Link} from 'brainly-style-guide';
type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingMemoizedAttributeToStyleGuideComponent = ({
  id,
  content,
  items,
}: PropsType) => {
  const handler = React.useCallback(() => {
    return null;
  }, []);

  return (
    <>
      <div onClick={handler}></div>
      <Flex marginRight={{sm: 'xs'}}>content</Flex>
    </>
  );
};

export default React.memo<PropsType>(
  PassingMemoizedAttributeToStyleGuideComponent
);
