import React, { useContext } from 'react'
import { MiContexto } from './context'

const Privacity = ({setPrivacity}) => {
    const context = useContext(MiContexto)
  return (
    <div class="privacyContainer">
                    <label class="privacyLabel">Cuenta privada:</label>
                    <div className="privacyToggleContainer">
                      <div class="privacyToggle">
                        <input
                          onClick={() => setPrivacity()}
                          type="checkbox"
                          class="privacyToggleInput"
                          id="privacyToggle"
                          checked={!context.data.private}
                        />
                        <label
                          class="privacyToggleSlider"
                          for="privacyToggle"
                        ></label>
                      </div>
                    </div>
                  </div>
  )
}

export default Privacity