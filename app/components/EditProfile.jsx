import React, { useContext } from 'react'
import { MiContexto } from './context'

const EditProfile = () => {
    const context = useContext(MiContexto)
  return (
    <form className="formulario">
<div className="inputContainer">
<label for="nombreInput">Nombre</label>
<input defaultValue={context.data.firstName} type="text" id="nombreInput" className="nombreInput" name="nombre" required/>
</div>

<div className="inputContainer">
<label for="apellidoInput">Apellido</label>
<input defaultValue={context.data.lastName} type="text" id="apellidoInput" className="apellidoInput" name="apellido" required/>
</div>

<div className="inputContainer">
<label for="usuarioInput">Nombre de Usuario</label>
<input defaultValue={context.data.username} type="text" id="usuarioInput" className="usuarioInput" name="usuario" required/>
</div>

<div className="inputContainer">
<label for="emailInput">E-mail</label>
<input defaultValue={context.data.email} type="email" id="emailInput" className="emailInput" name="email" required/>
</div>

<button className="formBtnPerfil">Editar Perfil</button>
<button className="cambiarContrasenaButton">¿Deseas cambiar tu contraseña?</button>
</form>
  )
}

export default EditProfile