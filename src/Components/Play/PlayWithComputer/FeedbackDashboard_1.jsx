import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for React 18
import { Box, Typography, Divider, List, ListItem, ListItemText, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Chessboard from 'chessboardjsx'; // Import Chessboard library 
import { saveAs } from 'file-saver'; // Import file-saver for downloading files
import gifshot from 'gifshot'; // Import gifshot library
import { toPng } from 'html-to-image'; // Import the toPng function from html-to-image

const FeedbackDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For navigation
  const gameData = location.state?.gameData || {}; // Safely access gameData from location state
  console.log("Game Data:", gameData); // Check data passed to FeedbackDashboard

  const {
    result = "Result not available",
    finalEvaluation = "N/A", // Final evaluation score
    gameCategory = "N/A",
    timeWhite = "N/A",
    timeBlack = "N/A",
    moves = [],
  } = gameData;

  const [selectedFen, setSelectedFen] = useState(""); // State for the selected FEN
  const [images, setImages] = useState([]); // State for generated images

  useEffect(() => {
    const generateImages = async () => {
      const images = [];
      for (const move of moves) {
        const fen = move.fen;
        const chessboardElement = document.createElement('div');
        document.body.appendChild(chessboardElement);
        const root = ReactDOM.createRoot(chessboardElement);
        root.render(
          <Chessboard
            position={fen}
            width={400}
            draggable={false}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          />
        );
        const dataUrl = await toPng(chessboardElement, { cacheBust: true, skipFonts: true });
        images.push(dataUrl);
        document.body.removeChild(chessboardElement);
      }
      setImages(images);
    };

    generateImages();
    
  }, [moves]);

  // Handlers for button actions
  const handleRetryGame = () => {
    navigate("/playwithcomputer", { state: { gameCategory } }); // Adjust to your game page route
  };

  const handleLearnTechniques = () => {
    navigate("/chess-techniques", { state: { gameCategory } }); // Pass category to the Puzzle component
  };

  const handleDownloadGif = () => {
    if (images.length === 0) {
      console.error('No valid images to create GIF');
      return;
    }
    gifshot.createGIF(
      {
        images: images,
        gifWidth: 400,
        gifHeight: 400,
      },
      function (obj) {
        if (!obj.error) {
          const image = obj.image;
          const binaryData = atob(image.split(',')[1]);
          const array = [];
          for (let i = 0; i < binaryData.length; i++) {
            array.push(binaryData.charCodeAt(i));
          }
          const blob = new Blob([new Uint8Array(array)], { type: 'image/gif' });
          saveAs(blob, 'game.gif');
        } else {
          console.error('Error generating GIF:', obj.errorMsg);
        }
      }
    );
  };

  return (
    <Box sx={{ padding: '2em', maxWidth: '800px', margin: 'auto', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      {/* Title */}
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333', mb: 2 }}>
        Feedback Analysis
      </Typography>
      <Divider sx={{ marginY: 2 }} />

      {/*// Final Evaluation Score 
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          Final Evaluation
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1, color: '#555' }}>
          {finalEvaluation}
        </Typography>
      </Paper>*/}

      {/* Game Result */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          Game Result
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1, color: '#555' }}>
          {result}
        </Typography>
      </Paper>

      {/* Time for White and Black */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
            Time for White
          </Typography>
          <Typography variant="body1" sx={{ color: '#555' }}>
            {timeWhite !== "N/A" ? `${timeWhite} seconds` : "N/A"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
            Time for Black
          </Typography>
          <Typography variant="body1" sx={{ color: '#555' }}>
            {timeBlack !== "N/A" ? `${timeBlack} seconds` : "N/A"}
          </Typography>
        </Box>
      </Paper>

      {/* Move History */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#4A90E2', marginBottom: 1 }}>
          Move History
        </Typography>
        <Divider />
        <List dense sx={{ maxHeight: 200, overflowY: 'auto' }}>
          {moves.length > 0 ? (
            moves.map((move, index) => (
              <ListItem
                key={index}
                onMouseEnter={() => setSelectedFen(move.fen)} // Set board position on hover
                sx={{
                  '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                }}
              >
                <ListItemText
                  primary={
                    <Typography component="span" variant="body1" sx={{ fontWeight: 'medium', color: '#333' }}>
                      Move {index + 1}: {move.san} ({move.from} to {move.to})
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" sx={{ color: '#666' }}>
                        Evaluation: {move.evaluation} | Move Quality: {move.moveQuality} | 
                      </Typography>
                      {move.alternativeMoves && move.alternativeMoves.length > 0 && (
                        <Typography variant="body2" component="span" sx={{ color: '#666' }}>
                          Suggested Moves: {move.alternativeMoves.join(', ')}
                        </Typography>
                      )}
                      {move.usedTechnique && (
                        <Typography variant="body2" component="span" sx={{ color: '#4caf50' }}>
                          Technique Used: {move.usedTechnique}
                        </Typography>
                      )}
                      {move.missedTechnique && (
                        <Typography variant="body2" component="span" sx={{ color: '#ff5722' }}>
                          Missed Opportunity: {move.missedTechnique}
                        </Typography>
                      )}
                    </>
                  }
                  primaryTypographyProps={{ fontSize: '1rem', fontWeight: 'medium', color: '#333' }}
                />
                <Button
                  variant="outlined"
                  sx={{ marginLeft: 2 }}
                  onClick={() => setSelectedFen(move.fen)}
                >
                  Show Board
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" component="div" sx={{ textAlign: 'center', marginTop: 2, color: '#999' }}>
              No moves available
            </Typography>
          )}
        </List>
      </Paper>
      
      {/* Game Result and Overall Evaluation */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4A90E2" }}>Performance Result</Typography>
        {/*<Typography variant="body1" sx={{ marginTop: 1, color: "#555" }}>{result}</Typography>*/}
        <Typography variant="body1" sx={{ marginTop: 1, color: "#555" }}>
          Overall Game Score: {finalEvaluation} | Category: {gameCategory}
        </Typography>
      </Paper>

      {/* Retry and Learn Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
        <Button variant="contained" color="primary" onClick={handleRetryGame}>
          Retry Game {/* Next game*/}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleLearnTechniques}>
          Learn
        </Button>
      </Box>

      {/* Download GIF Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <Button variant="contained" color="success" onClick={handleDownloadGif}>
          Download Game GIF
        </Button>
      </Box>

      {/* Chessboard Visualization */}
      {selectedFen && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
          <Chessboard
            position={selectedFen}
            width={400}
            draggable={false}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedbackDashboard;
