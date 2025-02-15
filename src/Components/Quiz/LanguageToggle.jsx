// import React from 'react';
// import { FormControlLabel, Switch } from '@mui/material';

// const LanguageToggle = ({ language, setLanguage }) => {
//   const handleToggle = (event) => {
//     setLanguage(event.target.checked ? 'tamil' : 'english');
//   };

//   return (
//     <FormControlLabel
//       control={<Switch checked={language === 'tamil'} onChange={handleToggle} />}
//       label={language === 'tamil' ? 'தமிழ்' : 'English'}
//     />
//   );
// };

// export default LanguageToggle;


import React from 'react';
import { Box, Switch, Typography } from '@mui/material';

const LanguageToggle = ({ language, setLanguage }) => {
  const handleToggle = (event) => {
    setLanguage(event.target.checked ? 'tamil' : 'english');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Typography sx={{ color: 'white', mr: 1 }}>English</Typography>
      <Switch checked={language === 'tamil'} onChange={handleToggle} />
      <Typography sx={{ color: 'white', ml: 1 }}>தமிழ்</Typography>
    </Box>
  );
};

export default LanguageToggle;