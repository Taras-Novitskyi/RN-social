import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { set, push, ref, onValue, child, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";

import { selectNickname, selectUserId } from "../../redux/auth/authSelectors";
import { db, databaseRef, app } from "../../firebase/config";
import { CommentItem } from "../../Components/CommentItem";

export function CommentsScreen({ route, navigation }) {
  const [comment, setComment] = useState("");
  const [postPhoto, setPostPhoto] = useState(null);
  const [allComments, setAllComments] = useState([]);

  const nickname = useSelector(selectNickname);
  const userId = useSelector(selectUserId);

  const { postId } = route.params;
  const commentHandler = (text) => setComment(text);

  useEffect(() => {
    getAllComments();
    getPostPhoto();
  }, []);

  const getPostPhoto = async () => {
    const postRef = await databaseRef(db, "posts/" + postId);
    let postPhoto = null;

    await onValue(
      postRef,
      (snapshot) => {
        // id: childSnapshot.key,
        const data = snapshot.val();
        postPhoto = data.photo;

        setPostPhoto(postPhoto);
        postPhoto = null;
      },
      {
        onlyOnce: true,
      }
    );

    // return postPhoto;
  };

  getPostPhoto();

  const getAllComments = async () => {
    const commentsRef = await databaseRef(db, "posts/" + postId + "/comments");
    let allCommentsDB = [];

    await onValue(
      commentsRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const commentItem = {
            // id: childSnapshot.key,
            ...childSnapshot.val(),
          };
          allCommentsDB.push(commentItem);
        });

        setAllComments(allCommentsDB);
        allCommentsDB = [];
      }
      // {
      //   onlyOnce: true,
      // }
    );
  };

  const createComment = async () => {
    const commentsRef = await databaseRef(db, "posts/" + postId + "/comments");
    const createdDate = new Date().toLocaleString();

    const newCommentRef = await push(commentsRef);

    const auth = getAuth();
    const userPhoto = await auth.currentUser.photoURL;

    const commentId = newCommentRef.key;
    const newComment = {
      commentId,
      createdDate,
      nickname,
      userId,
      userPhoto,
      comment,
    };

    await set(newCommentRef, newComment);

    Keyboard.dismiss();
    setComment("");
  };

  const ListHeaderComponent = () => {
    return (
      <View style={styles.photoContainer}>
        <Image source={{ uri: postPhoto }} style={styles.photo} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            {/* <View style={styles.photoContainer}>
              <Image source={{ uri: postPhoto }} style={styles.photo} />
            </View> */}
            {allComments.length > 0 && (
              <FlatList
                data={allComments}
                renderItem={({ item }) => CommentItem(item)}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={ListHeaderComponent}
              />
            )}
            {allComments.length === 0 && (
              <Text style={styles.title}>No comments</Text>
            )}
            <View style={styles.form}>
              <TextInput
                // inlineImageLeft="search_icon"
                value={comment}
                name="comment"
                onChangeText={commentHandler}
                placeholder="You comment..."
                placeholderTextColor="#BDBDBD"
                multiline
                textAlignVertical="top"
                maxLength={500}
                // onFocus={() => setIsShowKeyboard(true)}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={createComment}
                activeOpacity={0.8}
              >
                <AntDesign name="arrowup" size={24} color="white" />
                {/* <Text style={styles.btnTitle}>Add comment</Text> */}
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  photoContainer: {
    // flex: 1,
    height: 240,
    marginTop: 32,
    marginBottom: 32,
    marginHorizontal: 16,
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
    marginHorizontal: 16,
  },
  form: {
    position: "relative",

    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#ecf0f1",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 80,
    // borderTopRightRadius: 25,
    // borderTopLeftRadius: 25,
  },
  input: {
    // display: "flex",
    // flexDirection: "column",
    // alignItems: 'center',
    // justifyContent: "center",
    // textAlign: "center",

    alignContent: "center",

    height: 50,
    padding: 16,

    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
    backgroundColor: "#F6F6F6F",
    // fontFamily:
    fontSize: 16,
    // lineHeight: 19,
    color: "#212121",
  },
  button: {
    position: "absolute",
    top: 8,
    right: 8,
    height: 34,
    width: 34,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FF6C00",
    borderRadius: 100,
    alignItems: "center",
  },
  btnTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
  },
  delete: {
    width: 70,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
  },
});
