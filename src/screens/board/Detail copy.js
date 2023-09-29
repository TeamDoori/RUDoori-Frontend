import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
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
          <TouchableOpacity
            onPress={() => _handleDeleteCommentButtonPress(item.replyId)}
          >
            <Text>[ 삭제 ]</Text>
          </TouchableOpacity>
          {isComment && (
            <TouchableOpacity
              onPress={() => _handleChildCommentButtonPress(item.replyId)}
            >
              <Text>[ 대댓글 ]</Text>
            </TouchableOpacity>
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
    <View style={styles.container}>
      <TouchableOpacity onPress={_handleDeletePostButtonPress}>
        <Text>[ 삭제 ]</Text>
      </TouchableOpacity>
      {post &&
        post.imageList &&
        post.imageList.length > 0 &&
        post.imageList[0].path && (
          <LogoImage
            source={{
              uri: post.imageList[0].path,
            }}
            resizeMode={"contain"}
          />
        )}
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Text>{post.createdDt}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("UserProfile", { userId: post.userId })
        }
      >
        <UserProfileContainer>
          <Text>
            글쓴이: {post.writer}({post.userId})
          </Text>
        </UserProfileContainer>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("EditBoard", { post, pageInfo })}
      >
        <Text>[ 수정 ]</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_handleScrapButtonPress}>
        <Text>[ 스크랩 ]</Text>
      </TouchableOpacity>
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
          <Button
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
          <Button
            title="댓글 저장"
            onPress={_handleWriteCommentButtonPress}
            style={styles.button}
          />
        </>
      )}
    </View>
  );
};
const Container = styled.View`
  
`

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
const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const UserProfileContainer = styled(View)``;
export default Detail;
