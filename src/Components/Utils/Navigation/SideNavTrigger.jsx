import React from 'react';
import Box from '@mui/material/Box';

const SideNavTrigger = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        width: '22px',
        height: '96px',
        left: '0px',
        top: 'calc(50% - 96px/2)',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '15px',
          height: '82px',
          left: '0px',
          top: '147px',
          background: '#D79D05',
          borderRadius: '8px',
        }}
      />
      {/* <Box
        sx={{
          position: 'absolute',
          width: '96px',
          height: '16px',
          left: '22px',
          top: '140px',
          background: '#D79D05',
          borderRadius: '1px',
          transform: 'rotate(90deg)',
        }}
      /> */}
    </Box>
  );
};

export default SideNavTrigger;