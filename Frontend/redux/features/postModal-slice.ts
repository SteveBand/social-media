import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  isModal: boolean;
};

const initialState: InitialState = {
  isModal: false,
};

export const postModal = createSlice({
  name: "modal",
  initialState,
  reducers: {
    enable(state) {
      state.isModal = true;
    },
    disable(state) {
      state.isModal = false;
    },
  },
});

export const { enable, disable } = postModal.actions;
export default postModal.reducer;
