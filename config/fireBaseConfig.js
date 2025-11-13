// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAqi7MdqNF6bXTej_Yq60AY5Am5eCJGrNk",
  authDomain: "bonetune-dec3f.firebaseapp.com",
  projectId: "bonetune-dec3f",
  storageBucket: "bonetune-dec3f.appspot.com",
  messagingSenderId: "123676630098",
  appId: "1:123676630098:android:e0b685cf8c80fd9b86538b",
  databaseURL: "https://bonetune-dec3f-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };