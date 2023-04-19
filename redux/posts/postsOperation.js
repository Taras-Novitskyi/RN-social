import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
// import { updateUserProfile, authStateChange, authSignOut } from "./authReducer";
import { db, storage, app, databaseRef, auth } from "../../firebase/config";

// {
//     postId,
//     createdDate,
//     name,
//     location,
//     coords: locationCoords,
//     photo: linkPhoto,
//     likes,
//     owner,
//   }

export const createPost = (newPost) => async (dispatch, getState) => {
  try {
    const postListRef = await databaseRef(db, "posts");
    const newPostRef = await push(postListRef);
    const postId = newPostRef.key;

    newPost.postId = postId;

    await set(newPostRef, newPost);
    return postId;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error.massage:", errorMessage);
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
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error.massage:", errorMessage);
    }
  };

export const authLogOutUser = () => async (dispatch, getState) => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error.massage:", errorMessage);
  }
};

export const authStateChanged = () => async (dispatch, getState) => {
  // const auth = getAuth(app);
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

      // dispatch(
      //   updateUserProfile({
      //     userId: user.uid,
      //     nickname: user.displayName,
      //     userPhoto: user.photoURL,
      //     email: user.email
      //   })
      // );

      dispatch(authStateChange({ stateChange: true }));
    } else {
      // User is signed out
    }
  });
};
