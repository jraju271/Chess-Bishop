import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Switch } from '@mui/material';
import PuzzleBoard from './PuzzleBoard';
import { getPuzzlesByTheme, getPuzzlesForMistakeType, formatPuzzle } from '../../../services/puzzleApiService';

const PuzzleThemePage = () => {
  const location = useLocation();
  const mistakes = location.state?.mistakes || null; // Get mistakes from navigation state

  const availableThemes = ["middlegame", "endgame", "tactical", "opening", "defensive", "mateIn"];
  const [selectedTheme, setSelectedTheme] = useState("middlegame");
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Timer states
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timerId;
    if (timerRunning) {
      timerId = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [timerRunning]);

  // Fetch puzzles based on mistakes if provided
  useEffect(() => {
    if (mistakes) {
      fetchPuzzlesForMistakes();
    }
  }, [mistakes]);

  const fetchPuzzlesForMistakes = async () => {
    setLoading(true);
    try {
      const mistakeTypes = mistakes.map((mistake) => mistake.type);
      const mostFrequentType = getMostFrequentItem(mistakeTypes);
      const puzzlesData = await getPuzzlesForMistakeType(mostFrequentType, 3);
      const formattedPuzzles = puzzlesData.map((puzzle) => formatPuzzle(puzzle));
      setPuzzles(formattedPuzzles);
      setCurrentPuzzleIndex(0);
      setTime(0);
      setTimerRunning(false);
    } catch (error) {
      console.error("Error fetching puzzles for mistakes:", error);
    }
    setLoading(false);
  };

  const getMostFrequentItem = (array) => {
    const counts = {};
    let mostFrequent = null;
    let maxCount = 0;

    array.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        mostFrequent = item;
        maxCount = counts[item];
      }
    });

    return mostFrequent || "inaccuracy"; // Default to "inaccuracy" if no mistakes
  };

  const fetchPuzzlesByTheme = async () => {
    setLoading(true);
    try {
      const puzzlesData = await getPuzzlesByTheme([selectedTheme], 3);
      const formattedPuzzles = puzzlesData.map((puzzle) => formatPuzzle(puzzle));
      setPuzzles(formattedPuzzles);
      setCurrentPuzzleIndex(0);
      setTime(0);
      setTimerRunning(false);
    } catch (error) {
      console.error("Error fetching puzzles by theme:", error);
    }
    setLoading(false);
  };

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handlePuzzleComplete = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setTime(0);
      setTimerRunning(false);
    }
  };

  const handleStartTimer = () => setTimerRunning(true);
  const handleStopTimer = () => setTimerRunning(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex((prevIndex) => prevIndex + 1); // Move to the next puzzle
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg, #262626 0%, #1F1F1F 100%)',
        color: '#FFC008',
        gap: 0,
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          width: '30vw',
          height: '35vh',
          padding: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Theme Selection and Generate Puzzle Button */}
        <Box
          sx={{
            width: '250px',
            height: '100px',
            background: '#252525',
            border: '1px solid #FFC008',
            borderRadius: '4px',
            padding: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#F6F6F6' }}>Select Theme</InputLabel>
            <Select
              value={selectedTheme}
              onChange={handleThemeChange}
              sx={{
                color: '#F6F6F6',
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#FFC008' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFC008' },
                '.MuiSvgIcon-root': { color: '#F6F6F6' }, width: '100%', height: '40px',
              }}
            >
              {availableThemes.map((theme, index) => (
                <MenuItem key={index} value={theme}>
                  {theme}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={fetchPuzzlesByTheme}
            disabled={loading}
            sx={{
              background: "radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00", 
              borderRadius:'32px',
              '&:hover': { backgroundColor: '#FFC008' },
              width: '100%',
              color: 'black'
            }}
          >
            {loading ? 'Loading...' : 'Generate Puzzle'}
          </Button>
        </Box>

        {/* Timer Button */}
        <Box
          sx={{
            width: '240px',
            height: '10px',
            background: '#000000',
            borderRadius: '4px',
            padding: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: '#F6F6F6' }}>Timer</Typography>
          <Switch
            checked={timerRunning}
            onChange={(e) => (e.target.checked ? handleStartTimer() : handleStopTimer())}
            sx={{
              '& .MuiSwitch-thumb': { backgroundColor: '#FFC008' },
              '& .MuiSwitch-track': { backgroundColor: '#F6F6F6' },
            }}
          />
        </Box>

        {/* Timer Display */}
        <Box
          sx={{
            width: '275px',
            height: '200px',
            background: '#191919',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
          }}
        >
          <Typography sx={{ color: '#F6F6F6', fontSize: '24px', fontWeight: 'bold' }}>
            {formatTime(time)}
          </Typography>
        </Box>
      </Box>

      {/* Center Section */}
      <Box
        sx={{
          // width: '75%',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          left: "40%",
          top: "8%",
          position: "fixed",
        }}
      >
        {/* Description */}
        <Typography variant="h4" sx={{ color: '#FFC008', left: "49%", top:"2%", position: "fixed"}}>
          {/* {mistakes ? 'Practice Based on Feedback' : 'Puzzle Themes'} */}
          {/* {mistakes ? 'Feedback Puzzle' : 'Puzzle Themes'} */}
          {"Puzzle Challenge"}
        </Typography>

        {/* Puzzle Info */}
        {puzzles.length > 0 && (
          <>
            <Typography variant="h6" sx={{ color: '#FFC008', left: "53%", top: "6%", position: "fixed"}}>
              Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
            </Typography>
            <PuzzleBoard puzzle={puzzles[currentPuzzleIndex]} onComplete={handlePuzzleComplete}   onNext={handleNextPuzzle} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PuzzleThemePage;