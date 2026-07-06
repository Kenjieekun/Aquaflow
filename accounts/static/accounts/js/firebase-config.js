// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Replace with YOUR Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDH2Z1fGAhKFbgbB7DEteAIQt2xCnsftTM",
    authDomain: "water-refilling-station-dbb61.firebaseapp.com",
    projectId: "water-refilling-station-dbb61",
    storageBucket: "water-refilling-station-dbb61.firebasestorage.app",
    messagingSenderId: "590302733142",
    appId: "1:590302733142:web:0231b162ca164412886cf7",
    measurementId: "G-PM4YESWFJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;