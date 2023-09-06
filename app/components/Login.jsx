import React, { useContext, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { MiContexto } from "./context";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const context = useContext(MiContexto)
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password); // Usa auth para createUserWithEmailAndPassword
      setError("Sesión iniciada correctamente!");
      setTimeout(() => {
        router.push("/Dashboard");
      }, 1000);
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
  const title = "Hola"
  return (
    <div className="formContainer">
     
      <div className="form">
      <h1 className="formTitle">Iniciar Sesión</h1>
      <div className="formInputs">
      {error ? error && <p className="formError">{error}</p> : <p></p>}
      <input
      className="formInput"
      type="email"
      placeholder="Correo electrónico"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />
      <input
      className="formInput"
      type="password"
      placeholder="Contraseña"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <div className="formButtons">
      <button onClick={handleLogin} className="formBtn">Iniciar sesión</button>
      <button className="formIsRegistered" onClick={() => context.setIsRegistered(!context.isRegistered)}>¿No tienes una cuenta?</button>
      </div>

      </div>
    </div>
  );
};

export default Login;
