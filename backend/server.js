import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env file
dotenv.config();

// Loading values for system variables
const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;


// Create a server to serve the frontend
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // Allow the frontend to connect to the WebSocket server
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for handshake event
  socket.on('handshake', () => {
    console.log('Handshake event received');
    socket.emit('message', {
      message: 'Hello! How can I help you today?',
      date: new Date(),
      sender: "ChatGPT"
    });
  });

  // Listen to incoming messages
  socket.on('message', async (msg) => {
    console.log('Received message:', msg.message);

    // Process message to ChatGPT
    const response = await processMessage(msg);
    io.emit('message', {
      message: response,
      date: new Date(),
      sender: 'ChatGPT'
    });
  });

  socket.on('endChat', () => {
    console.log('Chat ended');
    socket.disconnect();
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const processMessage = async (chatMessage) => {
  const apiMessage = [
    {
      role: chatMessage.sender === 'ChatGPT' ? 'assistant' : 'user',
      content: chatMessage.message
    }
  ];

  const systemMessage = {
    role: "system",
    content: "Explain all concepts like a 10 years of experience software engineer."
  };

  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [systemMessage, ...apiMessage]
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from API';
  } catch (error) {
    console.error('Error processing message:', error);
    return 'Sorry, there was an error processing your request.';
  }
};

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
