// src/Components/Play/PuzzleRecommendations.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import PuzzleBoard from './PuzzleBoard';
import { getPuzzlesForMistakeType, formatPuzzle } from '../../../services/puzzleApiService';
import { useNavigate } from 'react-router-dom';

const PuzzleRecommendations = ({ mistakes }) => {
  const [recommendedPuzzles, setRecommendedPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [showPuzzles, setShowPuzzles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedPuzzles = async () => {
      if (mistakes && mistakes.length > 0) {
        setLoading(true);
        setError(null);
        try {
          // Get the most frequent mistake type
          const mistakeTypes = mistakes.map(m => m.type);
          const mostFrequentType = getMostFrequentItem(mistakeTypes);
          
          // Get puzzles for this mistake type
          const puzzlesData = await getPuzzlesForMistakeType(mostFrequentType, 3);
          
          // Format puzzles for component use
          const formattedPuzzles = puzzlesData.map(puzzle => formatPuzzle(puzzle));
          
          setRecommendedPuzzles(formattedPuzzles);
        } catch (err) {
          console.error("Error fetching puzzle recommendations:", err);
          setError("Failed to load puzzle recommendations. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecommendedPuzzles();
  }, [mistakes]);

  const getMostFrequentItem = (array) => {
    const counts = {};
    let mostFrequent = null;
    let maxCount = 0;
    
    array.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        mostFrequent = item;
        maxCount = counts[item];
      }
    });
    
    return mostFrequent || "inaccuracy"; // Default to inaccuracy if array is empty
  };

  const handlePracticeWithPuzzles = () => {
    navigate('/puzzle-themes', { state: { mistakes } });
  };

  const handlePuzzleComplete = () => {
    // Automatically move to next puzzle if available
    if (currentPuzzleIndex < recommendedPuzzles.length - 1) {
      setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < recommendedPuzzles.length - 1) {
      setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleOpenPuzzles = () => {
    setShowPuzzles(true);
  };

  

  return (
    <Box sx={{ mt: 1 }}>
      {!showPuzzles ? (
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "#212121", color: "white", textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#FFC008", mb: 2 }}>
            Improve Your Game
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: "#FFC008" }} />
            </Box>
          ) : error ? (
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Based on your game analysis, we have {recommendedPuzzles.length} recommended puzzles 
                that can help you improve on the mistakes made in this game.
              </Typography>
              <Button 
                variant="contained" 
                //onClick={handleOpenPuzzles}
                onClick={handlePracticeWithPuzzles}
                disabled={recommendedPuzzles.length === 0}
                sx={{ backgroundColor: "#8E5C00", '&:hover': {background: 'rgba(255, 192, 8, 0.5)'} }}
              >
                Practice with Puzzles
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: "#FFC008" }} />
            </Box>
          ) : recommendedPuzzles.length > 0 ? (
            <>
              <Typography variant="h6" sx={{ color: "#FFC008", mb: 2 }}>
                Puzzle {currentPuzzleIndex + 1} of {recommendedPuzzles.length}
              </Typography>
              <PuzzleBoard 
                puzzle={recommendedPuzzles[currentPuzzleIndex]}
                onComplete={handlePuzzleComplete}
                onNext={handleNextPuzzle}
              />
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No puzzles available based on your game analysis.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PuzzleRecommendations;