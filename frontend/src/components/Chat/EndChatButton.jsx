import React from 'react';
import { Button } from '@mui/material';

const EndChat = ({ onEndChat }) => {
  return (
    <Button variant="outlined" color="secondary" onClick={onEndChat} size="small">
      End Chat
    </Button>
  );
};

export default EndChat;
