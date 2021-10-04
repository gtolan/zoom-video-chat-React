// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAlVdcz9NJRsB6v3xBkdB29QNQnB8Lb_8",
  authDomain: "zzoom-chat.firebaseapp.com",
  databaseURL: "https://zzoom-chat-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zzoom-chat",
  storageBucket: "zzoom-chat.appspot.com",
  messagingSenderId: "627841618404",
  appId: "1:627841618404:web:8f8eb7836a48d47cf737f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;


