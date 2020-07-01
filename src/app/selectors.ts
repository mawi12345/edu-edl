import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './slice';
import { AppState } from './types';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.app || initialState;

export const selectAppState = createSelector(
  [selectDomain],
  (appState: AppState): AppState => appState,
);

export const gender = (text: string, male: boolean): string =>
  text.replace(/{{([\s\S]+?)\|([\s\S]+?)}}/g, (m, p1, p2) =>
    male ? p2.trim() : p1.trim(),
  );
