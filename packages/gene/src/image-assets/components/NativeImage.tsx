import React from 'react';
import {GeneImagePropsType} from './types';

const NativeImage = ({...props}: GeneImagePropsType) => {
  return (
    <img
      {...(props as React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      >)}
    />
  );
};

export default React.memo<GeneImagePropsType>(NativeImage);
