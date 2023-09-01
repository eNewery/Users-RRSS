"use client";
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Importa auth
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
const MiContexto = createContext();
const MiContextoProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [profile, setProfile] = useState(true)

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [usernames, setUsernames] = useState([]);
  useEffect(() => {
    getUserSearchDocByName(search);
  }, [search]);

  async function getUserSearchDocByName(userName) {
    try {
      const usernamesDocRef = doc(db, "users", "usernames");
      const docSnapshot = await getDoc(usernamesDocRef);
      setUsernames(docSnapshot.data());
      const filtered = usernames.usernames.filter((item) =>
      item.includes(userName)
      );
      setResults(filtered);
      if (search === "") {
        setResults([]);
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  async function getUserSearchDoc(userId) {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", `${userId}`)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          if (doc.data().username === userId.toString()) {
            setData(doc.data());
          }
        });
      } else {
        console.log("No se encontraron documentos.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      return null;
    }
  }
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
    <MiContexto.Provider
      value={{
        getUserDoc,
        data,
        clickCount,
        setClickCount,
        getUserSearchDocByName,
        search,
        setSearch,
        results,
        getUserSearchDoc, profile, setProfile
      }}
    >
      {children}
    </MiContexto.Provider>
  );
};
export { MiContexto, MiContextoProvider };
