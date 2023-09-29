import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CreateRoom, EnterRoom } from "../screens/room";
import { ChatList, Chat } from "../screens/chat";
import ChatDraw from "./ChatDraw";

const Stack = createStackNavigator();

const Room = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateRoom"
        component={CreateRoom}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EnterRoom"
        component={EnterRoom}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Room;
