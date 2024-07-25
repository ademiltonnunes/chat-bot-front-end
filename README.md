# Chatbot UI

## Overview
Chatbot UI is a React-based web application offering a user-friendly interface for AI chatbot interactions. It features real-time chat, session management, and activity visualization. While the project focuses on frontend development, it includes a backend server for testing and demonstration purposes. The backend manages WebSocket communication, AI integration, session handling, and message storage.
Please take a look at our slide presentation for a detailed project architecture and feature breakdown [link here](https://pitch.com/v/cosmochat-ui-fsvuef).

## Features
- Real-time chat functionality
- Comprehensive session management
- Insightful activity visualization
- WebSocket-based communication
- Integration with generative AI

## Technologies Used
- React.js
- Material-UI for styling
- Socket.io for real-time communication
- Nivo for data visualization

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

You can download and install Node.js and npm from [https://nodejs.org/](https://nodejs.org/)

## OpenAI API Key
This project requires an OpenAI API key to function. Follow these steps to obtain and configure your API key:

1. Sign up for an account at [https://openai.com/](https://openai.com/)
2. Navigate to the API section and create a new API key


## Installation

1. Clone the repository:
   ```
     git clone https://github.com/ademiltonnunes/chat-bot-ui.git
   ```
2. Navigate to the project directory backend:
   ```
   cd chatbot-ui/backend
   ```
3. Install the backend dependencies:
   ```
    npm install
   ```
4. Navigate to the project directory frontend:
   ```
   cd chatbot-ui/frontend
   ```
5. Install the backend dependencies:
   ```
     npm install
   ```

## Configuration
### Creating `.env` file
1. Navigate to the project directory backend:
   ```
     cd chatbot-ui/backend
   ```
2. Create a `.env` file in the root directory.
3. Add the following environment variables:
   ```
   PORT = 8080 //Port Sugestion
   API_KEY = "API key you copied from OpenAI"
   SESSION_TIMEOUT=30
   CLIENT_ORIGIN = "Client/fontend URL, usually it is http://localhost:3000"
   ```
### Setting the Server URL
1. Navigate to the project directory frontend API connection:
   ```
     cd chatbot-ui/frontend/scr/api
   ```
2. Open the file `sessions.js`
3. Update the SERVER_URL with the current backend URL that you configured in the backend. Usually, it is http://localhost:8080 

## Running the Application
### Run the backend
1. Navigate to the project directory backend:
   ```
     cd chatbot-ui/backend
   ```
2. Start the development server:
   ```
    npm start
   ```
### Run the backend
1. Navigate to the project directory backend:
   ```
     cd chatbot-ui/frontend
   ```
2. Start the development client:
   ```
    npm start
   ```
2. Open your browser and visit `http://localhost:3000`

## Usage
- Click on "Start New Chat" to begin a chat session.
- Use the input field at the bottom to send messages.
- See the system responses
- Click "End Chat" to terminate the current session.
- Click "See Activity" to view a chart of chat session frequency.
- The left sidebar displays all active and ended sessions.
Please, watch the video on this [link](https://www.loom.com/share/b72d147859a747a58f48f8abd626f40d?sid=dadcd91a-4878-40b5-a322-69cde30051f1) to see more usage details.

