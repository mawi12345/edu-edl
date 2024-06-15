import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { initialState } from "./slice";

export const selectAppState = (state: RootState) => state.app || initialState;

export const selectRoute = createSelector(
  selectAppState,
  ({ students, error }) => {
    if (error) {
      return "error";
    }
    if (students.length === 0) {
      return "home";
    }
    return "select";
  }
);

export const selectText = createSelector(
  selectAppState,
  ({ chapters, selected, active }) => {
    const s: string[] = [];
    const male = active ? active.Geschlecht === "m" : false;
    chapters.forEach((chapter, chapterIndex) =>
      chapter.sentences.forEach((sentence, sentencesIndex) => {
        if (
          selected.find(
            (s) =>
              s.chapterIndex === chapterIndex &&
              s.sentencesIndex === sentencesIndex
          )
        ) {
          s.push(gender(sentence, male));
        }
      })
    );
    return s;
  }
);

export const gender = (text: string, male: boolean): string =>
  text.replace(/{{([\s\S]+?)\|([\s\S]+?)}}/g, (m, p1, p2) =>
    male ? p2.trim() : p1.trim()
  );
