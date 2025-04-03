import * as React from 'react';
import Confetti from 'react-confetti'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import './NoticeDialogBox.css';
import { useSelector, useDispatch } from 'react-redux';
import {setNotifySate} from '../../../Middleware/Global'
import { useState } from 'react';
import { Link } from 'react-router-dom';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));


function NoticeDialogBox() {
    const dispatch = useDispatch();
    const CurrentState = useSelector((state) => state.CurrentState.value)
    const width = screen.width;
    const [open, setOpen] = useState(CurrentState.Notify);

    const handleClose = () => {
      dispatch(setNotifySate(false))
    };
  return (
    <>

    <React.Fragment>
    {CurrentState.Notify &&<Confetti
      width={width}
        style={{'zIndex':'1'}}
    />}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={CurrentState.Notify}
      >

        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Congratulations !!!!
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Congratulations on the amazing news! This is an incredible milestone and you deserve the spotlight to celebrate the moment
          </Typography>

        </DialogContent>
        <DialogActions>
          <Link to={CurrentState.NextLesson}>
          <Button autoFocus sx={{color:'black'}} onClick={handleClose}>
            Next Lesson
          </Button>

          </Link>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
    </>
  )
}

export default NoticeDialogBox
