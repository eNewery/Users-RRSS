// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword  } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc_2WWABsBFTyCMHPs2ijNLbcnpBPSgCc",
  authDomain: "usertasks-41c2a.firebaseapp.com",
  projectId: "usertasks-41c2a",
  storageBucket: "usertasks-41c2a.appspot.com",
  messagingSenderId: "599188741944",
  appId: "1:599188741944:web:b7f80f1ae999129c4babcd",
  measurementId: "G-JZ2F5WMV3X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Obtén la instancia de autenticación

export { db, auth }; // Exporta el objeto auth