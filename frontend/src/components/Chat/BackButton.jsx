import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ onClick, label = 'Back', ...props }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={onClick}
      {...props}
    >
      {label}
    </Button>
  );
};

export default BackButton;