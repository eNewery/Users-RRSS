import { useContext, useState, useEffect } from "react"
import React from 'react'
import { MiContexto } from "./context"
const EditAvatar = () => {
    const [clothState, setClothState] = useState()
const [actualColor, setActualColor] = useState()
const [shirtCloth, setShirtCloth] = useState() 
const [snikersCloth, setSnikersCloth] = useState()
const [pantsCloth, setPantsCloth] = useState()

const [colorsHidden, setColorsHidden] = useState(true)
const [colors, setColors] = useState([])
const context = useContext(MiContexto);
useEffect(() => {
    if (colorsHidden === true) {
        if(clothState === "shirtCloth"){
        setShirtCloth(actualColor)
        }
       
        if(clothState === "pantsCloth"){
            setPantsCloth(actualColor)
        }
        if(clothState === "snikersCloth"){
            setSnikersCloth(actualColor)
        }    
    }

}, [colorsHidden])
function getCloth(cloth) {
    setColorsHidden(false)
    setClothState(cloth)
}
function getColor(color) {
    setColorsHidden(true)
    setActualColor(color)
}
  return (
    <div className="modalEditAvatarContainer"><div className="colors">{colorsHidden === true ? <p>Selecciona una parte</p> : context.colors.map(item => (<div className={`color ${item.colorName}`}
        onClick={() => getColor(item.colorName)}
         key={item.colorId}></div>))}</div><div class="persona">
    <div class="cabeza">
        <div class="ojos">
            <div class="ojo"></div>
            <div class="ojo"></div>
        </div>
        <div class="boca"></div>

    </div>
    <div onClick={() => getCloth("shirtCloth")} class={`camisa ${shirtCloth}`}>
        <div class="brazos">
            <div class="brazo"></div>
            <div class="brazo"></div>
        </div>
    </div>
    <div onClick={() => getCloth("pantsCloth")} class={`pantalon ${pantsCloth}`}></div>
    <div onClick={() => getCloth("snikersCloth")} class={`zapatillas ${snikersCloth}`}></div>
</div></div>
  )
}

export default EditAvatar