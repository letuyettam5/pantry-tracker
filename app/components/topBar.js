import React from 'react';
import PropTypes from 'prop-types';
import {Box} from "@mui/material";

const TopContainer = ({ children, className }) => {
  return (
    <Box
    className={`grid ${className}`}
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
  className: PropTypes.node.isRequired
};

export default TopContainer;


