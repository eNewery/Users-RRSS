"use client";
import React, { useContext, useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, query, collection, getDocs, where } from "firebase/firestore";
import UserDetails from "../components/userDetails";
import { db } from "../firebase";
import { auth } from "../firebase";
import { MiContexto } from "../components/context";
import { useRouter } from "next/navigation";
const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const context = useContext(MiContexto);
  useEffect(() => {
    if (user.uid) {
      context.getUserDoc(user.uid);
    }
  }, [user, context.clickCount]);

  useEffect(() => {
    if (context.data.id === user.uid) {
      context.setProfile(true);
    } else {
      context.setProfile(false);
    }
  }, [context.data]);

  useEffect(() => {
    // Suscríbete al estado de autenticación para obtener los cambios en el usuario
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Establece el estado con el usuario actual
        console.log(user);
      } else {
        router.push("/");
      }
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);
  async function deletePost(postIdABorrar) {
    const newArray = context.data.posts.filter(
      (post) => post.postId !== postIdABorrar
    );
    const docRef = doc(db, "users", user.uid.toString());
    await updateDoc(docRef, {
      posts: newArray,
    });
    context.setClickCount((prevCount) => prevCount + 1);
  }
  async function handleSubmit() {
    try {
      const fechaActual = new Date();
      const id = Date.now();
      const añoActual = fechaActual.getFullYear();
      const mesActual = fechaActual.getMonth() + 1;
      const diaActual = fechaActual.getDate();
      const horaActual = fechaActual.getHours();
      const minutosActuales = fechaActual.getMinutes();
      const day = `${diaActual}/${mesActual}/${añoActual}`;
      const hour = `${horaActual}:${minutosActuales}`;
      const newPost = {
        title: title,
        description: description,
        day: day,
        hour: hour,
        postId: id,
      };
      const docRef = doc(db, "users", user.uid.toString());
      await updateDoc(docRef, {
        ["posts"]: arrayUnion(newPost),
      });
      context.setClickCount((prevCount) => prevCount + 1);
      console.log("Campo actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  }
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Cierre de sesión exitoso, puedes redirigir al usuario a otra página o realizar otras acciones
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  async function addFriend() {
    const docRef = doc(db, "users", context.data.id.toString());
    await updateDoc(docRef, {
      ["friendRequests"]: arrayUnion({userData:user.displayName, userId:user.uid}),
    });
  }
  async function declineFriend(friend) {
    const docRef = doc(db, "users", context.data.id.toString());
    await updateDoc(docRef, {
      ["friendRequests"]: arrayRemove(friend),
    });
    context.setClickCount((prevCount) => prevCount + 1);
  }
  async function acceptFriend(friend, id) {
    const docReference = doc(db, "users", id.toString());
    const filtered = context.data.friendRequests.filter(item => item.userData !== friend)
    await updateDoc(docReference, {
      ["friends"]: arrayUnion({username:user.displayName, id:user.uid}),
    });
    const docRef = doc(db, "users", user.uid.toString());
    await updateDoc(docRef, {
      ["friendRequests"]: filtered,
      ["friends"]: arrayUnion({username:friend, id:id}),
    });
    context.setClickCount((prevCount) => prevCount + 1);
  }
 
  
  return (
    <div>
      {user.displayName !== context.data.username ? <button onClick={() => context.getUserSearchDoc(user.displayName)}>Mi Perfil</button> : <p>Perfil de {context.data.username}</p>}
      
      <div>
        <p>{context.data.username}</p>
        <p>{context.data.email}</p>
        <p>{context.data.password}</p>
      </div>

      <button onClick={handleLogout}>Cerrar Sesión</button>
      {context.profile === true ? (
        <div>
          <div><p>Solicitudes de amistad ({context.data.friendRequests?.length})</p>{context.data.friendRequests?.map(item => (<p>{item.userData}</p>))} {context.data.friendRequests?.map(item => (<button onClick={() => acceptFriend(item.userData, item.userId)}>Aceptar</button>))}</div>
         <div><p>Amigos: {context.data.friends?.length}</p> <div>{context.data.friends?.map(item => (<p onClick={() => context.getUserSearchDoc(item.username)}>{item.username}</p>))}</div></div>
          <input
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSubmit}>Subir Post</button>
        </div>
      ) : (
        <div>
         {context.data.friends.map(item => item.username.includes(user.displayName)) ? <p>Ya son amigos!</p> : <button onClick={() => addFriend()}>Añadir Amigo</button>} 
        </div>
      )}
      {context.data.posts?.map((item) => (
        <div>
          Title:{item.title} Description:{item.description}{" "}
          <button onClick={() => deletePost(item.postId)}>Eliminar Post</button>
        </div>
      ))}
      <form>
        <input
          type="search"
          onChange={(e) => context.setSearch(e.target.value)}
          placeholder="Nombre de usuario"
        />
        <button type="submit">Buscar</button>
      </form>
      {context.results.map((item) => (
        <div key={item.id} onClick={() => context.getUserSearchDoc(item.username)}>
          <p>{item.username}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
