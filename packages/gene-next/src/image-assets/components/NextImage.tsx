import * as React from 'react';
import Image from 'next/image';
import { GeneImagePropsType } from '@brainly-gene/core';

export const NextImage = ({ ...props }: GeneImagePropsType) => {
  return <Image {...props} />;
};

export default React.memo<GeneImagePropsType>(NextImage);
