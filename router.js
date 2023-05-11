import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const MainStack = createStackNavigator();

import { RegistrationScreen } from "./Screens/auth/RegistrationScreen";
import { LoginScreen } from "./Screens/auth/LoginScreen";
import { Home } from "./Screens/Home";

export const useRoute = (isAuth) => {

  if (!isAuth) {
    return (
      <MainStack.Navigator initialRouteName="Login">
        <MainStack.Screen
          name="Registry"
          component={RegistrationScreen}
          options={{
            headerShown: false,
            title: "Login",
          }}
        />
        <MainStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            title: "Registration",
          }}
        />
      </MainStack.Navigator>
    );
  }

  return <Home />;
};

