import React, { useContext, useState } from "react";
import { auth, db } from "../firebase"; // Importa auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "firebase/auth";
import {
  setDoc,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { MiContexto } from "./context";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [data, setData] = useState([]);
const context = useContext(MiContexto)
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
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        image: "https://firebasestorage.googleapis.com/v0/b/usertasks-41c2a.appspot.com/o/perfil.png?alt=media&token=206c7c88-a408-469b-ad5c-805531e3d845",
        posts: [],
        friendRequests: [],
        friends: [],
        private:false
      });

      

      setError("¡Usuario registrado correctamente!");
      // Registro exitoso, puedes redirigir al usuario a otra página
    } catch (error) {
      // Captura el error y muestra un mensaje de error personalizado según el tipo de error
      switch (error.code) {
        case "auth/invalid-email":
          // Maneja el error de correo electrónico inválido aquí
          setError("El formato del correo electrónico es incorrecto.");
          break;
        case "auth/user-not-found":
          // Maneja el error de usuario no encontrado aquí
          setError("No se encontró ningún usuario con este correo electrónico.");
          break;
        case "auth/wrong-password":
          // Maneja el error de contraseña incorrecta aquí
          setError("La contraseña es incorrecta.");
          break;
        default:
          // Maneja otros errores aquí
          setError("Ocurrió un error durante la autenticación:", error.message);
      }
    }
  
  };

  return (
    <div className="formContainer">
      <div className="form">

      <h1 className="formTitle">Registrarse</h1>
      <div className="formInputs">
      {error ? error && <p className="formError">{error}</p> : <p></p>}
      <input
        type="text"
        placeholder="Nombre"
        className="formInput"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        /><input
        type="text"
        placeholder="Apellido"
        className="formInput"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        />
      <input
        type="text"
        placeholder="Nombre de usuario"
        className="formInput"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
      <input
        type="email"
        placeholder="Correo electrónico"
        className="formInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
      <input
        type="password"
        placeholder="Contraseña"
        className="formInput"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      </div>
        <div className="formButtons">
      <button className="formBtn" onClick={handleRegister}>Registrarse</button>
      <button className="formIsRegistered" onClick={() => context.setIsRegistered(!context.isRegistered)}>¿Ya tienes una cuenta?</button>
        </div>
        </div>
    </div>
  );
};

export default Register;
