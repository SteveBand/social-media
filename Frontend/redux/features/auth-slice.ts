import { LoginParams } from "@/lib/auth-utilis/authTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  firstName: string;
  lastName: string;
  id: string;
  token: string;
};

const initialState: InitialState = {
  firstName: "",
  lastName: "",
  id: "",
  token: "",
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
