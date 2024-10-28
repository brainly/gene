import * as React from 'react';
import Image, { ImageProps } from 'next/future/image';
import { GeneImagePropsType } from '@brainly-gene/core';

const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};

const imgproxyLoader = ({
  src,
  width,
  quality = 75,
  origin,
  imgproxyLoaderBaseUrl,
}: {
  src: string;
  width: number;
  quality?: number;
  origin?: string;
  imgproxyLoaderBaseUrl?: string;
}) => {
  if (!origin || !imgproxyLoaderBaseUrl) {
    return src;
  }

  const prefix = src.startsWith('/') && origin ? `${origin}/` : '';

  return (
    imgproxyLoaderBaseUrl +
    `/image/rs:fill/w:${width}/q:${quality}/plain/${prefix}${normalizeSrc(src)}`
  );
};

export const NextImageImgproxyLoader = ({
  ...props
}: GeneImagePropsType & {
  originURL?: string;
  imgproxyLoaderBaseUrl?: string;
}) => {
  const imgElementProps = React.useMemo(() => {
    const { originURL, imgproxyLoaderBaseUrl, ...rest } = props;

    return rest;
  }, [props]);

  if (!props.originURL || !props.imgproxyLoaderBaseUrl) {
    return <Image {...(imgElementProps as ImageProps)} />;
  }

  return (
    <Image
      loader={(loaderProps) =>
        imgproxyLoader({
          ...loaderProps,
          origin: props?.originURL,
          imgproxyLoaderBaseUrl: props.imgproxyLoaderBaseUrl,
        })
      }
      {...(imgElementProps as ImageProps)}
    />
  );
};

export default React.memo<GeneImagePropsType>(NextImageImgproxyLoader);
