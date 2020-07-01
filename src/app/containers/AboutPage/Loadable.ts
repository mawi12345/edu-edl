/**
 *
 * Asynchronously loads the component for AboutPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AboutPage = lazyLoad(
  () => import('./index'),
  module => module.AboutPage,
);
