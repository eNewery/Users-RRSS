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
  updateDoc,
  arrayUnion
} from "firebase/firestore";
const MiContexto = createContext();
const MiContextoProvider = ({ children }) => {
  const [modalData, setModalData] = useState([]);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [dashboardContent, setDashboardContent] = useState("personalPage")
  const [clickCount, setClickCount] = useState(0);
  const [profile, setProfile] = useState(true);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [modalSettings, setModalSettings] = useState(false);
  const [friendsDataState, setFriendsDataState] = useState([]);
  const [isRegistered, setIsRegistered] = useState(true);
  const [user, setUser] = useState([])
  const [userData ,setUserData] = useState([])
  const [posts, setPosts] = useState([])
  const postPush = [];
 
  useEffect(() => {
    getUserSearchDocByName(search);
  }, [search]);
  useEffect(() => {
    userData.friends?.map(item => getFriendsPosts(item.id))
  }, [userData.length, userData.id, userData.friends])
  useEffect(() => {
    // Suscríbete al estado de autenticación para obtener los cambios en el usuario
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
      }
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);
 
  function compararPorFechaYHora(postA, postB) {
    const fechaA = new Date(postA.day + ' ' + postA.hour);
    const fechaB = new Date(postB.day + ' ' + postB.hour);
  
    return fechaA - fechaB;
  }
  useEffect(() => {
  friendsDataState.map(item => postPush.push(item.posts))
  const objetosCombinados = postPush.reduce((resultado, arreglo) => resultado.concat(arreglo), []);

  objetosCombinados.sort(compararPorFechaYHora)

  setPosts(objetosCombinados)  
  
}, [friendsDataState])

  async function getUserSearchDocByName(userName) {
    try {
      const usernamesDocRef = doc(db, "users", "usernames");
      const docSnapshot = await getDoc(usernamesDocRef);
      setUsernames(docSnapshot.data());
      const filtered = usernames.usernames?.filter((item) =>
        item.username.includes(userName)
      );
      setResults(filtered);
      if (search === "") {
        setResults([]);
      }
    } catch (err) {
    }
  }
    async function getYourUserData(userId){
        const usernamesDocRef = doc(db, "users", userId.toString());
        const docSnapshot = await getDoc(usernamesDocRef);
        setUserData(docSnapshot.data())
  }

  
  const friendsData = [];
  async function getFriendsPosts(userId) {
    try {
      const usernamesDocRef = doc(db, "users", userId.toString());
      const docSnapshot = await getDoc(usernamesDocRef);
      friendsData.push(docSnapshot.data());
      setFriendsDataState(friendsData);
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      return null;
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
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      return null;
    }
  }
  async function handleSubmit() {
    try {
      const fechaActual = new Date();
      const id = Date.now();
      const añoActual = fechaActual.getFullYear();
      const mesActual = fechaActual.getMonth() + 1;
      const diaActual = fechaActual.getDate();
      const horaActual = fechaActual.getHours();
      let minutosActuales = fechaActual.getMinutes();
      if (minutosActuales >= 0 && minutosActuales <= 9) {
        minutosActuales = "0" + minutosActuales;
      }

      const day = `${diaActual}/${mesActual}/${añoActual}`;
      const hour = `${horaActual}:${minutosActuales}`;
      const newPost = {
        text: title,
        day: day,
        hour: hour,
        postId: id,
        user:data.username,
        userId:user.uid,
        image:data.image,
        postPrivacity:false
      };
      const docRef = doc(db, "users", user.uid.toString());
      await updateDoc(docRef, {
        ["posts"]: arrayUnion(newPost),
      });
      
      setClickCount((prevCount) => prevCount + 1);
    } catch (error) {
    }
  }
  async function getUserDoc(idDocumento) {
    try {
      const docRef = doc(db, "users", idDocumento.toString());
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setData(docSnapshot.data());
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  useEffect(() => {
    for (let i = 0; i < 1; i++) {
      getUserDoc(user.uid)       
    }   
  }, [user])
  useEffect(() => {
getUserDoc(data.id)
  }, [clickCount])
  
  
  async function getUserModalDoc(idDocumento) {
    try {
      const docRef = doc(db, "users", idDocumento.toString());
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setModalData(docSnapshot.data());
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  const colors = [{colorName:"blue", colorId:1}, {colorName:"red", colorId:2}, {colorName:"green", colorId:3}, {colorName:"yellow", colorId:4}, {colorName:"purple", colorId:5}, {colorName:"orange", colorId:6}, {colorName:"pink", colorId:7}, {colorName:"black", colorId:8}, {colorName:"brown", colorId:9}, {colorName:"grey", colorId:10}]
  return (
    
    <MiContexto.Provider
      value={{
        colors,
        getUserDoc,
        data,
        clickCount,
        setClickCount,
        getUserSearchDocByName,
        search,
        setSearch,
        results,
        getUserSearchDoc,
        profile,
        setProfile,
        usernames,
        getFriendsPosts,
        setFriendsDataState,
        friendsDataState,
        isRegistered, 
        setIsRegistered,
        dashboardContent,
         setDashboardContent,
         user, setUser, userData, setUserData, getYourUserData, handleSubmit, posts, title, setTitle, modalSettings, setModalSettings, getUserModalDoc, modalData, setModalData }}
    >
      {children}
    </MiContexto.Provider>
  );
};
export { MiContexto, MiContextoProvider };
