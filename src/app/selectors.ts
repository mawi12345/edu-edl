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

export const gender = (text: string, male: boolean): string =>
  text.replace(/{{([\s\S]+?)\|([\s\S]+?)}}/g, (m, p1, p2) =>
    male ? p2.trim() : p1.trim()
  );
