import React from 'react';
import { Box } from '@mui/material';

export default function TopContainer() {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        width: '100vw',
        height: '35vh', 
        backgroundColor: '#f5f5f5', 
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
    </Box>
  );
}


