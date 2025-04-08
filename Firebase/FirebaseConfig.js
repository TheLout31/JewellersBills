// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey:"AIzaSyC5WmeIcaDjI0kdxGi9EY7FqenD8EGbAdE",
  authDomain: "jewellersbills.firebaseapp.com",
  projectId: "jewellersbills",
  storageBucket: "jewellersbills.firebasestorage.app",
  messagingSenderId: "937898862936",
  appId: "1:937898862936:web:d3ef1a40ff6b9622f45d2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);