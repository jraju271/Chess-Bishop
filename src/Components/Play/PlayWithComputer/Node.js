const Stockfish = require('stockfish');
const fs = require('fs');

// Function to analyze moves
async function analyzeGame(moves) {
  const engine = Stockfish();
  let analysisResults = [];
  let centipawnLoss = [];
  let inaccuracies = 0, mistakes = 0, blunders = 0;

  engine.onmessage = (message) => {
    if (message.startsWith('info depth')) {
      const scoreMatch = message.match(/score cp (-?\d+)/); // Centipawn score
      const bestMoveMatch = message.match(/pv ([a-z0-9\s]+)/); // Suggested best move
      if (scoreMatch && bestMoveMatch) {
        const score = parseInt(scoreMatch[1], 10);
        const bestMove = bestMoveMatch[1].trim();
        analysisResults.push({ score, bestMove });
      }
    }
  };

  // Loop through moves to analyze each one
  for (let i = 0; i < moves.length; i++) {
    engine.postMessage(`position startpos moves ${moves.slice(0, i + 1).join(' ')}`);
    engine.postMessage('go depth 20');
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for analysis
  }

  engine.postMessage('quit');

  // Detect inaccuracies, mistakes, and blunders
  for (let i = 0; i < analysisResults.length - 1; i++) {
    const diff = Math.abs(analysisResults[i + 1].score - analysisResults[i].score);
    centipawnLoss.push(diff);

    if (diff >= 300 && diff < 500) {
      inaccuracies++;
    } else if (diff >= 500 && diff < 900) {
      mistakes++;
    } else if (diff >= 900) {
      blunders++;
    }
  }

  // Calculate average centipawn loss and accuracy
  const avgCentipawnLoss = centipawnLoss.reduce((sum, val) => sum + val, 0) / centipawnLoss.length;
  const accuracy = 100 - avgCentipawnLoss / 10;

  return {
    analysisResults,
    statistics: {
      inaccuracies,
      mistakes,
      blunders,
      avgCentipawnLoss: Math.round(avgCentipawnLoss),
      accuracy: Math.round(accuracy),
    },
  };
}

module.exports = { analyzeGame };
