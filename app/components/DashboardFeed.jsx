import React, { useContext, useEffect, useState } from 'react'
import { MiContexto } from './context'
import PerfilModal from './PerfilModal'

const DashboardFeed = () => {


    function showPerfModal(classId, userId) {
      context.getUserDoc(userId)
      var elemento2 = document.querySelector(`.a${classId}`);
    var elemento3 = document.querySelector(".perfilModalContent")
      elemento2.style.display = 'flex';  
      elemento2.style.animationName = 'extend';
      elemento2.style.animationDuration = '0.4s';
      elemento2.style.animationFillMode = 'both';
      elemento3.style.animationName = 'appear';
      elemento3.style.animationDuration = '1s';
      elemento3.style.animationFillMode = 'both';
  }
  
  function hiddenPerfModal(classId) {
    var elemento2 = document.querySelector(`.a${classId}`);
    var elemento3 = document.querySelector(".perfilModalContent")
    elemento3.style.animationName = 'dissapear';
    elemento3.style.animationFillMode = 'both';
    elemento3.style.animationDuration = '1s';
    elemento2.style.animationName = 'extend-o';
    elemento2.style.animationDuration = '1s';
    elemento2.style.animationFillMode = 'both';
    elemento2.style.animationDelay = "0.4s"
    setTimeout(() => {
  context.getUserDoc(context.user.uid)
  elemento2.style.display = 'none';
}, 1000);
  } 
  
    const context = useContext(MiContexto)

    
   
  return (
    <div className='dashboardFeedContainer'><div className='dashboardGeneral'><div className="postsContainer">
        {context.posts?.map(item => ( item.postPrivacity === false ? <div className="post">
        <div className="postHeader">
          <img onMouseOver={() => showPerfModal(item.postId, item.userId)}
        onMouseOut={() => hiddenPerfModal(item.postId)} className="profileImage" src={item.image} alt="" />
          <h3>{item.user}</h3>
        </div>
        <p className="postText">{item.text}</p>
        <div className="actions">
          
        <span className="timestamp">
{item.day} / {item.hour}
          </span>

        </div>
        <PerfilModal data={item}/>
        
      </div> : <div className="post privatePost">
      <div className="postHeader">
        <img
          className="profileImage"
          src={item.image}
          alt=""
          onMouseOver={() => showPerfModal(item.postId, item.userId)}
        onMouseOut={() => hiddenPerfModal(item.postId)}
        />
        <h3>{item.user}</h3>
      </div>
      <p className="privatePostText postText">
        El contenido de este post es privado. No puedes ver su
        contenido
      </p>
      <PerfilModal data={item}/>
    </div>)
       
    )}</div></div></div>
  )
}

export default DashboardFeed

