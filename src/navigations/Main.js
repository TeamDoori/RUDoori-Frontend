import React, { useState, useContext, useRef } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import { CreateRoom, EnterRoom, RoomSelect, Result } from "../screens/room";
import { ChatList, Chat, EndPage } from "../screens/chat";
import ChatDraw from "./ChatDraw";

const Stack = createStackNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: theme.text,
        headerBackTitleVisible: false,
        cardStyle: { backgroundColor: theme.background },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="EnterRoom" component={EnterRoom} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateRoom"
        component={CreateRoom}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomSelect"
        component={RoomSelect}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Result"
        component={Result}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EndPage"
        component={EndPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Main;
