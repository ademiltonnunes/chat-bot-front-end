import React from 'react';
import { Button } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const SeeActivityButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<BarChartIcon />}
      onClick={onClick}
      style={{ marginTop: '20px' }}
    >
      See Activity
    </Button>
  );
};

export default SeeActivityButton;