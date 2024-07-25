import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env file
dotenv.config();

// Loading values for system variables
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;
// Setting up time out for the chat
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT, 10) || 30;

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

// Store active sessions
const sessions = {};

// Check session timeout
const checkSessionTimeout = () => {
  const now = new Date();

  // Filter sessions to include only those with endTime as null
  const activeSessions = Object.keys(sessions).filter(sessionId => !sessions[sessionId].endTime);

  activeSessions.forEach(sessionId => {
    const session = sessions[sessionId];
    const sessionDuration = (now - new Date(session.startTime)) / (1000 * 60);

    // Check if the session has timed out
    if (sessionDuration > session.timeout) {
      session.endTime = now;  // End the session
      io.to(session.socketId).emit('sessionTimeout', { sessionId });
      console.log(`Session timed out: ${sessionId}`);
    }
  });
};

setInterval(checkSessionTimeout, 60000); // Check for timeouts every minute


// Calls that can be made when the user is connected
io.on('connection', (socket) => {
  console.log('User connected');

  // Start sessions
  socket.on('startSession', () => {
    // Generate a new session ID
    const sessionId = uuidv4();

    // Store the session
    sessions[sessionId] = {
      startTime: new Date(),
      endTime: null,
      timeout: SESSION_TIMEOUT,
      socketId: socket.id,
      messages: []
    };

    // Emit the session ID to the client
    socket.emit('sessionStarted', { sessionId });
    console.log(`Session started: ${sessionId}`);
  });

  // End sessions we set the end time of the session
  socket.on('endSession', (sessionId) => {
    if (sessions[sessionId]) {
      sessions[sessionId].endTime = new Date();
      console.log(`Session ended: ${sessionId} in ${sessions[sessionId].endTime} `);
      socket.emit('sessionEnded', { sessionId });
    } else {
      socket.emit('error', { message: 'Session not found' });
    }
  });

  // Listen for handshake event
  socket.on('handshake', (sessionId) => {
    if (!sessions[sessionId]) {
      console.log('Session not found - handshake');
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    const message = {
      message: 'Hello! How can I help you today?',
      date: new Date(),
      sender: "ChatGPT"
    };
    sessions[sessionId].messages.push(message);

    console.log('Handshake event received');
    socket.emit('message', message);
  });

  // Listen to incoming messages
  socket.on('message', async (sessionId, msg) => {
    try{
      if (!sessions[sessionId]) {
        console.log('Session not found - messaging');
        socket.emit('error', { message: 'Session not found' });
        return;
      }
  
      // Store the message
      sessions[sessionId].messages.push(msg);
      console.log('Received message:', msg.message);
  
      // Process message to ChatGPT
      const response = await processMessage(msg);
  
      // Get the response message
      const responseMessage = {
        message: response,
        date: new Date(),
        sender: 'ChatGPT'
      };
  
      // Store the response
      sessions[sessionId].messages.push(responseMessage);
  
      io.emit('message', responseMessage);

    }
    catch(err){
      console.error('Error processing message:', err);
      socket.emit('error', { message: 'Error processing your message' });
    }
    
  });


  // Getting all sessions
  socket.on('getAllSessions', () => {
    const activeSessions = {};
    const endedSessions = {};

    Object.entries(sessions).forEach(([id, session]) => {
      if (session.endTime) {
        endedSessions[id] = session;
      } else {
        activeSessions[id] = session;
      }
    });

    socket.emit('allSessions', { activeSessions, endedSessions });
  });

  // Loading session messages
  socket.on('loadSessionMessages', (sessionId) => {
    const session = sessions[sessionId];
    if (session) {
      socket.emit('sessionMessages', { sessionId, messages: session.messages });
    } else {
      socket.emit('error', { message: 'Session not found' });
    }
  });



});

app.get('/sessions', (req, res) => {
  res.json(sessions);
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

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from API';
  } catch (error) {
    console.error('Error processing message:', error);
    return 'Sorry, there was an error processing your request.';
  }
};

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
