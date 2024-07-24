import {useState} from 'react';
import { Button } from '@mui/material';

const StartChat = ({ onStartChat }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    setIsLoading(true);
    onStartChat();
    setIsLoading(false);
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleStartChat}
    >
      {isLoading ? 'Initializing...' : 'Start New Chat'}
    </Button>
  );
};

export default StartChat;