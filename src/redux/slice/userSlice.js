import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const initialState = {
  profile: {
    userName: "",
    nickname: "",
    major: "",
    email: "",
    birthday: "",
    gender: "",
    phoneNumber: "",
    score: 0,
    image: "",
  },
  security: {
    accessToken: "",
    refreshToken: "",
  },
  userId: "",
};

// 자동로그인 구현시 사용 예정
export const saveUserIdAndPasswordAsyncStorage = createAsyncThunk(
  "user/saveUserIdAndPasswordAsyncStorage",
  async ({ userId, password }, thunkAPI) => {
    try {
      if (userId) {
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("password", password);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
const convertState = ({ data }) => {
  const state = {
    nickname: data.nickname, // 다름
    userName: data.userName,
    major: data.major,
    email: data.email, // 다름
    birthday: data.birthday,
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    score: data.score,
    image: data.image,
  };
  return state;
};
const convertState2 = (data) => {
  const state = {
    nickname: data.userInput.nickname, // 다름
    userName: data.userInput.userName,
    major: data.userInput.major,
    email: data.userInput.email, // 다름
    birthday: data.userInput.birthday,
    gender: data.userInput.gender,
    phoneNumber: data.userInput.phoneNumber,
    score: data.userInput.score,
  };
  return state;
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.profile.image = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => {
      state.security.accessToken = action.payload.accessToken;
      state.security.refreshToken = action.payload.refreshToken;
    });

    builder.addCase(registerImage.fulfilled, (state, action) => {});
    builder.addCase(login.fulfilled, (state, action) => {
      const { data } = action.payload.data;

      state.profile = convertState(action.payload.data);
      state.userId = action.payload.userId;
      state.security.accessToken = data.accessToken;
      state.security.refreshToken = data.refreshToken;
    });

    builder.addCase(saveEditMypage.fulfilled, (state, action) => {
      state.profile = convertState2(action.payload);
    });
    builder.addCase(saveEditMypageImage.fulfilled, (state, action) => {});

    builder.addCase(logout.fulfilled, (state, action) => {
      state.userId = "";
      state.profile.nickname = "";
      state.profile.userName = "";
      state.profile.major = "";
      state.profile.email = "";
      state.profile.birthday = "";
      state.profile.gender = "";
      state.profile.phoneNumber = "";
      state.profile.score = 0;
      state.profile.image = "";
      state.security.accessToken = "";
      state.security.refreshToken = "";
    });

    builder.addCase(
      saveUserIdAndPasswordAsyncStorage.fulfilled,
      (state, action) => {
        // 자동로그인 구현
      },
    );
  },
});

export const register = createAsyncThunk(
  "user/register",
  async ({ registerInput }) => {
    try {
      const { userInput } = registerInput;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
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

export const registerImage = createAsyncThunk(
  "user/registerImage",
  async ({ registerImageInput }) => {
    try {
      const { formData, accessToken } = registerImageInput;

      const response = await fetch(`${API_URL}/auth/register/profile`, {
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
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const login = createAsyncThunk("user/login", async ({ userInput }) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json(); // 서버 응답을 JSON으로 파싱
    return { data, userId: userInput.userId }; // 받아온 데이터를 반환합니다.
  } catch (error) {
    throw error; // 에러가 발생하면 에러를 던집니다.
  }
});

export const saveEditMypage = createAsyncThunk(
  "user/saveEditMypage",
  async ({ saveEditMypageInput }) => {
    try {
      console.log("=======saveEditMypageInput========start");
      console.log(saveEditMypageInput);
      console.log("=======saveEditMypageInput========end");
      const { userId, accessToken, userInput } = saveEditMypageInput;
      const response = await fetch(`${API_URL}/user/info/update/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return { userInput };
    } catch (error) {
      throw error;
    }
  },
);

export const saveEditMypageImage = createAsyncThunk(
  "user/saveEditMypageImage",
  async ({ saveEditMypageImageInput }) => {
    try {
      console.log("===========saveEditMypageImageInput========start");
      console.log(saveEditMypageImageInput);
      console.log("===========saveEditMypageImageInput========end");
      const { accessToken, userId, formData } = saveEditMypageImageInput;
      const response = await fetch(`${API_URL}/user/profileImage/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // 서버 응답을 JSON으로 파싱

      return { data }; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error;
    }
  },
);

export const logout = createAsyncThunk(
  "user/logout",
  async ({ logoutInput }) => {
    try {
      const response = await fetch(
        `${API_URL}/user/logout/${logoutInput.userId}`,
        // `http://172.20.10.7:8020/user/logout/${logoutInput.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${logoutInput.accessToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return data; // 받아온 데이터를 반환합니다.
    } catch (error) {
      throw error; // 에러가 발생하면 에러를 던집니다.
    }
  },
);

// export const getOpponentProfile = createAsyncThunk(
//   "user/getOpponentProfile",
//   async ({ getOpponentProfileInput }) => {
//     try {
//       const { opponentProfile, accessToken } = getOpponentProfileInput;
//       const response = await fetch(
//         `${API_URL}/user/profile/${opponentProfile}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         },
//       );
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return data; // 받아온 데이터를 반환합니다.
//     } catch (error) {
//       throw error; // 에러가 발생하면 에러를 던집니다.
//     }
//   },
// );

export const { addImage } = userSlice.actions;

export default userSlice.reducer;
