import { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Importa el objeto auth de tu archivo firebase.js
import { useRouter } from 'next/navigation';

export default function UserDetails() {
  const [user, setUser] = useState(null);
const router = useRouter()
  useEffect(() => {
    // Suscríbete al estado de autenticación para obtener los cambios en el usuario
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Establece el estado con el usuario actual
        console.log(user)
      } else {
    router.push("/")
      }
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

 
  return (
    <div>
      <h1>Perfil del Usuario</h1>
      {user ? (
        <>
          <p>UID: {user.uid}</p>
          <p>Correo electrónico: {user.email}</p>
          {/* Puedes mostrar otros datos del usuario según tus necesidades */}
        </>
      ) : (
        ``
      )}
    </div>
  );
}
