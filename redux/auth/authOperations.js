import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  updateUserProfile,
  authStateChange,
  authSignOut,
  updateUserPhoto,
} from "./authReducer";
import { auth } from "../../firebase/config";
import { showToast } from "../../helpers/showErrorToast";

export const authRegistryUser =
  ({ name, email, password, userPhoto }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: userPhoto,
      });

      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickname: user.displayName,
          userPhoto: user.photoURL,
          email: user.email,
        })
      );
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      updateUser = {
        userId: user.uid,
        nickname: user.displayName,
        userPhoto: user.photoURL,
        email: user.email,
      };

      dispatch(updateUserProfile(updateUser));
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
    }
  };

export const authLogOutUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth();
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    showToast({
      text1: `Something wrong, try again.`,
      text2: `Error ${error.message}`,
    });
  }
};

export const authUpdateUsersPhoto =
  ({ userPhoto }) =>
  async (dispatch, getState) => {
    try {
      const auth = getAuth();

      const user = await updateProfile(auth.currentUser, {
        photoURL: userPhoto,
      });

      dispatch(
        updateUserPhoto({
          userPhoto,
        })
      );
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
    }
  };

export const authStateChanged = () => async (dispatch, getState) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickname: user.displayName,
          userPhoto: user.photoURL,
          email: user.email,
        })
      );

      dispatch(authStateChange({ stateChange: true }));
    }
  });
};

export const authRefresh = (user) => async (dispatch, getState) => {
  const auth = getAuth();
  if (user) {
    dispatch(
      updateUserProfile({
        userId: user.uid,
        nickname: user.displayName,
        userPhoto: user.photoURL,
        email: user.email,
      })
    );

    dispatch(authStateChange({ stateChange: true }));
  } else {
    showToast({ text1: "User is signed out" });
  }
};

export const authCommentsActivityChanged =
  ({ postId }) =>
  async (dispatch, getState) => {
    const user = await auth.currentUser;

    if (user) {
      const userCommentsActivity = user.userActivity.comments;

      userCommentsActivity.push(postId);

      await updateProfile(user, {
        userActivity: { ...user.userActivity, comments: userCommentsActivity },
      });
    } else {
      showToast({ text1: "User is signed out" });
    }
  };
