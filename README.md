# Chatbot UI

## Overview
Chatbot UI is a React-based web application that provides a user-friendly interface for interacting with a chatbot. It includes features such as real-time chat, session management, and activity visualization.

## Features
- Real-time chat interface
- Session management (start, end, and view past sessions)
- Activity visualization showing chat session frequency
- Responsive design for desktop and mobile use

## Technologies Used
- React.js
- Material-UI for styling
- Socket.io for real-time communication
- Nivo for data visualization

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

# Chatbot UI

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

You can download and install Node.js and npm from [https://nodejs.org/](https://nodejs.org/)

## OpenAI API Key
This project requires an OpenAI API key to function. Follow these steps to obtain and configure your API key:

1. Sign up for an account at [https://openai.com/](https://openai.com/)
2. Navigate to the API section and create a new API key
3. Copy your API key
4. In the project's root directory, create a file named `.env` if it doesn't exist
5. Add the following line to the `.env` file:

```
  REACT_APP_OPENAI_API_KEY=your_api_key_here
```
Replace `your_api_key_here` with the API key you copied from OpenAI

**Note:** Never share your API key publicly or commit it to version control.

## Overview
...

## Installation

1. Clone the repository:
   ```
     git clone https://github.com/your-username/chatbot-ui.git
   ```
2. Navigate to the project directory:
  ```
   cd chatbot-ui
  ```
3. Install the dependencies:
   ```
    npm install
   ```

## Configuration
1. Create a `.env` file in the root directory.
2. Add the following environment variables:
REACT_APP_SOCKET_URL=http://localhost:8080
Replace the URL with your backend server URL if different.

## Running the Application

1. Start the development server:
   ```
    npm start
   ```
2. Open your browser and visit `http://localhost:3000`

## Usage
- Click on "Start New Chat" to begin a chat session.
- Use the input field at the bottom to send messages.
- Click "End Chat" to terminate the current session.
- Click "See Activity" to view a chart of chat session frequency.
- The left sidebar displays all active and ended sessions.

