import React, { useState, useEffect , useCallback} from 'react';
import { Typography, Container, Grid, CircularProgress } from '@mui/material';
import StartChat from '../../components/Chat/StartChat';
import Chat from '../Chat';
import EndChat from '../../components/Chat/EndChat';
import SessionList from '../../components/Chat/SessionList';
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
  startSession,
  endSession,
} from '../../api/sessions';

const HomeChat = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshSessionList, setRefreshSessionList] = useState(0);

  useEffect(() => {
    // Initialize the socket connection
    initializeSocket()
      .then((socketInstance) => {
        setSocket(socketInstance);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Could not connect to the server. Please try again later.');
        console.error('Socket initialization error:', err);
        setIsLoading(false);
      });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleStartChat = async () => {
    try {
      const socketInstance = getSocket();
      if (!socketInstance || !socketInstance.connected) {
        setError('Could not connect to the server. Please try again later.');
        return;
      }

      const id = await startSession();
      setSessionId(id);
      setChatStarted(true);
      setRefreshSessionList(prev => prev + 1);
    } catch (err) {
      setError('Error starting session:');
      console.error('Error starting session:', err);
    }
  };

  const handleEndChat = useCallback(async () => {
    try {
      if (sessionId) {
        await endSession(sessionId);
        setSessionId(null);
      }

      setChatStarted(false);
      setRefreshSessionList(prev => prev + 1);

      // Force an immediate refresh of the session list
      socket.emit('getAllSessions');
    }
    catch (err) {
      setError('Error ending session');
      console.error('Error ending session:', err);
    }
  }, [sessionId, socket]);

  const handleSessionSelect = (selectedSessionId) => {
    setSessionId(selectedSessionId);
    setChatStarted(true);
  };

  if (isLoading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>Sessions</Typography>
          {socket && <SessionList onSessionSelect={handleSessionSelect} refreshTrigger={refreshSessionList} />}
        </Grid>
        <Grid item xs={12} md={8}>
          {chatStarted ? (
            <>
              <Chat socket={socket} sessionId={sessionId} />
              <EndChat onEndChat={handleEndChat} />
            </>
          ) : (
            <>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Our Chatbot
              </Typography>
              <StartChat onStartChat={handleStartChat} />
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
export default HomeChat;
