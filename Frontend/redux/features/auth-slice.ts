import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  user_info: {
    name: string;
    id: string;
    token: string;
    email: string;
    avatar_url: string;
  };
  status: "authenticated" | "unauthenticated";
};

const initialState: InitialState = {
  user_info: {
    name: "",
    id: "",
    token: "",
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
      return action.payload;
    },
    logOut: () => {
      return initialState;
    },
  },
});

export const { logOut, logIn } = user.actions;
export default user.reducer;
