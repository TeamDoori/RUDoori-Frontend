import React, { useContext, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  flushMessage,
  getPageInfo,
  setInvite,
  setExit,
} from "../../redux/slice/chatSlice";
import { API_URL, INFO_DOORI, LOGO } from "@env";

const EnterRoom = ({ navigation }) => {
  const page = useSelector((state) => state.chat.totalPage);
  const room = useSelector((state) => state.chat.roomInfo);
  const status = useSelector((state) => state.chat.status);
  // const { user } = useContext(UserContext);
  const user = useSelector((state) => state.user.security);
  const userId = useSelector((state) => state.user.userId);
  const nickName = useSelector((state) => state.user.profile.nickname);
  const token = user.accessToken;
  const dispatch = useDispatch();
  console.log(status);
  useEffect(() => {
    console.log("rooooooooooooooooooooooooooooooooooom", room);
    if (status.isInvite === "" || status.isInvite === room._id) {
      // console.log(room);
      dispatch(getPageInfo({ room, token }));
      dispatch(setInvite(room._id));
    } else {
      // console.log("invited effect", room);
      dispatch(getPageInfo({ room, token }));
      dispatch(flushMessage());
      dispatch(setInvite(room._id));
    }
  }, []);

  /**
   * 방 입장 가능 여부 확인
   * @returns true, false
   */
  const handleEnterRoom = async () => {
    try {
      const response = await fetch(`${API_URL}/room/valid/${room._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // 서버의 API 엔드포인트를 입력합니다.
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.data);
      if (data.data == "enter") {
        navigation.navigate("Chat");
      } else if (data.data == "blocked") {
        Alert.alert("차단되어 들어갈 수 없습니다.");
      } else if (data.data == "false") {
        Alert.alert("들어갈 수 없는 방입니다.");
      } else if (data.data == "finish") {
        Alert.alert("모임이 종료되었습니다.");
        navigation.navigate("EndPage");
      }
      return data.data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <TopContainer>
          <Profile>
            <ProfileImage
              source={{
                uri: `${LOGO}`,
              }}
              style={{ resizeMode: "contain" }}
            />
            <ProfileName>{nickName} 님</ProfileName>
          </Profile>
          <Title>채팅방 입장</Title>
        </TopContainer>
        <ImageComponent
          source={{
            uri: `${INFO_DOORI}`,
          }}
        />
        <IntroduceContainer>
          <NameContainer>
            <RoomName>{room.roomName}</RoomName>
          </NameContainer>
          <IntroContainer>
            <IntroduceContent>{room.introduce}</IntroduceContent>
          </IntroContainer>
          <Numbers>정원 : {room.maxParticipants}명</Numbers>
          <Members>
            참가자 : {room.participants.map((member) => member.name).join(", ")}
            님
          </Members>
          <Date>{room.formattedTime}</Date>
        </IntroduceContainer>
        <ButtonContainer>
          <EnterButton title="입장" onPress={handleEnterRoom}>
            <ButtonText>입장</ButtonText>
          </EnterButton>
        </ButtonContainer>
      </Container>
    </ThemeProvider>
  );
};

const Container = styled.View`
  background-color: ${({ theme }) => theme.background};
  flex: 1;
`;
const TopContainer = styled.View`
  /* background-color: ${({ theme }) => theme.background}; */
  /* align-items: center; */
  flex-direction: column;
  /* flex: 1; */
  flex-wrap: wrap;
  width: 100%;
  border: 1px;
  font-weight: bold;
  color: ${({ theme }) => theme.whiteText};
  font-size: 17px;
  background: ${({ theme }) => theme.backgroundSkyblue};

  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  height: 17%;
  border: 1px;
`;
const ProfileImage = styled.Image`
  height: 5%;
  border-radius: 100px;
  border: 1px;
  margin-left: 14px;
  width: 40px;
  height: 40px;
`;
const Profile = styled.View`
  background: ${({ theme }) => theme.backgroundSkyblue};
  height: 50%;
  align-items: center;
  flex-direction: row;
`;
const ProfileName = styled.Text`
  margin: 10px;
  margin-top: 20px;
  color: ${({ theme }) => theme.whiteText};
`;

const NameContainer = styled.View`
  position: absolute;
  top: 25px;
  /* border: 1px; */
  width: 100%;
  /* height: 15%; */
`;
const RoomName = styled.Text`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  font-size: 23px;
  margin-left: 5px;
  margin-right: 5px;
`;
const IntroContainer = styled.View`
  position: absolute;
  top: 100px;
  width: 100%;
  height: 40%;
  margin-top: 1px;
  /* border: 1px; */
`;
const IntroduceContent = styled.Text`
  /* font-weight: bold; */
  /* left: 20px; */

  color: ${({ theme }) => theme.text};
  font-size: 17px;
  padding: 0 0 0 0;
  margin-left: 5px;
  margin-right: 5px;
  /* border: 1px; */
`;

const ImageComponent = styled(Image)`
  width: 70px;
  height: 100px;
  position: absolute;
  right: 10px;
  top: 150px;
`;

const Title = styled.Text`
  font-weight: bold;
  position: absolute;
  left: 20px;
  bottom: 8px;
  font-weight: bold;
  color: ${({ theme }) => theme.whiteText};
  font-size: 35px;
`;

const TitleName = styled.Text`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  font-size: 30px;
`;

const IntroduceContainer = styled.View`
  position: relative;
  top: 40px;
  /* left: 5px; */
  justify-content: center;
  align-items: center;
  margin: 20px 5px 20px 20px;
  flex-direction: column;
  /* background-color: ${({ theme }) => theme.introduceBackground}; */
  width: 75%;
  height: 60%;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-width: 2px;
  /* border-color: black; */
`;

const Introduce = styled.Text`
  color: ${({ theme }) => theme.grey};
  font-size: 20px;
  position: absolute;
  top: 20px;
  left: 20px;
  border: 1px;
`;

const Numbers = styled.Text`
  color: ${({ theme }) => theme.grey};
  font-size: 14px;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;
const Members = styled.Text`
  color: ${({ theme }) => theme.grey};
  font-size: 12px;
  position: absolute;
  bottom: 50px;
  right: 20px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 10px;
  right: 20px;
  flex-direction: row;
  justify-content: center;
  width: 80px;
  height: 80px;
  /* margin: 0 0 0 0; */
  /* border: 1px; */
`;

const EnterButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 20px;
  width: 100px;
  height: 50px;
  background: ${({ theme }) => theme.backgroundSkyblue};
  border-radius: 5px;
  margin-left: 30px;
  border-width: 1px;
  border-color: black;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20px;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.whiteText};
  font-size: 15px;
`;

const DateContainer = styled.View`
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.background};
  width: 180px;
  height: 45px;
  position: absolute;
  right: 5px;
  bottom: 10px;
  border-radius: 20px;
`;

const Date = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  padding: 0 0 0 0;
`;

export default EnterRoom;
