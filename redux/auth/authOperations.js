import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateUserProfile,
  authStateChange,
  authSignOut,
  updateUserPhoto,
} from "./authReducer";
import { app } from "../../firebase/config";
import { auth } from "../../firebase/config";

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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error.massage:", errorMessage);
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

      // if (user) {
      //   AsyncStorage.setItem("currentUser", JSON.stringify(updateUser));
      // } else {
      //   AsyncStorage.removeItem("currentUser");
      // }

      dispatch(updateUserProfile(updateUser));
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error.massage:", errorMessage);
    }
  };

export const authLogOutUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth();
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error.massage:", errorMessage);
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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error.massage:", errorMessage);
    }
  };

export const authStateChanged = () => async (dispatch, getState) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user is signed in");

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
      console.log("User is signed out");
    }
  });
};

export const authRefresh = (user) => async (dispatch, getState) => {
  const auth = getAuth();
  if (user) {
    console.log("user is signed in");

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
    console.log("User is signed out");
  }
};

export const authCommentsActivityChanged =
  ({ postId }) =>
  async (dispatch, getState) => {
    // const auth = getAuth(app);
    const user = await auth.currentUser;

    if (user) {
      const userCommentsActivity = user.userActivity.comments;
      // const userLikesActivity = user.userActivity.likes;

      userCommentsActivity.push(postId);
      // userLikesActivity.push(postId);

      await updateProfile(user, {
        userActivity: { ...user.userActivity, comments: userCommentsActivity },
      });

      // dispatch(
      //   updateUserActivity({
      //     activity: dataUser.userActivity,
      //   })
      // );
    } else {
      // User is signed out
    }
  };
