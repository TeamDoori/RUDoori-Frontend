import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteComment,
  initialCommentList,
  writeComment,
  writeChildComment,
  scrapPost,
  deleteBoard,
  getBoardDetailInfo,
} from "../../redux/slice/BoardSlice";
import styled from "styled-components/native";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Detail = ({ navigation, route }) => {
  const [post, setPost] = useState(route.params.item);
  const pageInfo = route.params.pageInfo;
  const [commentInput, setCommentInput] = useState("");
  const accessToken = useSelector((state) => state.user.security.accessToken);
  const dispatch = useDispatch();
  const [childComment, setChildComment] = useState(false);
  const [replyParentId, setReplyParentId] = useState(null);
  const [childCommentInput, setChildCommentInput] = useState("");

  const comments = useSelector((state) => state.board.commentList);
  // post.userId
  const userId = useSelector((state) => state.user.userId);
  const hostId = post.userId;

  const hostViewId = hostId.substring(0, 6) + "XX";

  const now = moment();
  const date = moment(post.createdDt);
  const formattedTime = now.isSame(date, "day")
    ? date.format("HH:mm")
    : date.format("YY년 MM월 DD일");

  useEffect(() => {
    console.log(post);
    const getBoardDetailInfoInput = {
      accessToken,
      postId: post.postId,
      pageInfo,
    };
    dispatch(getBoardDetailInfo({ getBoardDetailInfoInput }));
  }, []);

  const _handleWriteCommentButtonPress = () => {
    if (commentInput.trim() !== "") {
      const writeCommentInput = {
        commentInput,
        accessToken,
        postId: post.postId,
        pageInfo,
      };
      dispatch(writeComment({ writeCommentInput }));
      setCommentInput("");
    } else {
      Alert.alert("댓글을 작성해주세요.");
    }
  };

  const _handleWriteChildCommentButtonPress = () => {
    if (replyParentId !== null && childCommentInput.trim() !== "") {
      const writeChildCommentInput = {
        accessToken,
        postId: post.postId,
        commentParentId: replyParentId,
        commentInput: childCommentInput,
        pageInfo,
      };
      dispatch(writeChildComment({ writeChildCommentInput }));
      setChildCommentInput("");
      setReplyParentId(null);
    } else {
      Alert.alert("대댓글을 작성해주세요.");
    }
  };

  const _handleDeleteCommentButtonPress = (commentId) => {
    const deleteCommentInput = { accessToken, commentId, pageInfo };
    dispatch(deleteComment({ deleteCommentInput }));
  };

  const _handleChildCommentButtonPress = (replyId) => {
    if (replyId === replyParentId || replyId === null) {
      setReplyParentId(null);
      setChildComment(false);
    } else {
      setReplyParentId(replyId);
      setChildComment(true);
    }
  };

  const renderCommentItem = ({ item, isComment }) => {
    return (
      <View style={styles.commentItem}>
        <Text style={styles.commentContent}>댓글 닉네임: {item.nickname}</Text>
        <Text style={styles.commentContent}>
          댓글 내용: {item.content + "  "}
          {/* {item.createdDt} */}
          <CommentButton
            onPress={() => _handleDeleteCommentButtonPress(item.replyId)}
          >
            <Text>[ 삭제 ]</Text>
          </CommentButton>
          {isComment && (
            <CommentButton
              onPress={() => _handleChildCommentButtonPress(item.replyId)}
            >
              <Text>[ 대댓글 ]</Text>
            </CommentButton>
          )}
        </Text>
        {item.children && item.children.length > 0 && (
          <FlatList
            data={item.children}
            renderItem={({ item }) =>
              renderCommentItem({ item, isComment: false })
            }
            keyExtractor={(child) => child.replyId}
            style={styles.replyList}
          />
        )}
      </View>
    );
  };

  const _handleDeletePostButtonPress = () => {
    const deleteBoardInput = { accessToken, postId: post.postId, pageInfo };
    dispatch(deleteBoard({ deleteBoardInput }));
    navigation.goBack();
  };

  const _handleScrapButtonPress = () => {
    const scrapPostInput = { postId: post.postId, accessToken };
    dispatch(scrapPost({ scrapPostInput }));
    Alert.alert("스크랩 완료");
  };

  return (
    <Container>
      <TitleContainer>
        <Title>{post.title}</Title>
        <Date>{formattedTime}</Date>
        {hostId == userId ? (
          <SystemButtonContainer>
            <SystemButton onPress={_handleDeletePostButtonPress}>
              <ButtonText>[ 삭제 ]</ButtonText>
            </SystemButton>
            <SystemButton
              onPress={() =>
                navigation.navigate("EditBoard", { post, pageInfo })
              }
            >
              <ButtonText>[ 수정 ]</ButtonText>
            </SystemButton>
          </SystemButtonContainer>
        ) : (
          <SystemButtonContainer>
            <SystemButton onPress={_handleScrapButtonPress}>
              <ButtonText>[ 스크랩 ]</ButtonText>
            </SystemButton>
          </SystemButtonContainer>
        )}
        <UserProfileButton
          onPress={() =>
            navigation.navigate("UserProfile", { userId: post.userId })
          }
        >
          <UserProfileContainer>
            <Text>
              {post.writer}_{hostViewId}
            </Text>
          </UserProfileContainer>
        </UserProfileButton>
      </TitleContainer>
      {post &&
        post.imageList &&
        post.imageList.length > 0 &&
        post.imageList[0].path && (
          <ImageContent
            source={{
              uri: post.imageList[0].path,
            }}
            resizeMode={"contain"}
          />
        )}

      <Content>{post.content}</Content>

      <FlatList
        data={comments}
        renderItem={({ item }) => renderCommentItem({ item, isComment: true })}
        keyExtractor={(comments) => comments.replyId.toString()}
      />
      {childComment ? (
        <>
          <TextInput
            placeholder="대댓글을 입력하세요"
            value={childCommentInput}
            onChangeText={(value) => setChildCommentInput(value)}
            style={styles.input}
          />
          <CommentButton
            title="대댓글 저장"
            onPress={_handleWriteChildCommentButtonPress}
            style={styles.button}
          />
        </>
      ) : (
        <>
          <TextInput
            placeholder="댓글을 입력하세요"
            value={commentInput}
            onChangeText={(value) => setCommentInput(value)}
            style={styles.input}
          />
          <CommentButton
            title="댓글 저장"
            onPress={_handleWriteCommentButtonPress}
            style={styles.button}
          />
        </>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 24px;
  /* border: 1px; */
  background-color: ${({ theme }) => theme.background};
`;

const TitleContainer = styled.View`
  flex-direction: column;
  /* border: 1px; */
  border-bottom: 1px;
  border-bottom-width: 1px;
  margin-bottom: 12px;
`;
const Title = styled.Text`
  font-size: 25px;
  font-weight: bold;
  margin-left: 8px;
  margin-top: 8px;
`;

const Content = styled.Text`
  font-size: 18px;
  margin-top: 20px;
`;

const Date = styled.Text`
  font-size: 13px;
  margin-left: 8px;
`;

const SystemButtonContainer = styled.View`
  position: absolute;
  right: 1px;
  top: 1px;
  flex-direction: row;
`;
const CommentList = styled.FlatList`
  /* 스타일링을 추가하거나 수정할 수 있습니다. */
`;

const ButtonText = styled.Text`
  /* 버튼 텍스트의 스타일을 지정할 수 있습니다. */
`;

const CommentButton = styled.TouchableOpacity`
  /* 삭제 버튼의 스타일을 지정할 수 있습니다. */
`;

const SystemButton = styled.TouchableOpacity`
  /* 삭제 버튼의 스타일을 지정할 수 있습니다. */
`;

const UserProfileButton = styled.TouchableOpacity`
  /* 글쓴이 프로필 버튼의 스타일을 지정할 수 있습니다. */
  position: absolute;
  right: 1px;
  bottom: 1px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    fontSize: 18,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  commentItem: {
    padding: 10,
    marginVertical: 4,
  },
  editButton: {
    fontSize: 14,
    color: "blue",
    marginLeft: 10,
  },
  editTextInput: {
    fontSize: 16,
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  replyList: {
    marginLeft: 16,
  },
});
const ImageContent = styled(Image)`
  flex: 1;
  border-radius: 30px;
`;

const UserProfileContainer = styled(View)``;
export default Detail;
