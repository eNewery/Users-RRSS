import React, { useContext } from 'react'
import { MiContexto } from './context'

const PerfilModal = ({data}) => {
    const context = useContext(MiContexto)
  return (
    <div className={`a${data.postId} perfilModalContainer`}><div className={`b${data.postId} perfilModalContent`}><p className="perfilModalHeading">{context.modalData?.username}</p><p>Amigos: {context.modalData.friends?.length}</p><p>Posts: {context.modalData.posts?.length}</p></div></div>
  )
}

export default PerfilModal