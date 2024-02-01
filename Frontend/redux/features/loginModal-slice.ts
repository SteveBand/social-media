import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  isModal: boolean;
};

const initialState: InitialState = {
  isModal: false,
};

export const loginModal = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    activate(state) {
      state.isModal = !state.isModal;
    },
  },
});

export const { activate } = loginModal.actions;
export default loginModal.reducer;
