import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import postReducer from "./features/post-slice";
export const store = configureStore({
  reducer: {
    authReducer,
    postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
