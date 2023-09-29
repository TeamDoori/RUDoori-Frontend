import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  token: "",
};

export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = exampleSlice.actions;

export default exampleSlice.reducer;

/**
 * // src/features/dataSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@env'; // API_URL은 .env 파일에서 가져온 서버 API 주소입니다.

// 비동기 처리를 위한 Thunk 함수를 생성합니다.
export const fetchData = createAsyncThunk('data/fetchData', async () => {
  try {
    const response = await fetch(`${API_URL}/data`); // 서버의 API 엔드포인트를 입력합니다.
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; // 받아온 데이터를 반환합니다.
  } catch (error) {
    throw error; // 에러가 발생하면 에러를 던집니다.
  }
});

// Slice를 생성합니다.
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchData가 성공적으로 완료될 경우
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload; // 받아온 데이터를 상태에 저장합니다.
      state.loading = false; // 로딩 상태를 false로 변경합니다.
      state.error = null; // 에러를 초기화합니다.
    });

    // fetchData가 실패할 경우
    builder.addCase(fetchData.rejected, (state, action) => {
      state.loading = false; // 로딩 상태를 false로 변경합니다.
      state.error = action.error.message; // 에러 메시지를 상태에 저장합니다.
    });

    // fetchData가 실행 중일 경우
    builder.addCase(fetchData.pending, (state) => {
      state.loading = true; // 로딩 상태를 true로 변경합니다.
    });
  },
});

export default dataSlice.reducer;

 */
