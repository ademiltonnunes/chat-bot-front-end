import React, { useState, useEffect , useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { Container } from '@mui/material';

const Chat = ({ socket, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const handshakeSent = useRef(false);

  useEffect(() => {
    if (!socket) return;
    
    if (!handshakeSent.current) {
      console.log('Sending handshake');
      socket.emit('handshake', sessionId);
      handshakeSent.current = true;
    }

    // Define the handler function for incoming messages
    const handleMessage = (msg) => {
      console.log('Received message from server:', msg); // Debug log
      const incomingMessage = {
        ...msg,
        direction: msg.sender === 'ChatGPT' ? 'incoming' : 'outgoing'
      };
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      setTyping(false);
    };

    // Attach the event listener
    socket.on('message', handleMessage);

    // Cleanup function to remove the event listener
    return () => {
      socket.off('message', handleMessage);
    };
    
  }, [socket]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      date: new Date(),
      sender: "User",
      direction: "outgoing"
    };

    // Update the state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Emit the message to the server
    socket.emit('message', sessionId, newMessage);

    // Turn on the typing indicator
    setTyping(true);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <div style={{ position: "center", height: "700px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Chat GPT is typing..." /> : null}
            >
              {messages.map((message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.message,
                    date: message.date,
                    sender: message.sender,
                    direction: message.direction
                  }}
                />
              ))}
            </MessageList>
            <MessageInput placeholder="Type a message..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </Container>
  );
};

export default Chat;
