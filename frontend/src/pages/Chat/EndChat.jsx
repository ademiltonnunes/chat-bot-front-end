import React from 'react';
import { Button, Container } from '@mui/material';

const EndChat = ({ onEndChat }) => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
      <Button variant="contained" color="secondary" onClick={onEndChat}>
        End Chat
      </Button>
    </Container>
  );
};

export default EndChat;
