import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env";
const initialState = {
  roomInfo: {
    _id: "",
    blockedMember: [],
    createdAt: "",
    hostUser: "",
    full: false,
    used: true,
    complete: false,
    introduce: "",
    maxParticipants: 2,
    participants: [],
    roomName: "",
  },
  totalPage: 0,
  currentPage: 1,
  messages: [],
  chatList: [],
  involvedList: [],
  status: {
    isInvite: "",
    isEntered: false,
    isPanGestureActive: false,
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    //방 입장시 정보 초기화
    initRoomInfo: (state, action) => {
      console.log("initRoomInfo-------------------------------------", action);
      state.roomInfo = action.payload;
      state.currentPage = 1;
      state.status.isEntered = false;
    },
    increasePage: (state) => {
      state.currentPage = state.currentPage + 1;
    },
    addMessage: (state, action) => {
      console.log("addMessage------------------ ", action.payload);
      // let list = state.messages;
      // list.unshift(action.payload);

      // state.messages.unshift(action.payload);
      // 새로운 메시지 추가
      const updatedMessages = [action.payload, ...state.messages];

      // 중복 메시지 제거 (메시지 ID를 기준으로 중복 제거)
      const uniqueMessages = updatedMessages.reduce((uniqueList, message) => {
        if (!uniqueList.some((item) => item._id === message._id)) {
          uniqueList.push(message);
        }
        return uniqueList;
      }, []);
      state.messages = uniqueMessages;
    },
    flushMessage: (state) => {
      state.messages = [];
    },
    setInvite: (state) => {
      state.status.isInvite = state.payload;
    },
    setEnter: (state) => {
      console.log(
        "----------------------wggududuududdu---------------",
        state.status,
      );
      state.status.isEntered = true;
      console.log(state.status);
    },
    setExit: (state) => {
      state.status.isEntered = false;
    },
    setIsPanGestureActive: (state, action) => {
      state.isPanGestureActive = action.payload;
    },
    setBlockUsers: (state, action) => {
      state.roomInfo.blockedMember = action.payload;
    },
    updateParticipants: (state, action) => {
      console.log("updateParticipants==========================", action);

      state.roomInfo.participants = action.payload;
    },
    removeParticipants: (state, action) => {
      console.log("removeParticipants==========================", state);
      // state.roomInfo.participants.filter(
      //   (user) => !action.payload.includes(user),
      // );
      const updatedParticipants = state.roomInfo.participants.filter(
        (user) => !action.payload.includes(user._id),
      );
      state.roomInfo.participants = updatedParticipants;
      console.log("after removeParticipants==========================", state);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getPageInfo.fulfilled, (state, action) => {
      // getInfo Thunk가 성공적으로 완료되었을 때, 받아온 데이터를 상태에 반영
      state.totalPage = action.payload;
    });

    builder.addCase(getListInfo.fulfilled, (state, action) => {
      // getInfo Thunk가 성공적으로 완료되었을 때, 받아온 데이터를 상태에 반영

      state.chatList = action.payload.data;
      console.log(action.payload.data[0]);
    });

    builder.addCase(getInvoledList.fulfilled, (state, action) => {
      state.involvedList = action.payload.data;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      // console.log("slice messages ", action.payload.data);
      action.payload.data.forEach((message) => {
        if (!state.messages.find((msg) => msg._id === message._id)) {
          state.messages.push(message);
        }
      });
    });
    builder.addCase(fixMemeber.fulfilled, (state, action) => {
      //
      console.log(
        "\n\nafter fixMemeber=======================\n\n ",
        action.payload.data,
      );
      state.roomInfo = action.payload.data;
    });

    builder.addCase(scoreMember.fulfilled, (state, action) => {
      console.log(
        "\n\nupdated chatroom=======================\n\n ",
        action.payload.data,
      );
      state.roomInfo = action.payload.data;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  initRoomInfo,
  addMessage,
  increasePage,
  flushMessage,
  setInvite,
  setEnter,
  setExit,
  setIsPanGestureActive,
  setBlockUsers,
  removeParticipants,
  updateParticipants,
} = chatSlice.actions;

export default chatSlice.reducer;

/**
 * 서버 비동기 처리를 위한 코드
 */
// fetch(`${API_URL}/room/list`,

export const getListInfo = createAsyncThunk("chat/getListInfo", async () => {
  try {
    const response = await fetch(`${API_URL}/room/list`); // 서버의 API 엔드포인트를 입력합니다.
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("======================getListInfo==============\n\n", data);
    return data; // 받아온 데이터를 반환합니다.
  } catch (error) {
    throw error; // 에러가 발생하면 에러를 던집니다.
  }
});

//total page 불러오기
export const getPageInfo = createAsyncThunk(
  "chat/getPageInfo",
  async (info) => {
    try {
      // console.log("accessToken", info);

      const response = await fetch(`${API_URL}/room/pages/${info.room._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${info.token}`,
        },
      }); // 서버의 API 엔드포인트를 입력합니다.
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data", data);
      return data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  },
);

export const getInvoledList = createAsyncThunk(
  "chat/getInvoledList",
  async (accessToken) => {
    try {
      const response = await fetch(`${API_URL}/room/list/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  },
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (args) => {
    // console.log("info---------------", args);
    const { roomId, token, currentPage } = args;
    // console.log("info---------------", args);
    // const state = roomInfo.getState(roomInfo);
    try {
      // console.log("info---------------w---", state.chat.roomInfo._id);
      const response = await fetch(
        `${API_URL}/room/message/${roomId}/${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  },
);

export const fixMemeber = createAsyncThunk("chat/fixMemeber", async (args) => {
  const { roomId, token } = args;
  try {
    const response = await fetch(`${API_URL}/room/member/${roomId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data; // 받아온 데이터를 반환합니다.
  } catch (error) {
    throw error; // 에러가 발생하면 에러를 던집니다.
  }
});

export const scoreMember = createAsyncThunk(
  "chat/scoreMember",
  async (args) => {
    const { roomId, roomName, token, scoreRequestList } = args;
    const bodyObject = JSON.stringify({
      roomName: roomName,
      ScoreList: scoreRequestList,
    });
    try {
      const response = await fetch(`${API_URL}/room/member/score/${roomId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: bodyObject,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      return data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  },
);
