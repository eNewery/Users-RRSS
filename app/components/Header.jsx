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
    const context = useContext(MiContexto)
  return (
    <header class="header">
        <div class="headerLeft">
            <div onClick={() => context.setDashboardContent("dashboardFeed")} className="headerLeftLogo"></div>
            <button onClick={() => context.setDashboardContent("personalPage")} className='myAccount'>Mi Perfil</button>
        </div>
        <div class="header-center">
            <div className="searchInputContainer">
            <input type="text" class="searchInput" onChange={(e) => context.setSearch(e.target.value)} placeholder="Buscar..."/>
            {context.results.map((item) => (
        <div className='searchItemContainer' key={item.id} onClick={() => context.getUserSearchDoc(item.username)}>
          <p className='searchItem'>{item.username}</p>
        </div>
      ))}
            </div>
        </div>
        <div class="header-right">
            <button onClick={handleLogout} class="logout-button">Cerrar Sesión</button>
        </div>
    </header>
  )
}

export default Header