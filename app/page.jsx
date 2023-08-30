"use client"
import Login from "./components/Login"
import Register from "./components/Register"
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";
export default function Home() {
  const [tasks, setTasks] = useState([])
  async function fetchFirebase() {
    const documentsArray = [];
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
    documentsArray.push(doc.data())
    })
    setTasks(documentsArray)
    console.log(tasks)
  }
  useEffect(() => {
fetchFirebase()
  }, [])

  return (
    <main>
      <Register/>
      <Login/>
    </main>
  )
}
