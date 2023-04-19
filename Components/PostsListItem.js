import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { PostItem } from "./PostItem";

export const PostsListItem = (item, navigation, currentUserId) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.userData}>
        <Image
          style={styles.profilePhoto}
          source={{ uri: item.owner.userPhoto }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.owner.userNickname}</Text>
          <Text style={styles.userEmail}>{item.owner.userEmail}</Text>
        </View>
      </View>
      <PostItem
        item={item}
        navigation={navigation}
        currentUserId={currentUserId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    // flex: 1,
    height: 240,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  userData: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 32,
    marginTop: 32,
    marginHorizontal: 16,
  },
  profilePhoto: {
    // flex: 1,
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 8,
  },
  userInfo: {
    display: "flex",
    justifyContent: "center",
  },
  userName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
    lineHeight: 15,
    fontWeight: 700,
    color: "#212121",
  },
  userEmail: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
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
