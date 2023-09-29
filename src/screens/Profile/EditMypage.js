import React, { useState, useRef, useContext, useEffect } from "react";
// import { Image, Dimensions } from "react-native";
import { Dimensions } from "react-native";
import { BigButton, RadioButton, Image } from "../../components/auth";
import { UserInfoTextInput } from "../../components/profile";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSelector, useDispatch } from "react-redux";
import {
  saveEditMypage,
  saveEditMypageImage,
  addImage,
} from "../../redux/slice/userSlice";

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

// font-weight: bold;
const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.label};
`;

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

// const DEFAULT_PHOTO =
//   "https://firebasestorage.googleapis.com/v0/b/rn-chat-15e2f.appspot.com/o/img.png?alt=media&token=7677bf2d-0a84-4a2f-835b-eacfbca64e4a";

const EditMypage = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.profile);
  const accessToken = useSelector((state) => state.user.security.accessToken);

  const userId = useSelector((state) => state.user.userId);

  const [photo, setPhoto] = useState(userInfo.image);

  const [userInput, setUserInput] = useState({});

  const [selectedGender, setSelectedGender] = useState(userInfo.gender);
  useEffect(() => {
    setUserInput(() => ({
      nickname: userInfo.nickname || "",
      userName: userInfo.userName || "",
      major: userInfo.major || "",
      email: userInfo.email || "",
      birthday: userInfo.birthday || "",
      gender: userInfo.gender || "",
      phoneNumber: userInfo.phoneNumber || "",
      // image: photo || "",
    }));
  }, [userInfo]);

  const handleGenderSelection = (gender) => {
    setSelectedGender(gender);
  }; // console.log(user.userId);

  const _handleUpdateUserButtonPress = () => {
    const formData = new FormData();

    if (photo !== "") {
      formData.append("multipartFile", {
        uri: photo,
        type: "image/jpeg",
        name: "image.jpg",
      });
    }

    const saveEditMypageInput = { userId, accessToken, userInput };
    dispatch(saveEditMypage({ saveEditMypageInput }))
      .then((action) => {
        const saveEditMypageImageInput = {
          formData,
          accessToken,
          userId,
        };
        dispatch(saveEditMypageImage({ saveEditMypageImageInput }));
      })
      .then((action) => {
        // dispatch(addImage(action.payload));
        navigation.navigate("Mypage");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const _handleUserInputChange = (fieldName, value) => {
    // console.log(fieldName + ": " + value);
    setUserInput({
      ...userInput,
      [fieldName]: value,
    });
  };

  const refNickName = useRef(null);
  const refUserId = useRef(null);
  const refMajor = useRef(null);
  const refPassword = useRef(null);
  const refEmail = useRef(null);
  const refBirthday = useRef(null);
  const refGender = useRef(null);
  const refPhoneNumber = useRef(null);

  return (
    <KeyboardAwareScrollView>
      <Container>
        <List width={width}>
          <CenteredView>
            <Image showButton={true} url={photo} onChangePhoto={setPhoto} />
          </CenteredView>
          <UserInfoTextInput
            label="이름"
            placeholder="홍길동"
            onSubmitEditing={() => refNickName.current.focus()}
            value={userInput.userName}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("userName", value)}
          />
          <UserInfoTextInput
            ref={refNickName}
            label="닉네임"
            placeholder="두리"
            onSubmitEditing={() => refUserId.current.focus()}
            value={userInput.nickname}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("nickname", value)}
          />
          <UserInfoTextInput
            ref={refMajor}
            label="학과"
            placeholder="컴퓨터공학과"
            onSubmitEditing={() => refEmail.current.focus()}
            value={userInput.major}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("major", value)}
          />
          <UserInfoTextInput
            ref={refEmail}
            label="이메일"
            placeholder="example@naver.com"
            onSubmitEditing={() => refBirthday.current.focus()}
            value={userInput.email}
            returnKeyType="next"
            onChangeText={(value) => _handleUserInputChange("email", value)}
          />

          <UserInfoTextInput
            ref={refBirthday}
            label="생일"
            placeholder="2000-12-26"
            onSubmitEditing={() => refGender.current.focus()}
            value={userInput.birthday}
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

          <UserInfoTextInput
            ref={refPhoneNumber}
            label="전화번호"
            placeholder="010-0000-0000"
            returnKeyType="done"
            value={userInput.phoneNumber}
            onChangeText={(value) =>
              _handleUserInputChange("phoneNumber", value)
            }
          />
          <BigButton title="저장" onPress={_handleUpdateUserButtonPress} />
        </List>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default EditMypage;
