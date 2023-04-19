import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  set,
  push,
  ref,
  onValue,
  remove,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";

import { Feather, FontAwesome, AntDesign } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";

import { db, databaseRef, app } from "../firebase/config";
import { updateCountLikes } from "../redux/posts/postsOperation";
import {
  selectUserId,
  selectNickname,
  selectUserEmail,
  selectUserPhoto,
} from "../redux/auth/authSelectors";
import { async } from "@firebase/util";

export const PostItem = ({ item, navigation, currentUserId }) => {
  // const [currentUserLikeId, setCurrentUserLikeId] = useState(null);

  // const currentUserId = useSelector(selectUserId);
  // console.log(currentUserId);

  const countComments = item.comments ? Object.keys(item.comments).length : 0;
  const countLikes = item.likes ? Object.values(item.likes).length : 0;

  let currentUserLikeId;
  let currentUserComentId;

  if (countLikes) {
    const likePostUsers = Object.values(item.likes);

    const userLike = likePostUsers.find(
      (item) => item.userId === currentUserId
    );

    if (userLike) {
      currentUserLikeId = userLike.likeId;
    }
  }

  if (countComments) {
    const commentPostUsers = Object.values(item.comments);

    const userComment = commentPostUsers.find(
      (item) => item.userId === currentUserId
    );

    if (userComment) {
      currentUserComentId = userComment.commentId;
    }
  }

  const handleClickOnLikePost = async () => {
    if (!item.likes) {
      await addLike();
      return;
    }

    if (!currentUserLikeId) {
      await addLike();
      return;
    }

    removeLike();
  };

  const addLike = async () => {
    const likesRef = await databaseRef(db, "posts/" + item.postId + "/likes");
    const newLikeRef = await push(likesRef);

    const likeId = newLikeRef.key;
    const newLike = {
      likeId,
      userId: currentUserId,
    };

    // setCurrentUserLikeId(likeId);
    currentUserLikeId = likeId;
    await set(newLikeRef, newLike);
  };

  const removeLike = async () => {
    const userLikeRef = await databaseRef(
      db,
      "posts/" + item.postId + "/likes/" + currentUserLikeId
    );

    // setCurrentUserLikeId(null);
    currentUserLikeId = null;
    await remove(userLikeRef);
  };

  return (
    <View style={{ flex: 1, marginBottom: 32, marginHorizontal: 16 }}>
      <View style={styles.photoContainer}>
        <Image source={{ uri: item.photo }} style={styles.photo} />
      </View>
      <Text style={styles.title}>{item.name}</Text>
      <View style={styles.info}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              navigation.navigate("Comments", { postId: item.postId })
            }
          >
            <Icon
              name={currentUserComentId ? "chatbubble" : "chatbubble-outline"}
              size={24}
              color={countComments === 0 ? "#BDBDBD" : "#FF6C00"}
              style={styles.icon}
            />
            <Text
              style={{ color: countComments === 0 ? "#BDBDBD" : "#212121" }}
            >
              {countComments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.thumpUpBtn}>
            <AntDesign
              name={currentUserLikeId ? "like1" : "like2"}
              size={24}
              color={countLikes === 0 ? "#BDBDBD" : "#FF6C00"}
              style={styles.icon}
              onPress={handleClickOnLikePost}
            />
            <Text style={{ color: countLikes === 0 ? "#BDBDBD" : "#212121" }}>
              {countLikes}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            navigation.navigate("Map", {
              coords: item.coords,
              location: item.location,
            })
          }
        >
          <Feather
            name="map-pin"
            size={24}
            color="#BDBDBD"
            style={styles.icon}
          />
          <Text>{item.location}</Text>
        </TouchableOpacity>
      </View>
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
