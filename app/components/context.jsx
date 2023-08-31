"use client"
import React, { createContext, useState } from 'react';
import { auth, db } from '../firebase'; // Importa auth
import { getDoc, doc } from 'firebase/firestore';

const MiContexto = createContext();
const MiContextoProvider = ({ children }) => {
const [data, setData] = useState([])
const [clickCount, setClickCount] = useState(0)
  async function getUserDoc(idDocumento) {
    try {
      const docRef = doc(db, "users", idDocumento.toString());
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
         setData(docSnapshot.data());
      } else {
        console.log("El documento no existe.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      return null;
    }
  }
      
    return (
      <MiContexto.Provider value={{getUserDoc, data, clickCount, setClickCount}}>
        {children}
      </MiContexto.Provider>
    );
  };
  export { MiContexto, MiContextoProvider };