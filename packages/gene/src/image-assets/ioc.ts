import type React from 'react';

import NativeImage from './components/NativeImage';
import { Container } from 'inversify';
import type { GeneImagePropsType } from './components/types';
import { withLoaderUrls } from './components/withLoaderUrls';

export const GENE_IMAGE_COMPONENT_IDENTIFIER = Symbol.for('GeneImage');

export const NATIVE_IMAGE = Symbol.for('nativeImage');

type ImageComponentsType = typeof NATIVE_IMAGE;

const imageComponents = new Map([[NATIVE_IMAGE, NativeImage]]);

function getImageComponent(
  imagesType: ImageComponentsType,
): React.FC<GeneImagePropsType> {
  return imageComponents.get(imagesType) || NativeImage;
}

export function getAssetsContainer(imagesType: ImageComponentsType) {
  const brainlyAssetsContainer = new Container();
  brainlyAssetsContainer
    .bind<
      React.ComponentType<GeneImagePropsType>
    >(GENE_IMAGE_COMPONENT_IDENTIFIER)
    .toConstantValue(withLoaderUrls(getImageComponent(imagesType)));

  return brainlyAssetsContainer;
}
