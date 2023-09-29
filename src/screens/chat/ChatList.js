import React, { useEffect, useState, useContext, useMemo } from "react";
import styled from "styled-components/native";
import { FlatList, RefreshControl } from "react-native";
import { Item } from "../../components/common/ChatList";
import { FloatButton } from "../../components/common";
import { useDispatch, useSelector } from "react-redux";
import { getInvoledList, initRoomInfo } from "../../redux/slice/chatSlice";
//채팅방 이름 목록들
const List = styled.View`
  flex: 1;
`;

const ChatList = ({ navigation }) => {
  // const { user } = useContext(UserContext);
  const user = useSelector((state) => state.user.security);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatlist = useSelector((state) => state.chat.involvedList);
  const dispatch = useDispatch();

  useEffect(() => {
    //목록 불러오기
    dispatch(getInvoledList(user.accessToken));
    setIsRefreshing(false);
  }, []);
  // useMemo를 사용하여 list를 메모이제이션
  const memoizedList = useMemo(() => chatlist, [chatlist]);

  const handleRefresh = () => {
    setIsRefreshing(true); // 새로고침 시작 시 상태 변경
    dispatch(getInvoledList(user.accessToken));
    setIsRefreshing(false);
  };
  return (
    <Container>
      <TopContainer>
        <Title>내가 참여한 모임들</Title>
      </TopContainer>
      <List>
        <FlatList
          data={chatlist}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
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
      </List>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  /* border: 1px; */
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
const Title = styled.Text`
  /* font-weight: bold; */
  /* position: absolute; */
  /* left: 20px; */
  /* bottom: 8px; */
  margin-left: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.whiteText};
  font-size: 23px;
`;
export default ChatList;
