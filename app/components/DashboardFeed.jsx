import React, { useContext, useEffect, useState } from "react";
import { MiContexto } from "./context";
import PerfilModal from "./PerfilModal";

const DashboardFeed = () => {
  function showPerfModal(classId, userId) {
    context.getUserModalDoc(userId);
    var elemento2 = document.querySelector(`.a${classId}`);
    var elemento3 = document.querySelector(`.b${classId}`);
    elemento2.style.display = "flex";
    elemento2.style.animationName = "extend";
    elemento2.style.animationDuration = "0.4s";
    elemento2.style.animationFillMode = "both";
    elemento3.style.animationName = "appear";
    elemento3.style.animationDuration = "1s";
    elemento3.style.animationFillMode = "both";
  }

  function hiddenPerfModal(classId) {
    var elemento2 = document.querySelector(`.a${classId}`);
    var elemento3 = document.querySelector(`.b${classId}`);
    elemento3.style.animationName = "dissapear";
    elemento3.style.animationFillMode = "both";
    elemento3.style.animationDuration = "1s";
    elemento2.style.animationName = "extend-o";
    elemento2.style.animationDuration = "1s";
    elemento2.style.animationFillMode = "both";
    elemento2.style.animationDelay = "0.4s";
    setTimeout(() => {
      context.getUserModalDoc(context.user.uid);
      elemento2.style.display = "none";
    }, 1000);
  }

  const context = useContext(MiContexto);
  function goPersonalPage(userId) {
    context.getUserDoc(userId)
    setTimeout(() => {
  context.setDashboardContent("personalPage")
}, 1000);
  }
  return (
    <div className="dashboardFeedContainer">
      <div className="dashboardGeneral">
        <div className="postsContainer">
          {context.posts.length === 0 ? ( // Si no ha cargado ningún post / No hay ningún post
            <div className="post noPosts">
              <p className="postTextCenter">¡No ha cargado ningún post! Prueba a añadir nuevos amigos.</p>
            </div>
          ) : (
            context.posts?.map((item) =>
              item.postPrivacity === false ? (
                <div className="post">
                  <div className="postHeader">
                    <img
                      onMouseOver={() =>
                        showPerfModal(item.postId, item.userId)
                      }
                      onMouseOut={() => hiddenPerfModal(item.postId)}
                      className="profileImage"
                      src={item.image}
                      alt=""
                      onClick={() => goPersonalPage(item.userId)}
                    />
                    <h3>{item.user}</h3>
                  </div>
                  <p className="postText">{item.text}</p>
                  <div className="actions">
                    <span className="timestamp">
                      {item.day} / {item.hour}
                    </span>
                  </div>
                  <PerfilModal data={item} />
                </div>
              ) : (
                <div className="post privatePost">
                  <div className="postHeader">
                    <img
                      className="profileImage"
                      src={item.image}
                      alt=""/>
                    <h3>{item.user}</h3>
                  </div>
                  <p className="privatePostText postText">
                    El contenido de este post es privado. No puedes ver su
                    contenido
                  </p>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardFeed;
