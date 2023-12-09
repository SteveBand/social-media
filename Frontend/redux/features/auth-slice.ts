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

export const login = createAsyncThunk(
  "auth/login",
  async (params: Partial<LoginParams>, router) => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const value = await res.json();

    return value;
  }
);

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload,
      };
    });
  },
});

export const { logOut } = auth.actions;
export default auth.reducer;
