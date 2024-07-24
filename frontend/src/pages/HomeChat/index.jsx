import React, { useState } from 'react';
import { Typography, Container } from '@mui/material';
import StartChat from '../../components/Chat/StartChat';
import Chat from '../Chat';
import EndChat from '../../components/Chat/EndChat';
import { disconnectSocket , endSession} from '../../api/sessions';

const HomeChat = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleStartChat = (socket, sessionId) => {

    console.log('Chat started with session ID:', sessionId); // Debug log

    // Set socket connection
    setSocket(socket);
    // Set current session ID
    setSessionId(sessionId);

    // Start the chat
    setChatStarted(true);
  };

  const handleEndChat = () => {
    console.log('End chat button clicked'); // Debug log
  
    if (sessionId) {
      endSession(socket, sessionId);
    }
  
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
            <Chat socket={socket}  sessionId={sessionId}/>
            <EndChat onEndChat={handleEndChat} />
          </>
        ) 
        : 
        (
          <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to Our Chatbot
            </Typography>
            <StartChat onStartChat={handleStartChat} />
          </Container>
        )
      }
    </div>
  );
};

export default HomeChat;
