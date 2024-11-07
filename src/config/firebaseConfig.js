// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7g99PRL9zR8k-SnEbl8bRjV88IBrCVWc",
  authDomain: "pawfunupload.firebaseapp.com",
  projectId: "pawfunupload",
  storageBucket: "pawfunupload.firebasestorage.app",
  messagingSenderId: "253460420380",
  appId: "1:253460420380:web:831267d79e54ba19120cd9",
  measurementId: "G-P14ZX58W71",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
