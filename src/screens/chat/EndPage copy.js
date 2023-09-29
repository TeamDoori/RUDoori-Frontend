import React, { useState, useContext } from "react";
import { Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { LOGO, INFO_DOORI } from "@env";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
const EndPage = () => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const participants = useSelector((state) => state.chat.roomInfo.participants);
  const roomInfo = useSelector((state) => state.chat.roomInfo);
  const user = useSelector((state) => state.user);
  const score = ["A", "B", "C", "D", "E", "F"];
  const [membersSelect, setMembersSelect] = useState();
  console.log(participants);

  const handleMembersSelect = (option) => {
    setMembersSelect(option);
  };
  return (
    <Container>
      <TopContainer>
        <Title>{roomInfo.roomName}에 참가한 두리들</Title>
      </TopContainer>
      <ImageComponent
        source={{
          uri: `${INFO_DOORI}`,
        }}
      />
      <PointContainer>
        {participants.map((item) =>
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
                onSelect={handleMembersSelect}
                buttonStyle={{
                  backgroundColor: theme.background, // 버튼 배경색
                  borderRadius: 8, // 버튼 테두리의 둥근 정도
                  height: 20,
                  width: 70,
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
                      <Text>{membersSelect}학점</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Icon name="caret-down" size={15} color="black" />
                    </View>
                  </View>
                )}
              ></SelectDropdown>
            </ProfileItem>
          ) : null,
        )}
      </PointContainer>
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
  padding: 10px;
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
  /* align-items: center; */
  /* flex-direction: row; */
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
  width: 50px;
  height: 50px;
  border-radius: 50px;
  /* resize: "contain"; */
`;
const ProfileItem = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  padding: 5px;
  margin: 10px;
`;
const ProfileName = styled.Text``;

const Title = styled.Text`
  font-weight: bold;
  /* position: absolute; */
  /* left: 20px; */
  /* bottom: 8px; */
  font-weight: bold;
  color: ${({ theme }) => theme.whiteText};
  font-size: 25px;
`;
const ImageComponent = styled.Image`
  width: 70px;
  height: 100px;
  position: absolute;
  right: 10px;
  top: 13%;
`;
