import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const initialState = {
  boardList: [],
  commentList: [],

  scrapBoardList: [],
  scrapCommentList: [],

  myBoardList: [],
  myBoardCommentList: [],

  searchBoardList: [],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.commentList.push(...action.payload.replyGroup);
    },
    removeComment: (state, action) => {
      state.commentList = state.commentList.filter(
        (comment) => comment.replyId !== action.payload,
      );
    },
    initialCommentList: (state, action) => {
      state.commentList = [];
    },
    initialscrapCommentList: (state, action) => {
      state.scrapCommentList = [];
    },
    initialmyBoardCommentList: (state, action) => {
      state.myBoardCommentList = [];
    },
    initialBoardList: (state, action) => {
      state.boardList = [];
    },
    initialmyBoardList: (state, action) => {
      state.myBoardList = [];
    },
    initialscrapBoardList: (state, action) => {
      state.scrapBoardList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(scrapPost.fulfilled, (state, action) => {});
    builder.addCase(deleteScrap.fulfilled, (state, action) => {
      const deletedPostId = action.payload.boardId;
      state.scrapBoardList = state.scrapBoardList.filter(
        (item) => item.postId !== deletedPostId,
      );
    });
    builder.addCase(deleteBoard.fulfilled, (state, action) => {
      // action에 myscrap , myboard, common board 구분해서 case 로 실행할 것
      const pageInfo = action.payload.pageInfo;
      if (pageInfo === "Myboard") {
        const deletedPostId = action.payload.boardId;
        state.myBoardList = state.myBoardList.filter((item) => {
          return item.postId !== deletedPostId;
        });
      } else if (pageInfo === "Myscrap") {
        const deletedPostId = action.payload.boardId;
        state.scrapBoardList = state.scrapBoardList.filter((item) => {
          return item.postId !== deletedPostId;
        });
      } else if (pageInfo === "CommonBoard") {
        const deletedPostId = action.payload.boardId;
        state.boardList = state.boardList.filter((item) => {
          return item.postId !== deletedPostId;
        });
      } else {
        error();
      }
    });
    builder.addCase(writePost.fulfilled, (state, action) => {
      // console.log(action);
      // 새로고침 없이도 boardList 추가
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      // action에 myscrap , myboard, common board 구분해서 case 로 실행할 것
      const pageInfo = action.payload.pageInfo;
      const updatedPost = action.payload.data.data;
      if (pageInfo === "Myboard") {
        state.myBoardList = state.myBoardList.map((post) => {
          if (post.postId === updatedPost.postId) {
            return updatedPost;
          }
          return post;
        });
      } else if (pageInfo === "Myscrap") {
        state.scrapBoardList = state.scrapBoardList.map((post) => {
          if (post.postId === updatedPost.postId) {
            return updatedPost;
          }
          return post;
        });
      } else if (pageInfo === "CommonBoard") {
        state.boardList = state.boardList.map((post) => {
          if (post.postId === updatedPost.postId) {
            return updatedPost;
          }
          return post;
        });
      } else {
        error();
      }
    });
    builder.addCase(writeComment.fulfilled, (state, action) => {
      const pageInfo = action.payload.pageInfo;
      if (pageInfo === "Myboard") {
        state.myBoardCommentList = [
          ...state.myBoardCommentList,
          action.payload.data.data,
        ];
      } else if (pageInfo === "Myscrap") {
        state.scrapCommentList = [
          ...state.scrapCommentList,
          action.payload.data.data,
        ];
      } else if (pageInfo === "CommonBoard") {
        state.commentList = [...state.commentList, action.payload.data.data];
      } else {
        error();
      }
    });

    builder.addCase(writeChildComment.fulfilled, (state, action) => {
      const pageInfo = action.payload.pageInfo;
      const newComment = action.payload.data.data;

      if (pageInfo === "Myboard") {
        const parentCommentIndex = state.myBoardCommentList.findIndex(
          (comment) => comment.replyId === newComment.parentReplyId,
        );
        if (parentCommentIndex !== -1) {
          if (!state.myBoardCommentList[parentCommentIndex].children) {
            state.myBoardCommentList[parentCommentIndex].children = [];
          }
          state.myBoardCommentList[parentCommentIndex].children = [
            ...state.myBoardCommentList[parentCommentIndex].children,
            newComment,
          ];
        }
      } else if (pageInfo === "Myscrap") {
        const parentCommentIndex = state.scrapCommentList.findIndex(
          (comment) => comment.replyId === newComment.parentReplyId,
        );
        if (parentCommentIndex !== -1) {
          if (!state.scrapCommentList[parentCommentIndex].children) {
            state.scrapCommentList[parentCommentIndex].children = [];
          }
          state.scrapCommentList[parentCommentIndex].children = [
            ...state.scrapCommentList[parentCommentIndex].children,
            newComment,
          ];
        }
      } else if (pageInfo === "CommonBoard") {
        const parentCommentIndex = state.commentList.findIndex(
          (comment) => comment.replyId === newComment.parentReplyId,
        );
        if (parentCommentIndex !== -1) {
          if (!state.commentList[parentCommentIndex].children) {
            state.commentList[parentCommentIndex].children = [];
          }
          state.commentList[parentCommentIndex].children = [
            ...state.commentList[parentCommentIndex].children,
            newComment,
          ];
        }
      } else {
        error();
      }
    });
    builder.addCase(getBoardInfo.fulfilled, (state, action) => {
      const totalPages = action.payload.data.totalPages;
      const pageNumber = action.payload.data.pageable.pageNumber;

      // 중복되지 않는 postId만 필터링하여 추가
      const newPosts = action.payload.data.content.filter(
        (newPost) =>
          !state.boardList.some((post) => post.postId === newPost.postId),
      );

      if (pageNumber < totalPages) {
        state.boardList = [...state.boardList, ...newPosts];
      }
    });

    builder.addCase(getBoardDetailInfo.fulfilled, (state, action) => {
      const pageInfo = action.payload.pageInfo;
      if (pageInfo === "Myboard") {
        state.myBoardCommentList = [...action.payload.data.data.replyGroup];
      } else if (pageInfo === "Myscrap") {
        state.scrapCommentList = [...action.payload.data.data.replyGroup];
      } else if (pageInfo === "CommonBoard") {
        state.commentList = [...action.payload.data.data.replyGroup];
      }
    });
    builder.addCase(getScrapBoardInfo.fulfilled, (state, action) => {
      state.scrapBoardList = [...action.payload.data];
    });
    builder.addCase(getMyBoardInfo.fulfilled, (state, action) => {
      const totalPages = action.payload.data.totalPages;
      const pageNumber = action.payload.data.pageable.pageNumber;

      // 중복되지 않는 postId만 필터링하여 추가
      const newPosts = action.payload.data.content.filter(
        (newPost) =>
          !state.myBoardList.some((post) => post.postId === newPost.postId),
      );

      if (pageNumber < totalPages) {
        state.myBoardList = [...state.myBoardList, ...newPosts];
      }
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const pageInfo = action.payload.pageInfo;
      const deletedCommentId = action.payload.commentId;

      if (pageInfo === "Myboard") {
        state.myBoardCommentList = state.myBoardCommentList.filter(
          (item) => item.replyId !== deletedCommentId,
        );
      } else if (pageInfo === "Myscrap") {
        state.scrapCommentList = state.scrapCommentList.filter(
          (item) => item.replyId !== deletedCommentId,
        );
      } else if (pageInfo === "CommonBoard") {
        state.commentList = state.commentList.filter(
          (item) => item.replyId !== deletedCommentId,
        );
      } else {
        error();
      }
    });

    builder.addCase(searchBoard.fulfilled, (state, action) => {
      state.searchBoardList = [];
      const totalPages = action.payload.data.totalPages;
      const pageNumber = action.payload.data.pageable.pageNumber;

      // 중복되지 않는 postId만 필터링하여 추가
      const newPosts = action.payload.data.content.filter(
        (newPost) =>
          !state.searchBoardList.some((post) => post.postId === newPost.postId),
      );

      if (pageNumber < totalPages) {
        state.searchBoardList = [...state.searchBoardList, ...newPosts];
      }
    });
  },
});

export const scrapPost = createAsyncThunk(
  "user/scrapPost",
  async ({ scrapPostInput }) => {
    try {
      const boardId = scrapPostInput.postId;
      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      const response = await fetch(`${API_URL}/board/scrap/${boardId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${scrapPostInput.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: " + data);
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteBoard = createAsyncThunk(
  "user/deleteBoard",
  async ({ deleteBoardInput }) => {
    try {
      const boardId = deleteBoardInput.postId;
      const pageInfo = deleteBoardInput.pageInfo;
      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      // const response = await fetch(`${API_URL}/board?boardId=${boardId}`, {
      const response = await fetch(`${API_URL}/board?boardId=${boardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${deleteBoardInput.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return { data, boardId, pageInfo };
    } catch (error) {
      throw error;
    }
  },
);
export const deleteScrap = createAsyncThunk(
  "user/deleteScrap",
  async ({ deleteScrapInput }) => {
    try {
      const boardId = deleteScrapInput.postId;

      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      const response = await fetch(`${API_URL}/board/scrap/${boardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${deleteScrapInput.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: " + data);
      return { data, boardId };
    } catch (error) {
      throw error;
    }
  },
);

export const updatePost = createAsyncThunk(
  "user/updatePost",
  async ({ updatePostInput }) => {
    try {
      const boardId = updatePostInput.postId;
      const pageInfo = updatePostInput.pageInfo;
      // const response = await fetch(`${API_URL}/board/${boardId}`, {
      const response = await fetch(`${API_URL}/board/${boardId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${updatePostInput.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePostInput.userInput),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: " + data);
      return { data, pageInfo };
    } catch (error) {
      throw error;
    }
  },
);

export const writeComment = createAsyncThunk(
  "user/writeComment",
  async ({ writeCommentInput }) => {
    try {
      const pageInfo = writeCommentInput.pageInfo;
      const boardId = writeCommentInput.postId;
      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${writeCommentInput.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(writeCommentInput.commentInput),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: " + data);
      return { data, pageInfo };
    } catch (error) {
      throw error;
    }
  },
);

export const writeChildComment = createAsyncThunk(
  "user/writeChildComment",
  async ({ writeChildCommentInput }) => {
    try {
      const boardId = writeChildCommentInput.postId;
      const parentId = writeChildCommentInput.commentParentId;
      const pageInfo = writeChildCommentInput.pageInfo;
      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      const response = await fetch(
        `${API_URL}/board/${boardId}/reply/${parentId}/child`,
        // `${API_URL}/board/${boardId}/reply/${parentId}/child`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${writeChildCommentInput.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(writeChildCommentInput.commentInput),
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: " + data);
      return { data, pageInfo };
    } catch (error) {
      throw error;
    }
  },
);

export const writePost = createAsyncThunk(
  "user/writePost",
  async ({ writePostInput }) => {
    try {
      const { formData, accessToken } = writePostInput;
      const response = await fetch(`${API_URL}/board`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: " + data);
      return data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  },
);

export const getBoardInfo = createAsyncThunk(
  "chat/getBoardInfo",
  async ({ getBoardInput }) => {
    try {
      const response = await fetch(
        `${API_URL}/board/list?page=${getBoardInput.page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getBoardInput.accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

// 사실 comment를 받아오는 ..
export const getBoardDetailInfo = createAsyncThunk(
  "chat/getBoardDetailInfo",
  async ({ getBoardDetailInfoInput }) => {
    try {
      const { postId, pageInfo } = getBoardDetailInfoInput;
      const response = await fetch(`${API_URL}/board?boardId=${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getBoardDetailInfoInput.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return { data, pageInfo }; // 받아온 데이터를 반환합니다.
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

export const getScrapBoardInfo = createAsyncThunk(
  "chat/getScrapBoardInfo",
  async ({ getScrapBoardInfoInput }) => {
    try {
      const response = await fetch(
        // `${API_URL}/board/list?page=${getScrapBoardInfoInput.page}`,
        `${API_URL}/board/scrap`,
        //   `${API_URL}/board/list?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getScrapBoardInfoInput.accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

export const getMyBoardInfo = createAsyncThunk(
  "chat/getMyBoardInfo",
  async ({ getMyBoardInfoInput }) => {
    try {
      const userId = getMyBoardInfoInput.userId;
      const response = await fetch(
        `${API_URL}/board/myBoardList/${userId}?page=${getMyBoardInfoInput.page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getMyBoardInfoInput.accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

export const deleteComment = createAsyncThunk(
  "user/deleteComment",
  async ({ deleteCommentInput }) => {
    try {
      const { commentId, pageInfo } = deleteCommentInput;

      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      const response = await fetch(
        `${API_URL}/board/comment?commentId=${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${deleteCommentInput.accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return { data, commentId, pageInfo };
    } catch (error) {
      throw error;
    }
  },
);

export const searchBoard = createAsyncThunk(
  "user/searchBoard",
  async ({ searchBoardInput }) => {
    try {
      const { keyWord, page } = searchBoardInput;
      // const response = await fetch(`${API_URL}/board/${boardId}/reply/parent`, {
      const response = await fetch(
        `${API_URL}/board/search?keyWord=${keyWord}&page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${searchBoardInput.accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const {
  addComment,
  removeComment,
  initialCommentList,
  initialBoardList,
  initialmyBoardList,
  initialscrapBoardList,
} = boardSlice.actions;
export default boardSlice.reducer;
