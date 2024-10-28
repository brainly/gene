const basePath = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';
const ASSETS_BASE_PATHS = Object.freeze({
  IMAGES: `${basePath}/nx-images`,
  FONTS: `${basePath}/nx-fonts`,
  STATICS: `${basePath}/nx-static`,
});

/**
 * @description
 * this should only include images with format .jpg .png or .gif
 */
const IMAGES_PATHS = Object.freeze({});

/**
 * @description
 * this should include the rest of the static files (css, svg, riv, etc...)
 */
const STATICS_PATHS = Object.freeze({});

export { ASSETS_BASE_PATHS, IMAGES_PATHS, STATICS_PATHS };
