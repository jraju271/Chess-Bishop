import './NavigationBar.css';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LocalLibrary, Settings, Extension, Home, SmartToy, People, PersonSearch } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent } from '@mui/material';

function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Set active button based on current path
    const path = location.pathname.substring(1);
    setActiveButton(path || 'home');
  }, [location]);

  // Add this check to hide navigation bar on specific routes
  const hideNavigation = ['/Auth', '/playwithcomputer', '/PlayWithComputer','/chess-quiz'].includes(location.pathname);

  // If on a route where navigation should be hidden, return null
  if (hideNavigation) {
    return null;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className="nav-container">
      <Box className="nav-background">
        <Box className="nav-buttons">
          <Link to="/" className="nav-link">
            <Button 
              className={`nav-button ${activeButton === 'home' ? 'active' : ''}`}
              onClick={() => setActiveButton('home')}
            >
              <Home sx={{ mr: 1 }} /> Home
            </Button>
          </Link>
          
          <Link to="/puzzle" className="nav-link">
            <Button 
              className={`nav-button ${activeButton === 'puzzle' ? 'active' : ''}`}
              onClick={() => setActiveButton('puzzle')}
            >
              <Extension sx={{ mr: 1 }} /> Puzzle
            </Button>
          </Link>

          <Link to="/learn" className="nav-link">
            <Button 
              className={`nav-button ${activeButton === 'learn' ? 'active' : ''}`}
              onClick={() => setActiveButton('learn')}
            >
              <LocalLibrary sx={{ mr: 1 }} /> Learn
            </Button>
          </Link>

          <Button 
            className={`nav-button ${open ? 'active' : ''}`}
            onClick={handleClickOpen}
          >
            Play Now
          </Button>

          <Link to="/legends" className="nav-link">
            <Button 
              className={`nav-button ${activeButton === 'legends' ? 'active' : ''}`}
              onClick={() => setActiveButton('legends')}
            >
              Legends
            </Button>
          </Link>

          <Link to="/settings" className="nav-link">
            <Button 
              className={`nav-button ${activeButton === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveButton('settings')}
            >
              <Settings sx={{ mr: 1 }} /> Settings
            </Button>
          </Link>
        </Box>
      </Box>

      <Dialog
        open={open}
        fullWidth
        maxWidth={'xs'}
        onClose={handleClose}
        sx={{ 
          '& .MuiBackdrop-root': {
            backgroundColor: 'transparent'
          },
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <DialogContent className='nav-dialog-content'>
          <Link to='/PlayWithComputer' onClick={handleClose} className='ButtonLink'>
            <Button className="nav-dialog-button" startIcon={<SmartToy />}>PLAY With COMPUTER</Button>
          </Link>
          <Link to='/PlayWithFriends' onClick={handleClose} className='ButtonLink'>
            <Button className="nav-dialog-button" startIcon={<People />}>PLAY With FRIENDS</Button>
          </Link>
          <Link to='/Under' onClick={handleClose} className='ButtonLink'>
            <Button className="nav-dialog-button" startIcon={<PersonSearch />}>PLAY With RANDOM</Button>
          </Link>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default NavigationBar;
