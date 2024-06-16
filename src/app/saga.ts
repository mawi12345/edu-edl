import { all, put, takeLatest, call } from "redux-saga/effects";
import { actions } from "./slice";
import { PayloadAction } from "@reduxjs/toolkit";
import { csvBlobToStudents, isFileSupported } from "./file";
import YAML from "yaml";
import { Chapter } from "./types";

export function* readBlob(action: PayloadAction<Blob>): any {
  const file = action.payload;
  const students = yield call(csvBlobToStudents, file);
  if (students.length > 0) {
    if (!isFileSupported(students)) {
      yield put(actions.fileParsedError("File is not supported"));
    } else {
      try {
        yield put(actions.fileParsedSuccess(students));
      } catch (e: any) {
        yield put(actions.fileParsedError(e.message));
      }
    }
  }
}

export function* readBlobSaga() {
  yield takeLatest(actions.readBlob.type, readBlob);
}

export function* readDBSaga(): any {
  const res = yield call(fetch, "db.yml");
  const text = yield call(() => res.text());
  const content: Map<string, string[]> = YAML.parse(text, { mapAsMap: true });
  const chapters: Chapter[] = [];
  for (const [name, sentences] of content.entries()) {
    chapters.push({ name, sentences });
  }
  yield put(actions.setChapters(chapters));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* appSaga() {
  yield all([readDBSaga(), readBlobSaga()]);
}
