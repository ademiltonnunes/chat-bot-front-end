import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import BackButton from '../../components/Chat/BackButton';
import { getSocket } from '../../api/sessions';

const ActivityPage = ({ onBack }) => {
  const [allSessions, setAllSessions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    const handleAllSessions = ({ activeSessions, endedSessions }) => {
      setAllSessions({ ...activeSessions, ...endedSessions });
      setIsLoading(false);
    };

    socket.on('allSessions', handleAllSessions);
    socket.emit('getAllSessions');

    return () => {
      socket.off('allSessions', handleAllSessions);
    };
  }, []);

  const activityData = useMemo(() => {
    const sessionCounts = {};
    Object.values(allSessions).forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0];
      sessionCounts[date] = (sessionCounts[date] || 0) + 1;
    });

    return Object.entries(sessionCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allSessions]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box height="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <BackButton onClick={onBack} />
        <Typography variant="h5">Activity Overview</Typography>
      </Box>
      <Box height="calc(100% - 60px)">
        <ResponsiveBar
          data={activityData}
          keys={['count']}
          indexBy="date"
          margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Sessions',
            legendPosition: 'middle',
            legendOffset: 60
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </Box>
    </Box>
  );
};

export default ActivityPage;