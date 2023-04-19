import { createSlice } from "@reduxjs/toolkit";
import { EmailAuthCredential } from "firebase/auth";
// import { State } from "react-native-gesture-handler";

const initialState = {
  userId: null,
  nickname: null,
  userEmail: null,
  userPhoto: null,
  stateChange: false,
  // userActivity: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userEmail: payload.email,
      userId: payload.userId,
      nickname: payload.nickname,
      userPhoto: payload.userPhoto,
    }),
    // updateUserActivity: (state, { payload }) => ({
    //   ...state,
    //   userActivity: payload.activity,
    // }),

    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),

    updateUserPhoto: (state, { payload }) => ({
      ...state,
      userPhoto: payload.userPhoto,
    }),

    authSignOut: () => initialState,
  },
});

export const { updateUserProfile, authStateChange, updateUserPhoto, authSignOut } =
  authSlice.actions;
