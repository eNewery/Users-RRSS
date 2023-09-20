import React, { useContext, useState, useEffect } from "react";
import { MiContexto } from "./context";
import { db } from "../firebase";
import { where, updateDoc, doc, getDoc } from "firebase/firestore";

const Messages = () => {
  const [messages, setMessages] = useState([]);
const [textMessage, setTextMessage] = useState("")
  const context = useContext(MiContexto);
useEffect(() => {
openChat(context.actualChatId)
}, [context.actualChatId])

  const sendMessage = async (e) => {
    e.preventDefault()
    const fechaHoraActual = new Date();

const cadenaFechaHoraActual = fechaHoraActual.toLocaleString();
    const docRef = doc(db, "users", "messages");
    const chats = []
    const chatsFiltered = context.messages.chats.filter(item => item.chatId !== parseInt(context.actualChatId))
    const chatsFilt = context.messages.chats.filter(item => item.chatId === parseInt(context.actualChatId))
    console.log("Estos son todos los chats menos el de el chatId actual:", chatsFiltered)
    console.log("Este es solo el chat con el chatId actual:", chatsFilt)
    chatsFilt.map(item => item.messages.push({messageText:textMessage, messageDate:cadenaFechaHoraActual, messageUsername:context.user.displayName, messageUserImage: context.userData.image}))
chatsFiltered.map(item => chats.push(item))
chatsFilt.map(item => chats.push(item))
console.log(chats)
  updateDoc(docRef, {
    ["chats"]: chats
  })
  context.getMessages()
  const chatIdsEnChats = context.userData.friends?.map((chat) => parseInt(chat.chatId));
  const amigosConMensajes = context.messages.chats?.filter((friend) =>
    chatIdsEnChats.includes(parseInt(friend.chatId))
  );
  console.log("Amigos: ", amigosConMensajes)
  const filtered = context.messages.chats.filter(
    (item) => item.chatId === context.actualChatId
  );
  console.log("Filtrado de users:", filtered)
  const filt = filtered.map(item => item.messages);
  setMessages(filt);

}



function openChat(chatId) {
  context.getMessages()

  const filtered = context.messages.chats.filter(
    (item) => item.chatId === chatId
  );
  console.log("Filtrado para chequear datos:", filtered)
  const filt = filtered.map(item => item.messages);
  const chat = filtered.map((item) => item.chatId.toString())
  const users = filtered.map(item => item.users)
  const userFiltered = users[0]?.filter(item => item !== context.user.displayName)
  context.setChatUsername(userFiltered?.toString())
  context.setActualChatId(parseInt(chat[0]))
  setMessages(filt);
}
  return (
    <div className="dashboardGeneralContainer">
      <div className="dashboardMessages">
      <div className="messagesContainer">
      {context.messageData?.length === 0 ? <p>No tienes amigos, prueba añadir a alguien</p> : <div className="chatItemsContainer">
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
            <div>
            <div className="userName">{context.chatUsername}</div>
            </div>
            <div className="screenMessages">{context.actualChatId === "" ? <p>Selecciona un chat</p> : messages[0]?.map(item => <div className={item.messageUsername === context.user.displayName ? "screenMessageItem screenMessageItemRight" : "screenMessageItem screenMessageItemLeft"}><div className="userAndImage"><img src={item.messageUserImage} alt="" className="userImage" /><p>{item.messageUsername}:</p></div><p>{item.messageText}</p><p className="messageHour">{item.messageDate}</p></div>)}</div>
            <form onSubmit={sendMessage}>
          <input
          onChange={(e) => setTextMessage(e.target.value)}
            className="inputChat"
            type="text"
            placeholder="Escribe tu mensaje..."
          />
            </form>
          </div>
        </div>}
        
      </div>
      </div>
    </div>
  );
};

export default Messages;
