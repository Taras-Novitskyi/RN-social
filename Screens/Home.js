import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { CreatePostScreen } from "./mainScreens/CreatePostScreen";
import { ProfileScreen } from "./mainScreens/ProfileScreen.jsx";
import { PostsScreen } from "./mainScreens/PostsScreen";

const Tabs = createBottomTabNavigator();

export const Home = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Create Post"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Profile") {
            iconName = focused ? "user" : "user";
          } else if (route.name === "Create Post") {
            iconName = focused ? "plus" : "plus";
          } else if (route.name === "Posts") {
            iconName = focused ? "grid" : "grid";
          }
          return <Feather name={iconName} size={size} color={color} />;
        },

        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
        tabBarActiveBackgroundColor: "#FF6C00",
        tabBarStyle: {
          position: "absolute",
          paddingHorizontal: 60,
          paddingTop: 9,
          height: 70,
          borderTopWidth: 0.5,
          borderTopColor: "rgba(0, 0, 0, 0.3)",
        },
        tabBarItemStyle: {
          borderRadius: 20,
          height: 40,
          width: 70,
          marginHorizontal: 8,
        },
      })}
    >
      <Tabs.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
        }}
      />
      <Tabs.Screen
        name="Create Post"
        component={CreatePostScreen}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        // children={() => <ProfileScreen propPosts={posts} />}
        options={{
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
