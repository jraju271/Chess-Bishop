// src/Engine/gameLogic.js

// Assigning values to pieces for evaluation
const pieceValues = {
    'P': 1,    // Pawn
    'N': 3,    // Knight
    'B': 3,    // Bishop
    'R': 5,    // Rook
    'Q': 9,    // Queen
    'K': 100,  // King, set high to reflect importance
    'p': -1,
    'n': -3,
    'b': -3,
    'r': -5,
    'q': -9,
    'k': -100
  };
  
  // Function to evaluate the board based on piece values
  export const evaluateBoard = (boardState) => {
    let score = 0;
    for (const row of boardState) {
      for (const piece of row) {
        score += pieceValues[piece] || 0;  // Add piece value to score if it's a recognized piece
      }
    }
    return score;
  };
  
  // Check if any player is in checkmate, stalemate, or if it's ongoing
  export const checkGameEndingCondition = (boardState) => {
    let whiteKingPresent = false;
    let blackKingPresent = false;
  
    for (const row of boardState) {
      for (const piece of row) {
        if (piece === 'K') whiteKingPresent = true;
        if (piece === 'k') blackKingPresent = true;
      }
    }
  
    // Determine status based on presence of kings
    if (!whiteKingPresent) return 'checkmate - black wins';
    if (!blackKingPresent) return 'checkmate - white wins';
  
    // Placeholder for stalemate check (can be expanded for actual stalemate detection)
    const noMovesLeft = false; // Implement actual logic for move availability check
    if (noMovesLeft) return 'draw - stalemate';
  
    return 'ongoing';
  };
  