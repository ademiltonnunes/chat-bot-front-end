import React, { useState, useEffect} from 'react';
import { Typography, Container } from '@mui/material';
import StartChat from '../../components/Chat/StartChat';
import Chat from '../Chat';
import EndChat from '../../components/Chat/EndChat';
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
  startSession,
  endSession,} from '../../api/sessions';

const HomeChat = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize the socket connection
    initializeSocket()
      .then((socketInstance) => {
        setSocket(socketInstance);
      })
      .catch((err) => {
        setError('Could not connect to the server. Please try again later.');
        console.error('Socket initialization error:', err);
      });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleStartChat = async () => {
    try {
      const socketInstance = getSocket();
      if (socketInstance.disconnectSocket) {
        setError('Could not connect to the server. Please try again later.');
        return;
      }

      const id = await startSession();
      setSessionId(id);
      setChatStarted(true);
    } catch (err) {
      setError('Error starting session:');
      console.error('Error starting session:', err);
    }
  };

  const handleEndChat = () => {
    try {
      if (sessionId) {
        endSession(sessionId);
        setSessionId(null);
      }

      // End the chat
      setChatStarted(false);
    }
    catch (err) {
      setError('Error ending session');
      console.error('Error ending session:', err);
    }
  };

  return (
    <div>
      {error && <Typography color="error">{error}</Typography>}
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
