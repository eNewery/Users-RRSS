import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

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
const auth = getAuth(app); 
  const storage = getStorage(app);

export { db, auth, storage }; // Exporta el objeto auth