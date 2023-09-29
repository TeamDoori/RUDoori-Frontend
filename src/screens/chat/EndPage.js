import React, { useState, useContext } from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { LOGO, INFO_DOORI } from "@env";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { scoreMember } from "../../redux/slice/chatSlice";
const EndPage = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const participants = useSelector((state) => state.chat.roomInfo.participants);
  const roomInfo = useSelector((state) => state.chat.roomInfo);
  const user = useSelector((state) => state.user);
  const score = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
  ];
  const [scoreList, setScoreList] = useState({}); // 학점을 관리할 상태 추가
  const [reasonList, setReasonList] = useState({}); // 사유를 관리할 상태 추가
  console.log(participants);
  console.log(scoreList);
  console.log(reasonList);

  const handleMembersSelect = (option, index) => {
    // setMembersSelect(option);

    const updatedScoreList = { ...scoreList };
    updatedScoreList[participants[index]._id] = option; // 해당 참가자의 학점 업데이트
    setScoreList(updatedScoreList);
  };

  const handleReasonChange = (text, index) => {
    const updatedReasonList = { ...reasonList };
    updatedReasonList[participants[index]._id] = text; // 해당 참가자의 사유 업데이트
    setReasonList(updatedReasonList);
  };

  const handleScore = (scoreKey) => {
    let scoreValue = 0; // 학점 값을 초기화

    // 학점 키값에 따라 점수를 설정
    switch (scoreKey) {
      case "A+":
        scoreValue = 4.5;
        break;
      case "A":
        scoreValue = 4.0;
        break;
      case "B+":
        scoreValue = 3.5;
        break;
      case "B":
        scoreValue = 3.0;
        break;
      case "C+":
        scoreValue = 2.5;
        break;
      case "C":
        scoreValue = 2.0;
        break;
      case "D+":
        scoreValue = 1.5;
        break;
      case "D":
        scoreValue = 1.0;
        break;
      case "F":
        scoreValue = 0;
        break;
      default:
        scoreValue = 0;
        break;
    }
    return scoreValue;
  };
  const handleComplete = () => {
    console.log("\n\n===============handleComplete===================\n\n");
    const scoreRequestList = participants.reduce((acc, item) => {
      if (item._id != user.userId) {
        // scoreList에서 학점 값을 가져옴
        const scoreValue = handleScore(scoreList[item._id]);
        // ScoreRequest 객체 생성
        const scoreRequest = {
          opponentId: item._id,
          score: scoreValue,
          mention: reasonList[item._id] || "",
        };

        console.log(
          "\n\n===============scoreRequest===================\n\n",
          scoreRequest,
        );
        acc.push(scoreRequest);
      }
      return acc;
    }, []);
    console.log(
      "\n\n===============scoreRequestList===================\n\n",
      scoreRequestList,
    );

    console.log(
      "\n\n===============before send===================\n\n",
      roomInfo._id,
      roomInfo.roomName,
      user.security.accessToken,
      scoreRequestList,
    );
    dispatch(
      scoreMember({
        roomId: roomInfo._id,
        roomName: roomInfo.roomName,
        token: user.security.accessToken,
        scoreRequestList: scoreRequestList,
      }),
    );
    navigation.navigate("Home");
  };
  return (
    <Container>
      <KeyboardAwareScrollView>
        <TopContainer>
          <Title>{roomInfo.roomName}에 참가한 두리들</Title>
        </TopContainer>
        <ImageComponent
          source={{
            uri: `${INFO_DOORI}`,
          }}
        />
        <PointContainer>
          <ScrollView style={{ height: 500, width: 300 }} horizontal={false}>
            {participants.map((item, index) =>
              item._id != user.userId ? (
                <ProfileItem key={item._id}>
                  <Image
                    source={{
                      uri: item.avatar == null ? `${LOGO}` : `${item.avatar}`,
                    }}
                  />
                  <ProfileName>{item.name}</ProfileName>
                  <SelectDropdown
                    data={score}
                    onSelect={(option) => handleMembersSelect(option, index)}
                    buttonStyle={{
                      backgroundColor: theme.background, // 버튼 배경색
                      borderRadius: 8, // 버튼 테두리의 둥근 정도
                      height: 20,
                      width: 70,
                    }}
                    renderCustomizedButtonChild={() => (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text>{scoreList[item._id]}학점</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Icon name="caret-down" size={18} color="black" />
                        </View>
                      </View>
                    )}
                  ></SelectDropdown>
                  <TextInput
                    placeholder="사유를 입력하세요"
                    onChangeText={(text) => handleReasonChange(text, index)}
                    value={reasonList[item._id] || ""}
                  />
                </ProfileItem>
              ) : null,
            )}
          </ScrollView>
        </PointContainer>
        <ButtonContainer>
          <EnterButton title="완료" onPress={handleComplete}>
            <ButtonText>완료</ButtonText>
          </EnterButton>
        </ButtonContainer>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default EndPage;

const Container = styled.View`
  flex: 1;
  border: 1px;
`;
const PointContainer = styled.View`
  /* flex: 1; */
  border: 1px;
  align-items: left;
  /* padding: 10px; */
  margin-top: 50px;
  margin-left: 20px;
  margin-bottom: 10px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-width: 2px;
  width: 75%;
  flex-wrap: wrap;
`;
const TopContainer = styled.View`
  align-items: center;
  flex-direction: row;
  /* flex-wrap: wrap; */
  width: 100%;
  height: 12%;
  /* border: 1px; */
  background: ${({ theme }) => theme.backgroundSkyblue};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const Image = styled.Image`
  /* border: 1px; */
  width: 40px;
  height: 40px;
  border-radius: 20px;
  /* resize: "contain"; */
`;
const ProfileItem = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  padding: 5px;
  margin: 10px;
  align-items: center;
`;
const ProfileName = styled.Text``;

const Title = styled.Text`
  font-weight: bold;
  /* position: absolute; */
  /* left: 20px; */
  /* bottom: 8px; */
  margin-left: 10px;
  font-weight: bold;
  color: ${({ theme }) => theme.whiteText};
  font-size: 20px;
`;
const ImageComponent = styled.Image`
  width: 70px;
  height: 100px;
  position: absolute;
  right: 10px;
  top: 13%;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 60px 20px 0px 0px;
`;

const EnterButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 1px;
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
`;
const ButtonText = styled.Text`
  color: ${({ theme }) => theme.whiteText};
  font-size: 15px;
`;
