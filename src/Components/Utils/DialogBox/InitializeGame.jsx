import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import DialogBox from "./PwFDialogBox";
import socket from "../../../Middleware/socket";
import '../../Play/PlayWithFriends/PlayWithFriends.css';
import './GameDialogBox.css'


const InitializeGame = ({ setRoom, setOrientation, setPlayers }) => {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState(""); // input state
  const [roomError, setRoomError] = useState("");
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "90%", width:'100%'}}
    >
      <DialogBox
        open={roomDialogOpen}
        handleClose={() => setRoomDialogOpen(false)}
        title="Enter Room ID to join the room"
        handleContinue={() => {
          // join a room
          if (!roomInput) return; // if given room input is valid, do nothing.
          socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            // r is the response from the server
            if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
            setRoom(r?.roomId); // set room to the room ID
            setPlayers(r?.players); // set players array to the array of players in the room
            setOrientation("black"); // set orientation as black
            setRoomDialogOpen(false); // close dialog
          });
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={
            !roomError ? "Enter a room ID" : `Invalid room ID: ${roomError}`
          }
        />
      </DialogBox>
      {/* Button for starting a game */}
      <div className="MpCopyBtn2">
        <Button className="MpCopyBtn1"
          onClick={() => {
            // create a room
            socket.emit("createRoom", (r) => {
              setRoom(r);
              setOrientation("white");
            });
          }}
        >
          Start a game
        </Button>
      </div>
      <div className="MpCopyBtn2">
        <Button  className="MpCopyBtn1"
          onClick={() => {
            setRoomDialogOpen(true);
          }}
        >
          Join a game
        </Button>
      </div>

    </Stack>
  );
};

export default InitializeGame;
