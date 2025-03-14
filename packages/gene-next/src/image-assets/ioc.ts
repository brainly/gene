import type React from 'react';
import type {
  GeneImagePropsType} from '@brainly-gene/core';
import {
  NativeImage,
  withLoaderUrls,
  GENE_IMAGE_COMPONENT_IDENTIFIER,
  NATIVE_IMAGE,
} from '@brainly-gene/core';
import NextImage from './components/NextImage';
import NextImageImgproxyLoader from './components/NextImageImgproxyLoader';

import { Container } from 'inversify';

export const NEXT_IMAGE = Symbol.for('nextImage');
export const NEXT_IMAGE_IMGPROXY_LOADER = Symbol.for(
  'nextImageImageproxyLoader'
);

type ImageComponentsType =
  | typeof NEXT_IMAGE
  | typeof NATIVE_IMAGE
  | typeof NEXT_IMAGE_IMGPROXY_LOADER;

const imageComponents = new Map([
  [NEXT_IMAGE, NextImage],
  [NATIVE_IMAGE, NativeImage],
  [NEXT_IMAGE_IMGPROXY_LOADER, NextImageImgproxyLoader],
]);

function getImageComponent(
  imagesType: ImageComponentsType
): React.FC<GeneImagePropsType> {
  return imageComponents.get(imagesType) || NativeImage;
}

export function getAssetsContainer(imagesType: ImageComponentsType) {
  const brainlyAssetsContainer = new Container();
  const imageComponent = getImageComponent(imagesType);

  const componentToBind =
    imagesType === NEXT_IMAGE_IMGPROXY_LOADER
      ? withLoaderUrls(imageComponent)
      : imageComponent;

  brainlyAssetsContainer
    .bind<React.ComponentType<GeneImagePropsType>>(
      GENE_IMAGE_COMPONENT_IDENTIFIER
    )
    .toConstantValue(componentToBind);

  return brainlyAssetsContainer;
}
