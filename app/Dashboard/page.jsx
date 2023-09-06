"use client";
import React, { useContext, useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { MiContexto } from "../components/context";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";  
const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFriend, setIsFriend] = useState(false)
  const [addFriendBtn, setAddFriendBtn] = useState(false)
  const [file, setFile] = useState(null);
  const [friends, setFriends] = useState(false)
  const [friendsCount, setFriendsCount] = useState("")
  const [friendsIcon, setFriendsIcon] = useState("")
  useEffect(() => {
friends == false ? setFriendsCount(context.data.friendRequests?.length) : setFriendsCount(context.data.friends?.length)
friends == false ? setFriendsIcon("group_add") : setFriendsIcon("group")

  }, [friends])
  
  const router = useRouter();
  const context = useContext(MiContexto);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    handleUpload()
  }, [file])
  const handleUpload = async () => {
    if (!file) return;
  
    try {
      // Subir la foto a Firebase Storage
      const fileName = file.name;
      const storageReference = ref(storage, `images/${fileName}`); 
  
      // Utilizamos 'put' en lugar de 'uploadBytes'
      const snapshot = await uploadBytes(storageReference, file);
  
      // Obtener el enlace de descarga
      const downloadURL = await getDownloadURL(snapshot.ref); 
  
      const docRef = doc(db, "users", user.uid.toString());
      await updateDoc(docRef, {
        image: downloadURL,
      });
  
      // Limpiar el archivo seleccionado después de la carga exitosa
      setFile(null);
    context.setClickCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error al cargar la foto:", error);
    }
  };
  
  
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
      let minutosActuales = fechaActual.getMinutes();
      if (minutosActuales >= 1 && minutosActuales <= 9) {
        minutosActuales = "0" + minutosActuales;
      }
      
      const day = `${diaActual}/${mesActual}/${añoActual}`;
      const hour = `${horaActual}:${minutosActuales}`;
      const newPost = {
        text: title,
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

  async function addFriend() {
    const docRef = doc(db, "users", context.data.id.toString());
    await updateDoc(docRef, {
      ["friendRequests"]: arrayUnion({
        userData: user.displayName,
        userId: user.uid,
      }),
    });
  }
  async function declineFriend(friend) {
    const docRef = doc(db, "users", context.data.id.toString());
    const filtered = context.data.friendRequests.filter(item => item.userData !== friend)
    await updateDoc(docRef, {
      ["friendRequests"]: filtered,
    });
    context.setClickCount((prevCount) => prevCount + 1);
    console.log(friend)
  }
  async function acceptFriend(friend, id) {
    const docReference = doc(db, "users", id.toString());
    const filtered = context.data.friendRequests.filter(
      (item) => item.userData !== friend
    );
    await updateDoc(docReference, {
      ["friends"]: arrayUnion({ username: user.displayName, id: user.uid }),
    });
    const docRef = doc(db, "users", user.uid.toString());
    await updateDoc(docRef, {
      ["friendRequests"]: filtered,
      ["friends"]: arrayUnion({ username: friend, id: id }),
    });
    context.setClickCount((prevCount) => prevCount + 1);
  }
  function buscarAmigoPorNombreDeUsuario() {
    const amigoEncontrado = context.data.friends?.find(item => item.username === user.displayName);
  
    if (amigoEncontrado) {
      setIsFriend(false);
    } else {
      setIsFriend(true);
    }
  }
  useEffect(() => {
    buscarAmigoPorNombreDeUsuario()
  }, [context.data])
  
  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <Header />
      {user.displayName !== context.data.username ? (
        <div className="backProfileContainer"><span className="backProfile material-symbols-outlined" onClick={() => context.getUserSearchDoc(user.displayName)}>
          account_circle
        </span></div>
      ) : (
        console.log("Estás en tu perfil")
      )}
      <div className="dashboardGeneralContainer">
<div className="dashboardGeneral">
      <div className="dashboardSections">
        {user.displayName !== context.data.username ? console.log("No estás en tu perfil") :  <div className="friendRequestsContainer">
          <p className="friendRequestCount">
            Solicitudes de amistad ({context.data.friendRequests?.length})
          </p>
          <div className="friendRequestItemsContainer">

          <div className="friendRequestItemContainer">
            {context.data.friendRequests?.map((item) => (
              <p className="friendRequestItem">{item.userData}</p>
              ))}
            {context.data.friendRequests?.map((item) => (
              <div className="friendRequestBtns">
                
              <span className="friendRequestItemBtn material-symbols-outlined" onClick={() => acceptFriend(item.userData, item.userId)}>
                done
              </span>
              <span className="friendRequestItemBtn material-symbols-outlined" onClick={() => declineFriend(item.userData)}>
              close
            </span>
              </div>
            ))}
            </div>
          </div>
        </div>}
       
        <div class="profileContainer">
          {user.displayName !== context.data.username ? (
            console.log("No estás en tu perfil")
          ) : (
            <span class="profileSettingsBtn material-symbols-outlined">
              settings
            </span>
          )}
          <div className="profileImageContainer">
<img class="profileImage"src={context.data.image} alt="" />
<input className="inputFile" type="file"  onChange={handleFileChange} />
          </div>
          
          <div class="profileInfo">
            <h1 class="profileUsername">{context.data.username}</h1>
            <p class="profileEmail">{context.data.email}</p>
            {user.displayName !== context.data.username ? isFriend === false ? <p className="isFriend">¡Ya son amigos! </p> : <div>{addFriendBtn === false ? <div onClick={() => setAddFriendBtn(!addFriendBtn)}><button className="addFriendBtn" onClick={() => addFriend()}>Añadir Amigo</button></div> : <button className="addFriendBtn addFriendBtnDiss">Solicitud Enviada</button>}</div> : console.log("Estás en tu perfil")}
            
          </div>
        </div>
        <div className="friendsContainer">
        <span onClick={() => setFriends(!friends)} class="friendsRequestsBtn material-symbols-outlined">
{friendsIcon} <p className="friendCount">{friendsCount}</p>
</span>
{friends === false ? <div>
            <p className="friendsCount">
              Amigos: {context.data.friends?.length}
            </p>{" "}
            <div className="friendsCardContainer">
              {context.data.friends?.map((item) => (
                <p
                  className="friendItem"
                  onClick={() => context.getUserSearchDoc(item.username)}
                >
                  {item.username}
                </p>
              ))}
            </div>
          </div> : user.displayName !== context.data.username ? console.log("No estás en tu perfil") :  <div className="friendRequestsContainerMedia">
          <p className="friendRequestCount">
            Solicitudes de amistad ({context.data.friendRequests?.length})
          </p>
          <div className="friendRequestItemsContainer">

          <div className="friendRequestItemContainer">
            {context.data.friendRequests?.map((item) => (
              <p className="friendRequestItem">{item.userData}</p>
              ))}
            {context.data.friendRequests?.map((item) => (
              <div className="friendRequestBtns">
                
              <span className="friendRequestItemBtn material-symbols-outlined" onClick={() => acceptFriend(item.userData, item.userId)}>
                done
              </span>
              <span className="friendRequestItemBtn material-symbols-outlined" onClick={() => declineFriend(item.userData)}>
              close
            </span>
              </div>
            ))}
            </div>
          </div>
        </div>}
          
        </div>
      </div>

      {context.profile === true ? (
        <div>
         
<div className="formPost">
          <input
          className="formInputPost"
          type="text"
          placeholder="Qué tienes para contar?"
          onChange={(e) => setTitle(e.target.value)}
          />
          <button className="formBtnPost" onClick={handleSubmit}>Subir Post</button>
</div>
        </div>
      ) : (
        <div>
          
        </div>
      )}
      <div className="postsContainer">

      {context.data.posts?.map((item) => (
        <div class="post">
        <div class="postHeader">
          <img class="profileImage" src={context.data.image} alt="" />
          <h3>{context.data.username}</h3>
        </div>
        <p className="postText">{item.text}</p>
        <div class="actions">
          <span class="timestamp">{item.day} / {item.hour}</span>
          <button class="deleteButton" onClick={() => deletePost(item.postId)}>Eliminar</button>
        </div>
      </div>
      ))}
      </div>
    </div>
      </div>
      </div>
  );
};

export default Dashboard;
