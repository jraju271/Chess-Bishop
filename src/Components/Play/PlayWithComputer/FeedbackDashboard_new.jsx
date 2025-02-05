import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Chessboard from "chessboardjsx";
import { Chess } from 'chess.js';
import GameReport from './GameReport';
import { Bar } from 'react-chartjs-2';

const FeedbackDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData || {};

  const { result = "Result not available", timeWhite = "N/A", timeBlack = "N/A", moves = [], finalEvaluation = "N/A", gameCategory = "N/A"} = gameData;

  const [selectedFen, setSelectedFen] = useState("start");
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [analysisData, setAnalysisData] = useState([]);
  const [analyzeButtonClicked, setAnalyzeButtonClicked] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(() => 
    parseInt(localStorage.getItem('gamesPlayed') || '0')
  );
  const [allGamesData, setAllGamesData] = useState(() => 
    JSON.parse(localStorage.getItem('allGamesData') || '[]')
  );

  useEffect(() => {
    if (moves.length > 0 && moves[currentMoveIndex]?.fen) {
      setSelectedFen(moves[currentMoveIndex].fen);
    }
  }, [currentMoveIndex, moves]);

  useEffect(() => {
    // Store current game data
    if (gameData && Object.keys(gameData).length > 0) {
      const newGamesData = [...allGamesData, gameData];
      setAllGamesData(newGamesData);
      localStorage.setItem('allGamesData', JSON.stringify(newGamesData));
      
      const newGamesPlayed = gamesPlayed + 1;
      setGamesPlayed(newGamesPlayed);
      localStorage.setItem('gamesPlayed', newGamesPlayed.toString());
    }
  }, [gameData]);

  // Handlers for button actions
  const handleRetryGame = () => {
    if (gamesPlayed < 3) {
      navigate("/playwithcomputer", { state: { gameCategory } }); // Adjust to your game page route
    }
  };

  const analyzeSinglePosition = (stockfish, analysis, index, fen, moveHistory) => {
    return new Promise((resolve) => {
        let bestLine = null;
        const chess = new Chess();
        
        // Reconstruct the position before the current move
        if (index > 0) {
            // Apply all moves up to the previous position
            for (let i = 0; i < index; i++) {
                chess.move(moves[i].san);
            }
        }
        
        const positionBeforeMove = chess.fen();
        const playerToMove = chess.turn();
        
        stockfish.onmessage = (event) => {
            const message = event.data;
            
            if (message.includes("info") && message.includes("score cp") && !bestLine) {
                const scoreMatch = message.match(/score cp (-?\d+)/);
                const depthMatch = message.match(/depth (\d+)/);
                const pvMatch = message.match(/pv ([a-h][1-8][a-h][1-8][qrbn]?\s*[a-h][1-8][a-h][1-8][qrbn]?)/i);
                
                if (scoreMatch && depthMatch && pvMatch && depthMatch[1] === "15") {
                    try {
                        const tempChess = new Chess(positionBeforeMove);
                        const moves = pvMatch[1].trim().split(/\s+/);
                        const firstMove = moves[0];
                        
                        const from = firstMove.substring(0, 2);
                        const to = firstMove.substring(2, 4);
                        const promotion = firstMove.length > 4 ? firstMove[4] : undefined;
                        
                        const moveResult = tempChess.move({
                            from: from,
                            to: to,
                            promotion: promotion
                        }, { sloppy: true });

                        if (moveResult && moveResult.san !== moves[index].san) {
                            // Only store if it's a different move than what was played
                            bestLine = {
                                evaluation: parseInt(scoreMatch[1]) / 100,
                                bestMove: moveResult.san,
                                uciMove: firstMove,
                                playerToMove: playerToMove
                            };
                        }
                    } catch (err) {
                        console.error('Move conversion error:', err);
                    }
                }
            }

            if (message.includes("bestmove")) {
                if (bestLine) {
                    analysis[index] = bestLine;
                }
                resolve();
            }
        };

        // Set MultiPV to get multiple lines of analysis
        stockfish.postMessage("setoption name MultiPV value 3");
        stockfish.postMessage("position fen " + positionBeforeMove);
        stockfish.postMessage("go depth 15");
    });
};

  const analyzeGame = async () => {
    console.log("Starting game analysis...");
    const stockfish = new Worker("../../../../stockfish/stockfish.js");
    const analysis = Array(moves.length).fill(null);

    try {
      stockfish.postMessage("uci");
      stockfish.postMessage("setoption name MultiPV value 3");
      stockfish.postMessage("setoption name Skill Level value 20");
      await new Promise(resolve => {
        stockfish.onmessage = (event) => {
          if (event.data.includes("uciok")) {
            console.log("Stockfish initialized");
            resolve();
          }
        };
      });

      let moveHistory = [];
      for (let i = 0; i < moves.length; i++) {
        console.log(`Analyzing move ${i + 1}/${moves.length}`);
        moveHistory = moves.slice(0, i + 1).map(m => m.san);
        await analyzeSinglePosition(stockfish, analysis, i, moves[i].fen, moveHistory);
        console.log(`Analysis for move ${i + 1}:`, analysis[i]);
      }

      console.log("Final analysis:", analysis);
      setAnalysisData(analysis);
      setAnalyzeButtonClicked(true);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      stockfish.terminate();
    }
  };

  const renderMoveAnalysis = (moveIndex, color) => {
    const analysis = analysisData[moveIndex];
    const move = moves[moveIndex];
    
    if (!analysis || !move) return null;

    const evalDiff = Math.abs((move.evaluation || 0) - (analysis.evaluation || 0));
    
    // Only show analysis if there's a significant difference AND a different best move
    if (evalDiff < 0.3 || analysis.bestMove === move.san) return null;

    let backgroundColor = "#ADD8E6";
    let label = "Inaccuracy";
    
    if (evalDiff > 2) {
        backgroundColor = "#FF6666";
        label = "Blunder";
    } else if (evalDiff > 1) {
        backgroundColor = "#FFFF99";
        label = "Mistake";
    }

    return {
        shouldDisplay: true,
        component: (
            <TableRow>
                <TableCell colSpan={5} style={{ backgroundColor }}>
                    <Typography variant="body2">
                        <strong>{color} {label}!</strong> Best move was {analysis.bestMove}
                    </Typography>
                </TableCell>
            </TableRow>
        )
    };
};

  const calculateWinPercentage = (centipawns) => {
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);
  };

  const calculateMoveAccuracy = (winPercentBefore, winPercentAfter) => {
    return 103.1668 * Math.exp(-0.04354 * (winPercentBefore - winPercentAfter)) - 3.1669;
  };

  const getGameStatistics = () => {
    console.log("Calculating game statistics..."); // Debug log
    const stats = {
        white: { inaccuracies: 0, mistakes: 0, blunders: 0, acpl: 0, accuracy: 0 },
        black: { inaccuracies: 0, mistakes: 0, blunders: 0, acpl: 0, accuracy: 0 }
    };

    if (!analysisData.length) {
        console.log("No analysis data available");
        return stats;
    }

    let totalWhiteLoss = 0;
    let totalBlackLoss = 0;
    let whiteAccuracySum = 0;
    let blackAccuracySum = 0;
    let whiteMoves = 0;
    let blackMoves = 0;

    moves.forEach((move, index) => {
        const analysis = analysisData[index];
        if (!analysis) return;

        const evalDiff = Math.abs((move.evaluation || 0) - (analysis.evaluation || 0));
        const isWhite = index % 2 === 0;
        const player = isWhite ? stats.white : stats.black;

        console.log(`Move ${index + 1}: ${isWhite ? 'White' : 'Black'}, Eval diff: ${evalDiff}`);

        // Updated thresholds to match renderMoveAnalysis
        if (evalDiff > 2) {
            player.blunders++;
            // Larger penalty for blunders
            const accuracyPenalty = Math.max(0, 100 - (evalDiff * 25));
            if (isWhite) whiteAccuracySum += accuracyPenalty;
            else blackAccuracySum += accuracyPenalty;
        } else if (evalDiff > 1) {
            player.mistakes++;
            // Medium penalty for mistakes
            const accuracyPenalty = Math.max(0, 100 - (evalDiff * 20));
            if (isWhite) whiteAccuracySum += accuracyPenalty;
            else blackAccuracySum += accuracyPenalty;
        } else if (evalDiff > 0.3) { // Changed from 0.5 to 0.3 to match renderMoveAnalysis
            player.inaccuracies++;
            // Small penalty for inaccuracies
            const accuracyPenalty = Math.max(0, 100 - (evalDiff * 15));
            if (isWhite) whiteAccuracySum += accuracyPenalty;
            else blackAccuracySum += accuracyPenalty;
        } else {
            // Good move
            if (isWhite) whiteAccuracySum += 100;
            else blackAccuracySum += 100;
        }

        // Update move counters
        if (isWhite) whiteMoves++;
        else blackMoves++;

        // Calculate centipawn loss
        const loss = evalDiff * 100;
        if (isWhite) totalWhiteLoss += loss;
        else totalBlackLoss += loss;
    });

    // Calculate final statistics
    stats.white.acpl = whiteMoves > 0 ? Math.round(totalWhiteLoss / whiteMoves) : 0;
    stats.black.acpl = blackMoves > 0 ? Math.round(totalBlackLoss / blackMoves) : 0;
    
    // New accuracy calculation
    stats.white.accuracy = whiteMoves > 0 ? Math.round(whiteAccuracySum / whiteMoves) : 0;
    stats.black.accuracy = blackMoves > 0 ? Math.round(blackAccuracySum / blackMoves) : 0;

    console.log("Final statistics:", stats);
    return stats;
};

  const saveGameStats = () => {
    if (analyzeButtonClicked && analysisData.length > 0) {
      const stats = getGameStatistics();
      const gameStats = {
        result: result,
        accuracy: {
          white: stats.white.accuracy,
          black: stats.black.accuracy
        },
        mistakes: {
          white: stats.white.mistakes,
          black: stats.black.mistakes
        },
        blunders: {
          white: stats.white.blunders,
          black: stats.black.blunders
        },
        inaccuracies: {
          white: stats.white.inaccuracies,
          black: stats.black.inaccuracies
        },
        overallScore: parseFloat(finalEvaluation) * 100 // Convert to percentage
      };

      const existingGames = JSON.parse(localStorage.getItem('gamesAnalysis') || '[]');
      const updatedGames = [...existingGames, gameStats];
      localStorage.setItem('gamesAnalysis', JSON.stringify(updatedGames));

      // Force update state to trigger re-render
      setAllGamesData(updatedGames);
    }
  };

  useEffect(() => {
    if (analyzeButtonClicked) {
      saveGameStats();
    }
  }, [analyzeButtonClicked, analysisData]);

  const renderGameSummary = () => {
    if (!analyzeButtonClicked) return null;
    
    const stats = getGameStatistics();
    
    return (
      <Paper elevation={3} sx={{ padding: 2, marginY: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4A90E2", mb: 2 }}>
          Game Summary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* White Statistics */}
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>White</Typography>
            <Typography sx={{ color: "#ADD8E6" }}>
              Inaccuracies: {stats.white.inaccuracies}
            </Typography>
            <Typography sx={{ color: "#FFFF99" }}>
              Mistakes: {stats.white.mistakes}
            </Typography>
            <Typography sx={{ color: "#FF6666" }}>
              Blunders: {stats.white.blunders}
            </Typography>
            <Typography>
              Average centipawn loss: {stats.white.acpl}
            </Typography>
            <Typography>
              Accuracy: {stats.white.accuracy}%
            </Typography>
          </Box>

          {/* Black Statistics */}
          <Box sx={{ flex: 1, ml: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Black</Typography>
            <Typography sx={{ color: "#ADD8E6" }}>
              Inaccuracies: {stats.black.inaccuracies}
            </Typography>
            <Typography sx={{ color: "#FFFF99" }}>
              Mistakes: {stats.black.mistakes}
            </Typography>
            <Typography sx={{ color: "#FF6666" }}>
              Blunders: {stats.black.blunders}
            </Typography>
            <Typography>
              Average centipawn loss: {stats.black.acpl}
            </Typography>
            <Typography>
              Accuracy: {stats.black.accuracy}%
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  };

  const renderGameReport = () => {
    if (gamesPlayed >= 3) {
      const gamesAnalysis = JSON.parse(localStorage.getItem('gamesAnalysis') || '[]');
      const playerData = {
        name: localStorage.getItem('userName') || 'Player',
        quizScore: localStorage.getItem('quizScore'),
        category: localStorage.getItem('playerCategory')
      };

      const gameData = gamesAnalysis.slice(-3).map((game, index) => ({
        gameNumber: index + 1,
        result: game.result,
        accuracy: {
          white: game.accuracy.white,
          black: game.accuracy.black
        },
        blunders: {
          white: game.blunders.white,
          black: game.blunders.black
        },
        mistakes: {
          white: game.mistakes.white,
          black: game.mistakes.black
        },
        inaccuracies: {
          white: game.inaccuracies.white,
          black: game.inaccuracies.black
        },
        overallScore: game.overallScore
      }));

      return (
        <GameReport 
          playerData={playerData}
          gameData={gameData}
          id="performance-chart"
        />
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", padding: 10 }}>
      {/* Chessboard section */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "start" }}>
        <Chessboard
          position={selectedFen}
          width={600}
          draggable={false}
          boardStyle={{
            borderRadius: "5px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      {/* Analysis and Summary section */}
      <Box sx={{ 
        flex: 1, 
        marginLeft: 2, 
        display: "flex", 
        flexDirection: "column", 
        height: "100vh",
        overflowY: "auto",
        //color: "white",
        backgroundColor: "#333"
      }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={analyzeGame}
          sx={{ mb: 2 , backgroundColor: "#8E5C00", '&:hover': {background: 'rgba(255, 192, 8, 0.5)'}}}
        >
          Analyze Game
        </Button>

        {/* Move history table */}
        <TableContainer component={Paper} sx={{ mb: 1 , backgroundColor: "#333"}}>
          <Table stickyHeader size="small">
            <TableHead>
                <TableRow sx={{ backgroundColor: "black" }}>
                    <TableCell sx={{ backgroundColor: "grey", color:"white"}}>Move</TableCell>
                    <TableCell align="center" sx={{backgroundColor:"grey", color:"white"}}>White</TableCell>
                    <TableCell align="center" sx={{ backgroundColor: "grey", color:"white"}}>Evaluation</TableCell>
                    <TableCell align="center" sx={{ backgroundColor: "grey", color:"white"}}>Black</TableCell>
                    <TableCell align="center" sx={{ backgroundColor: "grey",color:"white"}}>Evaluation</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {moves
                    .reduce((rows, move, index) => {
                        if (index % 2 === 0) {
                            rows.push({
                                moveNumber: Math.floor(index / 2) + 1,
                                white: { move, index },
                                black: index + 1 < moves.length ? { move: moves[index + 1], index: index + 1 } : null
                            });
                        }
                        return rows;
                    }, [])
                    .map((row) => {
                        const whiteAnalysis = analyzeButtonClicked ? renderMoveAnalysis(row.white.index, "White") : null;
                        const blackAnalysis = analyzeButtonClicked && row.black ? renderMoveAnalysis(row.black.index, "Black") : null;

                        return (
                            <React.Fragment  key={row.moveNumber}>
                                <TableRow hover>
                                    <TableCell sx={{color:"white"}}>{row.moveNumber}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ cursor: "pointer", color: "white" }}
                                        onClick={() => setCurrentMoveIndex(row.white.index)}
                                    >
                                        {row.white.move.san}
                                    </TableCell>
                                    <TableCell align="center"sx={{color:"white"}}>{row.white.move.evaluation}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ cursor: "pointer", color:"white" }}
                                        onClick={() => row.black && setCurrentMoveIndex(row.black.index)}
                                    >
                                        {row.black?.move.san || "-"}
                                    </TableCell>
                                    <TableCell align="center" sx={{color:"white"}}>{row.black?.move.evaluation || "-"}</TableCell>
                                </TableRow>
                                {whiteAnalysis?.shouldDisplay && whiteAnalysis.component}
                                {blackAnalysis?.shouldDisplay && blackAnalysis.component}
                            </React.Fragment>
                        );
                    })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Game Summary - Force render if analysis exists */}
        {analyzeButtonClicked && analysisData.length > 0 && (
          <Paper elevation={3} sx={{ p: 1, mb: 1, backgroundColor: "black" , textAlign:'center'}}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFC008", mb: 0, textAlign:'center' }}>
              Game Summary
            </Typography>
            <Box sx={{ display: "flex", gap: 4 }}>
              {/* White Statistics */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0 , color:"#FFC008", textAlign:'center' }}>White</Typography>
                <Typography sx={{ color: "white" , textAlign:'center'}}>
                  Inaccuracies: {getGameStatistics().white.inaccuracies}
                </Typography>
                <Typography sx={{ color: "white" , textAlign:'center'}}>
                  Mistakes: {getGameStatistics().white.mistakes}
                </Typography>
                <Typography sx={{ color: "white" , textAlign:'center'}}>
                  Blunders: {getGameStatistics().white.blunders}
                </Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  ACPL: {getGameStatistics().white.acpl}
                </Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  Accuracy: {getGameStatistics().white.accuracy}%
                </Typography>
              </Box>

              {/* Black Statistics */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0, color:"#FFC008", textAlign:'center' }}>Black</Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  Inaccuracies: {getGameStatistics().black.inaccuracies}
                </Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  Mistakes: {getGameStatistics().black.mistakes}
                </Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  Blunders: {getGameStatistics().black.blunders}
                </Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  ACPL: {getGameStatistics().black.acpl}
                </Typography>
                <Typography sx={{ color: "white", textAlign:'center' }}>
                  Accuracy: {getGameStatistics().black.accuracy}%
                </Typography>
              </Box>
            </Box>
            <Typography variant='h7' sx={{ fontWeight: "bold", color: "#FFC008", mb: 0}}>
              <br></br>
              Overall Game Score: {(parseFloat(finalEvaluation) * 100).toFixed(2)}
            </Typography>
          </Paper>
          )}
        {/* Next Game*/}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
          {gamesPlayed < 3 ? (
            <Button variant="contained" color="primary" onClick={handleRetryGame}>
              Next Game ({gamesPlayed}/3)
            </Button>
          ) : (
            renderGameReport()
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackDashboard;
