import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { reducer } from "./app/slice";
import { appSaga } from "./app/saga";
import { useDispatch } from "react-redux";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: { ignoreActions: true },
    }).concat(sagaMiddleware);
  },
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers({}),
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

sagaMiddleware.run(appSaga);
