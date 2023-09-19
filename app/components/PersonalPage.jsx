"use client";
import React, { useContext, useState, useEffect } from "react";
import { MiContexto } from "./context";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import PersonalInfo from "./personalInfo";
import EditProfile from "./EditProfile";
import ArrowBack from "./ArrowBack";
import Privacity from "./Privacity";
import ProfileSection from "./ProfileSection";
import { toast } from "react-toastify";

const PersonalPage = () => {
  const [itemPrivacity, setItemPrivacity] = useState("");
  const [user, setUser] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [friends, setFriends] = useState(false);
  const [friendsCount, setFriendsCount] = useState("");
  const [friendsIcon, setFriendsIcon] = useState("");
  const [isYourFriend, setIsYourFriend] = useState();
  const [privateState, setPrivateState] = useState();
  const [dashboardGeneral, setDashboardGeneral] = useState();
  const context = useContext(MiContexto);

  useEffect(() => {
    context.profile === true
      ? setDashboardGeneral("dashboardGeneral")
      : setDashboardGeneral("dashboardGeneralOutProfile");
  }, [context.profile]);

  useEffect(() => {
    const filtered = context.data.friends?.find(
      (item) => item.id === context.user.uid
    );
    console.log(filtered)
    filtered ? setIsYourFriend(true) : setIsYourFriend(false);
  }, [context.data, context.clickCount]);

  useEffect(() => {
    friends == false
      ? setFriendsCount(context.data.friendRequests?.length)
      : setFriendsCount(context.data.friends?.length);
    friends == false ? setFriendsIcon("group_add") : setFriendsIcon("group");
  }, [friends]);
  useEffect(() => {
    const body = document.querySelector("body");
    context.modalSettings === true
      ? body.classList.add("hiddenOverflow")
      : body.classList.remove("hiddenOverflow");
  }, [context.modalSettings]);



  useEffect(() => {
    if (context.data.id === context.user.uid) {
      context.setProfile(true);
    } else {
      context.setProfile(false);
    }
  }, [context.data]);

  async function removeFriend() {
    const docRef = doc(db, "users", context.user.uid.toString());
    const docReference = doc(db, "users", context.data.id.toString());
    const ourFilteredFriends = [];
    const filtered = context.friendsDataState.filter(
      (item) => item.id !== context.data.id
    );
    filtered.map((item) =>
      ourFilteredFriends.push({ username: item.username, id: item.id })
    );
    const hisFilteredFriends = [];
    const filteredFr = context.data.friends.filter(
      (item) => item.id !== context.user.uid.toString()
    );
    filteredFr.map((item) =>
      hisFilteredFriends.push({ username: item.username, id: item.id })
    );

    await updateDoc(docRef, {
      ["friends"]: ourFilteredFriends,
    });
    await updateDoc(docReference, {
      ["friends"]: hisFilteredFriends,
    });
    toast.success(
      `Eliminaste al amigo: ${context.data.username}`,
      {
        position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
        autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
        hideProgressBar: false, // Ocultar la barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
        draggable: true, // Permite arrastrar la notificación
        style: { backgroundColor: "#37363e" },
      }
    );
    context.setClickCount((prevCount) => prevCount + 1);
    closeModal();
  }
  async function deletePost(postIdABorrar) {
    const newArray = context.data.posts.filter(
      (post) => post.postId !== postIdABorrar
    );
    const docRef = doc(db, "users", context.user.uid.toString());
    await updateDoc(docRef, {
      posts: newArray,
    });
    toast.success(
      `Eliminaste el post con id: ${postIdABorrar}`,
      {
        position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
        autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
        hideProgressBar: false, // Ocultar la barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
        draggable: true, // Permite arrastrar la notificación
        style: { backgroundColor: "#37363e" },
      }
    );
    context.setClickCount((prevCount) => prevCount + 1);
  }
  async function setPrivacity() {
    const docRef = doc(db, "users", context.user.uid.toString());
    setPrivateState(!context.data.private);
    await updateDoc(docRef, {
      ["private"]: !context.data.private,
    });
    toast.success(
      `Cambiaste la privacidad de la cuenta. Ahora la cuenta es ${context.data.private === false ? "Privada" : "Pública"}`,
      {
        position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
        autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
        hideProgressBar: false, // Ocultar la barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
        draggable: true, // Permite arrastrar la notificación
        style: { backgroundColor: "#37363e" },
      }
    );
    context.setClickCount((prevCount) => prevCount + 1);
  }

  async function declineFriend(friend) {
    const docRef = doc(db, "users", context.data.id.toString());
    const filtered = context.data.friendRequests.filter(
      (item) => item.userData !== friend
    );
    await updateDoc(docRef, {
      ["friendRequests"]: filtered,
    });
    toast.success(
      `Rechazaste la solicitud de ${friend}`,
      {
        position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
        autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
        hideProgressBar: false, // Ocultar la barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
        draggable: true, // Permite arrastrar la notificación
        style: { backgroundColor: "#37363e" },
      }
    );
    context.setClickCount((prevCount) => prevCount + 1);
  }
  async function acceptFriend(friend, id) {
    const date = Date.now()
    const messages = doc(db, "users", "messages");
    await updateDoc(messages, {
      ["chats"]: arrayUnion({users:[friend, context.user.displayName],chatId:date, messages: []})
    })
    const docReference = doc(db, "users", id.toString());
    const filtered = context.data.friendRequests.filter(
      (item) => item.userData !== friend
    );

    await updateDoc(docReference, {
      ["friends"]: arrayUnion({
        username: context.user.displayName,
        id: context.user.uid,
        chatId: date 
      }),
    });
    const docRef = doc(db, "users", context.user.uid.toString());
    await updateDoc(docRef, {
      ["friendRequests"]: filtered,
      ["friends"]: arrayUnion({ username: friend, id: id, chatId: date}),
    });
    toast.success(
      `Aceptaste la solicitud de ${friend}`,
      {
        position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
        autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
        hideProgressBar: false, // Ocultar la barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
        draggable: true, // Permite arrastrar la notificación
        style: { backgroundColor: "#37363e" },
      }
    );
    context.setClickCount((prevCount) => prevCount + 1);
  }

  async function cambiarPrivacidad(postId, postPrivacity) {
    try {
      const userId = context.user.uid.toString();
      const docRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(docRef);

      if (userDocSnap.exists()) {
        const userPosts = userDocSnap.data().posts;
        const postIndex = userPosts.findIndex((post) => post.postId === postId); // Reemplaza "postId" con el ID del post que deseas actualizar

        if (postIndex !== -1) {
          const updatedPosts = [...userPosts]; // Clona el array
          updatedPosts[postIndex] = {
            ...updatedPosts[postIndex],
            postPrivacity: !updatedPosts[postIndex].postPrivacity, // Cambia la propiedad postPrivacity
          };

          await updateDoc(docRef, { posts: updatedPosts });
          toast.success(
            `El post se ha establecido como ${
              postPrivacity === true ? "público." : "privado."
            }`,
            {
              position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
              autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
              hideProgressBar: false, // Ocultar la barra de progreso
              closeOnClick: true, // Cerrar la notificación al hacer clic en ella
              pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
              draggable: true, // Permite arrastrar la notificación
              style: { backgroundColor: "#37363e" },
            }
          );
          context.getUserDoc(context.data.id)
        } else {
          console.error("No se encontró el objeto con el postId especificado.");
        }
      } else {
        console.error("No se encontró el documento del usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar la propiedad postPrivacity:", error);
    }
  }
function handleSubmit() {
  toast.success(
    `¡El post se ha subido correctamente!`,
    {
      position: "top-left", // Posición de la notificación (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
      autoClose: 3000, // Tiempo en milisegundos antes de que la notificación se cierre automáticamente
      hideProgressBar: false, // Ocultar la barra de progreso
      closeOnClick: true, // Cerrar la notificación al hacer clic en ella
      pauseOnHover: true, // Pausar el temporizador de cierre al pasar el ratón por encima
      draggable: true, // Permite arrastrar la notificación
      style: { backgroundColor: "#37363e" },
    }
  );
  context.getUserDoc(context.data.id)
  context.handleSubmit()
}
  function closeModal() {
    const modalContainer = document.querySelector(".modalSettingsContainer");
    const modalContent = document.querySelector(".modalContent");
    const modalIcon = document.querySelector(".closeModal");
    modalIcon.classList.add("modalContentDissappear");
    modalContainer.classList.add("modalDissappear");
    modalContent.classList.add("modalContentDissappear");
    setTimeout(() => {
      context.setModalSettings(!context.modalSettings);
      setModalContent("");
    }, 1000);
  }
  return (
    <div>
      {context.modalSettings === true ? (
        <div className="modalSettingsContainer">
          <span
            onClick={() => closeModal()}
            className="closeModal material-symbols-outlined"
          >
            close
          </span>
          <div className="modalContent">
            {modalContent === "" ? (
              <div className="modalBtnList">
                <button onClick={() => setModalContent("personalInfo")}>
                  Ver información personal
                </button>

                {context.profile === true ? (
                  <button onClick={() => setModalContent("editProfile")}>
                    Editar perfil
                  </button>
                ) : (
                  ""
                )}
                  
                {context.profile === true ? (
                  <button onClick={() => setModalContent("privacity")}>
                    Privacidad
                  </button>
                ) : (
                  ""
                )}

                {isYourFriend === true ? (
                  <button onClick={() => removeFriend()}>Eliminar Amigo</button>
                ) : (
                  ""
                )}
              </div>
            ) : modalContent === "personalInfo" ? (
              <div className="personalInfoContainer allModalContent">
                <ArrowBack data={setModalContent} />
                {context.profile === true ? (
                  <PersonalInfo />
                ) : context.data.private === false ? (
                  <PersonalInfo />
                ) : context.data.private === true ? (
                  isYourFriend === true ? (
                    <PersonalInfo />
                  ) : (
                    <p className="weAreNotFriends">
                      No son amigos y la cuenta es privada.
                    </p>
                  )
                ) : (
                  ""
                )}
              </div>
            ) : modalContent === "editProfile" ? (
              <div className="editProfileContainer allModalContent">
                <ArrowBack data={setModalContent} />
                <EditProfile />
              </div>
            ) : modalContent === "privacity" ? (
              <div className="privacityContainer allModalContent">
                <ArrowBack data={setModalContent} />
                <Privacity setPrivacity={setPrivacity} />
              </div>
            ) : (
              setModalContent("")
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="dashboardGeneralContainer">
        <div className={dashboardGeneral}>
          <div className="dashboardSections">
            {context.user.displayName !== context.data.username ? (
              ""
            ) : (
              <div className="friendRequestsContainer">
                <p className="friendRequestCount">
                  Solicitudes de amistad ({context.data.friendRequests?.length})
                </p>
                <div className="friendRequestItemsContainer">
                  <div className="friendRequestItemContainer">
                    {context.data.friendRequests?.map((item) => (
                      <p key={item.userId} className="friendRequestItem">{item.userData}</p>
                    ))}
                    {context.data.friendRequests?.map((item) => (
                      <div key={item.userId} className="friendRequestBtns">
                        <span
                          className="friendRequestItemBtn material-symbols-outlined"
                          onClick={() =>
                            acceptFriend(item.userData, item.userId)
                          }
                        >
                          done
                        </span>
                        <span
                          className="friendRequestItemBtn material-symbols-outlined"
                          onClick={() => declineFriend(item.userData)}
                        >
                          close
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <ProfileSection />
            <div className="friendsContainer">
              {context.profile === true ? <span
                onClick={() => setFriends(!friends)}
                className="friendsRequestsBtn material-symbols-outlined"
              >
                {friendsIcon} <p className="friendCount">{friendsCount}</p>
              </span> : ""}
              
              {friends === false ? (
                <div>
                  <p className="friendsCount">
                    Amigos: {context.data.friends?.length}
                  </p>{" "}
                  <div className="friendsCardContainer">
                    {context.data.friends?.map((item) => (
                      <p
                      key={item.id}
                        className="friendItem"
                        onClick={() => context.getUserSearchDoc(item.username)}
                      >
                        {item.username}
                      </p>
                    ))}
                  </div>
                </div>
              ) : context.user.displayName !== context.data.username ? (
                ""
              ) : (
                <div className="friendRequestsContainerMedia">
                  <p className="friendRequestCount">
                    Solicitudes de amistad (
                    {context.data.friendRequests?.length})
                  </p>
                  <div className="friendRequestItemsContainer">
                    <div className="friendRequestItemContainer">
                      {context.data.friendRequests?.map((item) => (
                        <p key={item.userId} className="friendRequestItem">{item.userData}</p>
                      ))}
                      {context.data.friendRequests?.map((item) => (
                        <div key={item.userId} className="friendRequestBtns">
                          <span
                            className="friendRequestItemBtn material-symbols-outlined"
                            onClick={() =>
                              acceptFriend(item.userData, item.userId)
                            }
                          >
                            done
                          </span>
                          <span
                            className="friendRequestItemBtn material-symbols-outlined"
                            onClick={() => declineFriend(item.userData)}
                          >
                            close
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {context.profile === true ? (
            <div>
              <div className="formPost">
                <input
                  className="formInputPost"
                  type="text"
                  placeholder="Qué tienes para contar?"
                  onChange={(e) => context.setTitle(e.target.value)}
                />
                <button className="formBtnPost" onClick={handleSubmit}>
                  Subir Post
                </button>
              </div>
              <div className="postsContainer">
                {context.data.posts?.map((item) => (
                  <div key={item.postId} className="post">
                    <div className="postHeader">
                      <img
                        className="profileImage"
                        src={context.data.image}
                        alt=""
                      />
                      <h3>{context.data.username}</h3>
                    </div>
                    <p className="postText">{item.text}</p>
                    <div className="actions">
                      <span className="timestamp">
                        {item.day} / {item.hour}
                      </span>
                      <div>
                        <button
                          className="deleteButton"
                          onClick={() => deletePost(item.postId)}
                        >
                          Eliminar
                        </button>
                        <button
                          className="deleteButton"
                          onClick={() =>
                            cambiarPrivacidad(item.postId, item.postPrivacity)
                          }
                        >
                          {item.postPrivacity === true ? "Privado" : "Público"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : context.data.private === true ? ( // Si la cuenta es privada
            isYourFriend === false ? ( // Si la cuenta es privada y no es tu amigo
              <p className="privatePosts">
                <span className="material-symbols-outlined">block</span>Los
                posts de esta cuenta son privados{" "}
                <span className="material-symbols-outlined">block</span>
              </p>
            ) : ( // Si la cuenta es privada y es tu amigo
              <div className="postsContainer">
              {context.data.posts?.map((item) =>
                item.postPrivacity === false ? ( // Si la cuenta es privada es tu amigo y el post es público
                  <div key={item.postId} className="post">
                    <div className="postHeader">
                      <img
                        className="profileImage"
                        src={context.data.image}
                        alt=""
                      />
                      <h3>{context.data.username}</h3>
                    </div>
                    <p className="postText">{item.text}</p>
                    <div className="actions">
                      <span className="timestamp">
                        {item.day} / {item.hour}
                      </span>
                      {context.profile === true ? ( // Si estás en tu cuenta
                        <button
                          className="deleteButton"
                          onClick={() => deletePost(item.postId)}
                        >
                          Eliminar
                        </button>
                      ) : ( // Si no estás en tu cuenta (no hace nada)
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="post privatePost">
                    <div className="postHeader">
                      <img
                        className="profileImage"
                        src={context.data.image}
                        alt=""
                      />
                      <h3>{context.data.username}</h3>
                    </div>
                    <p className="privatePostText postText">
                      El contenido de este post es privado. No puedes ver su
                      contenido
                    </p>
                  </div>
                )
              )}
            </div>
            )
          ) : ( // Si la cuenta no es privada
            <div className="postsContainer">
              {context.data.posts?.map((item) =>
                item.postPrivacity === false ? ( // Si la cuenta no es privada y el post es público
                  <div key={item.postId} className="post">
                    <div className="postHeader">
                      <img
                        className="profileImage"
                        src={context.data.image}
                        alt=""
                      />
                      <h3>{context.data.username}</h3>
                    </div>
                    <p className="postText">{item.text}</p>
                    <div className="actions">
                      <span className="timestamp">
                        {item.day} / {item.hour}
                      </span>
                      {context.profile === true ? (
                        <button
                          className="deleteButton"
                          onClick={() => deletePost(item.postId)}
                        >
                          Eliminar
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : ( // Si la cuenta no es privada pero el post es privado
                  <div className="post privatePost">
                    <div className="postHeader">
                      <img
                        className="profileImage"
                        src={context.data.image}
                        alt=""
                      />
                      <h3>{context.data.username}</h3>
                    </div>
                    <p className="privatePostText postText">
                      El contenido de este post es privado. No puedes ver su
                      contenido
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
