import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import uuid from "react-native-uuid";
import { showToast } from "./showErrorToast";

export const uploadPhotoOnServer = async (photo) => {
  try {
    const storage = getStorage();
    const id = uuid.v4();
    const storageRef = ref(storage, `userPhoto/${id}`);
    const resp = await fetch(photo);
    const file = await resp.blob();
    await uploadBytesResumable(storageRef, file);
    const link = await getDownloadURL(ref(storage, `userPhoto/${id}`));
    return link;
  } catch (error) {
    showToast({
      text1: `Something wrong, try again.`,
      text2: `Error ${error.message}`,
    });
  }
};
