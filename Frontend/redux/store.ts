import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import postReducer from "./features/postModal-slice";
import communityMembersReducer from "./features/communityMembers-slice";
export const store = configureStore({
  reducer: {
    authReducer,
    postReducer,
    communityMembersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
