import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

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
    Alert.alert(error.message);
    return;
  }
};
