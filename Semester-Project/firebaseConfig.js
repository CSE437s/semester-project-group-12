// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { app, db, auth};