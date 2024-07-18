import React, { useState } from 'react';
import StartChat from './StartChat';
import Chat from './Chat';

const ChatPage = () => {
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartChat = () => {
    setChatStarted(true);
  };

  return (
    <div>
      {chatStarted ? (<Chat />) : (<StartChat onStartChat={handleStartChat} />)}
    </div>
  );
};

export default ChatPage;
