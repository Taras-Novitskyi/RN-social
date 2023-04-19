import React from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { authLogOutUser } from "../redux/auth/authOperations";

export const LogOut = () => {
  const dispatch = useDispatch();

  const handlelogOut = () => {
    dispatch(authLogOutUser());
  };

  return (
    <TouchableOpacity style={{ marginRight: 10 }} onPress={handlelogOut}>
      <Feather name="log-in" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );
};
