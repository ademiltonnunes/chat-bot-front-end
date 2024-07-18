import React from 'react';
import { Button, Typography, Container } from '@mui/material';

const StartChat = ({ onStartChat }) => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Our Chatbot
      </Typography>
      <Button variant="contained" color="primary" onClick={onStartChat}>
        Start Chat
      </Button>
    </Container>
  );
};

export default StartChat;
