import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ContainerState, Student, Chapter, Selection, AppState } from "./types";
import { School } from "./school";

export const initialState: ContainerState = {
  students: [],
  chapters: [],
  selected: [],
  loading: false,
  printed: false,
};

const appSlice = createSlice({
  name: "app",
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
    setMode(state, action: PayloadAction<AppState["mode"]>) {
      state.mode = action.payload;
    },
    setSchool(state, action: PayloadAction<School>) {
      state.school = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setCustomText(state, action: PayloadAction<string>) {
      state.customText = action.payload === "" ? undefined : action.payload;
    },
    setActive(state, action: PayloadAction<string>) {
      state.active = state.students.find((s) => s.id === action.payload);
      state.selected = [];
      state.customText = undefined;
      state.printed = false;
    },
    printed(state) {
      state.printed = true;
    },
    nextStudent(state) {
      if (state.active !== undefined && state.active.id) {
        const nextIndex =
          (state.students.findIndex((s) => s.id === state.active!.id) + 1) %
          state.students.length;
        state.active = state.students[nextIndex];
      }
      state.selected = [];
      state.customText = undefined;
      state.printed = false;
    },
    setChapters(state, action: PayloadAction<Chapter[]>) {
      state.chapters = action.payload;
    },
    select(state, action: PayloadAction<Selection>) {
      if (
        !state.selected.find(
          (s) =>
            s.chapterIndex === action.payload.chapterIndex &&
            s.sentencesIndex === action.payload.sentencesIndex
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
    selectChapter(state, action: PayloadAction<number>) {
      const chapter = state.chapters[action.payload];
      const random = Math.floor(Math.random() * chapter.sentences.length);
      state.selected.push({
        chapterIndex: action.payload,
        sentencesIndex: random,
      });
    },
    unselectChapter(state, action: PayloadAction<number>) {
      state.selected = state.selected.filter(
        (s) => s.chapterIndex !== action.payload
      );
    },
  },
});

export const { actions, reducer, name: sliceKey } = appSlice;
