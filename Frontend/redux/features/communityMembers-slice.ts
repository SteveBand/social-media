import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../../types";

type InitialState = {
  communityMembers: CommunityMember[];
};

const initialState: InitialState = {
  communityMembers: [],
};

export const fetchMembers = createAsyncThunk(
  "/community/members",
  async (id: string, router) => {
    const res = await fetch(`http://localhost:4000/community/${id}/members`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const value = await res.json();
      return value;
    }
  }
);

export const CommunityMembers = createSlice({
  name: "communityMembers",
  initialState,
  reducers: {
    removeMember: (state, action) => {
      const memberId = action.payload;
      const updatedMembers = state.communityMembers.filter((member) => {
        console.log(member);
        return member._id !== memberId;
      });

      state.communityMembers = updatedMembers;
      console.log(
        "Current State: ",
        state.communityMembers,
        "UpdatedMembers: ",
        updatedMembers
      );
    },

    follow: (state, action) => {
      const userId = action.payload;
      const index = state.communityMembers.findIndex(
        (user) => user._id === userId
      );

      if (index !== -1) {
        state.communityMembers[index].isFollowing = true;
      }
    },

    unfollow: (state, action) => {
      const userId = action.payload;
      const index = state.communityMembers.findIndex(
        (user) => user._id === userId
      );

      if (index !== -1) {
        state.communityMembers[index].isFollowing = false;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchMembers.fulfilled,
      (state, action: PayloadAction<CommunityMember[]>) => {
        return {
          ...state,
          communityMembers: action.payload,
        };
      }
    );
  },
});

export const { follow, unfollow, removeMember } = CommunityMembers.actions;
export default CommunityMembers.reducer;

export interface CommunityMember extends UserType {
  isFollowing: boolean;
  IsModerator: boolean;
}
