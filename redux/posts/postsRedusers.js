import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  nickname: null,
  userEmail: null,
  userPhoto: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userEmail: payload.email,
      userId: payload.userId,
      nickname: payload.nickname,
      userPhoto: payload.userPhoto,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => initialState,
  },
});

export const { updateUserProfile, authStateChange, authSignOut } =
  authSlice.actions;
