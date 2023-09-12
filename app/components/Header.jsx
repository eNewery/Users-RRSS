"use client"
import React, { useContext } from 'react'
import { MiContexto } from './context'
import { auth } from '../firebase'
const Header = () => {
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
            <button onClick={() => goPersonalPage()} className='myAccount'>Mi Perfil</button>
            </nav>
        </div>
        <div className="header-center">
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
        </div>
    </header>
  )
}

export default Header