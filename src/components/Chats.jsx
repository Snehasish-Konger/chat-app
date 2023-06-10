import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../appwrite";

const Chats = () => {
  const [chats, setChats] = useState([]);

  // const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  
  useEffect(() => {
    const getChats = async () => {
      const res = await db.listDocuments("chats");
      const chats = res.documents.map((d) => d.collectionId);
      const chatsData = await Promise.all(
        chats.map(async (c) => {
          const chat = await db.getDocument(`chats/${c}`);
          return chat;
        })
      );
      const chatsWithUserInfo = await Promise.all(
        chatsData.map(async (c) => {
          const userInfo = await db.getDocument(`users/${c.members[0]}`);
          return { ...c, userInfo };
        })
      );
      setChats(chatsWithUserInfo);
    };

    getChats();
  }, []);

  

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
