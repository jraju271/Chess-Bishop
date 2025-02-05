import React, { useState } from 'react';
import { Box, Button, Paper, Step, StepLabel, Stepper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../Middleware/Firebase/firebase'; // Add this import

const quizSections = {
  basic: {
    title: "Basic Understanding",
    questions: [
      {
        question: "How many squares are there on a chessboard?",
        options: ["64", "81", "100", "49"],
        correctAnswer: "64"
      },
      {
        question: "What is a diagonal in chess?",
        options: [
          "A line of squares connected at their edges",
          "A straight line of squares connected at their corners",
          "A horizontal row of squares",
          "A vertical column of squares"
        ],
        correctAnswer: "A straight line of squares connected at their corners"
      },
      {
        question: "Which piece is considered the most powerful?",
        options: ["King", "Queen", "Rook", "Knight"],
        correctAnswe: "Queen"
      },
      {
        question: "What does the term 'rank' refer to?",
        options: ["A vertical column of squares", "A horizontal row of squares", "A diagonal line of squares", "A square occupied by a king"],
        correctAnswer: "A horizontal row of squares"
      },
      {
        question: "What is the value of a rook in points?",
        options: ["3", "5", "9", "1"],
        correctAnswer: "5"
      },
      {
        question: "Which piece can jump over other pieces?",
        options: ["Bishop", "Knight", "Rook", "Pawn"],
        correctAnswer: "Knight"
      },
      {
        question: "Which square does the White king start on?",
        options: ["d1", "e1", "d8", "e8"],
        correctAnswer: "e1"
      },
      {
        question: "What is the primary purpose of pawns?",
        options: ["To defend the king", "To control the center and support other pieces", "To attack the opponent’s pieces", "To win the game"],
        correctAnswer: "To control the center and support other pieces"
      },
      {
        question: "What is castling?",
        options: ["A special move involving the king and a rook", "Promoting a pawn to a rook", "Moving the king to a square protected by pawns", "None of the above"],
        correctAnswer: "A special move involving the king and a rook"
      },
      {
        question: "Which piece starts on b1 for White?",
        options: ["Rook", "Knight", "Bishop", "Pawn"],
        correctAnswer: "Knight"
      }
    ]
  },
  intermediate: {
    title: "Intermediate Skills",
    questions: [
      {
        question: "Which move leads to checkmate in a single move?",
        options: ["Scholars Mate", "Fools Mate", "En Passant", "Castling"],
        correctAnswer: "Fools Mate"
      },
      {
        question: "What is the primary goal in the opening phase of chess?",
        options: [
          "Control the center",
          "Develop your pieces",
          "Ensure king safety",
          "All of the above"
        ],
        correctAnswer: "All of the above"
      },
      {
        question: "What happens during pawn promotion?",
        options: ["The pawn is removed from the board", "The pawn is exchanged for a queen, rook, bishop, or knight", "The pawn gains extra points", "The pawn is moved back to its starting position"],
        correctAnswer: "The pawn is exchanged for a queen, rook, bishop, or knight"
      },
      {
        question: "Which of the following is a legal move for a bishop?",
        options: ["Moving diagonally any number of squares", "Moving vertically any number of squares", "Moving horizontally any number of squares", "Jumping over pieces"],
        correctAnswer: "Moving diagonally any number of squares"
      },
      {
        question: "What is a discovered attack?",
        options: ["An attack made when a piece moves, revealing an attack by another piece", "An attack discovered after a blunder", "An attack involving multiple pieces", "An attack targeting the king"],
        correctAnswer: "An attack made when a piece moves, revealing an attack by another piece"
      },
      {
        question: "Which is NOT a basic principle of the opening?",
        options: ["Control the center", "Develop minor pieces", "Move the same piece repeatedly", "Ensure king safety"],
        correctAnswer: "Move the same piece repeatedly"
      },
      {
        question: "What is en passant?",
        options: ["A special pawn capture", "A checkmate in two moves", "A king-side castle", "A promotion to a rook"],
        correctAnswer: "A special pawn capture"
      },
      {
        question: "Which piece is involved in a pin?",
        options: ["Bishop", "Pawn", "Knight", "Queen"],
        correctAnswer: "Bishop"
      },
      {
        question: "How many squares does a pawn move forward on its first move?",
        options: ["1", "2", "1 or 2", "None"],
        correctAnswer: "1 or 2"
      },
      {
        question: "Which piece always stays on the same color?",
        options: ["King", "Knight", "Bishop", "Rook"],
        correctAnswer: "Bishop"
      }
    ]
  },
  advanced: {
    title: "Advanced Concepts",
    questions: [
      {
        question: "What is zugzwang?",
        options: [
          "Forcing the opponent to make a disadvantageous move",
          "A checkmate in three moves",
          "A tactical sequence involving a knight",
          "A type of pawn structure"
        ],
        correctAnswer: "Forcing the opponent to make a disadvantageous move"
      },
      {
        question: "What is the most common endgame checkmate?",
        options: [
          "King and queen versus king",
          "King and rook versus king",
          "King and two bishops versus king",
          "King and pawn versus king"
        ],
        correctAnswer: "King and queen versus king"
      },
      {
        question: "Which pawn structure is considered strong?",
        options: ["Doubled pawns", "Isolated pawns", "Passed pawns", "Backward pawns"],
        correctAnswer: "Passed pawns"
      },
      {
        question: "What is a fork in chess?",
        options: ["A tactic attacking two pieces simultaneously", "A move targeting the center", "A checkmate pattern", "A defensive maneuver"],
        correctAnswer: "A tactic attacking two pieces simultaneously"
      },
      {
        question: "What is the primary goal in the middle game?",
        options: ["To develop minor pieces", "To attack the opponent's king", "To protect your pawns", "To create a strong pawn structure"],
        correctAnswer: "To attack the opponent's king"
      },
      {
        question: "Which is NOT an advantage of castling?",
        options: ["King safety", "Rook development", "Sacrificing a pawn", "Connecting the rooks"],
        correctAnswer: "Sacrificing a pawn"
      },
      {
        question: "What is a passed pawn?",
        options: ["A pawn with no opposing pawns blocking its path to promotion", "A pawn that has been promoted", "A pawn that has been captured", "A pawn on the opponent's side of the board"],
        correctAnswer: "A pawn with no opposing pawns blocking its path to promotion"
      },
      {
        question: "What is the fifty-move rule?",
        options: ["The game is drawn if no capture or pawn move occurs in fifty moves", "A pawn can be promoted after fifty moves", "A player can request a draw after fifty moves", "A rook and king can deliver checkmate within fifty moves"],
        correctAnswer: "The game is drawn if no capture or pawn move occurs in fifty moves"
      },
      {
        question: "What is the significance of a strong pawn structure?",
        options: ["It provides mobility for pieces and supports attacks", "It ensures the king's safety", "It guarantees a draw", "It simplifies the endgame"],
        correctAnswer: "It provides mobility for pieces and supports attacks"
      },
      {
        question: "Which piece is involved in a skewer?",
        options: ["Bishop", "Rook", "Queen", "Any of the above"],
        correctAnswer: "Any of the above"
      }
    ]
  }
};




const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: '#8E5C00', // Default color
  },
  '& .MuiStepIcon-text': {
    fill: 'white !important', // Text color
  },
  '& .MuiStepIcon-active': {
    color: '#8E5C00', // Active color
  },
  '& .MuiStepIcon-completed': {
    color: '#8E5C00', // Completed color
  },
}));




const ChessQuiz = ({ userName }) => {
  const navigate = useNavigate();
  const [knowsChess, setKnowsChess] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [playerCategory, setPlayerCategory] = useState('');
  const sections = ['basic', 'intermediate', 'advanced'];
   
  const handleLearnPage = () => {
    navigate("/Learn"); // Pass category to the Puzzle component
  };
  
  const handleInitialChoice = (knows) => {
    setKnowsChess(knows);
    setCurrentSection('basic');
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSection}_${questionIndex}`]: answer
    }));
  };

  const calculateSectionScore = (section) => {
    let correct = 0;
    quizSections[section].questions.forEach((q, index) => {
      if (answers[`${section}_${index}`] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const determinePlayerCategory = (score) => {
    if (score >= 0 && score <= 10) {
      return { category: 'Basic Level Player', aiLevel: 1 };
    } else if (score >= 11 && score <= 20) {
      return { category: 'Intermediate Level Player', aiLevel: 2 };
    } else {
      return { category: 'Advanced Level Player', aiLevel: 3 };
    }
  };

  const handleSectionComplete = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
      setActiveStep(currentIndex + 1);
    } else {
      // Calculate final score
      const totalScore = sections.reduce((acc, section) => {
        return acc + calculateSectionScore(section);
      }, 0);
      
      const { category, aiLevel } = determinePlayerCategory(totalScore);
      
      // Store quiz results
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        localStorage.setItem('quizCompleted', 'true');
        localStorage.setItem('quizScore', totalScore);
        localStorage.setItem('playerCategory', category);
        localStorage.setItem('aiLevel', aiLevel);
      }
      
      setQuizScore(totalScore);
      setPlayerCategory(category);
      setShowResults(true);
    }
  };

  const handlePlayWithComputer = () => {
    const aiLevel = localStorage.getItem('aiLevel');
    navigate('/playwithcomputer', { 
      state: { 
        aiLevel: parseInt(aiLevel),
        playerCategory: localStorage.getItem('playerCategory')
      } 
    });
  };

  const QuizResults = () => (
    <Box sx={{ 
      // display: 'flex', 
      // flexDirection: 'column', 
      // alignItems: 'center',
      // justifyContent: 'center',
      // minHeight: '80vh',
      // padding: 3
      position: 'absolute',
      width: '600px',
      height: '300px',
      //left: 'calc(50% - 1325px/2 + 0.5px)',
      //top: 'calc(50% - 632px/2)',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(90px)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      color: 'white'
    }}>
      {/* <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: '100%' }}> */}
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Quiz Results
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Total Score: <span style={{ color: '#8E5C00' }}>{quizScore}</span>
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, textAlign: 'center'}}>
          Your Category: <span style={{ color: '#8E5C00' }}>{playerCategory}</span>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handlePlayWithComputer}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              gap: '10px',
              width: '200px',
              height: '40px',
              background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
              borderRadius: '32px',
              '&:hover': {
                        background: 'rgba(255, 192, 8, 0.5)',
                      },
            }}
          >
            Start Playing
          </Button>
        </Box>
      {/* </Paper> */}
    </Box>
  );

  if (!knowsChess) {
    // return (
    //   <Box sx={{ 
    //     display: 'flex', 
    //     flexDirection: 'column', 
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     minHeight: '100vh',
    //     padding: 3
    //   }}>
    //     <Typography variant="h4" sx={{ mb: 4 }}>
    //       Welcome, {userName}!
    //     </Typography>
    //     <Typography variant="h5" sx={{ mb: 4 }}>
    //       Do you know how to play chess?
    //     </Typography>
    //     <Box sx={{ display: 'flex', gap: 2 }}>
    //       <Button variant="contained" onClick={() => handleInitialChoice(true)}>
    //         Yes
    //       </Button>
    //       <Button variant="contained" onClick ={handleLearnPage}> {/*onClick={() => handleInitialChoice(false)}>*/}
    //         No
    //       </Button>
    //     </Box>
    //   </Box>
    // );
    return (
      <Box sx={{
        position: 'absolute',
        width: '500px',
        height: '300px',
        //left: 'calc(50% - 1325px/2 + 0.5px)',
        //top: 'calc(50% - 632px/2)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(90px)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        color: 'white'
      }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Welcome, {userName}!
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Do you know how to play chess?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleInitialChoice(true)}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              gap: '10px',
              width: '200px',
              height: '40px',
              background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
              borderRadius: '32px',
              '&:hover': {
                        background: 'rgba(255, 192, 8, 0.5)',
                      },
            }}>
            Yes
          </Button>
          <Button
            variant="contained"
            onClick={handleLearnPage}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              gap: '10px',
              width: '200px',
              height: '40px',
              background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
              borderRadius: '32px',
              '&:hover': {
                        background: 'rgba(255, 192, 8, 0.5)',
                      },
            }}>
            No
          </Button>
        </Box>
      </Box>
    );
  }

  if (!currentSection) {
    return null;
  }

  const currentQuestions = quizSections[currentSection].questions;
  const allQuestionsAnswered = currentQuestions.every((_, index) => 
    answers[`${currentSection}_${index}`]
  );

  if (showResults) {
    return <QuizResults />;
  }

  const handleOptionClick = (index, option) => {
    handleAnswerChange(index, option);
  };
  
  return (
  //   <Box sx={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
  //     <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
  //       {sections.map((section, index) => (
  //         <Step key={section}>
  //           <StepLabel>{quizSections[section].title}</StepLabel>
  //         </Step>
  //       ))}
  //     </Stepper>

  //     <Paper elevation={3} sx={{ padding: 3 }}>
  //       <Typography variant="h5" sx={{ mb: 3 }}>
  //         {quizSections[currentSection].title}
  //       </Typography>

  //       {currentQuestions.map((q, index) => (
  //         <Box key={index} sx={{ mb: 4 }}>
  //           <Typography variant="h6" sx={{ mb: 2 }}>
  //             {index + 1}. {q.question}
  //           </Typography>
  //           <FormControl component="fieldset">
  //             <RadioGroup
  //               value={answers[`${currentSection}_${index}`] || ''}
  //               onChange={(e) => handleAnswerChange(index, e.target.value)}
  //             >
  //               {q.options.map((option, optIndex) => (
  //                 <FormControlLabel
  //                   key={optIndex}
  //                   value={option}
  //                   control={<Radio />}
  //                   label={option}
  //                 />
  //               ))}
  //             </RadioGroup>
  //           </FormControl>
  //         </Box>
  //       ))}

  //       <Button
  //         variant="contained"
  //         disabled={!allQuestionsAnswered}
  //         onClick={handleSectionComplete}
  //         sx={{ mt: 2 }}
  //       >
  //         {activeStep === sections.length - 1 ? 'Finish' : 'Next Section'}
  //       </Button>
  //     </Paper>
  //   </Box>
  // );
  
  
  
  
  
  
  // <Box sx={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
  //     <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
  //       {sections.map((section, index) => (
  //         <Step key={section}>
  //           <CustomStepLabel>
  //             <Box sx={{ color: '#8E5C00' }}>
  //               {quizSections[section].title}
  //             </Box>
  //           </CustomStepLabel>
  //         </Step>
  //       ))}
  //     </Stepper>

  //     <Paper
  //       elevation={3}
  //       sx={{
  //         padding: 3,
  //         background: 'rgba(255, 255, 255, 0.1)',
  //         backdropFilter: 'blur(90px)',
  //         borderRadius: '16px',
  //       }}
  //     >
  //       <Typography variant="h5" sx={{ mb: 3, color: 'white', textAlign: 'center' }}>
  //         {quizSections[currentSection].title}
  //       </Typography>

  //       {currentQuestions.map((q, index) => (
  //         <Box key={index} sx={{ mb: 4 }}>
  //           <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
  //             {index + 1}. {q.question}
  //           </Typography>
  //           <FormControl component="fieldset">
  //             <RadioGroup
  //               value={answers[`${currentSection}_${index}`] || ''}
  //               onChange={(e) => handleAnswerChange(index, e.target.value)}
  //             >
  //               {q.options.map((option, optIndex) => (
  //                 <FormControlLabel
  //                   key={optIndex}
  //                   value={option}
  //                   control={<Radio sx={{
  //                     '&.Mui-checked': {
  //                       color: '#8E5C00',
  //                     },
  //                   }} />}
  //                   label={option}
  //                   sx={{
  //                     boxSizing: 'border-box',
  //                     display: 'flex',
  //                     flexDirection: 'row',
  //                     justifyContent: 'center',
  //                     alignItems: 'center',
  //                     padding: '10px',
  //                     gap: '10px',
  //                     width: '560px',
  //                     height: '48px',
  //                     borderRadius: '32px',
  //                     background: answers[`${currentSection}_${index}`] === option ? 'rgba(255, 192, 8, 0.815)' : 'transparent',
  //                     color: answers[`${currentSection}_${index}`] === option ? '#8E5C00' : '#8E5C00',
  //                     border: '1px solid #8E5C00',
  //                     '&:hover': {
  //                       background: 'rgba(255, 192, 8, 0.5)',
  //                     },
  //                   }}
  //                 />
  //               ))}
  //             </RadioGroup>
  //           </FormControl>
  //         </Box>
  //       ))}

  //       <Button
  //         variant="contained"
  //         disabled={!allQuestionsAnswered}
  //         onClick={handleSectionComplete}
  //         sx={{ mt: 2, backgroundColor: 'transparent', color: '#8E5C00', border: '1px solid #8E5C00', '&:hover': {
  //                       background: 'rgba(255, 192, 8, 0.5)',
  //                     },
  //             }}
  //       >
  //         {activeStep === sections.length - 1 ? 'Finish' : 'Next Section'}
  //       </Button>
  //     </Paper>
  //   </Box>
  <Box sx={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {sections.map((section, index) => (
          <Step key={section}>
            <CustomStepLabel>
              <Box sx={{ color: '#8E5C00' }}>
                {quizSections[section].title}
              </Box>
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(90px)',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, color: 'white' , textAlign: 'center'}}>
          {quizSections[currentSection].title}
        </Typography>

        {currentQuestions.map((q, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
              {index + 1}. {q.question}
            </Typography>
            <FormControl component="fieldset">
              <Box>
                {q.options.map((option, optIndex) => (
                  <Box
                    key={optIndex}
                    onClick={() => handleOptionClick(index, option)}
                    sx={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '10px',
                      gap: '10px',
                      width: '560px',
                      height: '48px',
                      borderRadius: '32px',
                      background: answers[`${currentSection}_${index}`] === option ? 'rgba(255, 192, 8, 0.815)' : 'transparent',
                      color: answers[`${currentSection}_${index}`] === option ? 'black' : 'white',
                      border: '1px solid #8E5C00',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(255, 192, 8, 0.5)',
                      },
                    }}
                  >
                    {option}
                  </Box>
                ))}
              </Box>
            </FormControl>
          </Box>
        ))}

        <Button
          variant="contained"
          disabled={!allQuestionsAnswered}
          onClick={handleSectionComplete}
          sx={{ mt: 2, backgroundColor: '#8E5C00', color: 'white', border: '1px solid #8E5C00', '&:hover': {
                        background: 'rgba(255, 192, 8, 0.5)',
                      },
             }}
        >
          {activeStep === sections.length - 1 ? 'Finish' : 'Next Section'}
        </Button>
      </Paper>
    </Box>
  );
};

export default ChessQuiz;
