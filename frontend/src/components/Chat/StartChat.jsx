import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

const StartChat = ({ onStartChat }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    setIsLoading(true);
    await onStartChat();
    setIsLoading(false);
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleStartChat}
      disabled={isLoading}
      size="large"
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Start New Chat'}
    </Button>
  );
};

export default StartChat;