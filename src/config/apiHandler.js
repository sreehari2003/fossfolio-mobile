import Axios from "axios";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "https://api.fossfolio.com/api"; // Android emulator
  } else {
    return "https://api.fossfolio.com/api"; // iOS simulator and others
  }
};

const BASE_URL = getBaseUrl();

export const apiHandler = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
