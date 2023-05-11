import React from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { authLogOutUser } from "../redux/auth/authOperations";
import { showToast } from "../helpers/showErrorToast";

export const LogOut = () => {
  const dispatch = useDispatch();

  const handlelogOut = () => {
    try {
      dispatch(authLogOutUser());
    } catch (error) {
      showToast({
        text1: `Something wrong, try again.`,
        text2: `Error ${error.message}`,
      });
    }
  };

  return (
    <TouchableOpacity style={{ marginRight: 10 }} onPress={handlelogOut}>
      <Feather name="log-in" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );
};
