/**
 *
 * Asynchronously loads the component for SelectPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectPage = lazyLoad(
  () => import('./index'),
  module => module.SelectPage,
);
