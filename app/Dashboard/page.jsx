"use client"
import React from 'react'
import UserDetails from '../components/userDetails';
import { auth } from '../firebase';
const Dashboard = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Cierre de sesión exitoso, puedes redirigir al usuario a otra página o realizar otras acciones
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  return (
    <div><UserDetails/>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  )
}

export default Dashboard;