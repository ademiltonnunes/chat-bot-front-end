import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Box } from '@mui/material';
import { getSocket } from '../../api/sessions';

const SessionList = ({ onSessionSelect, refreshTrigger }) => {
  const [activeSessions, setActiveSessions] = useState({});
  const [endedSessions, setEndedSessions] = useState({});
  
  useEffect(() => {
    const socket = getSocket();

    const handleAllSessions = ({ activeSessions, endedSessions }) => {
        console.log('Received updated sessions:', { activeSessions, endedSessions });
        setActiveSessions(activeSessions);
        setEndedSessions(endedSessions);
    };

    socket.on('allSessions', handleAllSessions);
    socket.emit('getAllSessions');

    return () => {
      socket.off('allSessions', handleAllSessions);
    };
  }, [refreshTrigger]);

  const renderSessions = (sessions, isActive) => {
    const sortedSessions = Object.entries(sessions).sort((a, b) => new Date(b[1].startTime) - new Date(a[1].startTime));
    
    return (
    <List>
      {sortedSessions.map(([id, session]) => (
        <ListItem button key={id} onClick={() => onSessionSelect(id)}>
          <ListItemText 
            primary={`Session ${id.slice(0, 8)}...`}
            secondary={`${isActive ? 'Started' : 'Ended'}: ${new Date(session.startTime).toLocaleString()}`}
          />
        </ListItem>
      ))}
    </List>
    )
};

  return (
    <Paper elevation={3} style={{ height: '400px', overflow: 'auto' }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>Active Sessions</Typography>
        {Object.keys(activeSessions).length > 0 ? (
          renderSessions(activeSessions, true)
        ) : (
          <Typography>No active sessions</Typography>
        )}
        <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>Ended Sessions</Typography>
        {Object.keys(endedSessions).length > 0 ? (
          renderSessions(endedSessions, false)
        ) : (
          <Typography>No ended sessions</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SessionList;