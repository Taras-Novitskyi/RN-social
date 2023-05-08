import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, app, databaseRef, auth } from "../../firebase/config";
import { showToast } from "../../helpers/showErrorToast";

export const createPost = (newPost) => async (dispatch, getState) => {
  try {
    const postListRef = await databaseRef(db, "posts");
    const newPostRef = await push(postListRef);
    const postId = newPostRef.key;

    newPost.postId = postId;

    await set(newPostRef, newPost);
    return postId;
  } catch (error) {
    showToast({
      text1: `Something wrong, try again.`,
      text2: `Error ${error.message}`,
    });
  }
};

export const updateCountLikes =
  ( postId, updateLikes ) =>
  async (dispatch, getState) => {
    try {
      const db = getDatabase();
      set(ref(db, "posts/" + postId), {
        likes: updateLikes,
      });
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
    }
  };

export const authLogOutUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    showToast({
      text1: `Something wrong, try again.`,
      text2: `Error ${error.message}`,
    });
  }
};

export const authStateChanged = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const dataUser = user.auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: dataUser.uid,
          nickname: dataUser.displayName,
          userPhoto: dataUser.photoURL,
          email: dataUser.email,
        })
      );

      dispatch(authStateChange({ stateChange: true }));
    } else {
      // User is signed out
    }
  });
};
