// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5WmeIcaDjI0kdxGi9EY7FqenD8EGbAdE",
  authDomain: "jewellersbills.firebaseapp.com",
  projectId: "jewellersbills",
  storageBucket: "jewellersbills.firebasestorage.app",
  messagingSenderId: "937898862936",
  appId: "1:937898862936:web:d3ef1a40ff6b9622f45d2d",
};

// Initialize Firebase
let app;
let auth;
let database;

if (!app) {
  app = initializeApp(firebaseConfig);
}

// Initialize Auth only once
if (!auth) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  database = getFirestore(app);
}

export { app, auth,database };
// const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// export {auth ,app}
