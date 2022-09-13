import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGg7BWNuTfJVPAABLkfljAVRYEgb3HxAo",
  authDomain: "solo-nails-note.firebaseapp.com",
  projectId: "solo-nails-note",
  storageBucket: "solo-nails-note.appspot.com",
  messagingSenderId: "1090259997544",
  appId: "1:1090259997544:web:3114f03f0353067e09fcdd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);