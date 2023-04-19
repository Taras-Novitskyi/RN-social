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
import { getAuth } from "firebase/auth";
import { Feather } from "@expo/vector-icons";

export const CommentItem = (item) => {
  // const [isCurrentUserComent, setIsCurrentUserComent] = useState();
  // const [month, day, year, hour, minutes] = [
  //   item.date.getMonth(),
  //   item.date.getDate(),
  //   item.date.getFullYear(),
  //   item.date.getHours(),
  //   item.date.getMinutes(),
  // ];

  const currentUserId = getAuth().currentUser.uid;

  const isCurrentUserComent = item.userId === currentUserId;

  return (
    <View
      style={{
        ...styles.container,
        flexDirection: isCurrentUserComent ? "row-reverse" : "row",
      }}
    >
      <View
        style={{
          ...styles.avatar,
          marginRight: !isCurrentUserComent && 16,
          marginLeft: isCurrentUserComent && 16,
        }}
      >
        <Image source={{ uri: item.userPhoto }} style={{ ...styles.photo }} />
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.commentContainer}>
          <Text style={styles.comment}>{item.comment}</Text>
        </View>
        <Text
          style={{ ...styles.date, textAlign: !isCurrentUserComent && "right" }}
        >
          {item.createdDate}
        </Text>
        {/* </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 28,
    height: 28,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    objectFit: "cover",
    objectPosition: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  dataContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  info: {
    // height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nickname: {
    color: "#a9a9a9",
    fontSize: 10,
    lineHeight: 12,
  },
  date: {
    color: "#a9a9a9",
    fontSize: 10,
    lineHeight: 12,
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // marginTop: 10,
  },
  commentContainer: {
    marginBottom: 8,
    // flexDirection: "row",
    // paddingVertical: 12,
    // alignItems: "center",
  },
  comment: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 18,
  },
  icon: {
    marginRight: 4,
  },
});
