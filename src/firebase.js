// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH5_J8rXJlZbLDXzILuaSqYbVldOHPYYA",
  authDomain: "mern-estate-c49c8.firebaseapp.com",
  projectId: "mern-estate-c49c8",
  storageBucket: "mern-estate-c49c8.appspot.com",
  messagingSenderId: "261930922065",
  appId: "1:261930922065:web:a563e6db6e9271dadac870"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const provider = new GoogleAuthProvider()
const auth = getAuth()
 
export {app,provider,auth}
