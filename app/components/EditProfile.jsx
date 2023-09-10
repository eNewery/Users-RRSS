import React, { useContext } from 'react'
import { MiContexto } from './context'

const EditProfile = () => {
    const context = useContext(MiContexto)
  return (
    <form class="formulario">
<div class="inputContainer">
<label for="nombreInput">Nombre</label>
<input defaultValue={context.data.firstName} type="text" id="nombreInput" class="nombreInput" name="nombre" required/>
</div>

<div class="inputContainer">
<label for="apellidoInput">Apellido</label>
<input defaultValue={context.data.lastName} type="text" id="apellidoInput" class="apellidoInput" name="apellido" required/>
</div>

<div class="inputContainer">
<label for="usuarioInput">Nombre de Usuario</label>
<input defaultValue={context.data.username} type="text" id="usuarioInput" class="usuarioInput" name="usuario" required/>
</div>

<div class="inputContainer">
<label for="emailInput">E-mail</label>
<input defaultValue={context.data.email} type="email" id="emailInput" class="emailInput" name="email" required/>
</div>

<button className="formBtnPerfil">Editar Perfil</button>
<button class="cambiarContrasenaButton">¿Deseas cambiar tu contraseña?</button>
</form>
  )
}

export default EditProfile