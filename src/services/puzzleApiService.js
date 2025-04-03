// src/services/puzzleApiService.js
import axios from 'axios';

// API configuration
const API_KEY = "c226d21c55mshe42096852d18c36p13dd97jsnf35030afec7b"; //"cad811181bmshbb7ff7463370395p1bf516jsnca63036a6728"; //"c226d21c55mshe42096852d18c36p13dd97jsnf35030afec7b" ; //|| process.env.REACT_APP_RAPID_API_KEY; // Replace with your actual API key
const API_HOST = "chess-puzzles.p.rapidapi.com";

// Create API client
const apiClient = axios.create({
  baseURL: 'https://chess-puzzles.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST
  }
});

// Get a single random puzzle
export const getRandomPuzzle = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data.puzzles[0];
  } catch (error) {
    console.error('Error fetching random puzzle:', error);
    throw error;
  }
};

// Get puzzles by rating
export const getPuzzlesByRating = async (rating = 1500, count = 3) => {
  try {
    const response = await apiClient.get('/', {
      params: {
        rating: rating,
        count: count
      }
    });
    return response.data.puzzles;
  } catch (error) {
    console.error(`Error fetching puzzles with rating ${rating}:`, error);
    throw error;
  }
};

// Get puzzles by theme
export const getPuzzlesByTheme = async (themes = ["middlegame"], count = 3) => {
  try {
    const response = await apiClient.get('/', {
      params: {
        themes: JSON.stringify(themes),
        themesType: themes.length > 1 ? 'ONE' : 'ALL',
        count: count
      }
    });
    return response.data.puzzles;
  } catch (error) {
    console.error(`Error fetching puzzles with themes ${themes}:`, error);
    throw error;
  }
};

// Get puzzles for specific mistake types
export const getPuzzlesForMistakeType = async (mistakeType, count =3) => {
  // Map mistake types to appropriate themes
  const themeMap = {
    blunder: ["advantage", "crushing", "hangingPiece"],
    mistake: ["endgame", "tactical", "middlegame"],
    inaccuracy: ["advantage", "opening", "defensiveTactic"]
  };
 
  const themes = themeMap[mistakeType] || ["middlegame"];
  
  try {
    const response = await apiClient.get('/', {
      params: {
        themes: JSON.stringify(themes),
        themesType: 'ONE',
        count: count
      }
    });
    // Add a check to ensure the data structure is as expected
    if (!response.data || !response.data.puzzles) {
      console.warn('Unexpected response format:', response.data);
      return [];
    }
    return response.data.puzzles;
  } catch (error) {
    console.error(`Error fetching puzzles for mistake type ${mistakeType}:`, error);
    // Add more detailed error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Format the puzzle data to match the expected structure in your components
export const formatPuzzle = (puzzleData) => {
  if (!puzzleData) return null;
  
  // Add a hint based on the themes
  const generateHint = (themes) => {
    if (themes.includes("hanging")) return "Look for hanging pieces";
    if (themes.includes("advantage")) return "Find the move that gives you an advantage";
    if (themes.includes("mateIn")) return "Find the checkmate sequence";
    if (themes.includes("tactical")) return "Look for a tactical opportunity";
    return "Find the best move in this position";
  };
  
  return {
    id: puzzleData.puzzleid,
    fen: puzzleData.fen,
    moves: puzzleData.moves,
    rating: puzzleData.rating,
    themes: puzzleData.themes,
    hint: generateHint(puzzleData.themes || [])
  };
};