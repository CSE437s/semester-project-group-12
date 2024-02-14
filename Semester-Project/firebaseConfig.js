// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKv425wCwtyWhmEXq1kUzQwRfdliulAQc",
  authDomain: "safecities-773a7.firebaseapp.com",
  projectId: "safecities-773a7",
  storageBucket: "safecities-773a7.appspot.com",
  messagingSenderId: "558662647206",
  appId: "1:558662647206:web:12abdfe26185fcd2c0e367",
  measurementId: "G-JXT30DNE87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth  = getAuth(app)
