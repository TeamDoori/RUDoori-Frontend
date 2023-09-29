import React, { useState, useEffect, useCallback, useContext } from "react";
import { RefreshControl, FlatList } from "react-native";
import styled from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import { getBoardInfo, initialBoardList } from "../../redux/slice/BoardSlice";
import { FloatButton } from "../../components/common";
import { FontAwesome5 } from "@expo/vector-icons";
import { LOGO } from "@env";
import moment from "moment";

const MainGet = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((state) => state.user.security.accessToken);
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const boardList = useSelector((state) => state.board.boardList);
  const userInfo = useSelector((state) => state.user.profile);
  const nickName = useSelector((state) => state.user.profile.nickname);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchInitialData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    dispatch(initialBoardList());
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    const getBoardInput = { page: 0, accessToken };
    dispatch(initialBoardList());
    dispatch(getBoardInfo({ getBoardInput }));
  };

  const fetchMoreData = () => {
    if (!isLoading) {
      setIsLoading(true);

      const nextPage = page + 1;
      const getBoardInput = { page: nextPage, accessToken };

      dispatch(getBoardInfo({ getBoardInput }));
      setPage(nextPage);
      setIsLoading(false);
    }
  };

  const _handleSearchButtonPress = () => {
    navigation.navigate("SearchBoard", search);
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
        <ProfileName>{nickName} 님</ProfileName>
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

export default MainGet;
