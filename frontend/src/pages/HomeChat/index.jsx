import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Grid, CircularProgress, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Chat from '../Chat';
import StartChat from '../../components/Chat/StartChatButton';
import EndChat from '../../components/Chat/EndChatButton';
import BackButton from '../../components/Chat/BackButton'; 
import SessionList from '../../components/Chat/SessionList';
import SeeActivityButton from '../../components/Chat/SeeActivityButton';
import ActivityPage from '../Activity';
import {
  initializeSocket,
  getSocket,
  disconnectSocket,
  startSession,
  endSession,
} from '../../api/sessions';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
}));

const HomeChat = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshSessionList, setRefreshSessionList] = useState(0);
  const [isNewChat, setIsNewChat] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
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
      setIsNewChat(true);
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
    
    } catch (err) {
      setError('Error ending session');
      console.error('Error ending session:', err);
    }
  }, [sessionId]);

  const handleSessionSelect = (selectedSessionId) => {
    setSessionId(selectedSessionId);
    setChatStarted(true);
    setIsNewChat(false);
  };

  const handleSeeActivity = useCallback(() => {
    setShowActivity(true);
  }, []);

  const handleBack = () => {
    setShowActivity(false);
    setChatStarted(false);
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
      <Typography variant="h3" component="h1" gutterBottom align="center" style={{ marginBottom: '30px' }}>
        Welcome to Our Chatbot
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <Typography variant="h5" gutterBottom>Sessions</Typography>
            {socket && <SessionList onSessionSelect={handleSessionSelect} refreshTrigger={refreshSessionList} />}
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3}>
            {chatStarted ? (
              <>
               <Box display="flex" justifyContent="space-between" mb={2}>
                <BackButton onClick={handleBack} />
                <EndChat onEndChat={handleEndChat} />
              </Box>
              <Box flexGrow={1} overflow="auto">
                <Chat socket={socket} sessionId={sessionId} isNewChat={isNewChat} />
              </Box>
              </>
             ) : showActivity ? (
              <ActivityPage onBack={handleBack} />
            ) : (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
              <StartChat onStartChat={handleStartChat} />
              <SeeActivityButton onClick={handleSeeActivity} />
            </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeChat;