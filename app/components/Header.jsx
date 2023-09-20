"use client"
import React, { useContext, useState } from 'react'
import { MiContexto } from './context'
import { auth } from '../firebase'
const Header = () => {
  const [searchState, setSearchState] = useState(false)
  function setSearch() {
    const links = document.querySelectorAll(".myAccountMedia")
    const inputSearch = document.querySelector(".searchInput")

      links?.forEach(item => item.style.display = "none")
      inputSearch.style.animationName = "extendSearch"
      inputSearch.style.animationDuration = "1s"
      inputSearch.style.animationFillMode = "both"
      setSearchState(!searchState)
    }
    function getUser(user) {
      const links = document.querySelectorAll(".myAccountMedia")
      const inputSearch = document.querySelector(".searchInput")
      inputSearch.style.animationName = "extendSearch-o"
      inputSearch.style.animationDuration = "1s"
      inputSearch.style.animationFillMode = "both"
      context.getUserSearchDoc(user)
      setTimeout(() => {
  links?.forEach(item => item.style.display = "flex")
  setSearchState(!searchState)
}, 1000);
  }
  function closeSearch() {
    const links = document.querySelectorAll(".myAccountMedia")
    const inputSearch = document.querySelector(".searchInput")
    inputSearch.style.animationName = "extendSearch-o"
    inputSearch.style.animationDuration = "1s"
    inputSearch.style.animationFillMode = "both"
    setTimeout(() => {
      links?.forEach(item => (item.style.display = "flex", item.style.animation = "appear 1s both"))
      setSearchState(!searchState)

    }, 1000);
  }
    const handleLogout = async () => {
        try {
          context.setDashboardContent("personalPage")
          await auth.signOut();
          // Cierre de sesión exitoso, puedes redirigir al usuario a otra página o realizar otras acciones
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      };
      function goPersonalPage() {
        context.setDashboardContent("personalPage")
        context.getUserDoc(context.user.uid)
      }
    const context = useContext(MiContexto)
  return (
    <header className="header">
        <div className="headerLeft">
            <div  className="headerLeftLogo"></div>
            <nav className='btnNavList'>
            <button onClick={() => context.setDashboardContent("dashboardFeed")} className='myAccount'>Feed</button>
            <span onClick={() => context.setDashboardContent("dashboardFeed")} class="myAccountMedia material-symbols-outlined">
forum
</span>
            <button onClick={() => goPersonalPage()} className='myAccount'>Mi Perfil</button>
            <span onClick={() => goPersonalPage()} class="myAccountMedia material-symbols-outlined">
person
</span>
<button onClick={() => context.setDashboardContent("messages")} className='myAccount'>Mensajes</button>
<span onClick={() => context.setDashboardContent("messages")} class="material-symbols-outlined myAccountMedia">
chat
</span>
            </nav>
        </div>
        <div className="header-center">
       {searchState === false ? <span onClick={() => setSearch()} class="material-symbols-outlined searchInputMedia myAccountMedia">
search
</span> : <div className="searchInputContainerMedia">
            <input type="text" className="searchInput" onChange={(e) => context.setSearch(e.target.value)} placeholder="Buscar..." />
            <span onClick={() => closeSearch()} class="material-symbols-outlined">
close
</span>
            {context.results?.map((item) => (
              <div className='searchItemContainer' key={item.id} onClick={() => getUser(item.username)}>
          <p className='searchItem'>{item.username}</p>
        </div>
      ))}
            </div>}
        
            <div className="searchInputContainer">
            <input type="text" className="searchInput" onChange={(e) => context.setSearch(e.target.value)} placeholder="Buscar..."/>
            {context.results?.map((item) => (
        <div className='searchItemContainer' key={item.id} onClick={() => context.getUserSearchDoc(item.username)}>
          <p className='searchItem'>{item.username}</p>
        </div>
      ))}
            </div>
        </div>
        <div className="header-right">
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            <span onClick={handleLogout} class="myAccountMedia material-symbols-outlined">
logout
</span>
        </div>
    </header>
  )
}

export default Header