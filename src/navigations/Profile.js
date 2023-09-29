import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Mypage,
  Myscore,
  EditMypage,
  Myscrap,
  MyboardDetail,
  EditMyboardDetail,
  Myboard,
} from "../screens/Profile/index";

const Stack = createStackNavigator();

const Profile = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mypage" component={Mypage} />
      <Stack.Screen name="Myscore" component={Myscore} />
      <Stack.Screen name="EditMypage" component={EditMypage} />
      <Stack.Screen name="Myboard" component={Myboard} />
      <Stack.Screen name="Myscrap" component={Myscrap} />
      <Stack.Screen name="MyboardDetail" component={MyboardDetail} />
      <Stack.Screen name="EditMyboardDetail" component={EditMyboardDetail} />
    </Stack.Navigator>
  );
};

export default Profile;
