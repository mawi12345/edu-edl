/*
 * App Slice
 *
 * Here we define:
 * - The shape of our container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, Student, Chapter, Selection } from './types';
import { School } from './school';

// The initial state of the GithubRepoForm container
export const initialState: ContainerState = {
  students: [],
  chapters: [],
  selected: [],
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    readBlob(state, action: PayloadAction<Blob>) {
      state.loading = true;
      state.error = undefined;
    },
    fileParsedSuccess(state, action: PayloadAction<Student[]>) {
      state.loading = false;
      state.students = action.payload;
      state.error = undefined;
    },
    fileParsedError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.students = [];
      state.error = action.payload;
    },
    setSchool(state, action: PayloadAction<School>) {
      state.school = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setCustomText(state, action: PayloadAction<string>) {
      state.customText = action.payload === '' ? undefined : action.payload;
    },
    setActive(state, action: PayloadAction<string>) {
      state.active = state.students.find(s => s.id === action.payload);
      state.selected = [];
      state.customText = undefined;
    },
    setChapters(state, action: PayloadAction<Chapter[]>) {
      state.chapters = action.payload;
    },
    select(state, action: PayloadAction<Selection>) {
      if (
        !state.selected.find(
          s =>
            s.chapterIndex === action.payload.chapterIndex &&
            s.sentencesIndex === action.payload.sentencesIndex,
        )
      ) {
        state.selected.push(action.payload);
      }
    },
    unselect(state, action: PayloadAction<Selection>) {
      for (let i = 0; i < state.selected.length; i++) {
        if (
          state.selected[i].chapterIndex === action.payload.chapterIndex &&
          state.selected[i].sentencesIndex === action.payload.sentencesIndex
        ) {
          state.selected.splice(i, 1);
          break;
        }
      }
    },
  },
});

export const { actions, reducer, name: sliceKey } = appSlice;
