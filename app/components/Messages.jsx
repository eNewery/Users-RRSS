import React, { useContext, useState } from "react";
import { MiContexto } from "./context";
import { db } from "../firebase";
import { where, updateDoc, doc, getDoc } from "firebase/firestore";

const Messages = () => {
  const [messages, setMessages] = useState([]);
const [actualChatId, setActualChatId] = useState("")
const [textMessage, setTextMessage] = useState("")
const [chatUsername, setChatUsername] = useState("")
  const context = useContext(MiContexto);
  function openChat(chatId) {
    const filtered = context.messagesData.filter(
      (item) => item.chatId === chatId
    );
    const filt = filtered.map(item => item.messages);
    const chat = filtered.map((item) => item.chatId.toString())
    const users = filtered.map(item => item.users)
    const userFiltered = users[0].filter(item => item !== context.user.displayName)
    setChatUsername(userFiltered.toString())
    setActualChatId(chat[0])
    setMessages(filt);
  }
  const sendMessage = async (e) => {
    e.preventDefault()
    const docRef = doc(db, "users", "messages");
    const chats = []
    const chatsFiltered = context.messagesData.filter(item => item.chatId !== parseInt(actualChatId))
    const chatsFilt = context.messagesData.filter(item => item.chatId === parseInt(actualChatId))
    console.log("Estos son todos los chats menos el de el chatId actual:", chatsFiltered)
    console.log("Este es solo el chat con el chatId actual:", chatsFilt)
    chatsFilt.map(item => item.messages.push("Soy gay"))
chatsFiltered.map(item => chats.push(item))
chatsFilt.map(item => chats.push(item))
console.log(chats)
  updateDoc(docRef, {
    ["chats"]: chats
  })
}
  
  return (
    <div className="dashboardGeneralContainer">
      <div className="messagesContainer">
        <div className="chatItemsContainer">
          <div className="chatItems">
            {context.messagesData?.map((item) => (
              <div
                className="chatItem"
                onClick={() => openChat(item.chatId)}
                key={item.chatId}
              >
                {item.users.filter((item) => item !== context.user.displayName)}
              </div>
            ))}
          </div>
          <div className="chatScreen">
            <div className="userName">{chatUsername}</div>
            <div className="screenMessages">{messages?.map(item => <p>{item}</p>)}</div>
            <form onSubmit={sendMessage}>
          <input
          onChange={(e) => setTextMessage(e.target.value)}
            className="inputChat"
            type="text"
            placeholder="Escribe tu mensaje..."
          />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
