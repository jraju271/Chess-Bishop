import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';

const PuzzleBoard = ({ puzzle, onComplete, onNext }) => {
  const [game, setGame] = useState(null);
  const [position, setPosition] = useState('');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [status, setStatus] = useState('ready'); // 'ready', 'correct', 'incorrect', 'completed'
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize the chess game when a puzzle is loaded
  useEffect(() => {
    if (puzzle) {
      try {
        setLoading(true);
        
        // Create a new chess game from the FEN
        const newGame = new Chess(puzzle.fen);
        
        // Make the first move (opponent's move) to set up the puzzle
        if (puzzle.moves && puzzle.moves.length > 0) {
          const firstMove = puzzle.moves[0];
          const from = firstMove.substring(0, 2);
          const to = firstMove.substring(2, 4);
          
          newGame.move({
            from: from,
            to: to,
            promotion: 'q' // Always promote to queen for simplicity
          });
        }
        
        setGame(newGame);
        setPosition(newGame.fen());
        setCurrentMoveIndex(1); // Start with user's first move (2nd move in the sequence)
        setStatus('ready');
        setShowHint(false);
        setShowSolution(false);
      } catch (error) {
        console.error("Error initializing puzzle:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [puzzle]);

  // Handle user moves
  const handleMove = ({ sourceSquare, targetSquare }) => {
    if (status === 'completed' || !game) return false;


    const piece = game.get(sourceSquare);
    // Check if the piece is part of the solution
    const hintMove = puzzle.moves[currentMoveIndex];
    const hintSource = hintMove.substring(0, 2);
    if (sourceSquare !== hintSource) {
      // Non-hint coin moved
      setStatus('incorrect');
      setTimeout(() => {
        setPosition(game.fen()); // Reset the board position
        setStatus('ready');
      }, 500);
      return false; // Prevent the move
    }


    // Try to make the move
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // Always promote to queen for simplicity
    });

    // Invalid move
    if (move === null){
      setStatus('incorrect');
      setTimeout(() => {
        setPosition(game.fen()); // Reset the board position
        setStatus('ready');
      }, 500);
      return false;
    };

    // Update board position
    setPosition(game.fen());

    // Check if the move matches the expected puzzle move
    const expectedMove = puzzle.moves[currentMoveIndex];
    const userMoveUci = `${sourceSquare}${targetSquare}`;

    if (userMoveUci === expectedMove) {
      setStatus('correct');
      
      // Make the next computer move if available
      //if (currentMoveIndex + 1 < puzzle.moves.length) {
      
      // Check if this is the last move in the puzzle
      if (currentMoveIndex + 1 >= puzzle.moves.length) {
        setStatus('completed'); // Mark puzzle as completed
      } 
      else {
        setTimeout(() => {
          const nextMove = puzzle.moves[currentMoveIndex + 1];
          const from = nextMove.substring(0, 2);
          const to = nextMove.substring(2, 4);
          
          game.move({
            from: from,
            to: to,
            promotion: 'q'
          });
          
          setPosition(game.fen());
          setCurrentMoveIndex(currentMoveIndex + 2); // Skip to user's next move
          setStatus('ready');
        }, 500);
      }
    //   } else {
    //     // Puzzle completed
    //     setStatus('completed');
    //     if (onComplete) {
    //       setTimeout(() => {
    //         onComplete();
    //       }, 1000);
    //     }
    //   }
    } else {
      // Incorrect move
      setStatus('incorrect');
      setTimeout(() => {
        // Undo the move
        game.undo();
        setPosition(game.fen());
        setStatus('ready');
      }, 500);
    }

    return true;
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    
    // Show the solution moves on the board
    const solutionGame = new Chess(puzzle.fen);
    
    // Apply all moves to show the solution
    puzzle.moves.forEach((moveUci, index) => {
      const from = moveUci.substring(0, 2);
      const to = moveUci.substring(2, 4);
      
      try {
        solutionGame.move({
          from: from,
          to: to,
          promotion: 'q'
        });
      } catch (error) {
        console.error(`Error applying move ${moveUci}:`, error);
      }
    });
    
    setGame(solutionGame);
    setPosition(solutionGame.fen());
    setStatus('completed');
  };

  const handleNextPuzzle = () => {
    if (onNext) {
      onNext();
    }
  };

  // Highlight the hint piece
  const getSquareStyles = () => {
    if (!showHint || !puzzle || !puzzle.moves || puzzle.moves.length <= currentMoveIndex) {
      return {};
    }
    const hintMove = puzzle.moves[currentMoveIndex];
    const from = hintMove.substring(0, 2);
    return {
      [from]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderRadius: '50%'
      }
    };
  };

  const getActiveColor = (fen) => {
    const fields = fen.split(" ");
    return fields[1] === "w" ? "Black" : "White";
  };
  const handleNextMove = () => {
    if (currentMoveIndex < puzzle.moves.length) {
      const move = puzzle.moves[currentMoveIndex];
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
  
      game.move({
        from: from,
        to: to,
        promotion: 'q'
      });
  
      setPosition(game.fen());
      setCurrentMoveIndex((prev) => prev + 1);
    }
  };
  
  const handlePreviousMove = () => {
    if (currentMoveIndex > 0) {
      game.undo();
      setPosition(game.fen());
      setCurrentMoveIndex((prev) => prev - 1);
    }
  };


  return (
    <Paper elevation={3} sx={{ p: 0, gap: 0 , left:'20%' , padding:'15px' ,width:'32vw' , mb: 3, background: 'linear-gradient(180deg, #262626 0%, #1F1F1F 100%)', color: "white" }}>
      {/* <Typography variant="h5" sx={{ mb: 2, color: "#FFC008", textAlign: 'center' }}>
        Puzzle Challenge 
        {puzzle?.rating ? `(Rating: ${puzzle.rating})` : ''}
      </Typography> */}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: "#FFC008" }} />
        </Box>
      ) : puzzle ? (
        <>
          <Box sx={{ mb: 0 }}>
            <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
              {status === 'ready' && "Your move. Find the best continuation!"}
              {status === 'correct' && "Correct move!"}
              {status === 'incorrect' && "Incorrect. Try again!"}
              {status === 'completed' && "Puzzle completed successfully!"}
            </Typography>
            
            {/* {showHint && puzzle.hint && (
              <Typography variant="body2" sx={{ mt: 1, color: "#4CAF50" }}>
                Hint: {puzzle.hint}
              </Typography>
            )} */}
            
            {showSolution && (
              <Typography variant="body2" sx={{ mt: 1, color: "white", textAlign: 'center' }}>
                Solution: {puzzle.moves.slice(1).map((move, i) => 
                  // `${i % 2 === 0 ? `${Math.floor(i/2) + 1}.` : ''} ${move.substring(0, 2)}-${move.substring(2)}`
                  // `${i % 2 === 0 ? `${Math.floor(i/2) + 1}.` : ''} ${move.substring(2)}`
                  // In-line AI suggestion `${i % 2 === 0 ? `${Math.floor(i/2) + 1}.` : ''} ${move.substring(0, 2)}-${move.substring(2)}`
                  `${move.substring(2)}`
                ).join(' ')}
              </Typography>
            )}
            
            {puzzle.themes && (
              <Typography variant="body1" textAlign="center" sx={{ mt: 1, color: "white" }}>
                Themes: {Array.isArray(puzzle.themes) ? puzzle.themes.join(', ') : puzzle.themes}
              </Typography>
            )}

            <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
              Active Color: {getActiveColor(puzzle.fen)}
            </Typography>

          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chessboard
              position={position}
              width={425}
              onDrop={handleMove}
              draggable={true} // Ensure pieces are draggable
              boardStyle={{
                borderRadius: "5px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              }}
              dropSquareStyle={{
                boxShadow: "inset 0 0 1px 4px rgba(255, 255, 0, 0.5)",
              }}
              pieceStyle={{
                transition: "transform 0.2s ease", // Smooth transition for dragging
              }}
              squareStyles={getSquareStyles()}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0 }}>
            <Button
              variant="contained"
              onClick={handlePreviousMove}
              disabled={currentMoveIndex === 0}
              sx={{ width: '120px', height:'32px', background: "radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00", borderRadius:'32px', '&:hover': { backgroundColor: '#FFC008' }, mr: 1 , color: 'black'}}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNextMove}
              disabled={currentMoveIndex >= puzzle.moves.length}
              sx={{ width: '120px', height:'32px', background: "radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00", borderRadius:'32px', '&:hover': { backgroundColor: '#FFC008' }, ml: 0 , color: 'black'}}
            >
              Next
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' , mt: 1 }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={handleShowHint}
              sx={{ width: '160px', height:'32px', background: "radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00", borderRadius:'32px', '&:hover': { backgroundColor: '#FFC008' }, color: 'black' }}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary"
              onClick={handleShowSolution}
              sx={{ width: '160px', height:'32px', background: "radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00", borderRadius:'32px', '&:hover': { backgroundColor: '#FFC008' }, color: 'black'}}
            >
              Show Solution
            </Button>
            
            {status === 'completed' && (
              <Button 
                variant="contained" 
                color="success"
                onClick={handleNextPuzzle}
                sx={{ width: '160px', height:'32px', background: "radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00", borderRadius:'32px', '&:hover': { backgroundColor: '#FFC008' }, color: 'black' }}
              >
                Next Puzzle
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Typography>No puzzle available</Typography>
      )}
    </Paper>
  );
};

export default PuzzleBoard;