import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = React.createContext({
  user: { userId: "", nickname: "", accessToken: "", refreshToken: "" },
  setUserIdAndNickname: () => {},
  setNickname: () => {},
  setTokens: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: "",
    nickname: "",
    accessToken: "",
    refreshToken: "",
  });

  // 로그인 회원가입 시 필요
  const setUserIdAndNickname = async (userId, nickname) => {
    try {
      if (userId) {
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("nickname", nickname);
        setUser((prev) => ({ ...prev, userId: userId, nickname: nickname }));
      }
    } catch (error) {
      console.error("Error setting setUserIdAndNickname:", error);
    }
  };

  // mypage에서 nickname 변경 시 필요
  const setNickname = async (nickname) => {
    try {
      if (nickname) {
        setUser((prev) => ({ ...prev, nickname: nickname }));
      }
    } catch (error) {
      console.error("Error setting nickname:", error);
    }
  };

  const setTokens = async (accessToken, refreshToken) => {
    try {
      if (accessToken && refreshToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        setUser((prev) => ({
          ...prev,
          accessToken: accessToken,
          refreshToken: refreshToken,
        }));
      }
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  };

  // useEffect(() => {
  //   const fetchUserContext = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem("userId");
  //       const accessToken = await AsyncStorage.getItem("accessToken");
  //       const refreshToken = await AsyncStorage.getItem("refreshToken");
  //       setUser({ userId, accessToken, refreshToken });
  //       console.log("useeFFECT:" + userId);
  //     } catch (error) {
  //       console.error("Error fetching fetchUserContext:", error);
  //     }
  //   };

  //   fetchUserContext();
  // }, []);

  return (
    <UserContext.Provider
      value={{ user, setUserIdAndNickname, setNickname, setTokens }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
