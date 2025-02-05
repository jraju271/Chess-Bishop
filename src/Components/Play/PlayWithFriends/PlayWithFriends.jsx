import './PlayWithFriends.css';

import React, { useCallback, useEffect, useState } from "react";
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Box, Tabs, Tab, Grid, Slider, Typography, Container, TextField, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { History, Analytics, Settings } from '@mui/icons-material';
import socket from '../../../Middleware/socket';
import DialogBox from '../../Utils/DialogBox/PwFDialogBox';
import InitializeGame from '../../Utils/DialogBox/InitializeGame';
import toast, { Toaster } from "react-hot-toast";
import GameDialogBox from '../../Utils/DialogBox/GameDialogBox';
import { useDispatch } from 'react-redux';
// import { setPvPGame } from '../../../Middleware/Firebase/FirebaseController'
import { useGetSocreQuery } from '../../../Middleware/Engine/Engine'
import { Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom';
import { FB_SetPvPGame, SetGameCount } from '../../../Middleware/Firebase/FBController'

function PlayWithFriends() {


  const [ChartData, setChartData] = useState([]);
  const [ChartData2, setChartData2] = useState([]);
  const [ChartDataName, setChartDataName] = useState([]);
  const [ChartDataName2, setChartDataName2] = useState([]);
  const root = document.documentElement;
  const primaryColor = getComputedStyle(root).getPropertyValue('--PrimaryButtonColor').trim();
  const PrimaryTextColor = getComputedStyle(root).getPropertyValue('--PrimaryTextColor').trim();
  const Navagate = useNavigate();
  const Chartdata = {
    labels: ChartDataName,
    datasets: [
      {
        label: "Your Move",
        data: ChartData,
        fill: false,
        backgroundColor: primaryColor,
        borderColor: PrimaryTextColor,
        // color: PrimaryTextColor,

      }],
    // datasets: [
    //   {
    //     label: "Openant Move",
    //     data: ChartData2,
    //     fill: false,
    //     backgroundColor: primaryColor,
    //     borderColor: PrimaryTextColor,
    //     // color: PrimaryTextColor,

    //   }
    // ]

  };

  const handleAddChart = (Name, Value) => {
    if (Value != undefined) {
      ChartData.push(Value);
      ChartDataName.push(Name)

    }
  };


  const [FirebaseSendData, setFirebaseSendData] = useState(false);
  const [HistoryList, setHistoryList] = useState([]);
  const [Panelvalue, setPanelvalue] = useState('History');
  const [game, setGame] = useState(new Chess());

  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState('');
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [CheckSquares, setCheckSquares] = useState({});
  const [username, setUsername] = useState("");
  const [Move, setMove] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [validateName, setValidateName] = useState(false);

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);
  const [playersAvailable, setPlayersAvailable] = useState(false);
  const [initialTime, setInitilTime] = useState(600);

  // const initialTime = 300; // Initial time in seconds (5 minutes)
  const [timerWhite, setTimerWhite] = useState(initialTime);
  const [timerBlack, setTimerBlack] = useState(initialTime);
  const [activeTimer, setActiveTimer] = useState('white'); // 'A' or 'B'
  const [isRunning, setIsRunning] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');


  const [isRematch, setisRematch] = useState(true);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [isCompltedDialogOpen, setisCompltedDialogOpen] = useState(false);
  const [DialogText, setDialogText] = useState('');


  const [GameData, setGameData] = useState(true);

  const { data: ResScore } = useGetSocreQuery({ fen: game.fen() });
  const resetGame = () => {
    // Reset all necessary game state here
    setGame(new Chess());
    setTimerWhite(initialTime);
    setTimerBlack(initialTime);
    setIsRunning(false);
    setHistoryList([]);
    setDialogOpen(false);
    setPlayers([]);
    setPlayersAvailable(false);
    setOrientation("");
    setRoom("");
    setisRematch(true);
    setFirebaseSendData(false)
    setCheckSquares({});

  };


  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  const handleMove = useCallback((move) => {
    const gameCopy = new Chess(game.fen());
    setIsRunning(true)
    // Check if the move is valid
    const validMoves = gameCopy.moves({ verbose: true });
    const isValidMove = validMoves.some(
      (validMove) =>
        validMove.from === move.from &&
        validMove.to === move.to &&
        (!move.promotion || validMove.promotion === move.promotion)
    );

    if (isValidMove) {
      const newMove = gameCopy.move({
        from: move.from,
        to: move.to,
        promotion: "q", // You may adjust this based on the actual promotion received
      });

      if (newMove !== null) {
        setGame(gameCopy);
        setHistoryList([...HistoryList, newMove.lan]);
        // handleAddChart2(newMove.lan,ResScore.data.match(/Total evaluation: (-?\d+\.\d+)/)?.[1])

        const nextTurn = game.turn() === 'w' ? 'black' : 'white';
        setActiveTimer(nextTurn);
      }
    } else {
      console.error("Invalid move:", move);
    }
  }, [game, HistoryList]);

  useEffect(() => {
    socket.on("move", (move) => {
      handleMove(move);
    });
    if (Move !== "") {
      const gameCopy = game;
      const newMove = gameCopy.move({
        from: Move.from,
        to: Move.to,
        promotion: "q",
      });
      setGame(gameCopy);
      setHistoryList([...HistoryList, newMove.lan]);
    }
  }, [handleMove]);


  useEffect(() => {
    socket.on("playerDisconnected", (player) => {
      setDialogText(`${player.username} is Disconnected`)
      setisRematch(false)
      setDialogOpen(true);
    });
  }, []);

  useEffect(() => {
    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);

  useEffect(() => {
    if (players.length > 0) {
      setPlayersAvailable(true);
    } else {
      setPlayersAvailable(false);
    }
  }, [players]);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {

      setPlayers(roomData.players);
    });
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {

        toast.success('Copied to clipboard!', { position: 'top-center' });
      })
      .catch(() => {

        toast.error('Failed to copy text', { position: 'top-center' });
      });
  };

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    if (!(orientation.startsWith(game.turn()))) {
      // It's not the player's turn, prevent move or return early
      return false;
    }

    setRightClickedSquares({});
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    if (!moveTo) {
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      setMoveTo(square);

      if (
        (foundMove.color === "w" && foundMove.piece === "p" && square[1] === "8") ||
        (foundMove.color === "b" && foundMove.piece === "p" && square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const gameCopy = game;
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setHistoryList([...HistoryList, move.lan]);
      socket.emit("move", {
        move,
        room,
      });

      setGame(gameCopy);
      handleAddChart(move.lan, ResScore.data.match(/Total evaluation: (-?\d+\.\d+)/)?.[1]);
      setIsRunning(true);
      const nextTurn = game.turn() === 'w' ? 'white' : 'black';
      setActiveTimer(nextTurn);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    if (piece) {
      const gameCopy = game;
      const testmove = gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() || "q",
      });
      setHistoryList([...HistoryList, testmove.lan]);
      socket.emit("move", {
        testmove,
        room,
      });

      setGame(gameCopy);
      handleAddChart(testmove, ResScore.data.match(/Total evaluation: (-?\d+\.\d+)/)?.[1]);
      const nextTurn = game.turn() === 'w' ? 'white' : 'black';
      setActiveTimer(nextTurn);
      setMoveFrom("");
      setMoveTo(null);
      setShowPromotionDialog(false);
      setOptionSquares({});
    }
    return true;
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
          rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  const handleChange = (_, newValue) => {
    setPanelvalue(newValue);

  };

  const handleChangeTime = (event) => {
    setSelectedValue(event.target.value);

    // setInitilTime((event.target.value)*60)
    // setTimerWhite((event.target.value)*60)
    // setTimerBlack((event.target.value)*60)

  };
  const handleDepth = (value) => {
    setMove(value);
   
  };

  //changed
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const handleReset = () => {
    socket.disconnect();
    Navagate(0);
  };


  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (activeTimer === 'white') {
          setTimerWhite((prevTimer) => prevTimer - 1);
        } else if (activeTimer === 'black') {
          setTimerBlack((prevTimer) => prevTimer - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [isRunning, activeTimer, timerWhite, timerBlack]);



  useEffect(() => {
    const checkMate = checkMateIndication();
    const draw = checkDrawIndication();

    if (!isCompltedDialogOpen) {
      if (checkMate) {
        setDialogText(checkMate);
        setDialogOpen(true);
        // setisCompltedDialogOpen(true)

      } else if (draw) {
        setDialogText(draw);
        // setisCompltedDialogOpen(true)
        setDialogOpen(true);
      }
    }
      let temp = {}
      const get_piece_positions = (game, piece) => {
        return [].concat(...game.board()).map((p, index) => {
          if (p !== null && p.type === piece.type && p.color === piece.color) {
            return index
          }
        }).filter(Number.isInteger).map((piece_index) => {
          const row = 'abcdefgh'[piece_index % 8]
          const column = Math.ceil((64 - piece_index) / 8)
          return row + column
        })
      }
      if (game.isCheck()) {
        temp[get_piece_positions(game, { type: 'k', color: game.turn() })[0]] = { background: "rgba(255,0,0,.4)" }
      }
      setCheckSquares(temp)
      if (checkMate || draw || timerBlack === 0 || timerWhite === 0) {

          GetGameData()
          setIsRunning(false);


      }

  }, [checkMateIndication, checkDrawIndication, timerBlack, timerWhite]);


  function checkMateIndication() {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      return `Checkmate! ${winner} wins!`;
    }
    return '';
  }

  function checkDrawIndication() {
    if (game.isDraw()) {
      let drawReason = 'Draw by stalemate';
      if (game.isThreefoldRepetition()) {
        drawReason = 'Draw by threefold repetition';
      } else if (game.isInsufficientMaterial()) {
        drawReason = 'Draw by insufficient material';
      } else if (game.in_fifty_moves()) {
        drawReason = 'Draw by fifty-move rule';
      }
      return `Draw: ${drawReason}`;
    }
    return '';
  }

  const dispatch = useDispatch();

  const GetGameData = () => {
    if (DialogOpen && !FirebaseSendData) {

      FB_SetPvPGame({ pgn: game.pgn(), Final_Fen: game.fen(), ChartNameData: ChartDataName, ChartData: ChartData, GameStatus: DialogText, Move: HistoryList, Time: game.turn() === 'w' ? timerBlack : timerWhite })
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      if (orientation == winner) {
        SetGameCount(1);
      } else {
        SetGameCount(0);
      }
      setFirebaseSendData(true);
    }
  };


  return (
    <>
      <Box className="PwFBox" >


        <Box className="PwF_ChessBoardBox">
          <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <Avatar sx={{ backgroundColor: 'var(--PrimaryButtonColor)' }}>C</Avatar>
            <Typography style={{ 'padding': '2%' }}>{playersAvailable ? players[orientation === 'white' ? 1 : 0].username : 'Waiting...'}</Typography>

            <p>{formatTime(orientation === 'white' ? timerBlack : timerWhite)}</p>
          </Box>
          <Chessboard
            id="ClickToMove"
            animationDuration={200}
            arePiecesDraggable={false}
            position={playersAvailable ? game.fen() : ""}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPromotionPieceSelect={onPromotionPieceSelect}
            boardOrientation={orientation}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares,
              ...CheckSquares
            }}
            promotionToSquare={moveTo}
            showPromotionDialog={showPromotionDialog}
            customLightSquareStyle={{ backgroundColor: 'var(--PrimaryBoardLight)' }}
            customDarkSquareStyle={{ backgroundColor: 'var(--PrimaryBoardDark)' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '25%', display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" sx={{ backgroundColor: 'var(--PrimaryButtonColor) !important', color: 'var(--PrimaryTextColor)', fontFamily: 'var(--PrimaryFontFamily) !important' }} onClick={handleReset} >Leave game </Button>
            </Box>
            <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'end', alignItems: 'center', width: '75%' }}>
              <p>{formatTime(orientation === 'white' ? timerWhite : timerBlack)}</p>
              <Typography style={{ 'padding': '2%' }}>{playersAvailable ? players[orientation === 'white' ? 0 : 1].username : 'You'}</Typography>
              <Avatar sx={{ backgroundColor: 'var(--PrimaryButtonColor)' }}>Y</Avatar>
            </Box>

          </Box>
        </Box>

        <Box className="PwF_GamePanel" >
          {playersAvailable ? <>
            <Box className="Pwf_GamePanelHeader">

              <Tabs
                sx={{ width: '100%' }}
                value={Panelvalue}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="icon tabs example"
              >
                <Tab value="History" icon={<History />} aria-label="History" />
                <Tab value="Analytics" icon={<Analytics />} aria-label="Analytics" />
                <Tab value="Settings" icon={<Settings />} aria-label="Settings" />
              </Tabs>
            </Box>

            {Panelvalue == "History" && <Box className="Panel">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {HistoryList.map((value, index, array) => (
                  <>
                    {(index + 1) % 2 == 0 ? "" : <Grid item xs={2}>{(index / 2) + 1}</Grid>}
                    <Grid item xs={5}>
                      {value}
                    </Grid>
                  </>
                ))}
              </Grid>
            </Box>}
            {Panelvalue == "Analytics" && <Box className="Panel">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Box sx={{ width: '100%', padding: '10%' }}>
                  <Line style={{ 'backgroundColor': 'white' }} data={Chartdata} />
                </Box>

              </Grid>
            </Box>}
            {Panelvalue == "Settings" && <Box className="Panel">
              <Grid container rowSpacing={1} sx={{ justifyContent: 'center' }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {/* <FormControl fullWidth>
                  <InputLabel id="select-label">Select an option</InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    value={selectedValue}
                    onChange={handleChangeTime}
                    label="Select an option"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="20">20</MenuItem>
                    <MenuItem value="30">30</MenuItem>
                    <MenuItem value="40">40</MenuItem>
                  </Select>
                </FormControl> */}

                {/* <Grid item xs={10}>
                  <Typography variant="h6" component="h2">Depth</Typography>
                  <Slider
                    aria-label="Depth"
                    defaultValue={1}
                    getAriaValueText={handleDepth}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={13}
                    className='SliderDepth'
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h6" component="h2">Ai-Support</Typography>
                  <Switch
        checked={AiSupport}
        onChange={handleAisupport}
        inputProps={{ 'aria-label': 'controlled' }}
      />
                </Grid> */}
              </Grid>
            </Box>}
          </>
            :
            <Container className="container" sx={{ width: '100%', minHeight: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <DialogBox classes={{
                paper: 'customDialog',
              }}
                open={showDialog}
                handleClose={() => setShowDialog(false)}
                title="Enter a username"
                handleContinue={() => {
                  if (!username) {
                    setValidateName(true);
                  } else {
                    setValidateName(false);
                    socket.emit("username", username);
                    setUsernameSubmitted(true);
                    setShowDialog(false);
                  }
                }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  fullWidth
                  variant="standard"
                  error={validateName}
                  helperText={validateName ? "Enter User Name!" : " "}
                />
              </DialogBox>
              {room ? (
                <Button className='start-button' onClick={() => copyToClipboard(room)} >Copy Room Id</Button>
              ) : (
                <>
                  {usernameSubmitted ? (
                    <InitializeGame
                      setRoom={setRoom}
                      setOrientation={setOrientation}
                      setPlayers={setPlayers}
                    />
                  ) : (
                    <div className="welcome-container" style={{ 'height': '100%' }}>
                      <h1 className="title">Multiplayer Chess</h1>
                      <Button className="start-button"
                        onClick={() => setShowDialog(true)}

                      >
                        Click here to start
                      </Button>

                    </div>
                  )}
                </>
              )}
            </Container>
          }


          <GameDialogBox
            open={DialogOpen}
            Title={"Game End"}
            Discription={DialogText}
            isRematch={isRematch}
            handelClose={() => {
              setDialogOpen(false);
              setisCompltedDialogOpen(true)
              socket.disconnect();
              // Navagate(0);
            }}
            handelRematch={() => {
              setDialogOpen(false);
              game.reset()
            }}
          />
        </Box>
        <Toaster />
      </Box>
    </>
  );
}

export default PlayWithFriends;
