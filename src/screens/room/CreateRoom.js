import React, { useState, useContext } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { InputBox, SubmitButton } from "../../components/room";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image, View, Text, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import { UserContext } from "../../contexts/User";
import { Input } from "../../components/common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { initRoomInfo } from "../../redux/slice/chatSlice";
const Container = styled.View`
  background-color: ${({ theme }) => theme.background};
  flex: 1;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 10px 30px 0;
`;

const Title = styled.Text`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  font-size: 25px;
  padding: 0 0 0 0;
`;

const SubTitle = styled.Text`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 10px 0px 30px;
`;

const ContentContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 30px 10px 0px 30px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 60px 20px 0px 0px;
`;

const CreateRoom = () => {
  const navigation = useNavigation();
  // const { user } = useContext(UserContext);
  const user = useSelector((state) => state.user);
  const [roomName, setRoomName] = useState("");
  const dispatch = useDispatch();
  const handleRoomNameChange = (value) => {
    setRoomName(value);
  };

  const members = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [membersSelect, setMembersSelect] = useState();

  const handleMembersSelect = (option) => {
    setMembersSelect(option);
  };

  const categorys = ["공부", "밥", "운동", "택시", "배달", "외국인", "취미"];
  const [categorySelect, setCategorySelect] = useState("");

  const handleCategorySelect = (option) => {
    setCategorySelect(option);
  };

  const [introduce, setIntroduce] = useState("");
  const handleIntroduceChange = (value) => {
    console.log(value);
    setIntroduce(value);
  };

  const handleButtonPress = () => {
    postToBackend();
  };

  // 입력된 방 정보들 json 변환
  const postToBackend = () => {
    const apiUrl = `${API_URL}/room/create`;
    // 입력값이 하나라도 없으면 알림
    if (!roomName || !membersSelect || !introduce || !categorySelect) {
      alert("전부 다 입력해주세요!");
      return;
    }

    const jsonObject = {
      hostId: user.userId,
      roomName: roomName,
      maxParticipants: membersSelect,
      introduce: introduce,
      category: categorySelect,
    };

    // fetch 함수를 사용하여 POST 요청 보내기
    fetch(`${API_URL}/room/create`, {
      method: "POST", // 메서드를 POST로 설정
      headers: {
        "Content-Type": "application/json", // 요청의 Content-Type을 JSON으로 설정
        Authorization: `Bearer ${user.security.accessToken}`,
      },
      body: JSON.stringify(jsonObject), // 데이터 객체를 JSON 문자열로 변환하여 body에 설정
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        console.log("POST 요청 성공:");

        return response.json();
      })
      .then((res) => {
        console.log("resonse ", res);
        console.log("resonse ", res.data);

        dispatch(initRoomInfo(res.data));
        navigation.navigate("EnterRoom");
      })
      .catch((error) => {
        console.error("POST 요청 실패:");
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <KeyboardAwareScrollView>
          <TitleContainer>
            <Image
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/rudoori.appspot.com/o/room%2FcreateRoom.png?alt=media",
              }}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
            <Title>방 만들기</Title>
          </TitleContainer>
          <InputContainer>
            <SubTitle>방 이름 : </SubTitle>
            <InputBox onKeywordChange={handleRoomNameChange} />
          </InputContainer>
          <InputContainer>
            <SubTitle>인원 수 : </SubTitle>
            <SelectDropdown
              data={members}
              onSelect={handleMembersSelect}
              buttonStyle={{
                backgroundColor: "#A2E1DB", // 버튼 배경색
                borderRadius: 8, // 버튼 테두리의 둥근 정도
                height: 35,
                width: 250,
              }}
              renderCustomizedButtonChild={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text>{membersSelect}</Text>
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <Icon name="caret-down" size={35} color="black" />
                  </View>
                </View>
              )}
            ></SelectDropdown>
          </InputContainer>
          <InputContainer>
            <SubTitle>{"주    제  : "}</SubTitle>
            <SelectDropdown
              data={categorys}
              onSelect={handleCategorySelect}
              buttonStyle={{
                backgroundColor: "#A2E1DB", // 버튼 배경색
                borderRadius: 8, // 버튼 테두리의 둥근 정도
                height: 35,
                width: 250,
              }}
              renderCustomizedButtonChild={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text>{categorySelect}</Text>
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <Icon name="caret-down" size={35} color="black" />
                  </View>
                </View>
              )}
            ></SelectDropdown>
          </InputContainer>
          <ContentContainer>
            <Input
              height={300}
              width={330}
              placeholder="  방 소개를 해주세요"
              onChangeText={handleIntroduceChange}
              returnKeyType="done"
            ></Input>
          </ContentContainer>
          <ButtonContainer>
            <SubmitButton onPress={handleButtonPress} title="완료" />
          </ButtonContainer>
        </KeyboardAwareScrollView>
      </Container>
    </SafeAreaView>
  );
};

export default CreateRoom;
