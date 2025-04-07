import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import './LearnPage.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';

const LearnPage = () => {
  // Keep the existing categoryStages object
  const categoryStages = {
    "Chess Pieces": [
      { name: 'The Rook', description: 'Capture the star using the rook in the least number of moves.' },
      { name: 'The Bishop', description: 'Learn diagonal moves to capture pieces.' },
      { name: 'The Queen', description: 'Master the queens powerful moves.' },
      { name: 'The King', description: 'Keep your king safe while capturing.' },
      { name: 'The Knight', description: 'Master the L-shaped moves of the knight.' },
      { name: 'The Pawn', description: 'Understand the fundamentals of pawn movement.' },
    ],
    "Fundamentals": [
      { name: 'Capture', description: 'Learn capturing techniques.' },
      { name: 'Protection', description: 'Protect your pieces.' },
      { name: 'Combat', description: 'Engage in combat tactics.' },
      { name: 'Check in one', description: 'Deliver check in one move.' },
      { name: 'Out of check', description: 'Escape from check.' },
      { name: 'Mate in one', description: 'Mate in one move challenge.' },
    ],
    "Intermediate": [
      { name: 'Board setup', description: 'Set up the board correctly.' },
      { name: 'Castling', description: 'Learn castling rules.' },
      { name: 'En passant', description: 'Practice en passant captures.' },
      { name: 'Stalemate', description: 'Learn stalemate situations.' },
    ],
    "Advanced": [
      { name: 'Piece Value', description: 'Understand relative piece values.' },
      { name: 'Check in two', description: 'Deliver check in two moves challenge.' },
    ],
  };

  const categories = Object.keys(categoryStages);
  
  const [currentCategory, setCurrentCategory] = useState("Chess Pieces");
  const [currentStage, setCurrentStage] = useState(categoryStages[currentCategory][0]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progress, setProgress] = useState(() => {
    // Initialize progress with zeros for all stages and levels
    const initialProgress = {};
    categories.forEach(category => {
      categoryStages[category].forEach(stage => {
        initialProgress[stage.name] = [0, 0, 0, 0, 0, 0];
      });
    });
    return initialProgress;
  });

  const [showStageDialog, setShowStageDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [boardPosition, setBoardPosition] = useState('');
  const [game, setGame] = useState(new Chess());
  const [movesTaken, setMovesTaken] = useState(0);
  const [starsToCapture, setStarsToCapture] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [optimalMoves, setOptimalMoves] = useState(0);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [averageStars, setAverageStars] = useState(0);

  const [levelDescription, setLevelDescription] = useState('');

  const [status, setStatus] = useState("ready"); // Possible values: "ready", "failed", "completed"


  // Handle category change
  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    const defaultStage = categoryStages[category][0];
    setCurrentStage(defaultStage);
    setCurrentLevel(1);
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const handleStageClick = (stage) => {
    setCurrentStage(stage);
    setCurrentLevel(1);
    setShowStageDialog(true);
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const handleLevelClick = (level) => {
    setCurrentLevel(level);
    startLevel(level);
    setSelectedPiece(null);
    setPossibleMoves([]);
  };


  const isValidFEN = (fen) => {
    return fen.includes('K') && fen.includes('k');
  };


  const startLevel = (level) => {
    setStatus("ready"); // Clear any previous warning status
    setShowStageDialog(false);
    setMovesTaken(0);
    
    // Get configuration for the current category, stage and level
    const config = getLevelConfig(currentCategory, currentStage.name, level);
    
    
    if (!isValidFEN(config.fen)) {
      console.error('Invalid FEN:', config.fen);
      //return;
    }
    // Set up the board
    const newGame = new Chess(config.fen);
    setGame(newGame);
    setBoardPosition(config.fen);
    setStarsToCapture(config.stars || []);
    setOptimalMoves(config.optimalMoves || level);
    
     // Set level description
    setLevelDescription(config.description || '');

    // Reset highlighted moves
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const resetProgress = () => {
    const resetData = {};
    categories.forEach(category => {
      categoryStages[category].forEach(stage => {
        resetData[stage.name] = [0, 0, 0, 0, 0, 0];
      });
    });
    setProgress(resetData);
  };

  const retryLevel = () => {
    setStatus("ready");
    startLevel(currentLevel); // Restart the current level
  };

  const isMoveVulnerable = (fromSquare, toSquare) => {
    if (currentCategory === "Intermediate") {
      // Skip vulnerability check for Board setup stage
      return false;
    }
    const piece = game.get(fromSquare);
    if (!piece) return false;
    const simulatedGame = new Chess(game.fen());
    // Manually simulate the move by removing and placing the piece.
    simulatedGame.remove(fromSquare);
    simulatedGame.put({ type: piece.type, color: piece.color }, toSquare);
    
    // Update the active turn to black. (FEN format: [pieces] [active color] [castling] [en passant] [halfmove] [fullmove])
    const fenParts = simulatedGame.fen().split(" ");
    fenParts[1] = 'b'; // Set active turn to black.
    const newFEN = fenParts.join(" ");
    simulatedGame.load(newFEN);
    
    // Get all legal moves for black in this simulated position.
    const blackMoves = simulatedGame.moves({ verbose: true }).filter(move => move.color === 'b');
    
    // Check if any black move can capture on the destination square.
    return blackMoves.some(move => move.to === toSquare && move.captured !== undefined);
  };
  
  const isWhiteVulnerableAfterMove = (fromSquare, toSquare) => {
    if (currentCategory === "Intermediate" ) {
      // Skip vulnerability check for Board setup stage
      return false;
    }
    const piece = game.get(fromSquare);
    if (!piece) return false;
    const simulatedGame = new Chess(game.fen());
    // Simulate the move.
    simulatedGame.remove(fromSquare);
    simulatedGame.put({ type: piece.type, color: piece.color }, toSquare);
    // Update FEN so that it's black's turn.
    const fenParts = simulatedGame.fen().split(" ");
    fenParts[1] = 'b';
    simulatedGame.load(fenParts.join(" "));
    
    // Get all legal moves for black.
    const blackMoves = simulatedGame.moves({ verbose: true });
    
    // Collect all white piece positions.
    const whiteSquares = [];
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const square = String.fromCharCode('a'.charCodeAt(0) + file) + (8 - rank);
        const p = simulatedGame.get(square);
        if (p && p.color === 'w') {
          whiteSquares.push(square);
        }
      }
    }
    
    // Check if any black move can capture a white piece.
    return blackMoves.some(move => move.captured && whiteSquares.includes(move.to));
  };
  
  const simulateBlackCapture = (fromSquare, toSquare) => {
    if (currentCategory === "Intermediate" ) {
      // Skip vulnerability check for Board setup stage
      return false;
    }
    const simulatedGame = new Chess(game.fen());
    // Simulate the white move.
    const movingPiece = simulatedGame.get(fromSquare);
    simulatedGame.remove(fromSquare);
    simulatedGame.put({ type: movingPiece.type, color: movingPiece.color }, toSquare);
    // Force black's turn.
    const fenParts = simulatedGame.fen().split(" ");
    fenParts[1] = 'b';
    simulatedGame.load(fenParts.join(" "));
    
    // Find the first black move that results in a capture.
    const blackMoves = simulatedGame.moves({ verbose: true });
    const capturingMove = blackMoves.find(move => move.captured);
    if (capturingMove) {
      simulatedGame.move({ from: capturingMove.from, to: capturingMove.to });
    }
    return simulatedGame;
  };
  
  const isBlackVulnerableAfterCapture = (fromSquare, toSquare) => {
    if (currentCategory === "Intermediate" ) {
      // Skip vulnerability check for Board setup stage
      return false;
    }
    const simulatedGame = new Chess(game.fen());
    const movingPiece = simulatedGame.get(fromSquare);
    if (!movingPiece) return false;
    simulatedGame.remove(fromSquare);
    simulatedGame.put({ type: movingPiece.type, color: movingPiece.color }, toSquare);
    
    // Force turn to black.
    let fenParts = simulatedGame.fen().split(" ");
    fenParts[1] = 'b';
    try {
      simulatedGame.load(fenParts.join(" "));
    } catch (e) {
      console.error("Error in isBlackVulnerableAfterCapture (forcing turn):", e);
      return false;
    }
    
    const candidateCaptures = simulatedGame.moves({ verbose: true }).filter(move => move.captured);
    
    for (const candidateCapture of candidateCaptures) {
      const gameClone = new Chess(simulatedGame.fen());
      gameClone.move({ from: candidateCapture.from, to: candidateCapture.to });
      
      let cloneFenParts = gameClone.fen().split(" ");
      cloneFenParts[1] = 'w';
      try {
        gameClone.load(cloneFenParts.join(" "));
      } catch (e) {
        console.error("Error in isBlackVulnerableAfterCapture (clone):", e);
        continue;
      }
      const whiteMoves = gameClone.moves({ verbose: true });
      const counterCapture = whiteMoves.find(move => move.to === candidateCapture.to && move.captured);
      if (counterCapture) {
        return true;
      }
    }
    return false;
  };
  
  
  {/*const handleSquareClick = (square) => { 
    // Prevent moving black pieces
    const piece = game.get(square);
    if (piece && piece.color === 'b' && !selectedPiece) {
      alert("You cannot move black pieces!");
      return;
    }

    // If a piece is already selected, try to move it
    if (selectedPiece) {
      const move = { from: selectedPiece, to: square };
      
      // Check if the move is valid for the specific learning scenario
      const isValidLearningMove = isValidCustomMove(selectedPiece, square);
      
      if (isValidLearningMove) {
        // Level 2 specific logic
        if (currentCategory === "Fundamentals" && currentStage.name === "Capture" && currentLevel === 2) {
          // If the first move tries to capture the pawn at f6
          if (selectedPiece === "f3" && square === "f6" && starsToCapture.includes("f6")) {
            // Puzzle failed logic
            //alert("Puzzle failed! The queen is vulnerable to the rook.");
            setStatus("failed");

            // Simulate the black rook capturing the queen
            setTimeout(() => {
              const newGame = new Chess(game.fen());
              newGame.move({ from: "c6", to: "f6" }); // Black rook captures the queen
              setGame(newGame);
              setBoardPosition(newGame.fen());
            }, 500);

            return;
          }
        }
        // Perform the move directly without using chess.js move validation
        const newGame = new Chess(game.fen());
        const piece = newGame.get(selectedPiece);
        
        // Remove the piece from the original square
        newGame.remove(selectedPiece);
        
        // Place the piece on the new square
        newGame.put({ type: piece.type, color: piece.color }, square);
        
        setGame(newGame);
        setBoardPosition(newGame.fen());
        setMovesTaken(prev => prev + 1);
        
        // Check if a star was captured
        // const remainingStars = starsToCapture.filter((star) => star !== square);
        // setStarsToCapture(remainingStars);

        // Check if a specified black piece was captured
        const remainingTargets = starsToCapture.filter((target) => target !== square);
        setStarsToCapture(remainingTargets);
        
        // Check if level is completed
        //if (remainingStars.length === 0) {
        if (remainingTargets.length === 0) {
          completeLevel();
        }
        
        // Reset selection and recalculate possible moves for remaining white pieces
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }
      else {
        alert("Invalid move! Try again.");
      }
    }
    // Select a piece and calculate its possible moves
    //const piece = game.get(square);
    if (piece && piece.color === 'w') {
      setSelectedPiece(square);
      
      // Calculate possible moves based on learning scenario
      const validSquares = calculateCustomMoves(square);
      setPossibleMoves(validSquares);
    }
  };*/}
  
  const handleSquareClick = (square) => { 
    const piece = game.get(square);
    if (piece && piece.color === 'b' && !selectedPiece) {
      alert("You cannot move black pieces!");
      return;
    }
    
    // When a white piece is clicked, set selection.
    if (!selectedPiece && piece && piece.color === 'w') {
      setSelectedPiece(square);
      
      // Special: If in Castling stage and the piece is the king,
      // override possible moves with castling moves from chess.js.
      if (currentCategory === "Intermediate" && currentStage.name === "Castling" && piece.type === 'k') {
        // Get legal moves for the king.
        const legalMoves = game.moves({ square, verbose: true });
        // Filter only moves with castling flag ('k' or 'q').
        const castlingMoves = legalMoves.filter(m => m.flags.includes('k') || m.flags.includes('q'));
        setPossibleMoves(castlingMoves.map(m => m.to));
      } else {
        const validSquares = calculateCustomMoves(square);
        setPossibleMoves(validSquares);
      }
      return;
    }
    
    if (selectedPiece) {
      const config = getLevelConfig(currentCategory, currentStage.name, currentLevel);
      
      // Branch 1: Check in one (handled separately)
      if ((currentCategory === "Fundamentals" && currentStage.name === "Check in one") || (currentCategory === "Intermediate" && currentStage.name === "Stalemate") || (currentCategory === "Advanced" && currentStage.name === "Piece Value")) {
        if (config.answerMove && selectedPiece === config.answerMove.from && square === config.answerMove.to) {
          const newGame = new Chess(game.fen());
          const movingPiece = newGame.get(selectedPiece);
          newGame.remove(selectedPiece);
          newGame.put({ type: movingPiece.type, color: movingPiece.color }, square);
          setGame(newGame);
          setBoardPosition(newGame.fen());
          setMovesTaken(prev => prev + 1);
          completeLevel();
        } else {
          setStatus("failed");
          setTimeout(() => {
            // Failure simulation if desired.
          }, 500);
        }
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }
      
      // Branch 2: Out of check stage.
      else if (currentCategory === "Fundamentals" && currentStage.name === "Out of check") {
        if (isValidCustomMove(selectedPiece, square)) {
          const newGame = new Chess(game.fen());
          const movingPiece = newGame.get(selectedPiece);
          newGame.remove(selectedPiece);
          newGame.put({ type: movingPiece.type, color: movingPiece.color }, square);
          if (newGame.inCheck()) {
            setStatus("failed");
            setTimeout(() => {
              const newGameAfterCapture = simulateBlackCapture(selectedPiece, square);
              setGame(newGameAfterCapture);
              setBoardPosition(newGameAfterCapture.fen());
            }, 500);
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
          } else {
            setGame(newGame);
            setBoardPosition(newGame.fen());
            setMovesTaken(prev => prev + 1);
            completeLevel();
            setSelectedPiece(null);
            setPossibleMoves([]);
            return;
          }
        } else {
          alert("Invalid move! Try again.");
          setSelectedPiece(null);
          setPossibleMoves([]);
          return;
        }
      }
      
      // Branch 3: "Castling" stage (Intermediate).
// Inside handleSquareClick, in the Castling branch:
else if (currentCategory === "Intermediate" && currentStage.name === "Castling") {
  // Instead of using 'piece' (which is from game.get(square)), get the moving piece from the selectedPiece.
  const kingPiece = game.get(selectedPiece); // selectedPiece holds the king's location (e.g., "e1")
  if (kingPiece && kingPiece.type === 'k') {
    const fromSq = selectedPiece;  // e.g. "e1"
    const toSq = square;           // e.g. "g1" or "c1"
    const isCastlingMove = Math.abs(fromSq.charCodeAt(0) - toSq.charCodeAt(0)) === 2 && fromSq[1] === toSq[1];

    if (isCastlingMove) {
      // Verify that the move matches answerMove.
      if (config.answerMove && fromSq === config.answerMove.from && toSq === config.answerMove.to) {
        const newGame = new Chess(game.fen());
        // Convert to SAN castling notation.
        const san = (toSq === "g1" || toSq === "g8") ? "O-O" : (toSq === "c1" || toSq === "c8") ? "O-O-O" : null;
        if (san) {
          const move = newGame.move(san);
          if (move) {
            setGame(newGame);
            setBoardPosition(newGame.fen());
            setMovesTaken(prev => prev + 1);
            completeLevel();
          } else {
            alert("Invalid castling move! Try again.");
          }
        } else {
          alert("Invalid castling move! Try again.");
        }
      } else {
        alert("Invalid castling move! Try again.");
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
      return;
    }
    // If not a castling move, process as a normal move.
    else {
      if (isValidCustomMove(selectedPiece, square)) {
        const newGame = new Chess(game.fen());
        const movingPiece = newGame.get(selectedPiece);
        newGame.remove(selectedPiece);
        newGame.put({ type: movingPiece.type, color: movingPiece.color }, square);
        setGame(newGame);
        setBoardPosition(newGame.fen());
        setMovesTaken(prev => prev + 1);
        // Do not complete the level here.
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      } else {
        alert("Invalid move! Try again.");
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }
    }
  }
  // For non-king moves (clearing moves) in castling stage.
  else {
    if (isValidCustomMove(selectedPiece, square)) {
      const newGame = new Chess(game.fen());
      const movingPiece = newGame.get(selectedPiece);
      newGame.remove(selectedPiece);
      newGame.put({ type: movingPiece.type, color: movingPiece.color }, square);
      setGame(newGame);
      setBoardPosition(newGame.fen());
      setMovesTaken(prev => prev + 1);
      setSelectedPiece(null);
      setPossibleMoves([]);
      return;
    } else {
      alert("Invalid move! Try again.");
      setSelectedPiece(null);
      setPossibleMoves([]);
      return;
    }
  }
}

      // Branch for "En passant" stage.
    else if (currentCategory === "Intermediate" && currentStage.name === "En passant") {
      if (config.answerMove && selectedPiece === config.answerMove.from && square === config.answerMove.to) {
        // Accept the move as en passant.
        const newGame = new Chess(game.fen());
        const movingPiece = newGame.get(selectedPiece);
        newGame.remove(selectedPiece);
        // Perform the move (chess.js will recognize en passant based on FEN).
        newGame.put({ type: movingPiece.type, color: movingPiece.color }, square);
        setGame(newGame);
        setBoardPosition(newGame.fen());
        setMovesTaken(prev => prev + 1);
        completeLevel();
      } else {
        setStatus("failed");
        setTimeout(() => {}, 500);
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
      return;
    }

      
      // Branch 4: All other stages.
      else {
        const isValidLearningMove = isValidCustomMove(selectedPiece, square);
        let skipVulnerability = false;
        if (isWhiteVulnerableAfterMove(selectedPiece, square)) {
          if (isBlackVulnerableAfterCapture(selectedPiece, square)) {
            skipVulnerability = true;
          }
        }
        if (isValidLearningMove && !skipVulnerability && isWhiteVulnerableAfterMove(selectedPiece, square)) {
          setStatus("failed");
          setTimeout(() => {
            const newGame = simulateBlackCapture(selectedPiece, square);
            setGame(newGame);
            setBoardPosition(newGame.fen());
          }, 500);
          return;
        }
        if (isValidLearningMove) {
          const newGame = new Chess(game.fen());
          const movingPiece = newGame.get(selectedPiece);
          newGame.remove(selectedPiece);
          newGame.put({ type: movingPiece.type, color: movingPiece.color }, square);
          setGame(newGame);
          setBoardPosition(newGame.fen());
          setMovesTaken(prev => prev + 1);
          const remainingTargets = starsToCapture.filter(target => target !== square);
          setStarsToCapture(remainingTargets);
          if (remainingTargets.length === 0) {
            completeLevel();
          }
          setSelectedPiece(null);
          setPossibleMoves([]);
          return;
        } else {
          alert("Invalid move! Try again.");
        }
      }
    }
  };
  
  
  
  
    
  
  

  {/*const handleDrop = (sourceSquare, targetSquare) => {
    // Prevent moving black pieces
    const piece = game.get(sourceSquare);
    if (piece && piece.color === 'b') {
      alert("You cannot move black pieces!");
      return false;
    }
    // Use custom move validation for learning scenarios
    const isValidLearningMove = isValidCustomMove(sourceSquare, targetSquare);
    
    if (isValidLearningMove) {
      // Level 2 specific logic
      if (currentCategory === "Fundamentals" && currentStage.name === "Capture" && currentLevel === 2) {
        // If the first move tries to capture the pawn at f6
        if (sourceSquare === "f3" && targetSquare === "f6" && starsToCapture.includes("f6")) {
          // Puzzle failed logic
          //alert("Puzzle failed! The queen is vulnerable to the rook.");
          setStatus("failed");

          // Simulate the black rook capturing the queen
          setTimeout(() => {
            const newGame = new Chess(game.fen());
            newGame.move({ from: "c6", to: "f6" }); // Black rook captures the queen
            setGame(newGame);
            setBoardPosition(newGame.fen());
          }, 500);

          return false;
        }
      }
      const newGame = new Chess(game.fen());
      const piece = newGame.get(sourceSquare);
      
      // Remove the piece from the original square
      newGame.remove(sourceSquare);
      
      // Place the piece on the new square
      newGame.put({ type: piece.type, color: piece.color }, targetSquare);
      
      setGame(newGame);
      setBoardPosition(newGame.fen());
      setMovesTaken(prev => prev + 1);
      
      // Check star capture
      // const remainingStars = starsToCapture.filter(star => star !== targetSquare);
      // setStarsToCapture(remainingStars);

      // Check if a specified black piece was captured
      const remainingTargets = starsToCapture.filter((target) => target !== targetSquare);
      setStarsToCapture(remainingTargets);
      
      // Check if level is completed
      // if (remainingStars.length === 0) {
      if (remainingTargets.length === 0) {
        completeLevel();
      }
      
      // Reset selection and recalculate possible moves for remaining white pieces
      setSelectedPiece(null);
      setPossibleMoves([]);
      return true;
    }else {
      alert("Invalid move! Try again.");
      return false;
    }
  };*/}

  const handleDrop = (sourceSquare, targetSquare) => {
    const piece = game.get(sourceSquare);
    if (piece && piece.color === 'b') {
      alert("You cannot move black pieces!");
      return false;
    }
    
    const config = getLevelConfig(currentCategory, currentStage.name, currentLevel);
    
    // Branch 1: Check in one.
    if (currentCategory === "Fundamentals" && currentStage.name === "Check in one") {
      if (config.answerMove && sourceSquare === config.answerMove.from && targetSquare === config.answerMove.to) {
        const newGame = new Chess(game.fen());
        const movingPiece = newGame.get(sourceSquare);
        newGame.remove(sourceSquare);
        newGame.put({ type: movingPiece.type, color: movingPiece.color }, targetSquare);
        setGame(newGame);
        setBoardPosition(newGame.fen());
        setMovesTaken(prev => prev + 1);
        completeLevel();
      } else {
        setStatus("failed");
        setTimeout(() => {}, 500);
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
      return false;
    }
    
    // Branch 2: Out of check.
    else if (currentCategory === "Fundamentals" && currentStage.name === "Out of check") {
      if (isValidCustomMove(sourceSquare, targetSquare)) {
        const newGame = new Chess(game.fen());
        const movingPiece = newGame.get(sourceSquare);
        newGame.remove(sourceSquare);
        newGame.put({ type: movingPiece.type, color: movingPiece.color }, targetSquare);
        if (newGame.inCheck()) {
          setStatus("failed");
          setTimeout(() => {
            const newGameAfterCapture = simulateBlackCapture(sourceSquare, targetSquare);
            setGame(newGameAfterCapture);
            setBoardPosition(newGameAfterCapture.fen());
          }, 500);
          setSelectedPiece(null);
          setPossibleMoves([]);
          return false;
        } else {
          setGame(newGame);
          setBoardPosition(newGame.fen());
          setMovesTaken(prev => prev + 1);
          completeLevel();
          setSelectedPiece(null);
          setPossibleMoves([]);
          return true;
        }
      } else {
        setStatus("failed");
        setTimeout(() => {}, 500);
        setSelectedPiece(null);
        setPossibleMoves([]);
        return false;
      }
    }
    
    // Branch 3: "Castling" stage (Intermediate).
else if (currentCategory === "Intermediate" && currentStage.name === "Castling") {
  if (piece.type === 'k') {
    const fromFile = sourceSquare[0], toFile = targetSquare[0];
    const fromRank = sourceSquare[1], toRank = targetSquare[1];
    const fileDiff = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
    if (fromRank === toRank && fileDiff === 2) {
      if (config.answerMove && sourceSquare === config.answerMove.from && targetSquare === config.answerMove.to) {
        const newGame = new Chess(game.fen());
        const moveSAN = (targetSquare === 'g1') ? "O-O" : (targetSquare === 'c1') ? "O-O-O" : null;
        if (moveSAN) {
          const castlingMove = newGame.move(moveSAN);
          if (castlingMove) {
            setGame(newGame);
            setBoardPosition(newGame.fen());
            setMovesTaken(prev => prev + 1);
            completeLevel();
          } else {
            setStatus("failed");
            setTimeout(() => {}, 500);
          }
        } else {
          setStatus("failed");
          setTimeout(() => {}, 500);
        }
      } else {
        setStatus("failed");
        setTimeout(() => {}, 500);
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
      return true;
    }
  }
}

    // Branch for "En passant"
  else if (currentCategory === "Fundamentals" && currentStage.name === "En passant") {
    if (config.answerMove && sourceSquare === config.answerMove.from && targetSquare === config.answerMove.to) {
      const newGame = new Chess(game.fen());
      const movingPiece = newGame.get(sourceSquare);
      newGame.remove(sourceSquare);
      newGame.put({ type: movingPiece.type, color: movingPiece.color }, targetSquare);
      setGame(newGame);
      setBoardPosition(newGame.fen());
      setMovesTaken(prev => prev + 1);
      completeLevel();
    } else {
      setStatus("failed");
      setTimeout(() => {}, 500);
    }
    setSelectedPiece(null);
    setPossibleMoves([]);
    return false;
  }
    
    // Branch 4: All other stages.
    else {
      let skipVulnerability = false;
      if (isWhiteVulnerableAfterMove(sourceSquare, targetSquare)) {
        if (isBlackVulnerableAfterCapture(sourceSquare, targetSquare)) {
          skipVulnerability = true;
        }
      }
      const isValidLearningMove = isValidCustomMove(sourceSquare, targetSquare);
      if (isValidLearningMove && !skipVulnerability && isWhiteVulnerableAfterMove(sourceSquare, targetSquare)) {
        setStatus("failed");
        setTimeout(() => {
          const newGame = simulateBlackCapture(sourceSquare, targetSquare);
          setGame(newGame);
          setBoardPosition(newGame.fen());
        }, 500);
        return false;
      }
      if (isValidLearningMove) {
        const newGame = new Chess(game.fen());
        const movingPiece = newGame.get(sourceSquare);
        newGame.remove(sourceSquare);
        newGame.put({ type: movingPiece.type, color: movingPiece.color }, targetSquare);
        setGame(newGame);
        setBoardPosition(newGame.fen());
        setMovesTaken(prev => prev + 1);
        const remainingTargets = starsToCapture.filter(target => target !== targetSquare);
        setStarsToCapture(remainingTargets);
        if (remainingTargets.length === 0) {
          completeLevel();
        }
        setSelectedPiece(null);
        setPossibleMoves([]);
        return true;
      } else {
        alert("Invalid move! Try again.");
        return false;
      }
    }
  };
  
  
  
  
    

  
  // Custom move validation for learning scenarios
  // const isValidCustomMove = (fromSquare, toSquare) => {
  //   // Convert algebraic notation to coordinates
  //   const fromCoord = algebraicToCoord(fromSquare);
  //   const toCoord = algebraicToCoord(toSquare);
    
  //   // Rook moves (horizontal or vertical)
  //   const isSameRow = fromCoord.row === toCoord.row;
  //   const isSameCol = fromCoord.col === toCoord.col;
    
  //   return isSameRow || isSameCol;
  // };

  const isValidCustomMove = (fromSquare, toSquare) => {
    const piece = game.get(fromSquare);
    if (!piece) return false;
  
    // Convert algebraic notation to coordinates
    const fromCoord = algebraicToCoord(fromSquare);
    const toCoord = algebraicToCoord(toSquare);

  // Get the main piece's position from the level configuration
  const config = getLevelConfig(currentCategory, currentStage.name, currentLevel);
  const mainPieceSquare = config.mainPiece;

  // Simulate the move
  const newGame = new Chess(game.fen());
  newGame.remove(fromSquare);
  newGame.put({ type: piece.type, color: piece.color }, toSquare);

  // Check if the main piece is under attack after the move
  const isMainPieceUnderAttack = newGame.moves({ square: mainPieceSquare, verbose: true }).some(
    (move) => move.color === 'b' // Check if any black piece can attack the main piece
  );

  if (isMainPieceUnderAttack) {
    return false; // Invalid move if the main piece is under attack
  }

  // Validate moves based on piece type
  
    switch (piece.type) {
      case 'r': // Rook
        return fromCoord.row === toCoord.row || fromCoord.col === toCoord.col;
      case 'b': // Bishop
        return Math.abs(fromCoord.row - toCoord.row) === Math.abs(fromCoord.col - toCoord.col);
      case 'q': // Queen
        return (
          fromCoord.row === toCoord.row ||
          fromCoord.col === toCoord.col ||
          Math.abs(fromCoord.row - toCoord.row) === Math.abs(fromCoord.col - toCoord.col)
        );
      case 'n': // Knight
        return (
          (Math.abs(fromCoord.row - toCoord.row) === 2 && Math.abs(fromCoord.col - toCoord.col) === 1) ||
          (Math.abs(fromCoord.row - toCoord.row) === 1 && Math.abs(fromCoord.col - toCoord.col) === 2)
        );
      case 'k': // King
        return (
          Math.abs(fromCoord.row - toCoord.row) <= 1 && Math.abs(fromCoord.col - toCoord.col) <= 1
        );
      case 'p': {
        const direction = piece.color === 'w' ? -1 : 1;
        const fromCoord = algebraicToCoord(fromSquare);
        const toCoord = algebraicToCoord(toSquare);
        
        // Forward move.
        if (fromCoord.col === toCoord.col) {
          // One-square forward.
          if (toCoord.row === fromCoord.row + direction && !game.get(toSquare)) {
            return true;
          }
          // Two-square forward from initial rank.
          const initialRank = piece.color === 'w' ? 6 : 1;
          if (fromCoord.row === initialRank && toCoord.row === fromCoord.row + 2 * direction) {
            const intermediateSquare = coordToAlgebraic({ row: fromCoord.row + direction, col: fromCoord.col });
            if (!game.get(intermediateSquare) && !game.get(toSquare)) {
              return true;
            }
          }
        }
        
        // Diagonal move: normal capture.
        if (Math.abs(fromCoord.col - toCoord.col) === 1 && toCoord.row === fromCoord.row + direction) {
          const targetPiece = game.get(toSquare);
          if (targetPiece && targetPiece.color !== piece.color) {
            return true;
          }
          // En passant: allow if the target equals the en passant square.
          const fenParts = game.fen().split(" ");
          const enPassantSquare = fenParts[3];
          if (enPassantSquare !== "-" && enPassantSquare === toSquare) {
            return true;
          }
        }
        return false;
      }
                        
      default:
        return false;
    }
  };
  
  // Calculate possible moves for a piece in learning scenarios
  // const calculateCustomMoves = (square) => {
  //   const piece = game.get(square);
  //   if (!piece) return [];
    
  //   // If it's a rook, return all squares in the same row and column
  //   if (piece.type === 'r' && piece.color === 'w') {
  //     return generateRookMoves(square);
  //   }
    
  //   // Default to chess.js moves for other pieces
  //   return game.moves({ square, verbose: true }).map(move => move.to);
  // };

  const calculateCustomMoves = (square) => {
    const piece = game.get(square);
    if (!piece) return [];
    
    switch (piece.type) {
      case 'r': // Rook
        return generateRookMoves(square);
      case 'b': // Bishop
        return generateBishopMoves(square);
      case 'q': // Queen
        return [...generateRookMoves(square), ...generateBishopMoves(square)];
      case 'n': // Knight
        return generateKnightMoves(square);
      case 'k': // King
        return generateKingMoves(square);
      case 'p': // Pawn
        return generatePawnMoves(square, piece.color);
      default:
        return [];
    }
  };
  
  // Helper function to convert algebraic notation to coordinates
  const algebraicToCoord = (square) => {
    return {
      col: square.charCodeAt(0) - 'a'.charCodeAt(0),
      row: 8 - parseInt(square[1])
    };
  };

  const coordToAlgebraic = (coord) => {
    const file = String.fromCharCode('a'.charCodeAt(0) + coord.col);
    const rank = (8 - coord.row).toString();
    return file + rank;
  };

  // Generate all possible rook moves including star positions
  const generateRookMoves = (square) => {
    const moves = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    const file = square[0];
    const rank = square[1];
    
    // Horizontal moves
    files.forEach(f => {
      if (f !== file) {
        moves.push(f + rank);
      }
    });
    
    // Vertical moves
    ranks.forEach(r => {
      if (r !== rank) {
        moves.push(file + r);
      }
    });
    
    // Add star positions if they are in the same row or column
    moves.push(...starsToCapture.filter(star => 
      star[0] === square[0] || star[1] === square[1]
    ));
    
    return moves;
  };
  
  const generateBishopMoves = (square) => {
    const moves = [];
    const directions = [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];
  
    const fromCoord = algebraicToCoord(square);
  
    directions.forEach((dir) => {
      for (let i = 1; i < 8; i++) {
        const toCoord = { row: fromCoord.row + dir.row * i, col: fromCoord.col + dir.col * i };
        if (toCoord.row < 0 || toCoord.row >= 8 || toCoord.col < 0 || toCoord.col >= 8) break;
  
        const toSquare = coordToAlgebraic(toCoord);
        moves.push(toSquare);
  
        if (starsToCapture.includes(toSquare)) break;
      }
    });
  
    return moves;
  };

  const generateQueenMoves = (square) => {
    return [...generateRookMoves(square), ...generateBishopMoves(square)];
  };

  const generateKnightMoves = (square) => {
    const moves = [];
    const knightMoves = [
      { row: 2, col: 1 },
      { row: 2, col: -1 },
      { row: -2, col: 1 },
      { row: -2, col: -1 },
      { row: 1, col: 2 },
      { row: 1, col: -2 },
      { row: -1, col: 2 },
      { row: -1, col: -2 },
    ];
  
    const fromCoord = algebraicToCoord(square);
  
    knightMoves.forEach((move) => {
      const toCoord = { row: fromCoord.row + move.row, col: fromCoord.col + move.col };
      if (toCoord.row < 0 || toCoord.row >= 8 || toCoord.col < 0 || toCoord.col >= 8) return;
  
      const toSquare = coordToAlgebraic(toCoord);
      moves.push(toSquare);
    });
  
    return moves;
  };

  const generateKingMoves = (square) => {
    const moves = [];
    const kingMoves = [
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];
  
    const fromCoord = algebraicToCoord(square);
  
    kingMoves.forEach((move) => {
      const toCoord = { row: fromCoord.row + move.row, col: fromCoord.col + move.col };
      if (toCoord.row < 0 || toCoord.row >= 8 || toCoord.col < 0 || toCoord.col >= 8) return;
  
      const toSquare = coordToAlgebraic(toCoord);
      moves.push(toSquare);
    });
  
    return moves;
  };

  const generatePawnMoves = (square, color) => {
    const moves = [];
    const fromCoord = algebraicToCoord(square);
    const direction = color === 'w' ? -1 : 1;
  
    // One-square forward move.
    const forwardCoord = { row: fromCoord.row + direction, col: fromCoord.col };
    if (forwardCoord.row >= 0 && forwardCoord.row < 8) {
      const forwardSquare = coordToAlgebraic(forwardCoord);
      if (!game.get(forwardSquare)) {
        moves.push(forwardSquare);
        // Two-square move from initial rank.
        const initialRank = color === 'w' ? 6 : 1;
        if (fromCoord.row === initialRank) {
          const forwardTwoCoord = { row: fromCoord.row + 2 * direction, col: fromCoord.col };
          const forwardTwoSquare = coordToAlgebraic(forwardTwoCoord);
          if (!game.get(forwardTwoSquare) && !game.get(forwardSquare)) {
            moves.push(forwardTwoSquare);
          }
        }
      }
    }
  
    // Diagonal capture moves (if an opponent piece exists).
    const diagLeftCoord = { row: fromCoord.row + direction, col: fromCoord.col - 1 };
    const diagRightCoord = { row: fromCoord.row + direction, col: fromCoord.col + 1 };
    [diagLeftCoord, diagRightCoord].forEach(coord => {
      if (
        coord.row >= 0 &&
        coord.row < 8 &&
        coord.col >= 0 &&
        coord.col < 8
      ) {
        const diagSquare = coordToAlgebraic(coord);
        const targetPiece = game.get(diagSquare);
        if (targetPiece && targetPiece.color !== color) {
          moves.push(diagSquare);
        }
      }
    });
  
    // En passant: If an en passant target square exists in the FEN and is diagonally adjacent.
    const fenParts = game.fen().split(" ");
    const enPassantSquare = fenParts[3]; // 4th field of FEN.
    if (enPassantSquare !== "-") {
      // const enPassantCoord = algebraicToCoord(enPassantSquare);
      // const rowDiff = enPassantCoord.row - fromCoord.row;
      // const colDiff = Math.abs(enPassantCoord.col - fromCoord.col);
      // if (rowDiff === direction && colDiff === 1) {
      //   // Add en passant target square even if it's empty.
      //   moves.push(enPassantSquare);
      // }
      const epCoord = algebraicToCoord(enPassantSquare);
      if (epCoord.row === fromCoord.row + direction && Math.abs(epCoord.col - fromCoord.col) === 1) {
        moves.push(enPassantSquare);
      }
    }
    return moves;
  };
  
  
  

  
  const checkForCapture = (square) => {
    // Check if we captured a black piece
    const blackPieces = getAllBlackPiecePositions();
    
    // Remove the captured position from black pieces list
    const remainingBlackPieces = blackPieces.filter((pos) => pos !== square);
    
    // If we captured all black pieces, complete the level
    if (remainingBlackPieces.length === 0) {
      completeLevel();
    }
  };

  const getAllBlackPiecePositions = () => {
    const blackPieces = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = String.fromCharCode(97 + j) + (8 - i);
        const piece = game.get(square);
        if (piece && piece.color === 'b') {
          blackPieces.push(square);
        }
      }
    }
    return blackPieces;
  };

  const completeLevel = () => {
    // Award stars based on moves taken
    const stars = movesTaken <= optimalMoves ? 3 : 
                  movesTaken <= optimalMoves + 2 ? 2 : 1;
    setStarsEarned(stars);

    // Update progress
    const updatedProgress = { ...progress };
    updatedProgress[currentStage.name][currentLevel - 1] = stars;
    setProgress(updatedProgress);

    // Check if all levels are completed
    if (currentLevel === 6) {
      // Calculate average stars for this stage
      const stageStars = updatedProgress[currentStage.name];
      const avg = stageStars.reduce((sum, stars) => sum + stars, 0) / stageStars.length;
      setAverageStars(avg);
      setStageCompleted(true);
      setShowCompletionDialog(true);
    } else {
      // Move to next level
      const nextLevel = currentLevel + 1;
      setTimeout(() => {
        //setCurrentLevel(prev => prev + 1);
        //startLevel(currentLevel + 1);
        setCurrentLevel(nextLevel);
        startLevel(nextLevel);
      }, 500);
    }
  };

  const renderStars = (numStars) => {
    let stars = '';
    for (let i = 0; i < 3; i++) {
      stars += i < numStars ? '★' : '☆';
      if (i < 2) stars += ' ';
    }
    return stars;
  };

  const getSquareStyles = () => {
    const styles = {};
    
    // Highlight stars to capture (only for Chess Pieces category)
    if (currentCategory === "Chess Pieces" || (currentCategory === "Intermediate" && currentStage.name === "Board setup")) {
      starsToCapture.forEach(star => {
        styles[star] = {
          backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\' viewBox=\'0 0 24 24\'><path fill=\'%23FFD700\' d=\'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\'/></svg>")',
          backgroundSize: 'contain',
        };
      });
    }

    // Highlight selected piece
    if (selectedPiece) {
      styles[selectedPiece] = {
        ...styles[selectedPiece],
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      };
    }
    
    // Highlight possible moves
    possibleMoves.forEach(move => {
      styles[move] = {
        ...styles[move],
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        borderRadius: '50%',
      };
    });
    
    return styles;
  };

  // Level configuration for all categories and stages
  const getLevelConfig = (category, stage, level) => {
    // Chess Pieces category configurations
    if (category === "Chess Pieces") {
      if (stage === "The Rook") {
        return getRookLevelConfig(level);
      } else if (stage === "The Bishop") {
        return getBishopLevelConfig(level);
      } else if (stage === "The Queen") {
        return getQueenLevelConfig(level);
      } else if (stage === "The King") {
        return getKingLevelConfig(level);
      } else if (stage === "The Knight") {
        return getKnightLevelConfig(level);
      } else if (stage === "The Pawn") {
        return getPawnLevelConfig(level);
      }
    }
    // Fundamentals category configurations
    else if (category === "Fundamentals") {
      if (stage === "Capture") {
        return getCaptureLevelConfig(level);
      } else if (stage === "Protection") {
        return getProtectionLevelConfig(level);
      } else if (stage === "Combat") {
        return getCombatLevelConfig(level);
      } else if (stage === "Check in one") {
        return getCheckInOneLevelConfig(level);
      } else if (stage === "Out of check") {
        return getOutOfCheckLevelConfig(level);
      } else if (stage === "Mate in one") {
        return getMateInOneLevelConfig(level);
      }
    }
    // Intermediate category configurations
    else if (category === "Intermediate") {
      if (stage === "Board setup") {
        return getBoardSetupLevelConfig(level);
      } else if (stage === "Castling") {
        return getCastlingLevelConfig(level);
      } else if (stage === "En passant") {
        return getEnPassantLevelConfig(level);
      } else if (stage === "Stalemate") {
        return getStalemateLevelConfig(level);
      }
    }
    // Advanced category configurations
    else if (category === "Advanced") {
      if (stage === "Piece Value") {
        return getPieceValueLevelConfig(level);
      } else if (stage === "Check in two") {
        return getCheckInTwoLevelConfig(level);
      }
    }
    
    // Default configuration
    return {
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      stars: [],
      optimalMoves: 1
    };
  };

  //Chess Pieces Category
  // Rook level configurations
  const getRookLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5'], 
          optimalMoves: 2 
        };
      case 2:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5', 'g5'], 
          optimalMoves: 3 
        };
      case 3:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5', 'g5', 'd7'], 
          optimalMoves: 4 
        };
      case 4:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5', 'g5', 'd7', 'g7'], 
          optimalMoves: 5 
        };
      case 5:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5', 'g5', 'd7', 'g7', 'a3', 'a7'], 
          optimalMoves: 6 
        };
      case 6:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5', 'g5', 'd7', 'g7', 'a3', 'a7', 'h1', 'h8'], 
          optimalMoves: 8 
        };
      default:
        return { 
          fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1', 
          stars: ['d5'], 
          optimalMoves: 2 
        };
    }
  };

  // Bishop level configurations
  const getBishopLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4'], 
          optimalMoves: 2 
        };
      case 2:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4', 'g6'], 
          optimalMoves: 3 
        };
      case 3:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4', 'f7', 'g6'], 
          optimalMoves: 4 
        };
      case 4:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4', 'f7', 'g6', 'a8'], 
          optimalMoves: 5 
        };
      case 5:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4', 'f7', 'g6', 'a8', 'b1', 'a2'], 
          optimalMoves: 6 
        };
      case 6:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4', 'f7', 'g6', 'a8', 'b1', 'a2', 'h1', 'h7'], 
          optimalMoves: 8 
        };
      default:
        return { 
          fen: '8/8/8/8/8/3B4/8/4K2k w - - 0 1', 
          stars: ['e4'], 
          optimalMoves: 2 
        };
    }
  };

  // Queen level configurations
  const getQueenLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5'], 
          optimalMoves: 2 
        };
      case 2:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5', 'f5'], 
          optimalMoves: 3 
        };
      case 3:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5', 'f5', 'e4'], 
          optimalMoves: 4 
        };
      case 4:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5', 'f5', 'e4', 'g7'], 
          optimalMoves: 5 
        };
      case 5:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5', 'f5', 'e4', 'g7', 'a3', 'a7'], 
          optimalMoves: 6 
        };
      case 6:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5', 'f5', 'e4', 'g7', 'a3', 'a7', 'h1', 'h8'], 
          optimalMoves: 8 
        };
      default:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', 
          stars: ['d5'], 
          optimalMoves: 2 
        };
    }
  };

  // King level configurations
  const getKingLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4'], 
          optimalMoves: 1 
        };
      case 2:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4', 'e4'], 
          optimalMoves: 2 
        };
      case 3:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4', 'e4', 'e3'], 
          optimalMoves: 3 
        };
      case 4:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4', 'e4', 'e3', 'c3'], 
          optimalMoves: 4 
        };
      case 5:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4', 'e4', 'e3', 'c3', 'c2'], 
          optimalMoves: 6 
        };
      case 6:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4', 'e4', 'e3', 'c3', 'c2', 'd2', 'e2'], 
          optimalMoves: 8 
        };
      default:
        return { 
          fen: '8/8/8/8/8/3K4/8/7k w - - 0 1', 
          stars: ['d4'], 
          optimalMoves: 1 
        };
    }
  };

  // Knight level configurations
  const getKnightLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5'], 
          optimalMoves: 1 
        };
      case 2:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5', 'f5'], 
          optimalMoves: 2 
        };
      case 3:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5', 'f5', 'c6'], 
          optimalMoves: 3 
        };
      case 4:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5', 'f5', 'c6', 'f2'], 
          optimalMoves: 4 
        };
      case 5:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5', 'f5', 'c6', 'f2', 'b3', 'g3'], 
          optimalMoves: 6 
        };
      case 6:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5', 'f5', 'c6', 'f2', 'b3', 'g3', 'a1', 'h8'], 
          optimalMoves: 8 
        };
      default:
        return { 
          fen: '8/8/8/8/8/3N4/8/4K2k w - - 0 1', 
          stars: ['e5'], 
          optimalMoves: 1 
        };
    }
  };

  // Pawn level configurations
  const getPawnLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '8/8/8/8/8/8/3P4/4K2k w - - 0 1', 
          stars: ['d3'], 
          optimalMoves: 1 
        };
      case 2:
        return { 
          fen: '8/8/8/8/8/8/3P4/4K2k w - - 0 1', 
          stars: ['d3', 'd4'], 
          optimalMoves: 2 
        };
      case 3:
        return { 
          fen: '8/8/8/8/8/8/3P4/4K2k w - - 0 1', 
          stars: ['d3', 'd4', 'e5'], 
          optimalMoves: 3 
        };
      case 4:
        return { 
          fen: '7k/8/8/8/8/8/3P2P1/4K3 w - - 0 1', 
          stars: ['d3', 'd4', 'c5', 'g3'], 
          optimalMoves: 4 
        };
      case 5:
        return { 
          fen: '7k/8/8/8/8/8/3P2P1/4K3 w - - 0 1', 
          stars: ['d3', 'd4','g3', 'g4', 'f5'], 
          optimalMoves: 6 
        };
      case 6:
        return { 
          fen: '7k/8/8/8/8/8/3P2P1/4K3 w - - 0 1', 
          stars: ['d3', 'd4', 'g3', 'g4', 'f5', 'e5'], 
          optimalMoves: 8 
        };
      default:
        return { 
          fen: '7k/8/8/8/8/8/3P4/4K3 w - - 0 1', 
          stars: ['d3'], 
          optimalMoves: 1 
        };
    }
  };

  // Fundamentals Category
  // Capture level configurations
  const getCaptureLevelConfig = (level) => {
    switch (level) {
      case 1:
        return {
          fen: '8/2p2p2/8/8/8/8/2R5/4K2k w - - 0 1', // White rook at c2, black pawns at c7 and f7
          //mainPiece: 'c2', // Main piece is the white rook
          stars: ['c7', 'f7'],
          optimalMoves: 2,
          description: 'Take the black pieces!',
        };
      case 2:
        return {
          fen: '8/8/2r2p2/8/8/5Q2/8/4K2k w - - 0 1', // White queen at f4, black pawn at f7, black rook at c7
          //mainPiece: 'f3', // Main piece is the white queen,
          stars: ['c6', 'f6'], // Black rook and pawn to capture
          optimalMoves: 2,
          description: "Take the black pieces! And don't lose yours.",
        };
      case 3:
        return {
          fen: '8/5r2/8/1r3p2/8/3B4/8/4K2k w - - 0 1', // White bishop at d3, black pawn at f5, black rooks at b5 and f7
          //mainPiece: 'd3', // Main piece is the white bishop
          stars: ['b5', 'f5','f7'], // Black rooks to capture
          optimalMoves: 4,
          description: "Take the black pieces! And don't lose yours.",
        };
      case 4:
        return {
          fen: '8/5b2/5p2/3n2p1/8/6Q1/8/4K2k w - - 0 1', // White queen at g3, black knight at d5, pawns at g5 and f6, bishop at f7
          //mainPiece: 'g3', // Main piece is the white queen
          stars:  ['d5', 'g5', 'f6', 'f7'], // Black pawns to capture
          optimalMoves: 5,
          description: "Take the black pieces! And don't lose yours.",
        };
      case 5:
        return {
          fen: '8/3b4/2p2q2/8/3p1N2/8/8/4K2k w - - 0 1', // White knight at f4, black pawns at d4 and c6, bishop at d7, queen at f6
          //mainPiece: 'f4', // Main piece is the white knight
          stars:  ['d4', 'c6', 'f6', 'd7'], // Black pieces to capture
          optimalMoves: 6,
          description: "Take the black pieces! And don't lose yours.",
        };
      default:
        return {
          fen: '8/2p2p2/8/8/8/8/2R5/4K2k w - - 0 1', // Default to level 1
          //mainPiece: 'c2',
          stars: ['c7', 'f7'],
          optimalMoves: 2,
          description: "Take the black pieces! And don't lose yours.",
        };
    }
  };

  // Protection level configurations
  const getProtectionLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: '8/8/8/4bb2/8/8/P2P4/R2K2k1 w - - 0 1', 
        optimalMoves: 1,
        description: "You're under attack! Escape the threat!",
      };
    case 2:
      return { 
        fen: '8/8/8/2q2N2/8/8/8/4K2k w - - 0 1',
        optimalMoves: 2, 
        description: "You're under attack! Escape the threat!",
      };
    case 3:
      return { 
        fen: '8/N2q4/8/8/8/8/6R1/4K2k w - - 0 1',
        optimalMoves: 3,
        description: "There is no escape, but you can defend!",
        //exemptMove: { from: 'g2', to: 'a2' }  // Allow this move despite vulnerability.
      };
    case 4:
      return { 
        fen: '8/8/1Bq5/8/2P5/8/8/4K2k w - - 0 1',
        optimalMoves: 4,
        description: "There is no escape, but you can defend!",
        //exemptMove: { from: 'c4', to: 'c5' }
      };
    case 5:
      return { 
        fen: '1r6/8/5b2/8/8/3P1N2/P7/R1B2K1k w - - 0 1',
        optimalMoves: 5,
        description: "There is no escape, but you can defend!",
        //exemptMove: { from: 'd3', to: 'd4' }
      };
    case 6:
      return { 
        fen: '7k/1b6/8/8/7K/3P2P1/5NRP/r7 w - - 0 1',
        optimalMoves: 6,
        description: "Don't let them take any undefended piece!",
        //exemptMove: { from: 'f2', to: 'e4' }
      };
    default:
      return { 
        fen: '8/8/8/8/8/3R4/8/4K2k w - - 0 1',
        optimalMoves: 1,
        description: "You're under attack! Escape the threat!",
      };
  }
};

  // Combat level configurations
  const getCombatLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          //fen: '8/8/8/8/8/3R4/8/5b2 w - - 0 1', 
          fen: '8/8/8/8/P2r4/6B1/8/4K2k w - - 0 1', // Added white king at e1 and black king at h1
          stars: ['d4'],
          optimalMoves: 1,
          description: "Take the black pieces! And don't lose yours.", 
        };
      case 2:
        return { 
          //fen: '8/8/8/8/8/3R2B1/8/5b1n w - - 0 1', 
          fen: '2r5/8/3b4/2P5/8/1P6/2B5/4K2k w - - 0 1', // Added white king at e1 and black king at h1
          stars: ['c8', 'd6'],
          optimalMoves: 2,
          description: "Take the black pieces! And don't lose yours.", 
        };
      case 3:
        return { 
          //fen: '8/8/5n2/8/8/3R2B1/8/5b1n w - - 0 1', 
          fen: '1r6/8/5n2/3P4/4P1P1/1Q6/8/4K2k w - - 0 1',
          stars: ['b8', 'f6'],
          optimalMoves: 3, 
          description: "Take the black pieces! And don't lose yours.", 
        };
      case 4:
        return { 
          //fen: '8/8/5n2/4b3/8/3R2B1/8/5b1n w - - 0 1', 
          fen: '2r5/8/3N4/5b2/8/8/PPP5/4K2k w - - 0 1',
          stars: ['c8', 'f5'],
          optimalMoves: 4,
          description: "Take the black pieces! And don't lose yours.",  
        };
      case 5:
        return { 
          //fen: '8/8/5n2/4b3/8/3R2B1/6N1/1b3b1n w - - 0 1', 
          fen: 'k7/6q1/8/4P1P1/8/4B3/r2P2N1/4K3 w - - 0 1',
          stars: ['a2', 'g7'],
          optimalMoves: 5,
          description: "Take the black pieces! And don't lose yours.",  
        };
      default:
        return { 
          //fen: '8/8/8/8/8/3R4/8/5b2 w - - 0 1', 
          fen: '8/8/8/8/P2r4/6B1/8/4K2k w - - 0 1', // Added white king at e1 and black king at h1
          stars: ['d4'],
          optimalMoves: 1,
          description: "Take the black pieces! And don't lose yours.",  
        };
    }
  };

  // Check in one level configurations
  const getCheckInOneLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          fen: '4k3/8/2b5/8/8/8/8/R4K2 w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'a1', to: 'e1' } // Correct move for level 1
        };
      case 2:
        return { 
          fen: '8/8/4k3/3n4/8/1Q6/8/4K3 w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'b3', to: 'h3' } // Correct move for level 2
        };
      case 3:
        return { 
          fen: '3qk3/1pp5/3p4/4p3/8/3B4/6r1/4K3 w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'd3', to: 'b5' } // Correct move for level 3
        };
      case 4:
        return { 
          fen: '2r2q2/2n5/8/4k3/8/2NPP3/6B1/4K3 w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'd3', to: 'd4' } // Correct move for level 4 (white pawn d3 -> d4)
        };
      case 5:
        return { 
          fen: '8/2b1q2n/1ppk4/2N5/8/8/8/4K3 w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'c5', to: 'b7' } // Correct move for level 5
        };
      case 6:
        return { 
          fen: '6R1/1k3r2/8/4Q3/8/2n5/8/4K3 w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'e5', to: 'b8' } // Correct move for level 6
        };
      default:
        return { 
          fen: '8/8/8/8/8/3Q4/8/4K2k w - - 0 1', // White king at e1
          optimalMoves: 1,
          description: "Aim at the opponent's king in one move!",
          answerMove: { from: 'a1', to: 'e1' }
        };
    }
  };

  // Out of check level configurations
  const getOutOfCheckLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          //fen: '8/8/8/8/8/8/8/R3k2r b - - 0 1', 
          fen: '8/8/8/4q3/8/8/8/4K2k w - - 0 1', // Added white king at h1
          optimalMoves: 1,
          description: "Escape with the king!",  
        };
      case 2:
        return { 
          //fen: '8/8/8/4q3/8/8/8/4K3 w - - 0 1', 
          fen: '8/2n5/5b2/8/2K5/8/2q5/7k w - - 0 1',
          optimalMoves: 1,
          description: "Escape with the king!",  
        };
      case 3:
        return { 
          //fen: '8/8/2b5/8/8/8/8/4K3 w - - 0 1', 
          fen: '8/7r/6r1/8/R7/7K/8/7k w - - 0 1',
          optimalMoves: 1,
          description: "The king cannot escape, but you can block the attack!",  
        };
      case 4:
        return { 
          //fen: '8/8/8/8/6r1/8/8/4K3 w - - 0 1', 
          fen: '8/8/8/3b4/8/4N3/KBn5/1R5k w - - 0 1',
          optimalMoves: 1,
          description: "You can get out of check by taking the attacking piece.",  
        };
      case 5:
        return { 
          //fen: '8/8/8/8/8/8/1q6/4K3 w - - 0 1', 
          fen: '4q2k/8/8/8/8/5nb1/3PPP2/3QKBNr w - - 0 1',
          optimalMoves: 1,
          description: "This knight is checking through your defenses!",  
        };
      case 6:
        return { 
          //fen: '8/4r3/2n5/8/8/2b5/8/R3K3 w - - 0 1', 
          fen: '8/8/7p/2q5/5n2/1N1KP2r/3R4/7k w - - 0 1',
          optimalMoves: 1,
          description: "Escape with the king or block the attack!",  
        };
      default:
        return { 
          //fen: '8/8/8/8/8/8/8/R3k2r b - - 0 1', 
          fen: '8/8/8/8/8/8/8/R3K2k w - - 0 1', // Added white king at h1
          optimalMoves: 1,
          description: "Escape with the king!",  
        };
    }
  };
  
  // Mate in one level configurations
  const getMateInOneLevelConfig = (level) => {
    switch (level) {
      case 1:
        return { 
          //fen: '8/8/8/8/8/8/1Q6/4k3 w - - 0 1', 
          fen: '3qk3/3ppp2/8/8/2B5/5Q2/8/4K3 w - - 0 1', // Added white king at h1
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!", 
          answerMove: { from: 'f3', to: 'f7' } 
        };
      case 2:
        return { 
          //fen: '6k1/5ppp/8/8/8/8/1Q6/8 w - - 0 1', 
          fen: '6rk/6pp/7P/6N1/8/8/8/4K3 w - - 0 1',
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!",  
          answerMove: { from: 'g5', to: 'f7' }
        };
      case 3:
        return { 
          //fen: '7k/5Q2/8/8/8/8/8/8 w - - 0 1', 
          fen: 'R7/8/7k/2r5/5n2/8/6Q1/4K3 w - - 0 1',
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!",
          answerMove: { from: 'a8', to: 'h8' }  
        };
      case 4:
        return { 
          //fen: '3qk3/8/8/8/8/8/5Q2/8 w - - 0 1', 
          fen: '2rb4/2k5/5N2/1Q6/8/8/8/4K3 w - - 0 1',
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!", 
          answerMove: { from: 'f6', to: 'e8' } 
        };
      case 5:
        return { 
          //fen: '5rk1/6p1/6Qp/8/8/8/8/8 w - - 0 1', 
          fen: '1r2kb2/ppP1p3/2B2p2/2p1N3/B7/8/8/3RK3 w - - 0 1',
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!",
          answerMove: { from: 'c6', to: 'b7' }  
        };
      case 6:
        return { 
          //fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1', 
          //fen: 'r1bqb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1kR w KQkq - 0 1',
          fen: '8/pk1N4/n7/b7/6B1/1r3b2/8/1RR1K3 w - - 0 1',
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!",  
          answerMove: { from: 'g4', to: 'f3' }
        };
      default:
        return { 
          //fen: '8/8/8/8/8/8/1Q6/4k3 w - - 0 1', 
          fen: '8/8/8/8/8/8/1Q6/4K2k w - - 0 1', // Added white king at h1
          optimalMoves: 1,
          description: "Attack your opponent's king in a way that cannot be defended!",  
        };
    }
  };

  //Intermediate Category
// Board setup level configurations
const getBoardSetupLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1', 
        optimalMoves: 1,
        description: "This is the initial position of every game of chess! Make any move to continue.",  
      };
    case 2:
      return { 
        fen: 'r6r/7k/8/8/8/8/7K/2RR4 w kq - 0 1', 
        stars: ['a1', 'h1'],
        optimalMoves: 1,
        description: "First place the rooks! They go in the corners.",  
      };
    case 3:
      return { 
        fen: 'rn4nr/7k/8/8/8/8/2NN3K/R6R w - - 0 1', 
        stars: ['b1', 'g1'],
        optimalMoves: 1,
        description: "Then place the knights! They go next to the rooks.",  
      };
    case 4:
      return { 
        fen: 'rnb2bnr/7k/8/8/4BB2/8/7K/RN4NR w KQ - 0 1', 
        stars: ['c1', 'f1'],
        optimalMoves: 1,
        description: "Place the bishops! They go next to the knights.",  
      };
    case 5:
      return { 
        fen: 'rnbq1bnr/7k/8/8/5Q2/8/7K/RNB2BNR w - - 0 1', 
        stars: ['d1'],
        optimalMoves: 1,
        description: "Place the queen! She goes on her own color.",  
      };
    case 6:
      return { 
        fen: 'rnbqkbnr/8/8/8/5K2/8/8/RNBQ1BNR w KQkq - 0 1', 
        stars: ['e1'],
        optimalMoves: 1,
        description: "Place the king! Right next to his queen.",  
      };
    default:
      return { 
        fen: '8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1', 
        optimalMoves: 1,
        description: "",  
      };
  }
};

// Castling level configurations
const getCastlingLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/2B5/4PN2/PPPP1PPP/RNBQK2R w KQ - 0 1',
        optimalMoves: 1,
        description: "Move your king two squares to castle king-side!",
        answerMove: { from: 'e1', to: 'g1' }  // king-side castling
      };
    case 2:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/1PN5/PBPPQPPP/R3KBNR w KQ - 0 1',
        optimalMoves: 1,
        description: "Move your king two squares to castle queen-side!",
        answerMove: { from: 'e1', to: 'c1' }  // queen-side castling
      };
    case 3:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPPBPPP/RNBQK1NR w KQ - 0 1',
        optimalMoves: 1,
        description: "The knight is in the way! Move it, then castle king-side.",
        answerMove: { from: 'e1', to: 'g1' }
      };
    case 4:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1',
        optimalMoves: 1,
        description: "Castle king-side! You need to move out pieces first.",
        answerMove: { from: 'e1', to: 'g1' }
      };
    case 5:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1',
        optimalMoves: 1,
        description: "Castle queen-side! You need to move out pieces first.",
        answerMove: { from: 'e1', to: 'c1' }
      };
    case 6:
      return { 
        fen: 'rnbqkbnr/pppppppp/8/8/3P4/1PN1PN2/PBPQBPPP/R3K1R1 w KQkq - 0 1',
        optimalMoves: 1,
        description: "You cannot castle if the king or rook has already moved. Now castle queen-side.",
        answerMove: { from: 'e1', to: 'c1' }  // Left-side castling for level 6.
      };
    default:
      return { 
        fen: '8/8/8/8/8/8/8/R3K2k w KQ - 0 1',
        optimalMoves: 1,
        description: "",
      };
  }
};



// En passant level configurations
const getEnPassantLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: 'rnbqkbnr/ppp1pppp/8/2Pp4/8/8/PP1PPPPP/RNBQKBNR w - a6 0 1', 
        optimalMoves: 1,
        description: "Black just moved the pawn by two squares! Take it en passant.",
        answerMove: { from: "c5", to: "d6" }
      };
    case 2:
      return { 
        fen: 'rnbqkbnr/pppppp1p/8/2P3pP/8/8/PP1PPPP1/RNBQKBNR w - b6 0 1', 
        optimalMoves: 1,
        description: "En passant only works immediately after the opponent moved the pawn.",
        answerMove: { from: "h5", to: "g6" }
      };
    case 3:
      return { 
        fen: 'rnbqkbnr/p1pppppp/P7/1pP5/8/8/PP1PPPP1/RNBQKBNR w - c6 0 1', 
        optimalMoves: 1,
        description: "En passant only works if your pawn is on the 5th rank.",
        answerMove: { from: "c5", to: "b6" }
      };
    case 4:
      return { 
        fen: 'rnbqkbnr/p1pppppp/8/1pPPP2P/8/8/PP1P1PP1/RNBQKBNR w - d6 0 1', 
        optimalMoves: 1,
        description: "Take all the pawns en passant!",
        answerMove: { from: "c5", to: "b6" }
      };
    case 5:
      return { 
        fen: 'rnbqkbnr/ppp1pppp/8/2Pp4/8/8/PP1PPPPP/RNBQKBNR w - a6 0 1', 
        optimalMoves: 1,
        description: "En passant level 5.",
        answerMove: { from: "c5", to: "d6" }
      };
    case 6:
      return { 
        fen: 'rnbqkbnr/ppp1pppp/8/2Pp4/8/8/PP1PPPPP/RNBQKBNR w - a6 0 1', 
        optimalMoves: 1,
        description: "En passant level 6.",
        answerMove: { from: "c5", to: "d6" }
      };
    default:
      return { 
        fen: 'rnbqkbnr/ppp1pppp/8/2Pp4/8/8/PP1PPPPP/RNBQKBNR w - a6 0 1', 
        optimalMoves: 1,
        description: "Black just moved the pawn by two squares! Take it en passant.",
        answerMove: { from: "c5", to: "b6" }
      };
  }
};


// Stalemate level configurations
const getStalemateLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: 'k7/8/8/6B1/8/1R6/8/7K w - - 0 1', 
        optimalMoves: 1,
        description: "To stalemate black: - Black cannot move anywhere - There is no check.",  
        answerMove: { from: 'g5', to: 'e3' }
      };
    case 2:
      return { 
        fen: '8/7p/4N2k/8/8/3N4/8/1K6 w - - 0 1', 
        optimalMoves: 1,
        description: "To stalemate black: - Black cannot move anywhere - There is no check.", 
        answerMove: { from: 'd3', to: 'f4' } 
      };
    case 3:
      return { 
        fen: '4k3/6p1/5p2/p4P2/PpB2N2/1K6/8/3R4 w - - 0 1', 
        optimalMoves: 1,
        description: "To stalemate black: - Black cannot move anywhere - There is no check.",  
        answerMove: { from: 'f4', to: 'g6' }
      };
    case 4:
      return { 
        fen: '8/6pk/6np/7K/8/3B4/8/1R6 w - - 0 1', 
        optimalMoves: 1,
        description: "To stalemate black: - Black cannot move anywhere - There is no check.",
        answerMove: { from: 'b1', to: 'b8' }  
      };
    case 5:
      return { 
        fen: '7R/pk6/p1pP4/K7/3BB2p/7p/1r5P/8 w - - 0 1', 
        optimalMoves: 1,
        description: "To stalemate black: - Black cannot move anywhere - There is no check.",
        answerMove: { from: 'd4', to: 'b2' }  
      };
    default:
      return { 
        fen: 'k7/8/8/6B1/8/1R6/8/7K w - - 0 1', 
        optimalMoves: 1,
        description: "To stalemate black: - Black cannot move anywhere - There is no check.",
        answerMove: { from: 'g5', to: 'e3' }  
      };
  }
};

//Advanced Category
// Piece Value level configurations
const getPieceValueLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: '8/8/2qrbnp1/3P4/8/8/8/4K2k w - - 0 1', 
        optimalMoves: 1,
        description: "Take the piece with the highest value! Queen > Bishop",
        answerMove: { from: 'd5', to: 'c6' }  
      };
    case 2:
      return { 
        fen: '8/8/4b3/1p6/6r1/8/4Q3/4K2k w - - 0 1', 
        optimalMoves: 1,
        description: "Take the piece with the highest value! Do not exchange a higher valued piece for a less valuable one.",
        answerMove: { from: 'e2', to: 'e6' }  
      };
    case 3:
      return { 
        fen: '5b1k/8/6N1/2q5/3Kn3/2rp4/3B4/8 w - - 0 1', 
        optimalMoves: 1,
        description: "Take the piece with the highest value! Make sure your move is legal!", 
        answerMove: { from: 'd4', to: 'e4' } 
      };
    case 4:
      return { 
        fen: '1k4q1/pp6/8/3B4/2P5/1P1p2P1/P3Kr1P/3n4 w - - 0 1', 
        optimalMoves: 1,
        description: "Take the piece with the highest value!",  
        answerMove: { from: 'e2', to: 'd1' }
      };
    case 5:
      return { 
        fen: '7k/3bqp1p/7r/5N2/6K1/6n1/PPP5/R1B5 w - - 0 1', 
        optimalMoves: 1,
        description: "Take the piece with the highest value!",  
        answerMove: { from: 'c1', to: 'h6' }
      };
    default:
      return { 
        fen: '8/8/2qrbnp1/3P4/8/8/8/4K2k w - - 0 1', 
        optimalMoves: 1,
        description: "Take the piece with the highest value!", 
        answerMove: { from: 'd5', to: 'c6' } 
      };
  }
};
// Check in two level configurations
const getCheckInTwoLevelConfig = (level) => {
  switch (level) {
    case 1:
      return { 
        fen: '2k5/2pb4/8/2R5/8/8/8/7K w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
    case 2:
      return { 
        fen: '8/8/5k2/8/8/1N6/5b2/7K w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
    case 3:
      return { 
        fen: '6k1/2r3pp/8/1N6/8/8/4B3/7K w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
    case 4:
      return { 
        fen: 'r3k3/7b/8/4b3/8/8/4N3/4R2K w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
    case 5://in lichess level 6
      return { 
        fen: '8/8/8/2k5/q7/4N3/3B4/7K w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
    case 6:// in lichess level 7
      return { 
        fen: 'r6r/1Q2nk2/1B3p2/8/8/8/8/3K4 w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
    default:
      return { 
        fen: '8/8/8/8/8/8/1P6/k7 w - - 0 1', 
        optimalMoves: 2,
        description: "Threaten the opponent's king in two moves!",  
      };
  }
};

useEffect(() => {
  setCurrentCategory("Chess Pieces");
  setCurrentStage(categoryStages["Chess Pieces"][0]);
  setCurrentLevel(1);
}, []);

const calculateProgressStats = () => {
  let totalStages = 0;
  let completedStages = 0;
  let totalStars = 0;
  let earnedStars = 0;
  
  categories.forEach(category => {
    categoryStages[category].forEach(stage => {
      totalStages++;
      const stageStars = progress[stage.name];
      
      // Check if stage is complete (all levels have at least 1 star)
      const isComplete = stageStars.every(stars => stars > 0);
      if (isComplete) completedStages++;
      
      // Calculate stars
      totalStars += stageStars.length * 3; // Each level can earn up to 3 stars
      earnedStars += stageStars.reduce((sum, stars) => sum + stars, 0);
    });
  });
  
  return {
    totalStages,
    completedStages,
    progress: completedStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100),
    totalStars,
    earnedStars,
    starPercentage: totalStars === 0 ? 0 : Math.round((earnedStars / totalStars) * 100)
  };
};

return (
  <div className="learn-page-wrapper">
    {/* NavBar for Category Selection */}
    <div className="learn-navbar">
      {categories.map((category) => (
        <div
          key={category}
          className={`nav-item ${currentCategory === category ? 'active-category' : ''}`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </div>
      ))}
    </div>
    
    {/* Main Learn Page Container */}
    <div className="frame8508">
      {/* YOUR PROGRESS Section */}
      <div className="progress-section">
        <div className="progress-header">YOUR PROGRESS</div>
        <div className="header-line"></div>
        <div className="progress-content">
          {/* Display progress stats */}
          <div className="level-progress">
            <span>Completed:</span>
            <span>{calculateProgressStats().completedStages} / {calculateProgressStats().totalStages} stages ({calculateProgressStats().progress}%)</span>
          </div>
          <div className="level-progress">
            <span>Stars earned:</span>
            <span>{calculateProgressStats().earnedStars} / {calculateProgressStats().totalStars} ({calculateProgressStats().starPercentage}%)</span>
          </div>
          <div className="level-progress" style={{ marginTop: '20px' }}>
            <span>Current Stage Progress:</span>
            <span>Level {currentLevel}/6</span>
          </div>
          <div className="level-progress">
            <span>Stars for current level:</span>
            <span>{progress[currentStage.name][currentLevel - 1] > 0 ? renderStars(progress[currentStage.name][currentLevel - 1]) : 'Not completed'}</span>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="warning" 
              startIcon={<RefreshIcon />}
              onClick={resetProgress}
              sx={{ backgroundColor: '#FFC008', color: '#000' }}
            >
              Reset Progress
            </Button>
            {status === "failed" && (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" color="error" sx={{ mb: 1 }}>
                  Puzzle failed! Last white move puts the position of white in a compromising situation.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={retryLevel}
                  sx={{ backgroundColor: "#D32F2F", "&:hover": { background: "#FF6659" } }}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CURRENT STAGE Section */}
      <div className="stage-section">
        <div className="stage-header">{currentStage.name}</div>
        <div className="header-line"></div>
        <div className="stage-description">
          {levelDescription || currentStage.description}
        </div>
        
        <div className="chessboard-container">
          <Chessboard
            key={boardPosition}   // <-- This forces the board to reinitialize its internal state on each move.
            position={boardPosition}
            onSquareClick={handleSquareClick}
            onPieceDrop={handleDrop}   // <-- added handler for drag moves
            customSquareStyles={getSquareStyles()}
            boardWidth={500}
            boardOrientation="white"
          />
          <div style={{ marginTop: '5px', textAlign: 'center', color: '#F6F6F6' }}>
            Moves taken: {movesTaken}
          </div>
        </div>
        
        <div className="levels-numbers">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <span
              key={level}
              className={`level-number ${currentLevel === level ? 'active' : ''}`}
              onClick={() => handleLevelClick(level)}
            >
              {level} {progress[currentStage.name][level - 1] > 0 ? renderStars(progress[currentStage.name][level - 1]) : ''}
            </span>
          ))}
        </div>
      </div>
      
      {/* STAGES Section */}
      <div className="stages-section">
        <div className="stages-header">STAGES</div>
        <div className="header-line"></div>
        <div className="stages-list">
          {categoryStages[currentCategory].map((stage) => {
            // Calculate average stars for this stage
            const stageStars = progress[stage.name];
            const completedLevels = stageStars.filter(stars => stars > 0).length;
            const totalStars = stageStars.reduce((sum, stars) => sum + stars, 0);
            const avgStars = completedLevels === 0 ? 0 : (totalStars / completedLevels).toFixed(1);
            
            return (
              <div
                key={stage.name}
                className={`stage-item ${currentStage.name === stage.name ? 'selected' : ''}`}
                onClick={() => handleStageClick(stage)}
              >
                {stage.name} {completedLevels > 0 ? `(${avgStars}★)` : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    
    {/* Stage Starting Dialog */}
    <Dialog
      open={showStageDialog}
      onClose={() => setShowStageDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: '#1F1F1F', color: '#FFC008' }}>
        {currentStage.name}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1F1F1F', color: '#F6F6F6', py: 3 }}>
        <Typography variant="body1">
          {currentStage.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Complete all 6 levels to master this stage.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1F1F1F', justifyContent: 'center', pb: 3 }}>
        <Button
          variant="contained"
          onClick={() => {
            setShowStageDialog(false);
            startLevel(currentLevel);
          }}
          sx={{ bgcolor: '#FFC008', color: '#000', '&:hover': { bgcolor: '#E5AB00' } }}
        >
          Let's Go!
        </Button>
      </DialogActions>
    </Dialog>
    
    {/* Stage Completion Dialog */}
    <Dialog
      open={showCompletionDialog}
      onClose={() => setShowCompletionDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: '#1F1F1F', color: '#FFC008' }}>
        Stage Completed!
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1F1F1F', color: '#F6F6F6', py: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Congratulations!
        </Typography>
        <Typography variant="body1">
          You have completed all levels for {currentStage.name}.
        </Typography>
        <div style={{ margin: '20px 0', fontSize: '36px', color: '#FFC008' }}>
          {renderStars(Math.round(averageStars))}
        </div>
        <Typography variant="body2">
          Average stars earned: {averageStars.toFixed(1)} out of 3
        </Typography>
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1F1F1F', justifyContent: 'center', pb: 3 }}>
        <Button
          variant="contained"
          onClick={() => {
            setShowCompletionDialog(false);
            // Move to the next stage if available
            const currentIndex = categoryStages[currentCategory].findIndex(s => s.name === currentStage.name);
            if (currentIndex < categoryStages[currentCategory].length - 1) {
              const nextStage = categoryStages[currentCategory][currentIndex + 1];
              setCurrentStage(nextStage);
              setCurrentLevel(1);
              setShowStageDialog(true);
            }
          }}
          sx={{ bgcolor: '#FFC008', color: '#000', '&:hover': { bgcolor: '#E5AB00' } }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);
};

export default LearnPage;