import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import {
  getDatabase,
  ref,
  onValue,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";

import { db } from "../../firebase/config";
import {
  selectNickname,
  selectUserId,
  selectUserEmail,
  selectUserPhoto,
} from "../../redux/auth/authSelectors";
import { PostItem } from "../../Components/PostItem";
import { LogOut } from "../../Components/LogOut";
import { uploadPhotoOnServer } from "../../helpers/uploadPhotoOnServer";
import { authUpdateUsersPhoto } from "../../redux/auth/authOperations";

export const ProfileScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(currentUserPhoto);

  const currentUserId = useSelector(selectUserId);
  const currentUserNickName = useSelector(selectNickname);
  const currentUserEmail = useSelector(selectUserEmail);
  const currentUserPhoto = useSelector(selectUserPhoto);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const dbRef = ref(db, "posts");
    let allUserPosts = [];

    const userPostsRef = query(
      dbRef,
      orderByChild("owner/" + "userId"),
      equalTo(currentUserId)
    );

    onValue(userPostsRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const postItem = {
          // id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        allUserPosts.unshift(postItem);
      });

      setPosts(allUserPosts);
      allUserPosts = [];
    });
  };

  const selectFile = async () => {
    try {
      // setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      let photoLink;
      if (!result.canceled) {
        photoLink = await uploadPhotoOnServer(result.assets[0].uri);
        // setProfilePhoto(result.assets[0].uri);
      } else {
        // photoLink = await uploadPhotoOnServer(initialeUserPhoto);
        // setProfilePhoto(initialeUserPhoto);
      }

      setProfilePhoto(photoLink);
      dispatch(authUpdateUsersPhoto({ userPhoto: photoLink }));
      // setState((prevState) => ({
      //   ...prevState,
      //   userPhoto: photoLink,
      // }));

      // setIsLoading(false);
    } catch (error) {
      Alert.alert(error.message);
      // setIsLoading(false);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/Images/BG-img.jpg")}
        resizeMode="cover"
        style={styles.BGImage}
      >
        <View style={styles.containerContent}>
          <View style={styles.fotoContainer}>
            <Image style={styles.profilePhoto} source={{ uri: profilePhoto }} />
            {currentUserPhoto !== null ? (
              <TouchableOpacity style={styles.addFotoBtn} onPress={selectFile}>
                <Icon
                  // style={styles.iconAdd}
                  name="add-outline"
                  size={23}
                  color="#FF6C00"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
              // style={styles.deleteFotoBtn}
              // onPress={deleteFile}
              >
                <Icon
                  style={styles.iconDelete}
                  name="close-outline"
                  size={23}
                  color="#E8E8E8"
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.title}>{currentUserNickName}</Text>
          <View style={styles.logOut}>
            <LogOut />
            {/* <Text>{currentUserNickName}</Text>
            <Text>{currentUserEmail}</Text> */}
          </View>
          {posts.length > 0 && (
            <FlatList
              data={posts}
              renderItem={({ item }) =>
                PostItem({ item, navigation, currentUserId })
              }
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {posts.length === 0 && (
            <Text style={styles.title}>You have no posts</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  BGImage: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 119,
    // alignItems: "center",
  },
  containerContent: {
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    // marginTop: 119,
    paddingTop: 92,
    paddingBottom: 76,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  fotoContainer: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  profilePhoto: {
    flex: 1,
    borderRadius: 16,
  },
  logOut: {
    position: "absolute",
    top: 22,
    right: 0,
  },
  addFotoBtn: {
    position: "absolute",
    bottom: 14,
    right: -14,
    width: 25,
    height: 25,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FF6C00",
  },
  deleteFotoBtn: {
    position: "absolute",
    bottom: 14,
    right: -14,
    width: 25,
    height: 25,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 30,
    letterSpacing: 0.01,
    color: "#212121",
    textAlign: "center",
    marginBottom: 33,
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
