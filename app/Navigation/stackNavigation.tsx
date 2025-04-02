import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import Home from "../Screens/Home";
import Calculator from "../Screens/Calculator";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Calculator" component={Calculator} />
      </Stack.Navigator>
    
  );
};

export default StackNavigator;
