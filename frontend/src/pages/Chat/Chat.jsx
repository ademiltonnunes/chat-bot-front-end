import React from 'react';
import { Typography, Container } from '@mui/material';

const Chat = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Chatbot
      </Typography>
      
    </Container>
  );
};

export default Chat;
