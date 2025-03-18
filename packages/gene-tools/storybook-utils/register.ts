const LEGACY_APP = 'LEGACY_APP';
const HOMEPAGE = 'HOMEPAGE';
const PACKAGES = 'PACKAGES';

/** @deprecated */
export const registerStoryInLegacy = (storyName: string): string =>
  `${LEGACY_APP}/${storyName}`;

/** @deprecated */
export const registerStoryInHomepage = (storyName: string): string =>
  `${HOMEPAGE}/${storyName}`;

/** @deprecated */
export const registerStoryInPackages = (storyName: string): string =>
  `${PACKAGES}/${storyName}`;
