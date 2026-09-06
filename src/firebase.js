// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMz3Fpn3n3sKJZcffayfFZaRoylnShrvg",
  authDomain: "optimum-a2d13.firebaseapp.com",
  databaseURL: "https://optimum-a2d13-default-rtdb.firebaseio.com",
  projectId: "optimum-a2d13",
  storageBucket: "optimum-a2d13.firebasestorage.app",
  messagingSenderId: "643472535143",
  appId: "1:643472535143:web:39dc10c94077f31d9feec2",
  measurementId: "G-LDL224CG11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
