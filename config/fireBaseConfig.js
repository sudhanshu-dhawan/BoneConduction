import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAqi7MdqNF6bXTej_Yq60AY5Am5eCJGrNk",
  authDomain: "bonetune-dec3f.firebaseapp.com",
  projectId: "bonetune-dec3f",
  storageBucket: "bonetune-dec3f.appspot.com",
  messagingSenderId: "123676630098",
  appId: "1:123676630098:android:e0b685cf8c80fd9b86538b",
  databaseURL: "https://bonetune-dec3f-default-rtdb.firebaseio.com/", // Add this line for Realtime DB
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Initialize Realtime Database

export { auth, db };
