import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  theme: "light" | "dark";
};

const initialState: InitialState = {
  theme: "light",
};

export const ThemeSlice = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    changeTheme(state, action) {
      const localTheme = window.localStorage.getItem("data-theme");
      if (localTheme === "light") {
        window.localStorage.setItem("data-theme", "dark");
        state.theme = "dark";
      } else {
        window.localStorage.setItem("data-theme", "light");
        state.theme = "light";
      }
    },
  },
});

export const { changeTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
