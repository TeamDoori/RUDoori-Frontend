import React, { useState, useRef, useContext } from "react";
// import { Image, Dimensions } from "react-native";
import { Dimensions } from "react-native";
import { BigButton, RadioButton, Input, Image } from "../../components/auth";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//redux
import { useDispatch, useSelector } from "react-redux";
import { register, registerImage } from "../../redux/slice/userSlice";
import { LOGO, DEFAULT_PHOTO } from "@env";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
`;
const CenteredView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 50px;
`;

// const LogoImage = styled(Image)`
//   width: 150px;
//   height: 150px;
//   border-radius: 15px;
// `;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.label};
`;

// font-weight: bold;

const ElementContainer = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const GenderContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
  padding: 10px;
`;

const Signup = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const [photo, setPhoto] = useState(DEFAULT_PHOTO);
  // const [photo, setPhoto] = useState(logo);

  const [selectedGender, setSelectedGender] = useState("M");

  const handleGenderSelection = (gender) => {
    setSelectedGender(gender);
  };

  const [userInput, setUserInput] = useState({
    userName: "",
    nickname: "",
    userId: "",
    major: "",
    password: "",
    email: "",
    birthday: "",
    gender: "M",
    phoneNumber: "",
  });

  const refNickname = useRef(null);
  const refUserId = useRef(null);
  const refMajor = useRef(null);
  const refPassword = useRef(null);
  const refEmail = useRef(null);
  const refBirthday = useRef(null);
  const refGender = useRef(null);
  const refPhoneNumber = useRef(null);

  const dispatch = useDispatch();

  const _handleSignupButtonPress = () => {
    const formData = new FormData();

    if (photo !== "") {
      // Append the actual photo file, not the file path
      formData.append("multipartFile", {
        uri: photo,
        type: "image/jpeg", // Change the MIME type according to your file
        name: "image.jpg",
      });
    }

    const registerInput = {
      userInput,
    };

    dispatch(register({ registerInput }))
      .then((action) => {
        console.log("========then action=======start");
        console.log(action);
        console.log("========then action=======end");
        const registerImageInput = {
          formData,
          accessToken: action.payload.accessToken,
        };

        dispatch(registerImage({ registerImageInput }));
      })
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        // Handle errors from either dispatch
        console.error("An error occurred:", error);
      });

    // navigation.navigate("Login");
  };

  const _handleUserInputChange = (fieldName, value) => {
    setUserInput({
      ...userInput,
      [fieldName]: value,
    });
  };

  return (
    <KeyboardAwareScrollView>
      <Container>
        <List width={width}>
          <CenteredView>
            <Image showButton={true} url={photo} onChangePhoto={setPhoto} />
          </CenteredView>
          <Input
            label="이름"
            placeholder="홍길동"
            onSubmitEditing={() => refNickname.current.focus()}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("userName", value)}
          />
          <Input
            ref={refNickname}
            label="닉네임"
            placeholder="두리"
            onSubmitEditing={() => refUserId.current.focus()}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("nickname", value)}
          />
          <Input
            ref={refUserId}
            label="아이디(학번)"
            placeholder="202312345"
            onSubmitEditing={() => refPassword.current.focus()}
            returnKeyType="next"
            numericOnly={true}
            maxLength={9}
            onChangeText={(value) => _handleUserInputChange("userId", value)}
          />
          <Input
            ref={refPassword}
            label="비밀번호"
            placeholder="영문 포함 8자 이상"
            onSubmitEditing={() => refMajor.current.focus()}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("password", value)}
          />
          <Input
            ref={refMajor}
            label="학과"
            placeholder="컴퓨터공학과"
            onSubmitEditing={() => refEmail.current.focus()}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("major", value)}
          />
          <Input
            ref={refEmail}
            label="이메일"
            placeholder="example@naver.com"
            onSubmitEditing={() => refBirthday.current.focus()}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("email", value)}
          />

          <Input
            ref={refBirthday}
            label="생일"
            placeholder="2000.12.26"
            onSubmitEditing={() => refGender.current.focus()}
            returnKeyType="next"
            maxLength={10}
            onChangeText={(value) => _handleUserInputChange("birthday", value)}
          />

          <ElementContainer ref={refGender}>
            <Label>성별</Label>
            <GenderContainer>
              <RadioButton
                genderLabel="남"
                isSelected={selectedGender === "M"}
                onPress={() => {
                  handleGenderSelection("M");
                  _handleUserInputChange("gender", "M");
                }}
              />
              <RadioButton
                genderLabel="여"
                isSelected={selectedGender === "F"}
                onPress={() => {
                  handleGenderSelection("F");
                  _handleUserInputChange("gender", "F");
                }}
              />
            </GenderContainer>
          </ElementContainer>

          <Input
            ref={refPhoneNumber}
            label="전화번호"
            placeholder="010-0000-0000"
            returnKeyType="done"
            onChangeText={(value) =>
              _handleUserInputChange("phoneNumber", value)
            }
          />
          <BigButton title="회원가입" onPress={_handleSignupButtonPress} />
        </List>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
