import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";

export const Bangers = {
  Regular: isAndroid ? "Bangers-Regular" : "bangers-regular",
};

export const Quicksand = {
  Regular: isAndroid ? "Quicksand-Regular" : "quicksand-regular",
  Light: isAndroid ? "Quicksand-Light" : "quicksand-light",
  Bold: isAndroid ? "Quicksand-Bold" : "quicksand-bold",
};
