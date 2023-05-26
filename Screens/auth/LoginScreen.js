import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { authSignInUser } from "../../redux/auth/authOperations";

const initialState = {
  password: "",
  email: "",
};

export function LoginScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setIsLoading(true);
    await dispatch(authSignInUser(state));
    setState(initialState);
    setIsLoading(false);
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
              <Text style={styles.title}>Log in</Text>
              <TextInput
                value={state.email}
                onChangeText={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    email: value,
                  }))
                }
                placeholder="Email"
                placeholderTextColor="#BDBDBD"
                style={styles.input}
              />
              <TextInput
                value={state.password}
                onChangeText={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    password: value,
                  }))
                }
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={true}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.btnTitle}>Log in</Text>
                )}
              </TouchableOpacity>
              <View style={styles.subTitle}>
                <Text>You don't have account? </Text>
                <TouchableOpacity
                  style={styles.link}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("Registry")}
                >
                  <Text style={styles.linkText}>Sing up</Text>
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
    // alignItems: "center",
    justifyContent: "center",
  },
  BGImage: {
    flex: 1,
    justifyContent: "flex-end",
    // alignItems: "center",
  },
  form: {
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    // paddingHorizontal: 16,
    paddingTop: 32,
    // paddingBottom: 76,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  title: {
    fontSize: 30,
    letterSpacing: 0.01,
    color: "#212121",
    textAlign: "center",
    marginBottom: 33,
    // marginTop: 32,
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
