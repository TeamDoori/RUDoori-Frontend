import React, { useState, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "styled-components/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Main, ChatList } from "../screens/main";

import BoardList from "./BoardList";
import Profile from "./Profile";
import Room from "./Room";

const Tab = createBottomTabNavigator(); //Tab 네비 생성

const Home = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBarOptions={{
        activeTintColor: theme.selectedIconColor,
        inactiveTintColor: theme.unselectedIconColor,
      }}
    >
      <Tab.Screen
        name="메인"
        component={Main}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="채팅"
        component={Room}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat-bubble" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="게시판"
        component={BoardList}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="내정보"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
