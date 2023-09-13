import React, { useContext } from 'react'
import { MiContexto } from './context'

const Privacity = ({setPrivacity}) => {
    const context = useContext(MiContexto)
  return (
    <div className="privacyContainer">
                    <label className="privacyLabel">Cuenta privada:</label>
                    <div className="privacyToggleContainer">
                      <div className="privacyToggle">
                        <input
                          onClick={() => setPrivacity()}
                          type="checkbox"
                          className="privacyToggleInput"
                          id="privacyToggle"
                          checked={!context.data.private}
                        />
                        <label
                          className="privacyToggleSlider"
                          for="privacyToggle"
                        ></label>
                      </div>
                    </div>
                  </div>
  )
}

export default Privacity