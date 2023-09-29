import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
// import score1 from "./data/score1.json";
import { BigButton } from "../../components/profile";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
// import { UserContext } from "../../contexts";
import { API_URL } from "@env";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteScrap,
  getMyBoardInfo,
  initialmyBoardList,
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

const Myboard = ({ navigation }) => {
  // const [boardList, setBoardList] = useState([]);
  const boardList = useSelector((state) => state.board.myBoardList);

  const userId = useSelector((state) => state.user.userId);
  const accessToken = useSelector((state) => state.user.security.accessToken);
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true); // 새로고침 시작 시 상태 변경
    fetchInitialData(); // 데이터 로드 함수 호출
    setIsRefreshing(false); // 새로고침 완료 시 상태 변경
  };

  useEffect(() => {
    dispatch(initialmyBoardList());
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    const getMyBoardInfoInput = { accessToken, userId, page };
    dispatch(getMyBoardInfo({ getMyBoardInfoInput }));
  };

  const fetchMoreData = () => {
    if (!isLoading) {
      setIsLoading(true);

      const nextPage = page + 1;
      const getMyBoardInfoInput = { page: nextPage, userId, accessToken };

      dispatch(getMyBoardInfo({ getMyBoardInfoInput }));
      setPage(nextPage);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MyboardDetail", { item, pageInfo: "Myboard" })
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
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.8}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // 아이템 사이 간격을 설정합니다.
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </Container>
    // </SafeAreaView>
  );
};

export default Myboard;
