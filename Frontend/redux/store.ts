import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/auth-slice";
import loginReducer from "./features/loginModal-slice";
import communityMembersReducer from "./features/communityMembers-slice";
export const store = configureStore({
  reducer: {
    userReducer,
    loginReducer,
    communityMembersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
