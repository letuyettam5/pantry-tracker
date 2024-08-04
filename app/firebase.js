// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAACvaYjlYY1uRs9TUwwRAsnWlq34TqKCI",
  authDomain: "pantry-tracker-1a64b.firebaseapp.com",
  projectId: "pantry-tracker-1a64b",
  storageBucket: "pantry-tracker-1a64b.appspot.com",
  messagingSenderId: "28300691731",
  appId: "1:28300691731:web:58cc9a2ecde4891fa872e6",
  measurementId: "G-32XBZ0CK26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}