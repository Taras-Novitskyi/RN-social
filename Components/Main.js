import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { AppLoading } from "expo";
import { StatusBar } from "expo-status-bar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/config";
import { useRoute } from "../router";
import { authStateChanged, authRefresh } from "../redux/auth/authOperations";
import { selectStateChange } from "../redux/auth/authSelectors";

export const Main = () => {
  const stateChange = useSelector(selectStateChange);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        // const currentUser = await AsyncStorage.getItem("currentUser");
        // if (currentUser !== null) {
        //   dispatch(authRefresh(JSON.parse(currentUser)));
          dispatch(authStateChanged());
      } catch (e) {
        console.error(e);
      }
    })();
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
