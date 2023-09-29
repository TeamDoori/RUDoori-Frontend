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

const Result = ({ navigation, route }) => {
  console.log(route.params.data[1]);
  const user = useSelector((state) => state.user.security);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //   const chatlist = useSelector((state) => state.chat.involvedList);
  const dispatch = useDispatch();
  const chatList = route.params.data[1];
  useEffect(() => {
    //목록 불러오기
    dispatch(getInvoledList(user.accessToken));
    setIsRefreshing(false);
  }, []);
  // useMemo를 사용하여 list를 메모이제이션
  const memoizedList = useMemo(() => chatList, [chatList]);

  const handleRefresh = () => {
    setIsRefreshing(true); // 새로고침 시작 시 상태 변경
    dispatch(getInvoledList(user.accessToken));
    setIsRefreshing(false);
  };
  return (
    <List>
      <FlatList
        data={chatList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
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
  );
};

export default Result;
