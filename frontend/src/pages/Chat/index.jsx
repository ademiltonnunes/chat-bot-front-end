import React, { useState } from 'react';
import StartChat from './StartChat';
import Chat from './Chat';
import EndChat from './EndChat';
import { disconnectSocket } from '../../api/sessions';

const ChatPage = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [socket, setSocket] = useState(null);

  const handleStartChat = (socket) => {

    // Set socket connection
    setSocket(socket);

    // Start the chat
    setChatStarted(true);
  };

  const handleEndChat = () => {

    // End socket connection
    disconnectSocket();
    setSocket(null);

    // End the chat
    setChatStarted(false);
  };

  return (
    <div>
      {chatStarted ? 
        (
          <>
            <Chat socket={socket} />
            <EndChat onEndChat={handleEndChat} />
          </>
        ) 
        : 
        (<StartChat onStartChat={handleStartChat} />)
      }
    </div>
  );
};

export default ChatPage;
