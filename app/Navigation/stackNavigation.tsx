import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import Home from "../Screens/Home";
import Calculator from "../Screens/Calculator";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home", // Optional: Set the header title
          headerStyle: {
            backgroundColor: "#6F5AAA", // Set the header background color
          },
          headerTintColor: "#fff", // Optional: Set the color of the title and back button
          headerTitleStyle: {
            fontWeight: "500",// Optional: Style the header title
          },
        }}
      />
      <Stack.Screen name="Calculator" component={Calculator} 
      options={{
        title: "Calculator", // Optional: Set the header title
        headerStyle: {
          backgroundColor: "#6F5AAA", // Set the header background color
        },
        headerTintColor: "#fff", // Optional: Set the color of the title and back button
        headerTitleStyle: {
          fontWeight: "500", // Optional: Style the header title
        },
      }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
