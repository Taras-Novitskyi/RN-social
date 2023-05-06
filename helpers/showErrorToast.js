import Toast from "react-native-toast-message";

export const showToast = ({
  type = "error",
  text1 = "Try again",
  text2 = "",
}) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};
