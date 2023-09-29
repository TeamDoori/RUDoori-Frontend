import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
// import score1 from "./data/score1.json";
import { BigButton } from "../../components/profile";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
// import { UserContext } from "../../contexts";
import { API_URL } from "@env";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteScrap,
  getScrapBoardInfo,
  initialscrapBoardList,
} from "../../redux/slice/BoardSlice";

const Container = styled.View`
  flex: 1;
`;
// background-color: ${({ theme }) => theme.background};

const Label = styled.Text`
  font-size: 18px;
`;
// margin-bottom: 6px;
// color: ${({ theme }) => theme.label};
// font-weight: bold;

const Myscrap = ({ navigation }) => {
  // const [boardList, setBoardList] = useState([]);
  const boardList = useSelector((state) => state.board.scrapBoardList);

  const userId = useSelector((state) => state.user.userId);
  const accessToken = useSelector((state) => state.user.security.accessToken);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // const handleRefresh = () => {
  //   setIsRefreshing(true); // 새로고침 시작 시 상태 변경
  //   fetchInitialData(); // 데이터 로드 함수 호출
  //   setIsRefreshing(false); // 새로고침 완료 시 상태 변경
  // };

  useEffect(() => {
    // dispatch(initialscrapBoardList());
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    const getScrapBoardInfoInput = { accessToken };
    dispatch(getScrapBoardInfo({ getScrapBoardInfoInput }));
    // setPage(1);
  };

  const _handleDeleteScrapButtonPress = (postId) => {
    const deleteScrapInput = { accessToken, postId, pageInfo: "MyScrap" };
    dispatch(deleteScrap({ deleteScrapInput }));
    // setBoardList((prevList) =>
    //   prevList.filter((item) => item.postId !== postId),
    // );
  };

  const renderItem = ({ item }) => {
    // console.log("=======item==========start");
    // console.log(item);
    // console.log("=======item==========end");
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MyboardDetail", { item, pageInfo: "Myscrap" })
          }
        >
          <View>
            <Text>포스트아이디: {item.postId}</Text>
            <Text>글쓴이: {item.writer}</Text>
            <Text>생성날짜: {item.createdDt}</Text>
            <Text>제목: {item.title}</Text>
            <Text>내용: {item.content}</Text>
          </View>
        </TouchableOpacity>
        <BigButton
          title="스크랩 해제"
          onPress={() => _handleDeleteScrapButtonPress(item.postId)}
        />
      </View>
    );
  };
  return (
    // <SafeAreaView>
    <Container>
      <FlatList
        data={boardList}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        // onEndReached={fetchMoreData}
        // onEndReachedThreshold={0.8}
        // ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // 아이템 사이 간격을 설정합니다.
        // refreshControl={
        //   <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        // }
      />
    </Container>
    // </SafeAreaView>
  );
};

export default Myscrap;
