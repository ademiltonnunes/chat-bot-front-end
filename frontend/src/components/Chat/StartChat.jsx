import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { initializeSocket } from '../../api/sessions';

const StartChat = ({ onStartChat }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartChat = async () => {
    setIsLoading(true);
    setError('');

    try {
      const socket = await initializeSocket();

      if (socket.connected) {
        socket.emit('startSession');
        socket.on('sessionStarted', ({ sessionId }) => {
          onStartChat(socket, sessionId);
        });
      } else {
        setError('Could not connect to the server. Please try again later.');
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartChat}
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Start Chat'}
      </Button>
    </>
  );
};

export default StartChat;
