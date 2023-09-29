import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MainGet,
  Write,
  Detail,
  EditBoard,
  SearchBoard,
} from "../screens/board/index";
import { UserProfile } from "../screens/common/index";
const Stack = createStackNavigator();

const BoardList = () => {
  return (
    <Stack.Navigator initialRouteName="MainGet">
      <Stack.Screen
        name="MainGet"
        component={MainGet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Write"
        component={Write}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ headerShown: false }}
        initialParams={{ postId: null }}
      />

      <Stack.Screen
        name="EditBoard"
        component={EditBoard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchBoard"
        component={SearchBoard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BoardList;
