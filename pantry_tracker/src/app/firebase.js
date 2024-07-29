// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCmvPMKjxPiibYeuiVAiTIyrPn3wBtDrgE",
    authDomain: "pantry-tracker-eb1f8.firebaseapp.com",
    projectId: "pantry-tracker-eb1f8",
    storageBucket: "pantry-tracker-eb1f8.appspot.com",
    messagingSenderId: "205721109561",
    appId: "1:205721109561:web:53158ccf48bae01795f9e8",
    measurementId: "G-L48GGLPPJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };