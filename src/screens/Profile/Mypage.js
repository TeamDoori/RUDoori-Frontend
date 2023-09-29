import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components/native";
import { SafeAreaView, Platform, Image } from "react-native";
import { BigButton } from "../../components/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserImage, UserInfoText } from "../../components/profile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { DEFAULT_PHOTO } from "@env";
// import { UserContext } from "../../contexts";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/userSlice";
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
const Mypage = ({ navigation }) => {
  // const [photo, setPhoto] = useState(DEFAULT_PHOTO);

  const accessToken = useSelector((state) => state.user.security.accessToken);

  const userId = useSelector((state) => state.user.userId);
  const userInfo = useSelector((state) => state.user.profile);

  const dispatch = useDispatch();
  console.log("======MyPage의 userInfo=====start======");
  console.log(userInfo);
  console.log(userInfo.image);
  console.log("======MyPage의 userInfo=====end======");

  const _handleLogoutButtonPress = () => {
    const logoutInput = { accessToken, userId };
    dispatch(logout({ logoutInput }));

    // const { setUserIdAndNickname, setTokens } = useContext(UserContext);

    console.log("accessToken: " + accessToken);
    navigation.navigate("Login");
  };
  return (
    <KeyboardAwareScrollView>
      <SafeAreaView>
        <Container>
          <ProfileSectionContainer>
            {/* <UserImage url={photo} /> */}

            {/* {userInfo.image && <UserImage url={userInfo.image} />} */}
            {userInfo.image && (
              <LogoImage
                source={{
                  uri: userInfo.image,
                }}
                resizeMode={"contain"}
              />
            )}
            <UserInfoText value={userInfo.nickname} isNickname={true} />
            <UserInfoText value={userInfo.userName} isUsername={true} />
            <ElementContainer>
              <BigButton
                title="내 점수"
                onPress={() => navigation.navigate("Myscore")}
              />
              <BigButton
                title="내 글"
                onPress={() => navigation.navigate("Myboard")}
              />
              <BigButton
                title="스크랩"
                onPress={() => navigation.navigate("Myscrap")}
              />
            </ElementContainer>
            <ElementContainer>
              <BigButton
                title="정보 수정"
                onPress={() => navigation.navigate("EditMypage")}
              />
              <BigButton title="로그아웃" onPress={_handleLogoutButtonPress} />
            </ElementContainer>
          </ProfileSectionContainer>
          <UserInfoText label="아이디(학번)" value={userId} />
          <UserInfoText label="학과" value={userInfo.major} />
          <UserInfoText label="이메일" value={userInfo.email} />
          <UserInfoText label="생일" value={userInfo.birthday} />
          <UserInfoText label="성별" value={userInfo.gender} />
          <UserInfoText label="전화번호" value={userInfo.phoneNumber} />
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
export default Mypage;
