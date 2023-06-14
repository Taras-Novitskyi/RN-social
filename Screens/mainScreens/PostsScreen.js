import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { CommentsScreen } from "../nestedScreens/CommentsScreen";
import { MapScreen } from "../nestedScreens/MapScreen";
import { DefaultScreen } from "../nestedScreens/DefaultScreen";
import { LogOut } from "../../Components/LogOut";

const NestedScreens = createStackNavigator();

export const PostsScreen = ({ route, navigation }) => {
  return (
    <>
      <NestedScreens.Navigator
        initialRouteName="DefaultScreen"
        screenOptions={({ route }) => ({
          headerStyle: {
            height: 80,
            backgroundColor: "#fff",
            borderBottomWidth: 0.5,
            borderBottomColor: "rgba(0, 0, 0, 0.3)",
          },
        })}
      >
        <NestedScreens.Screen
          name="DefaultScreen"
          component={DefaultScreen}
          options={{
            title: "Posts",
            headerRight: () => <LogOut />,
          }}
        />
        <NestedScreens.Screen name="Comments" component={CommentsScreen} />
        <NestedScreens.Screen name="Map" component={MapScreen} />
      </NestedScreens.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    height: 240,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: "#212121",
    fontSize: 16,
  },
  info: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumpUpBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 40,
  },
  icon: {
    marginRight: 4,
  },
});
