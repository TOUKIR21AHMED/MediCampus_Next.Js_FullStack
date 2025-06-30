// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  getDocs
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzJOKEiOXLBBLHjQ1UQ0e-Nfo6VAdnSzs",
  authDomain: "chatapp-12268.firebaseapp.com",
  projectId: "chatapp-12268",
  storageBucket: "chatapp-12268.appspot.com",
  messagingSenderId: "656806131837",
  appId: "1:656806131837:web:2e6b4e5afd9c3398b4d914",
  measurementId: "G-2Q0VEDKZS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these individually
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, getDocs };