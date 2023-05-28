import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

import { authRegistryUser } from "../../redux/auth/authOperations";
import { showToast } from "../../helpers/showErrorToast";

const initialeUserPhoto =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";

const initialState = {
  name: "",
  password: "",
  email: "",
  userPhoto: initialeUserPhoto,
};

export function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await dispatch(authRegistryUser(state));
    setState(initialState);
    setProfilePhoto(null);
    setIsLoading(false);
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
        photoLink = await uploadPhotoToServer(result.assets[0].uri);
      } else {
        photoLink = await uploadPhotoToServer(initialeUserPhoto);
      }

      setProfilePhoto(photoLink);
      setState((prevState) => ({
        ...prevState,
        userPhoto: photoLink,
      }));
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = () => {
    setProfilePhoto(null);
    setState((prevState) => ({
      ...prevState,
      userPhoto: initialeUserPhoto,
    }));
  };

  const uploadPhotoToServer = async (photo) => {
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../../assets/Images/BG-img.jpg")}
            resizeMode="cover"
            style={styles.BGImage}
          >
            <View style={styles.form}>
              <View style={styles.fotoContainer}>
                <Image
                  style={styles.profilePhoto}
                  source={{ uri: profilePhoto }}
                />
                {profilePhoto === null ? (
                  <TouchableOpacity
                    style={styles.addFotoBtn}
                    onPress={selectFile}
                  >
                    <Icon name="add-outline" size={23} color="#FF6C00" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.deleteFotoBtn}
                    onPress={deleteFile}
                  >
                    <Icon name="close-outline" size={23} color="#E8E8E8" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.title}>Registry</Text>
              <TextInput
                value={state.name}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, name: value }))
                }
                placeholder="Username"
                placeholderTextColor="#BDBDBD"
                style={styles.input}
              />
              <TextInput
                value={state.email}
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
                placeholder="Email"
                placeholderTextColor="#BDBDBD"
                style={styles.input}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                  placeholder="Password"
                  placeholderTextColor="#BDBDBD"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.btnShowPassword}
                  onPress={handleClickShowPassword}
                >
                  {!showPassword ? (
                    <Entypo name="eye" size={24} color="black" />
                  ) : (
                    <Entypo name="eye-with-line" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.btnTitle}>Create account</Text>
                )}
              </TouchableOpacity>
              <View style={styles.subTitle}>
                <Text>Are you already registered? </Text>
                <TouchableOpacity
                  style={styles.link}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.linkText}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  BGImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    paddingTop: 92,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  fotoContainer: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  profilePhoto: {
    flex: 1,
    borderRadius: 16,
  },
  addFotoBtn: {
    position: "absolute",
    bottom: 14,
    right: -14,
    width: 25,
    height: 25,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FF6C00",
  },
  deleteFotoBtn: {
    position: "absolute",
    bottom: 14,
    right: -14,
    width: 25,
    height: 25,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 30,
    letterSpacing: 0.01,
    color: "#212121",
    textAlign: "center",
    marginBottom: 33,
  },
  passwordContainer: {
    position: "relative",
  },
  btnShowPassword: {
    position: "absolute",
    top: "50%",
    right: 32,
    transform: [{ translateY: -5 }],
  },
  input: {
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
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
    marginHorizontal: 16,
  },
  btnTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
  },
  link: {},
  subTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 76,
  },
  linkText: {
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
});
