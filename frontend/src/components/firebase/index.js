import "firebase/firebase-storage";

import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC6ZD80g6soJu5WmXjj6G86bp8ry2qv6A0",
  authDomain: "final-project-uploads-3eb3a.firebaseapp.com",
  projectId: "final-project-uploads-3eb3a",
  storageBucket: "final-project-uploads-3eb3a.appspot.com",
  messagingSenderId: "873866421826",
  appId: "1:873866421826:web:f80b35561e4fc0d7802fdb",
  measurementId: "G-SG7CDQX6C3"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default storage;
