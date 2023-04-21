import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getDatabase, set, push } from "firebase/database";

import { db, storage, app, databaseRef } from "../../firebase/config";
import {
  selectUserId,
  selectNickname,
  selectUserEmail,
  selectUserPhoto,
} from "../../redux/auth/authSelectors";

export function CreatePostScreen({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraIsReady, setCameraIsReady] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [coords, setCoords] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userNickname = useSelector(selectNickname);
  const userId = useSelector(selectUserId);
  const userEmail = useSelector(selectUserEmail);
  const userPhoto = useSelector(selectUserPhoto);

  const owner = {
    userId,
    userNickname,
    userEmail,
    userPhoto,
  };

  const locationHandler = (text) => setLocation(text);
  const nameHandler = (text) => setName(text);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");

      let location = await Location.getCurrentPositionAsync();
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCoords(coords);
      setIsLoading(false);
    })();
  }, []);

  const takePhoto = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const { uri } = await camera.takePictureAsync();

    setPhoto(uri);
    const asset = await MediaLibrary.createAssetAsync(uri);
  };

  const selectFile = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      let photoLink;
      if (!result.canceled) {
        photoLink = result.assets[0].uri;
      } else {
        photoLink = null;
      }

      setPhoto(photoLink);
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreatPost = async () => {
    setIsLoading(true);
    if (photo === null) {
      return Alert.alert("Add a PHOTO in your post");
    }
    if (name === "") {
      return Alert.alert("Add a NAME in your post");
    }

    const newPost = await uploadPostToServer();

    reset();
    setIsLoading(false);

    navigation.navigate("Posts", {
      screen: "DefaultScreen",
      params: newPost,
    });
  };

  const uploadPostToServer = async () => {
    try {
      const postListRef = await databaseRef(db, "posts");
      const newPostRef = await push(postListRef);
      const postId = newPostRef.key;

      const linkPhoto = await uploadPhotoToServer();
      const createdDate = new Date().getTime();
      const locationCoords =
        coords.latitude && coords.longitude ? coords : "noCoords";

      const newPost = {
        postId,
        createdDate,
        name,
        location,
        coords: locationCoords,
        photo: linkPhoto,
        owner,
      };

      await set(newPostRef, newPost);

      return newPost;
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const storage = getStorage();
      const response = await fetch(photo);
      const file = await response.blob();

      const uniquePostId = uuid.v4();

      const storageRef = await ref(storage, `postImage/${uniquePostId}`);
      const snapshot = await uploadBytes(storageRef, file);

      const linkPhoto = await getDownloadURL(
        ref(storage, `postImage/${uniquePostId}`)
      );

      return linkPhoto;
    } catch (error) {
      console.error("Error adding photo: ", error);
    }
  };

  const reset = () => {
    setPhoto(null);
    setName("");
    setLocation("");
  };

  const closeKeyboard = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>No access to permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={closeKeyboard}>
        <ScrollView
          style={styles.container}
          justifyContent={isShowKeyboard ? "center" : "flex-start"}
        >
          {photo === null && (
            <View>
              {hasPermission !== null && hasPermission !== false && (
                <>
                  <Camera
                    style={styles.camera}
                    type={type}
                    onCameraReady={() => setCameraIsReady(true)}
                    ref={setCamera}
                  >
                    <TouchableOpacity
                      style={styles.btnPhoto}
                      onPress={takePhoto}
                      disabled={!cameraIsReady}
                    >
                      <Feather name="camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnPhoto}
                      onPress={() => {
                        setType(
                          type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                      }}
                    >
                      <Feather name="refresh-cw" size={24} color="white" />
                    </TouchableOpacity>
                  </Camera>
                  <TouchableOpacity onPress={selectFile}>
                    <Text style={styles.subTitle}>Load photo</Text>
                  </TouchableOpacity>
                </>
              )}
              {hasPermission === false && (
                <View style={styles.camera}>
                  <Text>No access to camera</Text>
                </View>
              )}
            </View>
          )}
          {photo && (
            <View>
              <ImageBackground
                source={{ uri: photo }}
                style={styles.photoContainer}
              >
                <TouchableOpacity
                  style={styles.btnPhoto}
                  onPress={() => setPhoto(null)}
                >
                  <Feather name="camera" size={24} color="white" />
                </TouchableOpacity>
              </ImageBackground>
              <TouchableOpacity
                onPress={() => {
                  setPhoto(null);
                  selectFile();
                }}
              >
                <Text style={styles.subTitle}>Edit photo</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.form}>
            <TextInput
              value={name}
              onChangeText={nameHandler}
              placeholder="Name..."
              placeholderTextColor="#BDBDBD"
              onFocus={() => setIsShowKeyboard(true)}
              style={styles.input}
            />
            <TextInput
              inlineImageLeft="search_icon"
              value={location}
              onChangeText={locationHandler}
              placeholder="Location..."
              placeholderTextColor="#BDBDBD"
              onFocus={() => setIsShowKeyboard(true)}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={onCreatPost}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnTitle}>Creat Post</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.delete}
            onPress={reset}
            disabled={isLoading}
          >
            <Feather name="trash-2" size={24} color="#DADADA" />
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  camera: {
    height: 240,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  btnPhoto: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 50,
    backgroundColor: " rgba(255, 255, 255, 0.3)",
  },
  photoContainer: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    overflow: "hidden",
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginTop: 8,
    marginHorizontal: 16,
  },
  form: {
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    paddingTop: 32,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  input: {
    height: 44,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  button: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    height: 51,
    marginTop: 43,
    marginBottom: 80,
    marginHorizontal: 16,
  },
  btnTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
  },
  delete: {
    width: 70,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
  },
});
