/*import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from '@mui/material';
import './GameDialogBox.css'


function GameDialogBox({open,Title,Discription,handelClose,isRematch,handelRematch=()=>{}}) {
  return (
    <>
        <Dialog open={open} onClose={handelClose}
          classes={{
            paper: 'customDialog',
          }} >
          <DialogTitle  className="customDialogTitle">{Title}</DialogTitle>

          <DialogContent className='customDialogContent'>
            <DialogContentText className="customDialogContentText">{Discription}</DialogContentText>
            <DialogActions  >
              <Button onClick={handelClose} className='customButton' >Close</Button>
              {isRematch && <Button onClick={handelRematch} className='customButton' >Rematch</Button>}
            </DialogActions>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default GameDialogBox;*/



import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function GameDialogBox({ open, Title, Description, isRematch, handelClose, handelRematch, handelAnalyze }) {
  return (
    <Dialog open={open} onClose={handelClose}>
      <DialogTitle>{Title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{Description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handelClose} color="primary">Close</Button>
        <Button onClick={handelRematch} color="primary">Rematch</Button>
        {handelAnalyze && (
          <Button onClick={handelAnalyze} color="primary">Analyze Game</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default GameDialogBox;
