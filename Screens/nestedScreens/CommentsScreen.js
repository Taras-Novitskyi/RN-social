import React, { useState, useEffect, useMemo } from "react";
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

import {
  selectNickname,
  selectUserId,
  selectUserPhoto,
} from "../../redux/auth/authSelectors";
import { db, databaseRef, app } from "../../firebase/config";
import { CommentItem } from "../../Components/CommentItem";

const ListHeaderComponent = React.memo(({ postPhoto }) => {
  return (
    <View style={styles.photoContainer}>
      <Image source={{ uri: postPhoto }} style={styles.photo} />
    </View>
  );
});

export function CommentsScreen({ route, navigation }) {
  const [comment, setComment] = useState("");
  const [postPhoto, setPostPhoto] = useState(null);
  const [allComments, setAllComments] = useState([]);

  const nickname = useSelector(selectNickname);
  const userId = useSelector(selectUserId);
  const userPhoto = useSelector(selectUserPhoto);

  const { postId } = route.params;
  const commentHandler = (text) => setComment(text);

  useEffect(() => {
    getAllComments();
    getPostPhoto();
  }, [route]);

  const getPostPhoto = async () => {
    const postRef = databaseRef(db, "posts/" + postId);
    let postPhoto = null;

    onValue(
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
  };

  const getAllComments = async () => {
    const commentsRef = await databaseRef(db, "posts/" + postId + "/comments");
    let allCommentsDB = [];

    onValue(commentsRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const commentItem = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        allCommentsDB.push(commentItem);
      });

      setAllComments(allCommentsDB);
      allCommentsDB = [];
    });
  };

  const createComment = async () => {
    const commentsRef = databaseRef(db, "posts/" + postId + "/comments");
    const createdDate = new Date().toLocaleString();

    const newCommentRef = await push(commentsRef);

    const auth = getAuth();
    const userPhoto = auth.currentUser.photoURL;

    const commentId = newCommentRef.key;
    const newComment = {
      commentId,
      createdDate,
      nickname,
      userId,
      userPhoto,
      comment,
      postId,
    };

    await set(newCommentRef, newComment);

    Keyboard.dismiss();
    setComment("");
    getAllComments();
  };

  // const ListHeaderComponent = () => {
  //   return (
  //     <View style={styles.photoContainer}>
  //       <Image source={{ uri: postPhoto }} style={styles.photo} />
  //     </View>
  //   );
  // };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <>
            {allComments.length > 0 && (
              <FlatList
                data={allComments}
                // renderItem={({ item }) => CommentItem(item, userId)}
                renderItem={({ item }) => CommentItem(item, userId)}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => (
                  <ListHeaderComponent postPhoto={postPhoto} />
                )}
              />
            )}
            {allComments.length === 0 && (
              <>
                <ListHeaderComponent postPhoto={postPhoto} />
                <Text style={styles.title}>No comments</Text>
              </>
            )}
            <View style={styles.form}>
              <TextInput
                value={comment}
                name="comment"
                onChangeText={commentHandler}
                placeholder="You comment..."
                placeholderTextColor="#BDBDBD"
                multiline
                textAlignVertical="top"
                maxLength={500}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={createComment}
                activeOpacity={0.8}
              >
                <AntDesign name="arrowup" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
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
    justifyContent: "center",

    backgroundColor: "#ecf0f1",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 80,
  },
  input: {
    alignContent: "center",
    height: 50,
    padding: 16,

    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
    // backgroundColor: "#F6F6F6F",
    // fontFamily:
    fontSize: 16,
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
    // backgroundColor: "#F6F6F6",
    borderRadius: 20,
  },
});
