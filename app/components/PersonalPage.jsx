"use client"
import React, { useContext, useState, useEffect } from 'react'
import { MiContexto } from './context'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import PersonalInfo from "./personalInfo";
import EditProfile from "./EditProfile";
import ArrowBack from "./ArrowBack";
import Privacity from "./Privacity";

const PersonalPage = () => {
    const [user, setUser] = useState([])
    const [modalSettings, setModalSettings] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [addFriendBtn, setAddFriendBtn] = useState(false);
    const [file, setFile] = useState(null);
    const [friends, setFriends] = useState(false);
    const [friendsCount, setFriendsCount] = useState("");
    const [friendsIcon, setFriendsIcon] = useState("");
    const [isYourFriend, setIsYourFriend] = useState();
    const [privateState, setPrivateState] = useState();
  const [dashboardGeneral, setDashboardGeneral] = useState()
    const context = useContext(MiContexto)

    useEffect(() => {
    context.profile === true ? setDashboardGeneral("dashboardGeneral") : setDashboardGeneral("dashboardGeneralOutProfile")
    }, [context.profile])
    
      useEffect(() => {
        const filtered = context.data.friends?.find((item) => item.id === context.user.uid);
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
        modalSettings === true
          ? body.classList.add("hiddenOverflow")
          : body.classList.remove("hiddenOverflow");
      }, [modalSettings]);
      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      };
    
      useEffect(() => {
        handleUpload();
      }, [file]);
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
    
          const docRef = doc(db, "users", context.user.uid.toString());
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
        if (context.user.uid) {
          context.getUserDoc(context.user.uid);
        }
      }, [context.user, context.clickCount,]);
    
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
const ourFilteredFriends = []
        const filtered = context.friendsDataState.filter(
          (item) => item.id !== context.data.id
        );
        filtered.map(item => (ourFilteredFriends.push({username:item.username, id:item.id})))
  const  hisFilteredFriends = []   
        const filteredFr = context.data.friends.filter(
          (item) => item.id !== context.user.uid.toString()
          );
          filteredFr.map(item => (hisFilteredFriends.push({username:item.username, id:item.id})))

              await updateDoc(docRef, {
          ["friends"]: ourFilteredFriends,
        });
        await updateDoc(docReference, {
          ["friends"]: hisFilteredFriends,
        }); 
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
        context.setClickCount((prevCount) => prevCount + 1);
      }
      async function setPrivacity() {
        const docRef = doc(db, "users", context.user.uid.toString());
        setPrivateState(!context.data.private);
        await updateDoc(docRef, {
          ["private"]: !context.data.private,
        });
        context.setClickCount((prevCount) => prevCount + 1);
      }
    
    
      async function addFriend() {
        const docRef = doc(db, "users", context.data.id.toString());
        await updateDoc(docRef, {
          ["friendRequests"]: arrayUnion({
            userData: context.user.displayName,
            userId: context.user.uid,
          }),
        });
      }
    
      async function declineFriend(friend) {
        const docRef = doc(db, "users", context.data.id.toString());
        const filtered = context.data.friendRequests.filter(
          (item) => item.userData !== friend
        );
        await updateDoc(docRef, {
          ["friendRequests"]: filtered,
        });
        context.setClickCount((prevCount) => prevCount + 1);
        console.log(friend);
      }
      async function acceptFriend(friend, id) {
        const docReference = doc(db, "users", id.toString());
        const filtered = context.data.friendRequests.filter(
          (item) => item.userData !== friend
        );
        await updateDoc(docReference, {
          ["friends"]: arrayUnion({ username: context.user.displayName, id: context.user.uid }),
        });
        const docRef = doc(db, "users", context.user.uid.toString());
        await updateDoc(docRef, {
          ["friendRequests"]: filtered,
          ["friends"]: arrayUnion({ username: friend, id: id }),
        });
        context.setClickCount((prevCount) => prevCount + 1);
      }
      function buscarAmigoPorNombreDeUsuario() {
        const amigoEncontrado = context.data.friends?.find(
          (item) => item.username === context.user.displayName
        );
    
        if (amigoEncontrado) {
          setIsFriend(false);
        } else {
          setIsFriend(true);
        }
      }
      useEffect(() => {
        buscarAmigoPorNombreDeUsuario();
      }, [context.data]);
      function closeModal() {
        const modalContainer = document.querySelector(".modalSettingsContainer");
        const modalContent = document.querySelector(".modalContent");
        const modalIcon = document.querySelector(".closeModal");
        modalIcon.classList.add("modalContentDissappear");
        modalContainer.classList.add("modalDissappear");
        modalContent.classList.add("modalContentDissappear");
        setTimeout(() => {
          setModalSettings(!modalSettings);
          setModalContent("")
        }, 1000);
      }
  return (
    <div>{modalSettings === true ? (
        <div className="modalSettingsContainer">
          <span
            onClick={() => closeModal()}
            class="closeModal material-symbols-outlined"
          >
            close
          </span>
          <div className="modalContent">
      {
  modalContent === "" ? (
    <div className="modalBtnList">
      <button onClick={() => setModalContent("personalInfo")}>
        Ver información personal
      </button>

  {
    context.profile === true ? <button onClick={() => setModalContent("editProfile")}>
    Editar perfil
  </button> : console.log("No estás en tu perfil como para editar el perfil.")
  }
      { context.profile === true ? <button onClick={() => setModalContent("privacity")} >
                    Privacidad
                  </button> : console.log("No estás en tu perfil como para editar la privacidad.")}
                  
      {isYourFriend === true ? (
        <button onClick={() => removeFriend()}>Eliminar Amigo</button>
      ) : (
        console.log("No son amigos")
      )}
    </div>
  ) : modalContent === "personalInfo" ? (
    <div className="personalInfoContainer allModalContent">
                  <ArrowBack data={setModalContent}/>
                  {context.profile === true ? <PersonalInfo/> : context.data.private === false ? <PersonalInfo/> : context.data.private === true ? isYourFriend === true ? <PersonalInfo/> : <p className="weAreNotFriends">No son amigos y la cuenta es privada.</p> : console.log("Ha ocurrido un error")}
                </div>
  ) : modalContent === "editProfile" ? (
    <div className="editProfileContainer allModalContent">
    <ArrowBack data={setModalContent}/>
    <EditProfile/>
  </div>
  ) : modalContent === "privacity" ? (
    <div className="privacityContainer allModalContent">
                  <ArrowBack data={setModalContent}/>
                  <Privacity setPrivacity={setPrivacity}/>
                </div>
  ) : (
    setModalContent("")
  )
}
          </div>
        </div>
      ) : (
        console.log("El modal no ha sido activado.")
      )}
      {context.user.displayName !== context.data.username ? (
        <div className="backProfileContainer">
          <span
            className="backProfile material-symbols-outlined"
            onClick={() => context.getUserSearchDoc(context.user.displayName)}
          >
            account_circle
          </span>
        </div>
      ) : (
        console.log("Estás en tu perfil")
      )}
      <div className="dashboardGeneralContainer">
        <div className={dashboardGeneral}>
          <div className="dashboardSections">
            {context.user.displayName !== context.data.username ? (
              console.log("No estás en tu perfil")
            ) : (
              <div className="friendRequestsContainer">
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

            <div class="profileContainer">
              {context.user.displayName !== context.data.username ? (
                <span
                  onClick={() => setModalSettings(!modalSettings)}
                  class="profileSettingsBtn material-symbols-outlined"
                >
                  more_vert
                </span>
              ) : (
                <span
                  onClick={() => setModalSettings(!modalSettings)}
                  class="profileSettingsBtn material-symbols-outlined"
                >
                  settings
                </span>
              )}
              <div className="profileImageContainer">
                <img class="profileImage" src={context.data.image} alt="" />
                {context.profile === true ? (
                  <input
                    className="inputFile"
                    type="file"
                    onChange={handleFileChange}
                  />
                ) : (
                  console.log("No estás en tu perfilss")
                )}
              </div>

              <div class="profileInfo">
                <h1 class="profileUsername">{context.data.username}</h1>
                <p class="profileEmail">
                  {context.data.firstName} {context.data.lastName}
                </p>
                {context.user.displayName !== context.data.username ? (
                  isFriend === false ? (
                    <p className="isFriend">¡Ya son amigos! </p>
                  ) : (
                    <div>
                      {addFriendBtn === false ? (
                        <div onClick={() => setAddFriendBtn(!addFriendBtn)}>
                          <button
                            className="addFriendBtn"
                            onClick={() => addFriend()}
                          >
                            Añadir Amigo
                          </button>
                        </div>
                      ) : (
                        <button className="addFriendBtn addFriendBtnDiss">
                          Solicitud Enviada
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  console.log("Estás en tu perfil")
                )}
              </div>
            </div>
            <div className="friendsContainer">
              <span
                onClick={() => setFriends(!friends)}
                class="friendsRequestsBtn material-symbols-outlined"
              >
                {friendsIcon} <p className="friendCount">{friendsCount}</p>
              </span>
              {friends === false ? (
                <div>
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
                </div>
              ) : context.user.displayName !== context.data.username ? (
                console.log("No estás en tu perfil")
              ) : (
                <div className="friendRequestsContainerMedia">
                  <p className="friendRequestCount">
                    Solicitudes de amistad (
                    {context.data.friendRequests?.length})
                  </p>
                  <div className="friendRequestItemsContainer">
                    <div className="friendRequestItemContainer">
                      {context.data.friendRequests?.map((item) => (
                        <p className="friendRequestItem">{item.userData}</p>
                      ))}
                      {context.data.friendRequests?.map((item) => (
                        <div className="friendRequestBtns">
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
                <button className="formBtnPost" onClick={context.handleSubmit}>
                  Subir Post
                </button>
              </div>
              <div className="postsContainer">
                {context.data.posts?.map((item) => (
                  <div class="post">
                    <div class="postHeader">
                      <img
                        class="profileImage"
                        src={context.data.image}
                        alt=""
                      />
                      <h3>{context.data.username}</h3>
                    </div>
                    <p className="postText">{item.text}</p>
                    <div class="actions">
                      <span class="timestamp">
                        {item.day} / {item.hour}
                      </span>
                      <button
                        class="deleteButton"
                        onClick={() => deletePost(item.postId)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : context.data.private === true ? isYourFriend === false ? (
            <p className="privatePosts">
              <span class="material-symbols-outlined">block</span>Los posts de
              esta cuenta son privados{" "}
              <span class="material-symbols-outlined">block</span>
            </p>
          ) : (<div className="postsContainer">
          {context.data.posts?.map((item) => (
            <div class="post">
              <div class="postHeader">
                <img class="profileImage" src={context.data.image} alt="" />
                <h3>{context.data.username}</h3>
              </div>
              <p className="postText">{item.text}</p>
              <div class="actions">
                <span class="timestamp">
                  {item.day} / {item.hour}
                </span>
                {context.profile === true ? <button
                  class="deleteButton"
                  onClick={() => deletePost(item.postId)}
                >
                  Eliminar
                </button> : console.log("No puedes eliminar posts de otra persona!")}
                
              </div>
            </div>
          ))}
        </div>) : (
            <div className="postsContainer">
              {context.data.posts?.map((item) => (
                <div class="post">
                  <div class="postHeader">
                    <img class="profileImage" src={context.data.image} alt="" />
                    <h3>{context.data.username}</h3>
                  </div>
                  <p className="postText">{item.text}</p>
                  <div class="actions">
                    <span class="timestamp">
                      {item.day} / {item.hour}
                    </span>
                    <button
                      class="deleteButton"
                      onClick={() => deletePost(item.postId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div></div>
  )
}

export default PersonalPage