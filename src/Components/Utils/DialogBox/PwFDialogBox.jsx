import React from "react";
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from "@mui/material";
import './GameDialogBox.css'

const DialogBox = ({
  open,
  children,
  title,
  contentText,
  handleContinue,
  handleClose,
}) => {
  return (
    <Dialog open={open} classes={{
      paper: 'customDialog',
    }} >
      <DialogTitle className="customDialogTitle">{title}</DialogTitle>
      <DialogContent className='customDialogContent'>
        <DialogContentText className="customDialogContentText">{contentText}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        {handleClose && <Button onClick={handleClose} className='customButton'>Cancel</Button>}
        <Button onClick={handleContinue} className='customButton' >Continue</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;