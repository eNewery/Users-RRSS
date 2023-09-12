import { useContext, useState, useEffect } from "react"
import { MiContexto } from "./context"

const PersonalInfo = () => {  
const [isPrivate, setIsPrivate] = useState("");
const context = useContext(MiContexto);
useEffect(() => {
  context.data.private === false
    ? setIsPrivate("Pública")
    : setIsPrivate("Privada");
}, [context.data.private]);

    return (
        <div className="personalInfo">
        <h2>Información Personal</h2>
        <div className="infoItem">
          <label for="nombre">Nombre:</label>
          <span id="nombre">{context.data.firstName}</span>
        </div>
        <div className="infoItem">
          <label for="apellido">Apellido:</label>
          <span id="apellido">{context.data.lastName}</span>
        </div>
        <div className="infoItem">
          <label for="nombreUsuario">Nombre de Usuario:</label>
          <span id="nombreUsuario">{context.data.username}</span>
        </div>
        <div className="infoItem">
          <label for="email">E-mail:</label>
          <span id="email">{context.data.email}</span>
        </div>
        <div className="infoItem">
          <label for="id">ID:</label>
          <span id="id">{context.data.id}</span>
        </div>
        <div className="infoItem">
          <label for="fechaCreacion">Fecha de Creación:</label>
          <span id="fechaCreacion">08/09/2023</span>
        </div>
        <div className="infoItem">
          <label for="isPrivate">Estado de la Cuenta:</label>
          <span id="isPrivate">{isPrivate}</span>
        </div>
      </div>
  )
}

export default PersonalInfo