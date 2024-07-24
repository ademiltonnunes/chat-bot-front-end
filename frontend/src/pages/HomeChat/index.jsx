import React, { useState } from 'react';
import { Typography, Container } from '@mui/material';
import StartChat from '../../components/Chat/StartChat';
import Chat from '../Chat';
import EndChat from '../../components/Chat/EndChat';
import { disconnectSocket } from '../../api/sessions';

const HomeChat = () => {
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
        (
          <>
            <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Our Chatbot
              </Typography>
              <StartChat onStartChat={handleStartChat} />
            </Container>


            
          </>
          
        )
      }
    </div>
  );
};

export default HomeChat;
