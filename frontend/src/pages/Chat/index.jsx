import React, { useState, useEffect , useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const Chat = ({ socket, sessionId, isNewChat }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const handshakeSent = useRef(false);

  useEffect(() => {
    if (!socket || !sessionId) return;
    
    if (isNewChat && !handshakeSent.current) {
      console.log('Sending handshake');
      socket.emit('handshake', sessionId);
      handshakeSent.current = true;
    }

    // Load messages for the selected session
    socket.emit('loadSessionMessages', sessionId);

    const handleSessionMessages = ({ sessionId: loadedSessionId, messages: loadedMessages }) => {
      if (loadedSessionId === sessionId) {
        setMessages(loadedMessages.map(msg => ({
          ...msg,
          direction: msg.sender === 'ChatGPT' ? 'incoming' : 'outgoing'
        })));
      }
    };

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

    // Attach the event listeners
    socket.on('sessionMessages', handleSessionMessages);
    socket.on('message', handleMessage);

    // Cleanup function to remove the event listeners
    return () => {
      socket.off('sessionMessages', handleSessionMessages);
      socket.off('message', handleMessage);
    };
    
  }, [socket, sessionId, isNewChat]);

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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MainContainer style={{ flexGrow: 1 }}>
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
                  sentTime: message.date,
                  sender: message.sender,
                  direction: message.direction,
                  position: "single"
                }}
              />
            ))}
          </MessageList>
          <MessageInput placeholder="Type a message..." onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;