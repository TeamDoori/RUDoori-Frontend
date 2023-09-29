import React, { useRef, useState, useContext } from "react";
import { Image } from "react-native";
// import logo from "../../../assets/images/logo.jpg";
import { BigButton, SmallButton, Input } from "../../components/auth";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "@env";

// import { UserContext } from "../../contexts";

import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/slice/userSlice";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
`;
const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const IdPwRegisterContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.hideborder};
`;

const Separator = styled.Text`
  color: ${({ theme }) => theme.border};
  font-size: 15px;
`;

const Login = ({ navigation }) => {
  const refPassword = useRef(null);
  const [userInput, setUserInput] = useState({
    userId: "",
    password: "",
  });

  const userInfo = useSelector((state) => state.user.profile);

  // console.log("======MyPage의 userInfo=====start======");
  // console.log(userInfo);
  // console.log("======MyPage의 userInfo=====end======");

  const dispatch = useDispatch();
  // const { setUserIdAndNickname, setTokens } = useContext(UserContext);
  const accessToken = useSelector((state) => state.user.security.accessToken);

  // console.log("accessToken: " + accessToken);
  const _handleLoginButtonPress = () => {
    // 변수 하나로 보내기
    dispatch(login({ userInput }));
    navigation.navigate("Main");
  };

  const _handleUserInputChange = (fieldName, value) => {
    // console.log(fieldName + ": " + value);

    setUserInput({
      ...userInput,
      [fieldName]: value,
    });
  };

  return (
    <Container>
      <LogoImage
        source={require("../../../assets/images/logo.jpg")}
        resizeMode={"contain"}
      />
      <Input
        placeholder="학번"
        onSubmitEditing={() => refPassword.current.focus()}
        returnKeyType="next"
        onChangeText={(value) => _handleUserInputChange("userId", value)}
      />
      <Input
        ref={refPassword}
        placeholder="비밀번호"
        returnKeyType="done"
        onChangeText={(value) => _handleUserInputChange("password", value)}
      />
      <BigButton title="로그인" onPress={_handleLoginButtonPress} />
      <IdPwRegisterContainer>
        <SmallButton
          title="아이디 찾기"
          onPress={() => console.log("아이디 찾기 클릭")}
        />
        <Separator>|</Separator>
        <SmallButton
          title="비밀번호 찾기"
          onPress={() => console.log("비밀번호 찾기 클릭")}
        />
        <Separator>|</Separator>
        <SmallButton
          title="회원가입"
          onPress={() => navigation.navigate("Signup")}
        />
      </IdPwRegisterContainer>
    </Container>
  );
  // return console.log("screens/Login.js 접속");
};

export default Login;
