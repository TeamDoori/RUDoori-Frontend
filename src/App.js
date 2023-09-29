import React, { useState, useEffect, useContext } from "react";
import "react-native-gesture-handler";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { StatusBar, SafeAreaView } from "react-native";
import Navigation from "./navigations";
import { UserProvider } from "./contexts";
import store from "./redux/store";
import { Provider } from "react-redux";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* // 기존에 사용한 useSafeAreaInsets는 화면 회전시 성능이 저하된다고 하여 더
      안전한 것으로 대체함 */}
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: theme.background,
          }}
        >
          <UserProvider>
            <StatusBar
              backgroundColor={theme.background}
              barStyle="dark-content"
            />
            <Navigation />
          </UserProvider>
        </SafeAreaView>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
