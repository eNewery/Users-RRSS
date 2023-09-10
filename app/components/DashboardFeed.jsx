import React, { useContext, useEffect, useState } from 'react'
import { MiContexto } from './context'

const DashboardFeed = () => {
    const context = useContext(MiContexto)
    

    
   
  return (
    <div className='dashboardFeedContainer'><div className='dashboardGeneral'><div className="postsContainer">
        {context.posts?.map(item => (<div class="post">
        <div class="postHeader">
          <img class="profileImage" src={item.image} alt="" />
          <h3>{item.user}</h3>
        </div>
        <p className="postText">{item.text}</p>
        <div class="actions">
          
        <span class="timestamp">
{item.day} / {item.hour}
          </span>

        </div>
      </div>)
       
    )}</div></div></div>
  )
}

export default DashboardFeed