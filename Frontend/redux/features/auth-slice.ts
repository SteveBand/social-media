import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  user_info: {
    name: string;
    _id: string;
    email: string;
    avatar_url: string;
    admin?: boolean;
  };
  status: "authenticated" | "unauthenticated";
};

const initialState: InitialState = {
  user_info: {
    name: "",
    _id: "",
    email: "",
    avatar_url: "",
  },
  status: "unauthenticated",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.status = action.payload.status;
      state.user_info = action.payload.user_info;
    },
    logOut: () => {
      return initialState;
    },
  },
});

export const { logOut, logIn } = user.actions;
export default user.reducer;
