import { LoginParams } from "@/lib/auth-utilis/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user_info: {
    firstName: string;
    lastName: string;
    id: string;
    token: string;
  };
  status: "authenticated" | "unauthenticated";
};

const initialState: InitialState = {
  user_info: {
    firstName: "",
    lastName: "",
    id: "",
    token: "",
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
