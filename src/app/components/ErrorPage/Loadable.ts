/**
 *
 * Asynchronously loads the component for ErrorPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ErrorPage = lazyLoad(
  () => import('./index'),
  module => module.ErrorPage,
);
