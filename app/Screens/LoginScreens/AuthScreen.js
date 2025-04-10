import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import {
  Provider as PaperProvider,
  TextInput,
  Button,
  Title,
  DefaultTheme,
} from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
// import { auth } from "../../../Firebase/FirebaseConfig";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8a2be2", // custom theme color
  },
};

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();

  const handleAuth = async() => {
    if (isSignUp) {
      // Sign up logic
     await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          setIsSignUp(true);
          
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
          // ..
        });
      console.log("Signing up with:", email, password);
    } else {
      // Sign in logic
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigation.navigate("Home")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        });
        
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Title style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button mode="contained" onPress={handleAuth} style={styles.button}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 32,
    color: "#8a2be2",
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  toggleText: {
    marginTop: 20,
    textAlign: "center",
    color: "#8a2be2",
  },
});

export default AuthScreen;
