import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import Home from "../Screens/Home";
import Calculator from "../Screens/Calculator";
import AddDetails from "../Screens/AddDetails";
import AuthScreen from "../Screens/LoginScreens/AuthScreen";
import MyOrders from "../Screens/MyOrders";
import LiveGoldPrices from "../Screens/LiveGoldPrices"
import { auth } from "../../Firebase/FirebaseConfig";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import {
  IconButton,
  Dialog,
  Portal,
  Text,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";

const Stack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
  // const user = auth.currentUser;

  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const [signOutcheck, setsignOutcheck] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      hideDialog();
      // setsignOutcheck(true)
      // navigation.navigate("auth")
      // close dialog after signout
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  const checkPersistance = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User Details =====> ", user);
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    checkPersistance();
  }, [signOutcheck]);

  // if (initializing) return <SplashScreen />;
  return (
    <PaperProvider>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerRight: () => (
                  <IconButton
                    icon="exit-run"
                    size={20}
                    iconColor="white"
                    onPress={showDialog}
                  />
                ),
                title: "Home", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />
            <Stack.Screen
              name="Calculator"
              component={Calculator}
              options={{
                title: "Calculator", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />
            <Stack.Screen
              name="Details"
              component={AddDetails}
              options={{
                title: "Add Details", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />

            <Stack.Screen
              name="Orders"
              component={MyOrders}
              options={{
                title: "My Orders", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />

            <Stack.Screen
              name="LiveRate"
              component={LiveGoldPrices}
              options={{
                title: "LiveRate", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{
                title: "Auth", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: "Home", // Optional: Set the header title
                headerStyle: {
                  backgroundColor: "#8a2be2", // Set the header background color
                },
                headerTintColor: "#fff", // Optional: Set the color of the title and back button
                headerTitleStyle: {
                  fontWeight: "500", // Optional: Style the header title
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
      {/* 🔒 Sign Out Confirmation Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirm Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleSignOut}>Sign Out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

export default StackNavigator;
