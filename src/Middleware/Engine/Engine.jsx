// src/Engine/Engine.jsx

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { evaluateBoard, checkGameEndingCondition } from './gameLogic';  // Import functions from gameLogic

// Set up API calls for best move and evaluation
export const EngineApi = createApi({
  reducerPath: 'Engine',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://stockfish.online/api/stockfish.php' }),
  endpoints: (builder) => ({
    getBestMove: builder.query({
      query: (data) => `?fen=${data.fen}&depth=13&mode=bestmove`,
    }),
    getSocre: builder.query({
      query: (data) => `?fen=${data.fen}&depth=13&mode=eval`,
    }),
  }),
});

export const { useGetBestMoveQuery, useGetSocreQuery } = EngineApi;

// Local functions for evaluating the board and checking game-ending condition
export const localEvaluateBoard = (boardState) => {
  return evaluateBoard(boardState);  // Calls evaluateBoard from gameLogic.js
};

export const localCheckGameEndingCondition = (boardState) => {
  return checkGameEndingCondition(boardState);  // Calls checkGameEndingCondition from gameLogic.js
};
