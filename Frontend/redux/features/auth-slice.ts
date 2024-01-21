import { LoginParams } from "@/lib/auth-utilis/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user_info: {
    name: string;
    id: string;
    token: string;
    email: string;
    image: string;
  };
  status: "authenticated" | "unauthenticated";
};

const initialState: InitialState = {
  user_info: {
    name: "",
    id: "",
    token: "",
    email: "",
    image: "",
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
