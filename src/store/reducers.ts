/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';
import { connectRouter, RouterState } from 'connected-react-router';
import { InjectedReducersType } from 'utils/types/injector-typings';
import { History } from 'history';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export const makeCreateReducer = (history: History) => (
  injectedReducers: InjectedReducersType = {},
) =>
  combineReducers({
    ...injectedReducers,
    router: connectRouter(history) as Reducer<RouterState, AnyAction>,
  });
