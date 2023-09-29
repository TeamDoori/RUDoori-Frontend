import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components/native";
import { SafeAreaView, Platform, Image } from "react-native";
import { BigButton } from "../../components/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserImage, UserInfoText } from "../../components/profile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/userSlice";
import { API_URL } from "@env";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;
const ProfileSectionContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundSkyblue};

  ${Platform.select({
    ios: "border-bottom-left-radius: 10 10; border-bottom-right-radius: 10 10;", // iOS용 스타일
    android:
      "border-bottom-left-radius: 10px; border-bottom-right-radius: 10px", // Android용 스타일
  })}
`;
const ElementContainer = styled.View`
  margin-top: 4px;
  flex-direction: row;
  justify-content: center;
`;
const UserProfile = ({ route }) => {
  console.log(route.params);
  // const [photo, setPhoto] = useState(DEFAULT_PHOTO);
  const accessToken = useSelector((state) => state.user.security.accessToken);

  const { userId } = route.params; // 정보를 볼 user
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/user/profile/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log("=========res===========start");
        console.log(res);
        console.log("=========res===========end");
        setUserInfo(res);
        console.log(userInfo);
      })
      .catch((error) => {
        console.error("Error during LoadUserProfile:", error);
      });
  }, []);

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView>
        <Container>
          <ProfileSectionContainer>
            {/* {userInfo.image && (
              <LogoImage
                source={{
                  uri: userInfo.image,
                }}
                resizeMode={"contain"}
              />
            )} */}
            {/* <UserInfoText value={userInfo.nickname} isNickname={true} />
            <UserInfoText value={userInfo.userName} isUsername={true} /> */}
          </ProfileSectionContainer>
          {/* <UserInfoText label="아이디(학번)" value={userId} />
          <UserInfoText label="학과" value={userInfo.major} /> */}
        </Container>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
export default UserProfile;
