import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import './App.css'


// Main Routes
import NavigationBar from './Components/Utils/Navigation/NavigationBar'
import Home from './Components/Home/Home'
import PlayWithComputer from './Components/Play/PlayWithComputer/PlayWithComputer'
import PlayWithFriends from './Components/Play/PlayWithFriends/PlayWithFriends'
import ChatBot from './Components/Bot/ChatBot'
import Auth from './Components/Auth/Auth'
import Intro from './Components/Intro/Intro'
import LoginButton from './Components/Auth/LoginButton'
import Under from './Components/Home/Under'
import { useDispatch } from "react-redux";


import { setLogin } from './Middleware/Firebase/UserController'
import { SetStatus, fetchUser } from './Middleware/Firebase/FBController';


import NoticeDialogBox from './Components/Utils/DialogBox/NoticeDialogBox'
import Lesson1 from './Components/Learn copy/Page/lesson1/Lesson1'
import Pawn from './Components/Learn copy/Page/lesson1/Pawn'
import Knight from './Components/Learn copy/Page/lesson1/Knight'
import Rook from './Components/Learn copy/Page/lesson1/Rook'
import Queen from './Components/Learn copy/Page/lesson1/Queen'
import King from './Components/Learn copy/Page/lesson1/King'
import Bishop from './Components/Learn copy/Page/lesson1/Bishop'
import Notation from './Components/Learn copy/Page/lesson1/Notation'
import Lesson2 from './Components/Learn copy/Page/lesson2/Lesson2'
import Enpassant from './Components/Learn copy/Page/lesson2/Enpassant'
import Castling from './Components/Learn copy/Page/lesson2/Castling'

import Learn from "./Components/Learn copy/Learn";
import Histroy from './Components/Learn copy/Page/lesson0/Lesson0';

import React from 'react';
//import Chessboard from './Components/ChessBoard/ChessBoard.jsx';

import ErrorBoundary from './ErrorBoundary'; // Adjust the path if needed

import FeedbackDashboard from './Components/Play/PlayWithComputer/FeedbackDashboard_new.jsx';
import ChessTechniques from "./Components/Puzzle/ChessTechniques";
import GameStrategies from "./Components/Puzzle/GameStrategies";
import AdvancedCheckmates from './Components/Puzzle/AdvancedCheckmates.jsx'
import ChessQuiz from './Components/Quiz/ChessQuiz.jsx'


function App() {

  const dispatch = useDispatch();
  window.onbeforeunload = function () {
    SetStatus(false);
    return "Do you really want to close?";
  };
  window.onload = function () {
    console.log("Start");
    const uid = localStorage.getItem("User")
    if (uid != null) {
      setLogin(true)
      SetStatus(true);
      fetchUser(uid).then(() => {
        console.log("End");
      });

    } else {
      console.log("No Local Storage", uid);
    }
  }

  return (
    <>
      <BrowserRouter>
        <Box className='ContainerBox'>
          <ErrorBoundary> { /* <PlayWithComputer/> Add ErrorBoundary here */} 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/PlayWithComputer" element={<PlayWithComputer />} />
              <Route path="/PlayWithFriends" element={<PlayWithFriends />} />
              <Route path="/Auth" element={<Auth />} />
              <Route path="/Learn" element={<Learn />} />
              <Route path="/Histroy" element={<Histroy />} />
              <Route path="/Under" element={<Under />} />
              <Route path="/Lesson1" element={<Lesson1 />} />
              <Route path="/Lesson2" element={<Lesson2 />} />
              <Route path="/Lesson1/Pawn" element={<Pawn />} />
              <Route path="/Lesson1/Knight" element={<Knight />} />
              <Route path="/Lesson1/Rook" element={<Rook />} />
              <Route path="/Lesson1/Queen" element={<Queen />} />
              <Route path="/Lesson1/King" element={<King />} />
              <Route path="/Lesson1/Bishop" element={<Bishop />} />
              <Route path="/Lesson1/Notation" element={<Notation />} />
              <Route path="/Lesson2/Enpassant" element={<Enpassant />} />
              <Route path="/Lesson2/Castling" element={<Castling />} />
              <Route path="/feedback-analysis" element={<FeedbackDashboard />} /> {/* Define the route */}
              <Route path="/chess-techniques" element={<ChessTechniques />} />
              <Route path="/game-strategies" element={<GameStrategies />} />
              <Route path="/advanced-checkmates" element={<AdvancedCheckmates />} />
              <Route path="/chess-quiz" element={<ChessQuiz />} />
            </Routes> 
          </ErrorBoundary>
        </Box>
        <Box><NoticeDialogBox/></Box>
        <Box className='NavigationBox'><NavigationBar /></Box>
        <LoginButton />
        <ChatBot />
        <Intro />
      </BrowserRouter>
    </>
  );
}

export default App
