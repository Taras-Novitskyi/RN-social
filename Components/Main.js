import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { useRoute } from "../router";
import { authStateChanged } from "../redux/auth/authOperations";
import { selectStateChange } from "../redux/auth/authSelectors";
import { showToast } from "../helpers/showErrorToast";

export const Main = () => {
  const stateChange = useSelector(selectStateChange);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(authStateChanged());
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
    }
  }, []);

  const routing = useRoute(stateChange);

  return (
    <View style={styles.container}>
      <NavigationContainer>{routing}</NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
