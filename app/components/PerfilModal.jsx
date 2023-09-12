import React, { useContext } from 'react'
import { MiContexto } from './context'

const PerfilModal = ({data}) => {
    const context = useContext(MiContexto)
  return (
    <div className={`a${data.postId} perfilModalContainer`}><div className='perfilModalContent'><p className="perfilModalHeading">{context.data.username}</p><p>Amigos: {context.data.friends.length}</p><p>Posts: {context.data.posts.length}</p></div></div>
  )
}

export default PerfilModal