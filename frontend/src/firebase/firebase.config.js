// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmzfUAzVeiEd5Z0BPMOTUG-8wBmGrELzQ",
  authDomain: "product-store-mern-app.firebaseapp.com",
  projectId: "product-store-mern-app",
  storageBucket: "product-store-mern-app.firebasestorage.app",
  messagingSenderId: "476181559910",
  appId: "1:476181559910:web:8e0caa602805c170394ba7",
  measurementId: "G-X1HHKC5SVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);













