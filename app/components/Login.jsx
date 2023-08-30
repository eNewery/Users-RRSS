import React, { useState } from 'react';
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  const router = useRouter();
    const handleLogin = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password); // Usa auth para createUserWithEmailAndPassword
          setError("Sesión iniciada correctamente!")
          setTimeout(() => {
            router.push("/Dashboard")
          }, 1000);
          // Registro exitoso, puedes redirigir al usuario a otra página
        } catch (err) {
          setError(err.message);
        }
      };
  return (
    <div>
    <h1>Login</h1>
    {error ? error && <p>{error}</p> : <p>Inicia Sesión</p>}
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
    <button onClick={handleLogin}>Login</button>
  </div>
  )
}

export default Login