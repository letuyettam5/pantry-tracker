import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Modal, Stack, TextField, Button } from "@mui/material";

const TopContainer = ({ children }) => {
  return (
    <Box
    sx={{
      position: 'sticky',
      top: 0,
      width: '100vw',
      height: '35vh', 
      backgroundColor: '#93E9BE', 
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
    }}
    >
      
      {children}
    </Box>
  );
};

TopContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TopContainer;


