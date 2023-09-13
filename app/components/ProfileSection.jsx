import React, { useContext, useState, useEffect } from 'react'
import { MiContexto } from './context'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { toast } from 'react-toastify';

const ProfileSection = () => {
    const [addFriendBtn, setAddFriendBtn] = useState(false);
    const [file, setFile] = useState(null);
    const [isFriend, setIsFriend] = useState(true);
const [request, setRequest] = useState(false)

    const context = useContext(MiContexto)
    
    useEffect(() => {
        handleUpload();
      }, [file]);
      useEffect(() => {
        buscarAmigoPorNombreDeUsuario();
        buscarSolicitudesPorId();
      }, [context.data, context.data.friendRequests, context.data.friends]);
      function buscarSolicitudesPorId(){
        const amigoEncontrado = context.data.friendRequests?.find(
            (item) => item.userId === context.user.uid
          );
          if (amigoEncontrado) {
              setRequest(true);
          } else {
              setRequest(false);
          }
      }
      function buscarAmigoPorNombreDeUsuario() {
        const amigoEncontrado = context.data.friends?.find(
          (item) => item.username === context.user.displayName
        );
    
        if (amigoEncontrado) {
            setIsFriend(true);
        } else {
            setIsFriend(false);
        }
      }
      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      };  
    async function addFriend() {
        const docRef = doc(db, "users", context.data.id.toString());
        await updateDoc(docRef, {
          ["friendRequests"]: arrayUnion({
            userData: context.user.displayName,
            userId: context.user.uid,
          }),
        });
        toast.success(
          `Mandaste una solicitud de amistad correctamente a: ${context.data.username}`,
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
      }
    
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
          const postsActualizados = context.data.posts.map(post => ({
            ...post,
            image: downloadURL
          }));
          await updateDoc(docRef, {
            posts: postsActualizados
          });
          // Limpiar el archivo seleccionado después de la carga exitosa
          setFile(null);
          context.getUserDoc(context.data.id)
          context.setClickCount((prevCount) => prevCount + 1);
        } catch (error) {
          console.error("Error al cargar la foto:", error);
        }
      };
  return (
    <div className="profileContainer">
              {context.user.displayName !== context.data.username ? (
                <span
                  onClick={() => context.setModalSettings(!context.modalSettings)}
                  className="profileSettingsBtn material-symbols-outlined"
                >
                  more_vert
                </span>
              ) : (
                <span
                  onClick={() => context.setModalSettings(!context.modalSettings)}
                  className="profileSettingsBtn material-symbols-outlined"
                >
                  settings
                </span>
              )}
              <div className="profileImageContainer">
                <img className="profileImage" src={context.data.image} alt="" />
                {context.profile === true ? (
                  <input
                    className="inputFile"
                    type="file"
                    onChange={handleFileChange}
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="profileInfo">
                <h1 className="profileUsername">{context.data.username}</h1>
                <p className="profileEmail">
                  {context.data.firstName} {context.data.lastName}
                </p>
                {context.user.displayName !== context.data.username ? (
                  isFriend === true ? (
                    <p className="isFriend">¡Ya son amigos! </p>
                  ) : (
                    <div>
                        {request ? <p className='requestExists'>Hay una solicitud pendiente</p> : addFriendBtn === false ? (
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
                  ""
                )}
              </div>
            </div>
  )
}

export default ProfileSection