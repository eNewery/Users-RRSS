"use client";
import React, { useContext, useEffect } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import PersonalPage from "../components/PersonalPage";
import { MiContexto } from "../components/context";
import DashboardFeed from "../components/DashboardFeed";
const Dashboard = () => {
  const router = useRouter();
  const context = useContext(MiContexto)
  useEffect(() => {
    // Suscríbete al estado de autenticación para obtener los cambios en el usuario
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        context.getYourUserData(currentUser.uid)
      } else {
        router.push("/");
      }
    });
    
    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <Header />
      {context.dashboardContent === "personalPage" ? <PersonalPage/> : context.dashboardContent === "dashboardFeed" ? <DashboardFeed/> : console.log("Ha ocurrido un error con el contenido del Dashboard.") }
      
    </div>
  );
};

export default Dashboard;
