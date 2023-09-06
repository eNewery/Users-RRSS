"use client"
import Login from "./components/Login"
import Register from "./components/Register"
import { useContext } from "react";
import { MiContexto } from "./components/context";
export default function Home() {

const context = useContext(MiContexto)
  return (
    <main>
      {context.isRegistered === true ? <Register/> : <Login/>}
    </main>
  )
}
