import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slice/chatSlice";
import userReducer from "./slice/userSlice";
import boardReducer from "./slice/BoardSlice";

const store = configureStore({
  reducer: {
    // counter: counterSlice.reducer,
    chat: chatReducer,
    user: userReducer,
    board: boardReducer,
  },
});

export default store;

/**
src 
├── redux
     ├── store.js
     ├── slices
           └── exampleSlice.js
 */
