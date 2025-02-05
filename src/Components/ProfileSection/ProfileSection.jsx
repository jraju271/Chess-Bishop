import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Chip, Button, Popper} from '@mui/material';
import Transitions from '../Utils/ui-component/extended/Transitions';
import User1 from '../../assets/Image/users/user-round.svg';
import { Settings } from '@mui/icons-material';
import './ProfileSection.css'
import { In } from "react-flags-select";
import {FB_Logout} from '../../Middleware/Firebase/FBController'
function ProfileSection(props){
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {

    FB_Logout();
    window.location.reload();

};
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;

    const handleOutsideClick = (event) => {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        handleClose(event);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);






  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          borderColor: 'var(--PrimaryButtonColor)',
          backgroundColor: 'var(--PrimaryButtonColor)',
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: 'var(--PrimaryTextColor)',
            color: 'var(--PrimaryTextColor)',
            '& svg': {
              stroke: 'var(--PrimaryTextColor)'
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={props.profile!=""?props.profile:User1}
            sx={{
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<Settings />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Box className="card-container">
              <header className='HeaderBg'>
                <img className='Profile' src={props.profile!=""?props.profile:User1} alt={props.name} />
              </header>
              <h1 className="bold-text">
                {props.name}<span className="normal-text"> - Age: {props.age}</span>
                {/* {props.name} - Age:  <span className="normal-text">{props.age}</span> */}
              </h1>
              <h2 className="normal-text">{props.email}</h2>
              <h2 className="normal-text"><In/> {props.city}</h2>
              <Box className="social-container">
                <Box className="followers">
                  <h1 className="bold-text">{props.wins}</h1>
                  <h2 className="smaller-text">Wins</h2>
                </Box>
                <Box className="likes">
                  <h1 className="bold-text">{props.rank}</h1>
                  <h2 className="smaller-text">Rank</h2>
                </Box>
                <Box className="photos">
                  <h1 className="bold-text">{props.totalGames}</h1>
                  <h2 className="smaller-text">Total Games</h2>
                </Box>
              </Box>
              <Button onClick={handleLogout} className='customButton1' >Log out</Button>
            </Box>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
