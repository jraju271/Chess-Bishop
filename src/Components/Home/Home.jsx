import './Home.css'
import { useState } from 'react';
import {Box,Button,Typography,Dialog,DialogContent} from '@mui/material';
import { Link } from 'react-router-dom';
import {SmartToy,People ,PersonSearch} from '@mui/icons-material';
import ChessBishopLogo from '../../assets/Image/Home/ChessBishopLogo.png';
import Sigaram from '../../assets/Image/Home/Sigaram.png';
function Home() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Box className="HomeContent">
        <img src={ChessBishopLogo} alt='Chess Bishop Logo' className='ChessBishopLogo' />
            {/* <Box className='TitleLogo'>
                <Typography variant="h2" component="h2">SIGARAM64</Typography>
                <Typography variant="h2" component="h2">SIGARAM64</Typography>
            </Box> */}
            <Box className="TitleLogo">
              <img src={Sigaram} alt="SIGARAM64 Logo" />
              {/* <img src="path-to-your-image.png" alt="SIGARAM64 Logo" /> */}
            </Box>

            {/* <Button onClick={handleClickOpen} className='TitleButton' variant="contained">PLAY</Button> */}
        </Box>
        <Dialog
                open={open}
                fullWidth
                maxWidth={'xs'}
                onClose={handleClose}
                sx={{zIndex:'999999'}}
                >
                <DialogContent className='PlayGroupButton'>
                    <Link to={'/PlayWithComputer'} onClick={handleClose} className='ButtonLink'><Button variant="contained" startIcon={<SmartToy/>}>PLAY With COMPUTER</Button></Link>
                    <Link to={'/PlayWithFriends'} className='ButtonLink' onClick={handleClose} ><Button variant="contained" startIcon={<People/>}>PLAY With FRIENDS</Button></Link>
                    <Link to={"/Under"} className='ButtonLink' onClick={handleClose} ><Button variant="contained" startIcon={<PersonSearch/>}>PLAY With RANDOM</Button></Link>
                </DialogContent>

        </Dialog>
      </>
    )
  }

  export default Home
