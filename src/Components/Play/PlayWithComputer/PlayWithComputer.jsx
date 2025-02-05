import './PlayWithComputer.css'
import React, { useState, useEffect } from 'react'
import 'chart.js/auto'
import { Chess, SQUARES } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { useGetSocreQuery } from '../../../Middleware/Engine/Engine'
import { Box, Tabs, Tab, Grid, Slider, Typography, Switch, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { History, Analytics, Settings } from '@mui/icons-material'
import { Line } from 'react-chartjs-2'
import { findBestMove } from '../../../Middleware/Engine/ComputerEngine'
import GameDialogBox from '../../Utils/DialogBox/GameDialogBox';
import { useDispatch } from 'react-redux'
// import { setComputerGame } from '../../../Middleware/Firebase/FirebaseController'
import toast, { Toaster } from "react-hot-toast";
import { SPEAK } from '../../../Middleware/Utils/Speak'

import {FB_SetCommputerGame,SetGameCount} from '../../../Middleware/Firebase/FBController'

//import ChessBoard from "./ChessBoard"; // Import ChessBoard component
import FeedbackDashboard from './FeedbackDashboard';
import { useLocation, useNavigate } from 'react-router-dom'; // For navigation to analysis page
import { average } from 'firebase/firestore'

//function PlayWithComputer() {
const PlayWithComputer = () => {
  const location = useLocation();
  const aiLevel = location.state?.aiLevel || 1; // Default to level 1 if not specified
  const playerCategory = location.state?.playerCategory || 'Basic Level Player';
  const [stockfish, setStockfish] = useState(null);

  // Initialize Stockfish when component mounts
  useEffect(() => {
    const sf = new Worker("/stockfish/stockfish.js");
    setStockfish(sf);

    // Initialize Stockfish with UCI commands
    sf.postMessage("uci");
    sf.postMessage("isready");

    // Cleanup when component unmounts
    return () => {
      if (sf) {
        sf.terminate();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update Stockfish skill level when aiLevel changes
  useEffect(() => {
    if (stockfish) {
      stockfish.postMessage(`setoption name Skill Level value ${aiLevel}`);
    }
  }, [stockfish, aiLevel]);

  //
  // <h3>{isSuccess ? data.data.match(/bestmove\s+(\S+)/)?.[1] : 'Loading...'}</h3>
  const [FirebaseSendData, setFirebaseSendData] = useState(false);

  const [ChartData, setChartData] = useState([]);
  const [ChartDataName, setChartDataName] = useState([]);
  const root = document.documentElement;
  const primaryColor = getComputedStyle(root).getPropertyValue('--PrimaryButtonColor').trim();
  const PrimaryTextColor = getComputedStyle(root).getPropertyValue('--PrimaryTextColor').trim();

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

      }
    ],

  };

  const handleAddChart = (Name, Value) => {
    if (Value != undefined) {
      ChartData.push(Value);
      let preVal = ChartData[ChartData.length - 2]


      let curVal = ChartData[ChartData.length - 1]

      if (preVal < curVal && curVal > 0) {
        SPEAK("Good Move");
        toast.success('Good Move', { position: 'top-center' });
      }

      ChartDataName.push(Name)

    }
  };
  const handleBestMove = (bestmove) => {
    setBestMove(bestmove);
  };
  
  //const location = useLocation();
  const navigate = useNavigate();
  const [Depth, setDepth] = useState(1);
  const [HistoryList, setHistoryList] = useState([]);
  const [Panelvalue, setPanelvalue] = useState('History');
  const [game, setGame] = useState(new Chess());
  const [BestMove, setBestMove] = useState("");
  const [AiSupport, setAiSupport] = useState(false);
  const [AisupportMove, setAisupportMove] = useState([]);
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState('');
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [AioptionSquares, setAiOptionSquares] = useState({});
  const [CheckSquares, setCheckSquares] = useState({});
  const [LastMoveSquares, setLastMoveSquares] = useState({});
  const [isCompltedDialogOpen, setisCompltedDialogOpen] = useState(false);
  const { data: ResScore } = useGetSocreQuery({ fen: game.fen(), depth: Depth });

  const initialTime = 300; // Initial time in seconds (5 minutes)
  const [timerA, setTimerA] = useState(initialTime);
  const [timerB, setTimerB] = useState(initialTime);
  const [activeTimer, setActiveTimer] = useState('B'); // 'A' or 'B'
  const [isRunning, setIsRunning] = useState(false);

  const [isCheckmateDialogOpen, setIsCheckmateDialogOpen] = useState(false);
  const [isDrawDialogOpen, setIsDrawDialogOpen] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const [isRematch, setisRematch] = useState(true);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [DialogText, setDialogText] = useState('');

  const [gameOver, setGameOver] = useState(false);        // State to track game end
  const [gameResult, setGameResult] = useState('');       // State to hold the result
  const [showFeedback, setShowFeedback] = useState(false); // State to display feedback
  const [position, setPosition] = useState("start"); // Start position
  const [evaluation, setEvaluation] = useState(null); // Holds evaluation score
  //const game = useRef(new Chess()); // Chess game instance
  const [gameData, setGameData] = useState(null);   // Define a state to store game data



  const resetGame = () => {
    // Reset all necessary game state here
    setAisupportMove([]);
    setGame(new Chess());
    setTimerA(initialTime);
    setTimerB(initialTime);
    setActiveTimer('B');
    setIsRunning(false);
    setHistoryList([]);
    setDialogOpen(false);
    setChartData([]);
    setChartDataName([]);
    setFirebaseSendData(false);
    setLastMoveSquares();
    setCheckSquares();

  };

  useEffect(() => {
    findBestMove(game.fen(), Depth).then((bestMove) => {

      handleBestMove(bestMove);
      if (game.turn() == 'b') {
        ToggeleTimer(activeTimer === 'A' ? 'B' : 'A');

        setTimeout(game.move(bestMove), 2000);
        HistoryList.push(bestMove)
        console.log("bestMove",bestMove)
        let temp = {}
        temp[bestMove.substring(2, 4)] = { background: "rgba(255, 255, 0, 0.4)" }
        setLastMoveSquares(temp)

      }
    });
    //console.log('HistoryList',HistoryList)
    if (AiSupport == true && game.turn() === 'w') {

      findBestMove(game.fen(), Depth + 5).then((bestMove1) => {
        var TempAi_list = {}

        handleBestMove(bestMove1);
        TempAi_list[bestMove1.substring(0, 2)] = { background: "rgba(252, 161,3,.4)" }
        TempAi_list[bestMove1.substring(2, 4)] = { background: "rgba(252, 161, 3,.4)" }
        // TempAi_list[bestMove.substring(2, 4)] = {background: "radial-gradient(circle,transparent 0%,transparent 0%,red 95%,red 40%)"}

        setAiOptionSquares(TempAi_list)
        // setAisupportMove([[bestMove1.substring(0, 2), bestMove1.substring(2, 4), "red"]]);

      });
    } else {
      setAiOptionSquares({})
    }
  }, [game.turn()]);

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
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
            game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }


  function onSquareClick(square) {
    if (game.turn() == 'w') {
      setRightClickedSquares({});

      // from square
      if (!moveFrom) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      // to square
      if (!moveTo) {
        // check if valid move before showing dialog
        const moves = game.moves({
          moveFrom,
          verbose: true,
        });
        const foundMove = moves.find(
          (m) => m.from === moveFrom && m.to === square
        );
        // not a valid move
        if (!foundMove) {
          // check if clicked on new piece
          const hasMoveOptions = getMoveOptions(square);
          // if new piece, setMoveFrom, otherwise clear moveFrom
          setMoveFrom(hasMoveOptions ? square : "");
          return;
        }

        // valid move
        setMoveTo(square);

        // if promotion move
        if (
          (foundMove.color === "w" &&
            foundMove.piece === "p" &&
            square[1] === "8") ||
          (foundMove.color === "b" &&
            foundMove.piece === "p" &&
            square[1] === "1")
        ) {
          setShowPromotionDialog(true);
          return;
        }

        // is normal move
        const gameCopy = game;
        const move = gameCopy.move({
          from: moveFrom,
          to: square,
          promotion: "q",
        });

        // if invalid, setMoveFrom and getMoveOptions
        if (move === null) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }
        ToggeleTimer('B');

        HistoryList.push(move.lan)
        setGame(gameCopy);
        //handleAddChart(move.lan, ResScore.data.match(/Total evaluation: (-?\d+\.\d+)/)?.[1]);

        setMoveFrom("");
        setMoveTo(null);
        setOptionSquares({});
        return;
      }
    }
  }

  function onPromotionPieceSelect(piece) {
    if (game.turn() == 'w') {
      // if no piece passed then user has cancelled dialog, don't make move and reset
      if (piece) {
        const gameCopy = game;
        const testmove = gameCopy.move({
          from: moveFrom,
          to: moveTo,
          promotion: piece[1].toLowerCase() ?? "q",
        });
        HistoryList.push(testmove)
        ToggeleTimer(activeTimer === 'A' ? 'B' : 'A');
        setGame(gameCopy);
        //handleAddChart(testmove, ResScore.data.match(/Total evaluation: (-?\d+\.\d+)/)?.[1]);

      }

      setMoveFrom("");
      setMoveTo(null);
      setShowPromotionDialog(false);
      setOptionSquares({});
      return true;
    }
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
    ToggeleTimer(activeTimer === 'A' ? 'B' : 'A');
  }


  //changed
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleUndo = () => {
    game.undo()
    HistoryList.pop()
    game.undo()
    HistoryList.pop()
    ChartData.pop();
    ChartDataName.pop()
  };

  const handleReset = () => {
    game.reset();
    setHistoryList([]);
    setChartData([]);
    setChartDataName([]);
    resetGame();

  };


  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (activeTimer === 'A' && timerA > 0) {
          setTimerA((prevTimer) => prevTimer - 1);
        } else if (activeTimer === 'B' && timerB > 0) {
          setTimerB((prevTimer) => prevTimer - 1);
        } else {
          setActiveTimer(activeTimer === 'A' ? 'B' : 'A');
        }
      }, 1000);
    }

    return () => clearInterval(interval); // Clear interval on component unmount

  }, [isRunning, activeTimer, timerA, timerB]);



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
      temp[get_piece_positions(game, { type: 'k', color: game.turn() })[0]] = { background: "rgb(255,0,0)" }

    }
    setCheckSquares(temp)
    if (checkMate || draw || timerA === 0 || timerB === 0) {
      GetGameData();
      setIsRunning(false); // Stop the timer when the game ends
    }
  }, [checkMateIndication, checkDrawIndication, timerA, timerB]);

  function ToggeleTimer(val) {
    setActiveTimer(val);

    // Start the timer only when it's not running
    if (!isRunning) {
      setIsRunning(true);
    }
  }
  function checkMateIndication() {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      const emoji = game.turn() ==="w" ? `🤕` : `🎉 🤩`;
      return `Checkmate! ${winner} wins! ${emoji}` ;
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
  // firebase working
  const dispatch = useDispatch();

  const GetGameData = () => {
    if (DialogOpen && !FirebaseSendData) {

      FB_SetCommputerGame({ pgn: game.pgn(), Final_Fen: game.fen(), ChartNameData: ChartDataName, ChartData: ChartData, GameStatus: DialogText, Move: HistoryList })
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      if(winner=='White'){
        SetGameCount(1);
      }else{
        SetGameCount(0);
      }
      setFirebaseSendData(true);
    }
  };




  const onPieceDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // auto-promote to queen
    });

    if (move === null) return false;

    // Update position on the board immediately
    
    const newFen = game.fen();
    setPosition(newFen);

    // Game-ending conditions
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        console.log("Checkmate!");
      } else if (game.isStalemate()) {
        console.log("Stalemate!");
      } else if (game.isDraw()) {
        console.log("Draw!");
      }
    } else if (game.isCheck()) {
      console.log("Check!");
    }

    // Fetch evaluation score from API
    evaluatePosition(newFen);
    return true;
  };

  // Fetch evaluation score from an API
  const evaluatePosition = async (fen) => {
    //const fen = game.current.fen(); // Get the current FEN from the game instance
    console.log("Requesting evaluation for FEN:", fen);
    
    try {
      const response = await fetch('https://chess-api.com/v1',{ //'http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen, time: 1000 }), // Include depth if required
      });
  
      if (response.ok) {
        //const data = await response.json();
        const data= await response.json();
        console.log("Received evaluation response:", data);
        if (data.fen === fen) { // Ensure evaluation is for the current FEN
          const scoreText = data.text || `${(data.score / 100).toFixed(2)} (centipawn score)`;
          setEvaluation(`Evaluation: ${scoreText}`);
        } else {
          console.warn("Mismatch in FEN between request and response.");
        }
      } else {
        console.error("Failed to fetch evaluation. Status:", response.status);
      }
    } catch (error) {
      console.error("Error evaluating position:", error);
    }
  };
  
  const handleChange = (event, newValue) => {
    setPanelvalue(newValue);
  };

  const handleDepth = (event, newValue) => {
    setDepth(newValue);
  };

  const handleAisupport = () => {
    setAiSupport(!AiSupport);
  };

  async function handleResign() {
    let result='Resigned';
    const evaluation= await getEvaluationFromStockfish(game.fen());
    handleGameEnd(result);//, evaluation);    
  }

  function handleGameEnd1(result,evaluation) {
    const gameDetails = {
      moves: game.history(), // Get list of moves
      evaluation: evaluation, // Final evaluation score
      result: result, // Result: 'White wins', 'Black wins', 'Draw', etc.
      timeWhite: timerA, // Time taken by White
      timeBlack: timerB, // Time taken by Black
    };
    
    // Set game data
    setGameData(gameDetails);

    // Navigate to feedback analysis page with game data
    navigate('/feedback-analysis', { state: { gameData: gameDetails } });
  }

  async function getEvaluationFromStockfish1(fen) {
    const response = await fetch(`https://chess-api.com/v1`, { //`https://stockfish.online/api/stockfish.php`, { //`https://stockfish.online/api/s/v2.php`, { //`https://api.chess.com/pub/stockfish/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fen }),
    });
    const data = await response.json();
    const scoreText = data.text ;//|| `${(data.score / 100).toFixed(2)} (centipawn score)`;
    return scoreText;
  }

  function getEvaluationFromStockfish_1(fen) {
    return new Promise((resolve, reject) => {
      const stockfish = new Worker("/stockfish/stockfish.js");
      stockfish.postMessage("uci"); // Initialize Stockfish
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage("go depth 15"); // Set depth for evaluation  
      stockfish.onmessage = function (event) {
        const message = event.data;
        if (message.includes("score cp")) {
          // Find the evaluation score in the message
          const scoreMatch = message.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            const score = parseInt(scoreMatch[1], 10) / 100; // Convert centipawns to pawns
            resolve(score);
            stockfish.terminate();
          }
        } else if (message.includes("mate")) {
          // Check for mate score if applicable
          const mateMatch = message.match(/mate (-?\d+)/);
          if (mateMatch) {
            const mateInMoves = parseInt(mateMatch[1], 10);
            resolve(`Mate in ${mateInMoves}`);
            stockfish.terminate();
          }
        }
      };
    });
  }
  async function handelAnalyze() { 
    setDialogOpen(false); // Close the dialog
    // Determine the result based on game state
    let result = '';
    if (game.isCheckmate()) {
        result = game.turn() === 'w' ? 'Black wins' : 'White wins'; // The opponent of the current turn won
    } else if (game.isDraw()) {
        result = 'Draw';
    } else if (game.isStalemate()) {
        result = 'Stalemate - Draw';
    } else if (game.isThreefoldRepetition()) {
        result = 'Threefold Repetition - Draw';
    }
    // Fetch evaluation score from Stockfish
    const evaluation = await getEvaluationFromStockfish(game.fen());
    // Pass the result and evaluation to handleGameEnd
    handleGameEnd(result);//, evaluation);
  } 

  const difficultyMapping = {
    Poor: 1, //Basic level palyer
    Average: 3, //Intermediate level player
    Good: 5, //Professional level player
  };
  // Automatically adjust depth when navigating from FeedbackDashboard
  useEffect(() => {
    const gameCategory = location.state?.gameCategory || "Poor"; // Default to Beginner
    const adjustedDepth = difficultyMapping[gameCategory];
    setDepth(adjustedDepth);
  }, [location.state]);

  // Function to handle Retry Game
  const handleRetryGame = () => {
    if (gameData?.gameCategory) {
      // Adjust AI level based on the player's performance category
      let newDepth = Depth; // Start with current depth
      if (gameData.gameCategory === "Good") {
        newDepth = Math.min(Depth + 2, 23); // Increase difficulty
      } else if (gameData.gameCategory === "Average") {
        newDepth = Math.min(Depth + 1, 23); // Slight increase or no change
      } else if (gameData.gameCategory === "Poor") {
        newDepth = Math.max(Depth - 2, 1); // Decrease difficulty
      }
      setDepth(newDepth); // Update AI level
      console.log(`AI Level adjusted to: ${newDepth}`);
    }
    // Proceed with resetting the game for retry
    resetGame(); // Reset game logic here
  };

  // PlayWithComputer.jsx
  async function handleGameEnd(result) {
    const gameClone = new Chess(); // Create a new Chess instance for analysis
    const moveHistory = [];
    let totalEvaluation = 0; // For calculating the overall score
    let validEvaluationCount = 0; // Count moves with valid evaluations
    for (const [index, move] of game.history({ verbose: true }).entries()) {
      const gameStateBefore = gameClone.fen();
      console.log("Game state before move:", JSON.stringify(gameClone.fen()));
      gameClone.move(move); // Apply each move to the clone
      const gameStateAfter = gameClone.fen();
      console.log("Game state after move:", JSON.stringify(gameClone.fen()));
      const fen = gameClone.fen(); // Get FEN from the cloned game
      console.log(`Move ${index + 1}:`, move.san, "FEN:", fen);
      const evaluation = await getEvaluationFromStockfish(fen);
      console.log(`Evaluation for Move ${index + 1}:`, evaluation);
      
      if (typeof evaluation === "number") { // Only consider numeric evaluations
        totalEvaluation += evaluation;
        validEvaluationCount++;
      }

      let moveQuality = "Neutral";
      let alternativeMoves = [];

      if (evaluation > 1.0) moveQuality = "Good";
      else if (evaluation < -1.0){
        moveQuality = "Bad";
        alternativeMoves = await getAlternativeMoves(fen);      
      } 
      const usedTechnique = detectTechnique(move, gameStateBefore, gameStateAfter, "used");
      const missedTechnique = detectTechnique(move, gameStateBefore, gameStateAfter, "missed");
      console.log(`Move ${index + 1}:`, move.san);
      console.log("Used Technique:", usedTechnique, "Missed Technique:", missedTechnique);  
      
      // Add move details to history
      moveHistory.push({
        moveNumber: index + 1,
        from: move.from,
        to: move.to,
        san: move.san,
        evaluation,
        moveQuality,
        alternativeMoves,
        usedTechnique,
        missedTechnique,
        fen,
      });
    }

    const overallScore = validEvaluationCount > 0 ? totalEvaluation / validEvaluationCount : 0;
    let gameCategory = "Average";
    if (overallScore > 1.0) gameCategory = "Good";
    else if (overallScore < -1.0) gameCategory = "Poor";

    const gameDetails = {
      moves: moveHistory,
      finalEvaluation: overallScore,//moveHistory[moveHistory.length - 1]?.evaluation || result,
      gameCategory,
      result,
      timeWhite: timerA,
      timeBlack: timerB,
    };
    // Set game data
    setGameData(gameDetails);
    // Navigate to feedback analysis page with game data
    navigate("/feedback-analysis", { state: { gameData: gameDetails } });
  }

  async function getEvaluationFromStockfish(fen) {
    return new Promise((resolve) => {
      const stockfish = new Worker("/stockfish/stockfish.js");

      let isResolved = false; // Track if resolved

      stockfish.postMessage("uci");
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage("go depth 15");

      stockfish.onmessage = (event) => {
        const message = event.data;

        if (message.includes("score cp")) {
          const scoreMatch = message.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            const score = parseInt(scoreMatch[1], 10) / 100;
            resolve(score);
            isResolved = true;
            stockfish.terminate();
          }
        } else if (message.includes("mate")) {
          const mateMatch = message.match(/mate (-?\d+)/);
          if (mateMatch) {
            const mateInMoves = parseInt(mateMatch[1], 10);
            resolve(`Mate in ${mateInMoves}`);
            isResolved = true;
            stockfish.terminate();
          }
        }
      };

      setTimeout(() => {
        if (!isResolved) {
            resolve("Evaluation timeout"); // Fallback response
            stockfish.terminate();
        }
      }, 5000); // Set a 5-second timeout

    });
  }

  async function getAlternativeMoves(fen) {
    return new Promise((resolve) => {
        const stockfish = new Worker("/stockfish/stockfish.js");
        stockfish.postMessage("uci");
        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage("go depth 15");
        let alternatives = [];
        stockfish.onmessage = (event) => {
            const message = event.data;
            if (message.includes("bestmove")) {
                const bestMove = message.split(" ")[1];
                alternatives.push(bestMove);
                stockfish.terminate();
                resolve(alternatives);
            }
        };
    });
  }
  function algebraicToIndex(square) {
    if (!/^[a-h][1-8]$/.test(square)) {
      throw new Error(`Invalid square: ${square}`);
    }
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // File (a-h -> 0-7)
    const rank = parseInt(square[1], 10) - 1; // Rank (1-8 -> 0-7)
    return rank * 16 + file; // Convert to 0x88 index
  }


  function detectTechnique(move, gameStateBefore, gameStateAfter, type) {
    console.log('Move', move, 'type', type);
    const techniques = [];
    if (type === "used") {
      // Used techniques
      techniques.push(detectUsedPin(move, gameStateAfter));
      techniques.push(detectUsedFork(move, gameStateAfter));
      techniques.push(detectUsedDiscoveredAttack(move, gameStateAfter, gameStateBefore));
    } else if (type === "missed") {
      // Missed techniques
      techniques.push(detectMissedPin(move, gameStateBefore));
      techniques.push(detectMissedFork(move, gameStateBefore));
      techniques.push(detectMissedDiscoveredAttack(move, gameStateBefore));
    }
    // Filter out null or undefined techniques
    console.log('techniques array:', techniques);
    return techniques.filter((technique) => technique !== null).join(", ") || "None";
  }

  function isSquareAttacked(board, square, attackingColor) {
    const moves = board.moves({ verbose: true });
    return moves.some((move) => move.to === square && board.get(move.from).color === attackingColor);
  }
  
  function isPiecePinned(board, pieceSquare, kingSquare, attackingColor) {
    // Simulate moving the piece and check if the king becomes attacked
    const simulatedBoard = new Chess(board.fen());
    simulatedBoard.remove(pieceSquare); // Remove the piece from its square
    // Check if the king becomes attacked after removing the piece
    return isSquareAttacked(simulatedBoard, kingSquare, attackingColor);
  }
  
  function detectUsedPin(move, gameStateAfter) {
    const board = new Chess(gameStateAfter);
    console.log("Analyzing move.san for pin:", move.san);
    const pieces = board.board(); // Returns a 2D array
    const currentColor = move.color;
    const opponentColor = currentColor === "w" ? "b" : "w";
    const SQUARES = [
      "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
      "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
      "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
      "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
      "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
      "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
      "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
      "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"
    ];
    const kingSquare = SQUARES.find((square) => {
      const piece = board.get(square);
      return piece && piece.type === "k" && piece.color === currentColor;
    });
    if (!kingSquare) {
      console.warn("King not found on the board. Invalid state.");
      return null;
    }
    // Iterate over all squares to check for pinned pieces
    for (let i = 0; i < pieces.length; i++) {
      for (let j = 0; j < pieces[i].length; j++) {
        const square = SQUARES[i * 8 + j]; // Translate 2D index to square name
        const piece = pieces[i][j];
  
        if (piece && piece.color === currentColor) {
          if (isPiecePinned(board, square, kingSquare, opponentColor)) {
            console.log("Pinned piece detected at square:", square);
            return "Pin";
          }
        }
      }
    }
    console.log("No pin detected for move:", move.san);
    return null; // No pin detected
  }    


  function detectMissedPin(move, gameStateBefore) {
    const board = new Chess(gameStateBefore);
    console.log("Analyzing missed pin for move:", move.san);

    const currentColor = move.color;
    const opponentColor = currentColor === "w" ? "b" : "w";

    // Dynamically generate the list of squares if SQUARES is not available
    const generateSquares = () => {
        const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
        return files.flatMap((file) => ranks.map((rank) => `${file}${rank}`));
    };
    const SQUARES = generateSquares();

    // Find the opponent king's position
    const opponentKingSquare = SQUARES.find((square) => {
        const piece = board.get(square);
        return piece && piece.type === "k" && piece.color === opponentColor;
    });

    if (!opponentKingSquare) {
        console.warn("Opponent king not found. Invalid state.");
        return null;
    }

    // Iterate over all pieces of the current player
    for (const square of SQUARES) {
        const piece = board.get(square);
        if (piece && piece.color === currentColor) {
            const legalMoves = board.moves({ square, verbose: true });

            for (const legalMove of legalMoves) {
                const simulatedBoard = new Chess(gameStateBefore);
                simulatedBoard.move(legalMove);

                // Check if the opponent's king is attacked after this move
                if (isSquareAttacked(simulatedBoard, opponentKingSquare, currentColor)) {
                    console.log(`Missed pin: Moving ${piece.type} at ${square} to ${legalMove.to}`);
                    return "Missed Pin";
                }
            }
        }
    }

    console.log("No missed pin detected for move:", move.san);
    return null;
  }
  function detectUsedFork(move, gameStateAfter) {
    const board = new Chess(gameStateAfter);
    // Get the piece that moved
    const movingPiece = board.get(move.to);
    if (!movingPiece) return null; // No piece found, invalid move
    // Identify attacked opponent pieces
    const attackedSquares = board.moves({ square: move.to, verbose: true })
        .filter((legalMove) => {
          const targetPiece = board.get(legalMove.to);
          return targetPiece && targetPiece.color !== movingPiece.color; // Attacks opponent pieces
        })
        .map((legalMove) => legalMove.to);
    if (attackedSquares.length > 1) {
        // Ensure the attacked squares correspond to valid fork logic
        const uniqueTargets = attackedSquares.reduce((targets, square) => {
            const targetPiece = board.get(square);
            if (targetPiece && !targets.includes(targetPiece.type)) {
              targets.push(targetPiece.type); // Track distinct types attacked
            }
            return targets;
        }, []);
        // A fork occurs when multiple distinct targets (e.g., major pieces) are attacked
        if (uniqueTargets.length > 1) {
          return "Fork";
        }
    }
    return null; // No fork detected
  }
  

  function detectMissedFork(move, gameStateBefore) {
    const board = new Chess(gameStateBefore);
    console.log("Analyzing missed fork for move:", move.san);

    board.moves({ verbose: true }).forEach((legalMove) => {
        const simulatedBoard = new Chess(gameStateBefore);
        simulatedBoard.move(legalMove);
        const movingPiece = simulatedBoard.get(legalMove.to);
        if (!movingPiece) return;

        const attackedSquares = simulatedBoard.moves({ square: legalMove.to, verbose: true })
            .filter((simMove) => {
                const targetPiece = simulatedBoard.get(simMove.to);
                return targetPiece && targetPiece.color !== movingPiece.color;
            })
            .map((simMove) => simMove.to);

        const uniqueTargets = [...new Set(attackedSquares.map((sq) => simulatedBoard.get(sq)?.type))];
        if (uniqueTargets.length > 1) {
            console.log(`Missed fork: Moving ${movingPiece.type} at ${legalMove.from} to ${legalMove.to}`);
            return "Fork Missed";
        }
    });

    console.log("No missed fork detected for move:", move.san);
    return null;
  }
  
  
  const generateSquares = () => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    return files.flatMap((file) => ranks.map((rank) => `${file}${rank}`));
  };
  
  //const SQUARES = generateSquares();
  
  function detectUsedDiscoveredAttack(move, gameStateAfter, gameStateBefore) {
    const boardBefore = new Chess(gameStateBefore);
    const boardAfter = new Chess(gameStateAfter);

    console.log("Analyzing discovered attack for move:", move.san);

    const movingPiece = boardBefore.get(move.from);
    if (!movingPiece) return null; // Ensure the piece that moved exists
    
    // Dynamically generate squares if SQUARES is not provided
    const SQUARES = generateSquares();
  
    // Ensure SQUARES is defined and accessible
    if (!Array.isArray(SQUARES)) {
        console.error("Chess.SQUARES is not defined or not an array.");
        return null;
    }

    // Iterate through all squares to identify potential discovered attacks
    SQUARES.forEach((square) => {
        const piece = boardBefore.get(square);
        if (piece && piece.color === movingPiece.color) {
            if (square === move.from) return; // Skip the piece that moved

            const attackedSquaresBefore = boardBefore.moves({ square, verbose: true }).map((m) => m.to);
            const attackedSquaresAfter = boardAfter.moves({ square, verbose: true }).map((m) => m.to);

            const newlyAttackedSquares = attackedSquaresAfter.filter(
                (square) => !attackedSquaresBefore.includes(square)
            );

            newlyAttackedSquares.forEach((targetSquare) => {
                const targetPiece = boardAfter.get(targetSquare);
                if (targetPiece && targetPiece.color !== piece.color) {
                    console.log(
                        `Discovered attack: ${piece.type} at ${square} exposes ${targetPiece.type} at ${targetSquare}`
                    );
                    return "Discovered Attack";
                }
            });
        }
    });

    console.log("No discovered attack detected for move:", move.san);
    return null;
  }
  
    function detectMissedDiscoveredAttack(move, gameStateBefore) {
      const board = new Chess(gameStateBefore);
      console.log("Analyzing missed discovered attack for move:", move.san);
  
      // Dynamically generate the list of squares
      const generateSquares = () => {
          const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
          const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
          return files.flatMap((file) => ranks.map((rank) => `${file}${rank}`));
      };
      const SQUARES = generateSquares();
  
      // Iterate through all squares to identify missed discovered attacks
      for (const square of SQUARES) {
          const piece = board.get(square);
          if (piece && piece.color === board.turn()) {
              const legalMoves = board.moves({ square, verbose: true });
  
              for (const legalMove of legalMoves) {
                  const simulatedBoard = new Chess(gameStateBefore);
                  simulatedBoard.move(legalMove);
  
                  for (const attackingSquare of SQUARES) {
                      const attacker = simulatedBoard.get(attackingSquare);
                      if (attacker && attacker.color === piece.color && attackingSquare !== legalMove.to) {
                          const simulatedMoves = simulatedBoard.moves({ square: attackingSquare, verbose: true });
  
                          for (const simMove of simulatedMoves) {
                              const targetPiece = simulatedBoard.get(simMove.to);
                              if (targetPiece && targetPiece.color !== piece.color) {
                                  console.log(
                                      `Missed discovered attack: ${attacker.type} at ${attackingSquare} could attack ${targetPiece.type}`
                                  );
                                  return "Discovered Attack Missed";
                              }
                          }
                      }
                  }
              }
          }
      }
  
      console.log("No missed discovered attack detected for move:", move.san);
      return null;
  }

  //changed ------------------------------------------
  return (
    <>
      <Box className="PwCBox" >
        <Box className="PwC_ChessBoardBox" sx={{ width: '100%', maxWidth: '550px'}}>
          {/* <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <Avatar sx={{ backgroundColor: 'var(--PrimaryButtonColor)' }}>C</Avatar>
            <Typography style={{ 'padding': '2%', }}>Mr Chess</Typography>
            <p>{formatTime(timerB)}</p>
          </Box> */}
          <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '10px', backgroundColor: 'black', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
            <Avatar sx={{ backgroundColor: '#8E5C00' }}>C</Avatar>
            <Typography style={{ padding: '2%', color: 'white' }}>Mr Chess</Typography>
            <p style={{ color: 'white' }}>{formatTime(timerB)}</p>
          </Box>
          <Chessboard
            id="ClickToMove"
            animationDuration={200}
            arePiecesDraggable={false}
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPromotionPieceSelect={onPromotionPieceSelect}
            customArrows={AisupportMove}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares,
              ...AioptionSquares,
              ...CheckSquares,
              ...LastMoveSquares,
            }}
            promotionToSquare={moveTo}
            customLightSquareStyle={{ backgroundColor: 'var(--PrimaryBoardLight)' }}
            customDarkSquareStyle={{ backgroundColor: 'var(--PrimaryBoardDark)' }}
            showPromotionDialog={showPromotionDialog}
          />
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '25%', display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" sx={{ backgroundColor: 'var(--PrimaryButtonColor) !important', color: 'var(--PrimaryTextColor)', fontFamily: 'var(--PrimaryFontFamily) !important' }} onClick={handleUndo} >Undo</Button>
              <Button variant="contained" sx={{ backgroundColor: 'var(--PrimaryButtonColor) !important', color: 'var(--PrimaryTextColor)', fontFamily: 'var(--PrimaryFontFamily) !important' }} onClick={handleReset} >Reset</Button>
              <Button variant="contained" sx={{ backgroundColor: 'var(--PrimaryButtonColor) !important', color: 'var(--PrimaryTextColor)', fontFamily: 'var(--PrimaryFontFamily) !important' }} onClick={handleResign}>Resign </Button>
            </Box>
            <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'end', alignItems: 'center', width: '75%' }}>
              <p>{formatTime(timerA)}</p>
              <Typography style={{ 'padding': '2%' }}>You</Typography>
              <Avatar sx={{ backgroundColor: 'var(--PrimaryButtonColor)' }}>Y</Avatar>
            </Box>
          </Box> */}
          <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '10px', backgroundColor: 'black', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
            <Box sx={{ width: '70%', display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" sx={{ backgroundColor: '#8E5C00', color: 'white', fontFamily: 'Open Sans', '&:hover': {
                        background: 'rgba(163, 150, 109, 0.5)'}, }} onClick={handleUndo}>Undo</Button>
              <Button variant="contained" sx={{ backgroundColor: '#8E5C00', color: 'white', fontFamily: 'Open Sans', '&:hover': {
                        background: 'rgba(163, 150, 109, 0.5)'} }} onClick={handleReset}>Reset</Button>
              <Button variant="contained" sx={{ backgroundColor: '#8E5C00', color: 'white', fontFamily: 'Open Sans', '&:hover': {
                        background: 'rgba(163, 150, 109, 0.5)' } }} onClick={handleResign}>Resign</Button>
            </Box>
            <Box sx={{ margin: '1%', display: 'flex', justifyContent: 'end', alignItems: 'center', width: '75%' }}>
              <p style={{ color: 'white' }}>{formatTime(timerA)}</p>
              <Typography style={{ padding: '2%', color: 'white' }}>You</Typography>
              <Avatar sx={{ backgroundColor: '#8E5C00' }}>Y</Avatar>
            </Box>
          </Box>
        </Box>
        {/* <Box className="Pwc_GamePanel">
          <Box className="Pwc_GamePanelHeader">
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
          </Box> */}
        <Box className="Pwc_GamePanel" sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
          <Box className="Pwc_GamePanelHeader">
            <Tabs
              sx={{ width: '100%' }}
              value={Panelvalue}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="icon tabs example"
            >
              <Tab value="History" icon={<History sx={{ color: '#8E5C00' }} />} aria-label="History" />
              <Tab value="Analytics" icon={<Analytics sx={{ color: '#8E5C00' }} />} aria-label="Analytics" />
              <Tab value="Settings" icon={<Settings sx={{ color: '#8E5C00' }} />} aria-label="Settings" />
            </Tabs>
          </Box>
          {Panelvalue == "History" && <Box sx={{marginTop:'3%', height: '80vh', overflow: 'auto'}}>
            <Grid container rowSpacing={1} columnSpacing={{lg: 15 }}>{/* xs: 1, sm: 2, md: 3*/}
              {HistoryList.map((value, index, array) => (
                <>
                  {(index + 1) % 2 == 0 ? "" : <Grid item xs={2}>{(index / 2) + 1}</Grid>}
                  <Grid item >{/*xs={5}*/}
                  {value.slice(-2)}
                  </Grid>
                </>
              ))}
            </Grid>            
          </Box>}

          {Panelvalue == "Analytics" && <Box className="Panel">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Box sx={{ width: '100%', padding: '10%' }}>
                <Line className='ChartLayout' data={Chartdata}/>
              </Box>

            </Grid>
          </Box>}
          {Panelvalue == "Settings" && <Box sx={{marginTop:'3%', height: '80vh', overflow: 'auto'}}>
            <Grid container rowSpacing={1} sx={{ justifyContent: 'center' }}> {/*columnSpacing={{ xs: 1, sm: 2, md: 3, lg:20 }}*/}
              <Grid item xs={10}>
                <Typography variant="h6" component="h2" textAlign={'center'}>Level</Typography>
                <Slider
                  aria-label="Depth"
                  defaultValue={1}
                  value={Depth}
                  onChange={handleDepth}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={23}
                  className='SliderDepth'
                />
              </Grid>
              <Grid item > {/*xs={10}*/}
                <Typography variant="h6" component="h2" textAlign={'center'}>Ai-Support</Typography>
                <Switch
                  checked={AiSupport}
                  onChange={handleAisupport}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
            </Grid>
          </Box>}
        </Box>
        <Toaster />
      </Box>
      <GameDialogBox
        open={DialogOpen}
        Title={"Game End"}
        Discription={DialogText}
        isRematch={isRematch}
        handelClose={() => {
          setDialogOpen(false);
          setisCompltedDialogOpen(true)
        }}
        handelRematch={() => {
          setDialogOpen(false);
          resetGame();
          game.reset()
        }}
        /*handelAnalyze={() => {
          setDialogOpen(false); // Close the dialog
          // Determine the result based on game state
          let result = '';
          if (game.isCheckmate()) {
            result = game.turn() === 'w' ? 'Black wins' : 'White wins'; // The opponent of the current turn won
          } else if (game.isDraw()) {
            result = 'Draw';
          } else if (game.isStalemate()) {
            result = 'Stalemate - Draw';
          } else if (game.isThreefoldRepetition()) {
            result = 'Threefold Repetition - Draw';
          }
          //const newFen = game.fen();
          //setPosition(game.fen());
          getEvaluationFromStockfish(game.fen()).then((evaluation) => {
            console.log("Evaluation Score:", evaluation);
          });
          // Assume evaluation score is calculated here or fetched
          const finalEvaluationScore = getEvaluationFromStockfish(game.fen()); // Replace with the actual logic to fetch evaluation

          handleGameEnd(result,finalEvaluationScore);
          //navigate('/feedback-analysis', { state: { gameData: gameDetails } });
        }} // New Analyze button handler*/
        handelAnalyze={handelAnalyze} 
      />
    </>
  );
}

export default PlayWithComputer;