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
import { getDatabase, ref, onValue } from "firebase/database";

import { db } from "../../firebase/config";
import { PostsListItem } from "../../Components/PostsListItem";
import { selectUserId } from "../../redux/auth/authSelectors";

export function DefaultScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const currentUserId = useSelector(selectUserId);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    const dbRef = ref(db, "posts");
    let allPosts = [];

    onValue(
      dbRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const postItem = {
            // id: childSnapshot.key,
            ...childSnapshot.val(),
          };
          allPosts.unshift(postItem);
        });

        setPosts(allPosts);
        allPosts = [];
      }
      // {
      //   onlyOnce: true,
      // }
    );
  };

  return (
    <View style={styles.container}>
      {posts.length > 0 && (
        <FlatList
          data={posts}
          renderItem={({ item }) =>
            PostsListItem(item, navigation, currentUserId)
          }
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {posts.length === 0 && (
        <Text style={styles.title}>You have no posts</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 76,
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
