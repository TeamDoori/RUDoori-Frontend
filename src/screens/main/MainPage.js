import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components/native";
import { Button, FloatButton } from "../../components/common";
import { FlatList, RefreshControl, Text } from "react-native";
import { ThemeContext } from "styled-components/native";
import { Item } from "../../components/common/ChatList";
import { LOGO } from "@env";
import { getListInfo, initRoomInfo } from "../../redux/slice/chatSlice";
import { useSelector, useDispatch } from "react-redux";

// 메인페이지
const Container = styled.View`
  background: ${({ theme }) => theme.mainBackground};
  flex: 1;
`;

//로고 이미지
const Logo = styled.Image`
  height: 100%;
`;

const ProfileImage = styled.Image`
  height: 5%;
  border-radius: 100px;
  margin-top: 10px;
  border: 1px;
  margin-left: 14px;
  width: 40px;
  height: 40px;
`;
const Profile = styled.View`
  background: ${({ theme }) => theme.backgroundSkyblue};
  height: 8%;
  align-items: center;
  flex-direction: row;
`;
const ProfileName = styled.Text`
  margin: 10px;
  margin-top: 20px;
  color: ${({ theme }) => theme.whiteText};
`;
const CategoryContainer = styled.View`
  /* align-items: center; */
  /* flex-direction: row; */
  flex-wrap: wrap;
  width: 100%;
  height: 9%;
  /* border: 1px; */
  background: ${({ theme }) => theme.backgroundSkyblue};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
//채팅방 태그
const Category = styled.ScrollView`
  /* align-items: center; */
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
  width: 100%;

  /* border: 1px; */
`;

//채팅방 이름 목록들
const ChatList = styled.View`
  flex: 1;
`;

const Main = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const chatList = useSelector((state) => state.chat.chatList);
  const userId = useSelector((state) => state.user.userId);
  const nickName = useSelector((state) => state.user.profile.nickname);
  const userInfo = useSelector((state) => state.user.profile);

  //내가 작성한 게시물 안보이기
  result = chatList.reduce((acc, cur) => {
    if (cur.hostUser._id !== userId) acc.push(cur);
    return acc;
  }, []);
  const fetchItems = () => {
    dispatch(getListInfo()); // getListInfo 액션을 디스패치하여 채팅방 리스트 데이터 불러오기
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems();
    setIsRefreshing(false);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true); // 새로고침 시작 시 상태 변경
    fetchItems(); // 데이터 로드 함수 호출
    setIsRefreshing(false);
  };

  const buttonStyle = { fontSize: 17, color: "white", marginLeft: 15 };
  return (
    <Container>
      <Profile>
        <ProfileImage
          source={{
            uri: userInfo.image != null ? userInfo.image : `${LOGO}`,
          }}
          style={{ resizeMode: "contain" }}
        />
        <ProfileName>{nickName} 님</ProfileName>
      </Profile>
      <CategoryContainer>
        <Category horizontal={true} showsHorizontalScrollIndicator={false}>
          <Button
            title="밥"
            onPress={() =>
              navigation.navigate("RoomSelect", { keyword: "meal" })
            }
            textStyle={buttonStyle}
          />
          <Button
            title="스터디"
            onPress={() =>
              navigation.navigate("RoomSelect", { keyword: "study" })
            }
            textStyle={buttonStyle}
          />
          <Button
            title="배달"
            onPress={() =>
              navigation.navigate("RoomSelect", { keyword: "delivery" })
            }
            textStyle={buttonStyle}
          />
          <Button
            title="택시"
            onPress={() =>
              navigation.navigate("RoomSelect", { keyword: "taxi" })
            }
            textStyle={buttonStyle}
          />
          <Button
            title="외국인"
            onPress={() =>
              navigation.navigate("RoomSelect", { keyword: "foreigner" })
            }
            textStyle={buttonStyle}
          />
          <Button
            title="운동"
            onPress={() =>
              navigation.navigate("RoomSelect", { keyword: "exercise" })
            }
            textStyle={buttonStyle}
          />
        </Category>
      </CategoryContainer>
      <ChatList>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          data={result}
          renderItem={({ item }) => (
            <Item
              item={item}
              onPress={(param) => {
                navigation.navigate("EnterRoom");
                dispatch(initRoomInfo(param));
              }}
            />
          )}
        />
        <FloatButton route="CreateRoom" />
      </ChatList>
    </Container>
  );
};

export default Main;
