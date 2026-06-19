// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For the Database
import { getStorage } from "firebase/storage";     // For Image Uploads
import { getAuth } from "firebase/auth";           // For Admin Login

// REPLACE THIS OBJECT WITH YOUR ACTUAL KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyARaphVV0Xq29cQP1oCGqzzw4CBP4oeIdQ",
  authDomain: "ecosort-platform-kanemwaste.firebaseapp.com",
  projectId: "ecosort-platform-kanemwaste",
  storageBucket: "ecosort-platform-kanemwaste.firebasestorage.app",
  messagingSenderId: "457152923190",
  appId: "1:457152923190:web:3a74d94c857bde84e93a97"
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the services so we can use them in other files
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);