import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA5BjOCyxaZu2S_zE8MHlQ7uY-LUScj_DY",
  authDomain: "smart-waste-6f496.firebaseapp.com",
  projectId: "smart-waste-6f496",
  storageBucket: "smart-waste-6f496.appspot.com",
  messagingSenderId: "1032147834195",
  appId: "1:1032147834195:web:f278273336ba80fd9cbda6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
