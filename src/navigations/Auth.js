import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, Signup } from "../screens/auth/index";

const Stack = createStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

export default Auth;
