import React, { useState } from "react";
import { auth, db } from "../firebase"; // Importa auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "firebase/auth";
import {
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
} from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Una vez registrado el usuario, actualiza el displayName
      // Accede al UID del usuario recién creado
      const uid = userCredential.user.uid;
      updateProfile(auth.currentUser, {
        displayName: username, photoURL: "https://example.com/jane-q-user/profile.jpg"
      })
    
      // Crea una colección con el UID del usuario como nombre
      const userDocRef = doc(db, "users", uid);
      const usernamesDocRef = doc(db, "users", "usernames");
      await updateDoc(usernamesDocRef, {
        ["usernames"]: arrayUnion({username:username, id:uid}),
      });
      await setDoc(userDocRef, {
        id: uid,
        email: email,
        username: username,
        password: password,
        posts: [],
        friendRequests: [],
        friends: []
      });

      console.log("Usuario y colección creados exitosamente.");

      setError("¡Usuario registrado correctamente!");
      // Registro exitoso, puedes redirigir al usuario a otra página
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      {error ? error && <p>{error}</p> : <p>Regístrate</p>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
};

export default Register;
