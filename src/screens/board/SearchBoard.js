import React, { useState, useEffect, useContext } from "react";
import { FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
// import { UserContext } from "../../contexts";
// import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { searchBoard } from "../../redux/slice/BoardSlice";
import { FloatButton } from "../../components/common";
import { LOGO } from "@env";
import moment from "moment";
import { FontAwesome5 } from "@expo/vector-icons";

const SearchBoard = ({ navigation, route }) => {
  const [search, setSearch] = useState(route.params);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((state) => state.user.security.accessToken);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.profile);
  const [page, setPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const boardList = useSelector((state) => state.board.searchBoardList);
  const nickName = useSelector((state) => state.user.profile.nickname);

  const handleRefresh = () => {
    setIsRefreshing(true); // 새로고침 시작 시 상태 변경
    fetchInitialData(); // 데이터 로드 함수 호출
    setIsRefreshing(false); // 새로고침 완료 시 상태 변경
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    const searchBoardInput = { page: 0, accessToken, keyWord: search };
    dispatch(searchBoard({ searchBoardInput }));
  };

  const fetchMoreData = () => {
    if (!isLoading) {
      setIsLoading(true);

      const nextPage = page + 1; // 다음 페이지 번호 계산
      const getBoardInput = { page: nextPage, accessToken, keyWord: search };

      dispatch(searchBoard({ getBoardInput }));
      setPage(nextPage); // 페이지 번호 갱신

      setIsLoading(false);
    }
  };

  const _handleSearchButtonPress = () => {
    const searchBoardInput = { page: 0, accessToken, keyWord: search };
    dispatch(searchBoard({ searchBoardInput }));
    // navigation.navigate("SearchBoard", search);
    // // search한거에 대해서 ,,,
    // // 받아서 결과값 리스트를 같이 넘겨줘야할거같은데?>.그거랑 page0으로해서 맨처음 로드되게 하고
    // // 그다음부터는 page 1로 들어가게끔 하고 ....
  };

  const renderItem = ({ item }) => {
    const now = moment();
    const date = moment(item.createdAt);
    const formattedTime = now.isSame(date, "day")
      ? date.format("HH:mm")
      : date.format("YY년 MM월 DD일");
    let title = item.title;
    let content = item.content;

    if (title && title.length > 34) {
      title = item.title.substring(0, 34) + "...";
    }
    if (content && content.length > 34) {
      content = item.content.substring(0, 34) + "...";
    }
    return (
      <ItemContainer
        onPress={() =>
          navigation.navigate("Detail", { item, pageInfo: "CommonBoard" })
        }
      >
        <Item>
          <ItemId>{item.postId}</ItemId>
          <ItemTitle>{title}</ItemTitle>
          <ItemHost>{item.writer}</ItemHost>
          <ItemTime>{formattedTime}</ItemTime>
          <ItemDesc>{content}</ItemDesc>
        </Item>
      </ItemContainer>
    );
  };

  return (
    <Container>
      <Profile>
        <ProfileImage
          source={{
            uri: userInfo.image != null ? userInfo.image : `${LOGO}`,
          }}
          style={{ resizeMode: "contain" }}
        />
        <ProfileName>
          {nickName} 님의 {search} 검색 결과
        </ProfileName>
      </Profile>
      <SearchContainer>
        <SearchInput
          placeholder="검색"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <SearchButton onPress={_handleSearchButtonPress}>
          <FontAwesome5 name="search" size={25} color="white" />
        </SearchButton>
      </SearchContainer>

      <FlatList
        data={boardList}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.8}
        ItemSeparatorComponent={() => <Separator />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
      <FloatButton route="Write" />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;
const ProfileImage = styled.Image`
  height: 5%;
  border-radius: 100px;
  border: 1px;
  margin-left: 14px;
  margin-top: 10px;
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
  font-size: 16px;
  color: ${({ theme }) => theme.whiteText};
`;

const SearchInput = styled.TextInput`
  /* margin-top: 5px; */
  flex: 1;
  height: 40px;
  padding: 10px;
  background: ${({ theme }) => theme.background};
  /* border: 1px; */
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  /* padding-horizontal: 10px; */
`;

const SearchButton = styled.TouchableOpacity`
  margin-right: 15px;
`;

const ItemContainer = styled.TouchableOpacity``;

const Item = styled.View`
  padding: 20px;
  flex-direction: row;
  border-radius: 15px;
  padding: 15px 20px;
  /* margin-bottom: 0px; */
  margin-top: 1px;
  background-color: white;
  height: 80px;
  flex: 1;
  margin-left: 6px;
  margin-right: 6px;
`;
const ItemHost = styled.Text`
  position: absolute;
  bottom: 9px;
  right: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`;

const ItemId = styled.Text`
  position: absolute;
  top: 9px;
  right: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`;

const ItemTitle = styled.Text`
  font-size: 18px;
  position: absolute;
  top: 15px;
  left: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const ItemTime = styled.Text`
  position: absolute;
  font-size: 12px;
  right: 12px;
  top: 20px;
  color: ${({ theme }) => theme.text};
`;
const ItemDesc = styled.Text`
  position: absolute;
  bottom: 18px;
  left: 10px;
  font-size: 14px;
  margin-top: 5px;
  color: ${({ theme }) => theme.text};
`;

const Separator = styled.View`
  height: 10px;
`;

const SearchContainer = styled.View`
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100px;
  background: ${({ theme }) => theme.backgroundSkyblue};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  margin-bottom: 4px;
`;

export default SearchBoard;
