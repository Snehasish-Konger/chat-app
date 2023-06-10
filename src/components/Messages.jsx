import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db, listenForMessages } from "../appwrite";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [fetchMessages, setFetchMessages] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const fetchChatMessages = async () => {
      try {
        const fetchedMessages = await db.getMessages(data.chatId);
        setMessages(fetchedMessages);
        setFetchMessages(false);

        unsubscribe = listenForMessages(data.chatId, (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        //if there is no messages, set fetchMessages to false
        if (fetchedMessages.length === 0) {
          setFetchMessages(false);
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    if (fetchMessages) {
      fetchChatMessages();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [data.chatId, fetchMessages]);

  console.log(messages);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
