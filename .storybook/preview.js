import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { mswDecorator } from 'msw-storybook-addon';

const styles = {
  padding: 0,
};
const PaddingDecorator = (storyFn) => <div style={styles}>{storyFn()}</div>;

export const decorators = [PaddingDecorator, mswDecorator];

/**
 * @description
 * Initially the path to the mockServiceWorker.js script is relative to the origin
 * but the path of the deployed storybook on s3 consists of many subfolders, e.g:
 * /commit/80ae74b7f868313d7e17206ae94e6feb106f710e/project/payments-sdk-modules-payments-module/index.html
 * So we have to go into the deployed storybook's folder to get the worker's script.
 */
export const workerPath = `${window.location.pathname
  .split('/')
  .slice(0, -1)
  .join('/')}/mockServiceWorker.js`;

const customViewports = {
  mobile: {
    name: 'Phone (375px min width)',
    styles: {
      width: '375px',
      height: '812px',
    },
  },
  desktop: {
    name: 'Desktop (1024px min width)',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
};

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  msw: {
    handlers: [],
  },
  viewport: {
    viewports: customViewports,
    defaultViewport: 'mobile',
  },
};
