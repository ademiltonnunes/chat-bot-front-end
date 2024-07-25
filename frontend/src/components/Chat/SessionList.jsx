import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Tabs, Tab, Box } from '@mui/material';
import { getSocket } from '../../api/sessions';

const SessionList = ({ onSessionSelect, refreshTrigger }) => {
  const [activeSessions, setActiveSessions] = useState({});
  const [endedSessions, setEndedSessions] = useState({});
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const socket = getSocket();

    const handleAllSessions = ({ activeSessions, endedSessions }) => {
      setActiveSessions(activeSessions);
      setEndedSessions(endedSessions);
    };

    socket.on('allSessions', handleAllSessions);
    socket.emit('getAllSessions');

    return () => {
      socket.off('allSessions', handleAllSessions);
    };
  }, [refreshTrigger]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderSessions = (sessions) => (
    <List>
      {Object.entries(sessions).map(([id, session]) => (
        <ListItem button key={id} onClick={() => onSessionSelect(id)}>
          <ListItemText 
            primary={`Session ${id.slice(0, 8)}...`}
            secondary={`Started: ${new Date(session.startTime).toLocaleString()}`}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Paper elevation={3} style={{ maxHeight: '400px', overflow: 'auto', marginBottom: '20px' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Active Sessions" />
        <Tab label="Ended Sessions" />
      </Tabs>
      <Box p={3}>
        {tabValue === 0 ? (
          Object.keys(activeSessions).length > 0 ? (
            renderSessions(activeSessions)
          ) : (
            <Typography>No active sessions</Typography>
          )
        ) : (
          Object.keys(endedSessions).length > 0 ? (
            renderSessions(endedSessions)
          ) : (
            <Typography>No ended sessions</Typography>
          )
        )}
      </Box>
    </Paper>
  );
};

export default SessionList;