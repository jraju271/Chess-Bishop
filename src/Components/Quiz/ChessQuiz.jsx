import React, { useState, useRef } from 'react';
import { Box, Button, Paper, Step, StepLabel, Stepper, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../Middleware/Firebase/firebase'; // Add this import
import LanguageToggle from './LanguageToggle';

const quizSections = {
  english:{
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
  },
  tamil: {
    basic: {
      title: "அடிப்படை புரிதல்",
      questions: [
        {
          question: "சதுரங்கப் பலகையில் எத்தனை சதுரங்கள் உள்ளன?",
          options: ["64", "81", "100", "49"],
          correctAnswer: "64"
        },
        {
          question: "சதுரங்கத்தில் மூலைவிட்டம் என்றால் என்ன?",
          options: [
            "அவற்றின் விளிம்புகளில் இணைக்கப்பட்ட சதுரங்களின் கோடு",
            "சதுரங்களின் ஒரு நேர் கோடு அவற்றின் மூலைகளில் இணைக்கப்பட்டுள்ளது",
            "சதுரங்களின் கிடைமட்ட வரிசை",
            "சதுரங்களின் செங்குத்து நெடுவரிசை"
          ],
          correctAnswer: "சதுரங்களின் ஒரு நேர் கோடு அவற்றின் மூலைகளில் இணைக்கப்பட்டுள்ளது"
        },
        // ...other questions
        {
          question: "எந்த துண்டு மிகவும் சக்திவாய்ந்ததாக கருதப்படுகிறது?",
          options: ["ராஜ", "ராணி", "ரூக்", "நைட்"],
          correctAnswer: "ராணி"
        },
        {
          question: "ரேங்க்' என்ற சொல் எதைக் குறிக்கிறது?",
          options: ["சதுரங்களின் செங்குத்து நெடுவரிசை", 
            "சதுரங்களின் கிடைமட்ட வரிசை", 
            "சதுரங்களின் மூலைவிட்டக் கோடு", 
            "ஒரு அரசனால் ஆக்கிரமிக்கப்பட்ட ஒரு சதுரம்"],
          correctAnswer: "சதுரங்களின் கிடைமட்ட வரிசை"
        },
        {
          question: "புள்ளிகளில் ரூக்கின் மதிப்பு என்ன?",
          options: ["3", "5", "9", "1"],
          correctAnswer: "5"
        },
        {
          question: "எந்த துண்டு மற்ற துண்டுகளின் மீது குதிக்க முடியும்?",
          options: ["பிஷப்", "நைட்", "ரூக்", "சிப்பாய்"],
          correctAnswer: "நைட்"
        },
        {
          question: "வெள்ளை ராஜா எந்த சதுரத்தில் தொடங்குகிறார்?",
          options: ["d1", "e1", "d8", "e8"],
          correctAnswer: "e1"
        },
        {
          question: "சிப்பாய்களின் முதன்மை நோக்கம் என்ன?",
          options: ["ராஜாவைப் பாதுகாக்க", "மையத்தை கட்டுப்படுத்தவும் மற்ற துண்டுகளை ஆதரிக்கவும்", "எதிராளியின் துண்டுகளைத் தாக்க", "விளையாட்டில் வெற்றி பெற"],
          correctAnswer: "மையத்தை கட்டுப்படுத்தவும் மற்ற துண்டுகளை ஆதரிக்கவும்"
        },
        {
          question: "காஸ்ட்லிங் என்றால் என்ன?",
          options: ["ராஜா மற்றும் ஒரு ரோக் சம்பந்தப்பட்ட ஒரு சிறப்பு நகர்வு", "ஒரு சிப்பாய்க்கு ஒரு சிப்பாயை ஊக்குவித்தல்", "சிப்பாய்களால் பாதுகாக்கப்பட்ட ஒரு சதுரத்திற்கு ராஜாவை நகர்த்துதல்", "மேலே எதுவும் இல்லை"],
          correctAnswer: "ராஜா மற்றும் ஒரு ரோக் சம்பந்தப்பட்ட ஒரு சிறப்பு நகர்வு"
        },
        {
          question: "வெள்ளைக்கு b1 இல் தொடங்கும் துண்டு எது?",
          options: ["ரூக்", "நைட்", "பிஷப்", "சிப்பாய்"],
          correctAnswer: "நைட்"
        }
      ]
    },
    intermediate: {
      title: "இடைநிலை திறன்கள்",
      questions: [
        {
          question: "எந்த நகர்வு ஒற்றை நகர்வில் செக்மேட்டிற்கு வழிவகுக்கிறது?",
          options: ["அறிஞர்கள் துணை", "முட்டாள்கள் துணை", "கடந்து செல்வது", "காஸ்ட்லிங்"],
          correctAnswer: "முட்டாள்கள் துணை"
        },
        {
          question: "சதுரங்கத்தின் தொடக்க கட்டத்தில் முதன்மை இலக்கு என்ன?",
          options: [
            "மையத்தை கட்டுப்படுத்தவும்",
            "உங்கள் துண்டுகளை உருவாக்குங்கள்",
            "அரசரின் பாதுகாப்பை உறுதி செய்தல்",
            "மேலே உள்ள அனைத்தும்"
          ],
          correctAnswer: "மேலே உள்ள அனைத்தும்"
        },
        // ...other questions
        {
          question: " சிப்பாய் விளம்பரத்தின் போது என்ன நடக்கிறது?",
          options: ["சிப்பாய் பலகையில் இருந்து அகற்றப்பட்டது", 
            "சிப்பாய் ஒரு ராணி, ரூக், பிஷப் அல்லது நைட்டுக்கு மாற்றப்படுகிறது", 
            "சிப்பாய் கூடுதல் புள்ளிகளைப் பெறுகிறது",
            "சிப்பாய் அதன் தொடக்க நிலைக்கு மீண்டும் நகர்த்தப்பட்டது"],
          correctAnswer: "சிப்பாய் ஒரு ராணி, ரூக், பிஷப் அல்லது நைட்டுக்கு மாற்றப்படுகிறது"
        },
        {
          question: "பின்வருவனவற்றில் பிஷப்புக்கான சட்ட நடவடிக்கை எது?",
          options: ["குறுக்காக எத்தனை சதுரங்களை நகர்த்தினாலும்",
            "எத்தனை சதுரங்களின் செங்குத்தாக நகரும்",
            "எத்தனை சதுரங்கள் இருந்தாலும் கிடைமட்டமாக நகரும்",
            "துண்டுகள் மீது குதித்தல்"],
          correctAnswer: "எத்தனை சதுரங்கள் இருந்தாலும் குறுக்காக நகரும்"
        },
        {
          question: "கண்டுபிடிக்கப்பட்ட தாக்குதல் என்றால் என்ன?",
          options: ["ஒரு துண்டு நகரும் போது செய்யப்படும் தாக்குதல், மற்றொரு துண்டின் தாக்குதலை வெளிப்படுத்துகிறது",
            "ஒரு தவறுக்குப் பிறகு கண்டுபிடிக்கப்பட்ட தாக்குதல்",
            "பல துண்டுகளை உள்ளடக்கிய தாக்குதல்",
            "ராஜாவை குறிவைத்து தாக்குதல்"],
          correctAnswer: "ஒரு துண்டு நகரும் போது செய்யப்படும் தாக்குதல், மற்றொரு துண்டின் தாக்குதலை வெளிப்படுத்துகிறது"
        },
        {
          question: "திறப்பின் அடிப்படைக் கொள்கை எது அல்ல?",
          options: ["மையத்தை கட்டுப்படுத்தவும்", "சிறு துண்டுகளை உருவாக்கவும்", "அதே பகுதியை மீண்டும் மீண்டும் நகர்த்தவும்", "அரசரின் பாதுகாப்பை உறுதி செய்தல்"],
          correctAnswer: "அதே பகுதியை மீண்டும் மீண்டும் நகர்த்தவும்"
        },
        {
          question: "en passant என்றால் என்ன?",
          options: ["ஒரு சிறப்பு சிப்பாய் பிடிப்பு", "இரண்டு நகர்வுகளில் ஒரு செக்மேட்", "ஒரு ராஜா பக்க கோட்டை", "ரூக்கிற்கு பதவி உயர்வு"],
          correctAnswer: "ஒரு சிறப்பு சிப்பாய் பிடிப்பு"
        },
        {
          question: "எந்தத் துண்டு முள் சம்பந்தப்பட்டது?",
          options: ["பிஷப்", "சிப்பாய்", "நைட்", "ராணி"],
          correctAnswer: "பிஷப்"
        },
        {
          question: "சிப்பாய் அதன் முதல் நகர்வில் எத்தனை சதுரங்களை முன்னோக்கி நகர்த்துகிறது?",
          options: ["1", "2", "1 அல்லது 2", "இல்லை"],
          correctAnswer: "1 அல்லது 2"
        },
        {
          question: "எந்தத் துண்டு எப்போதும் ஒரே நிறத்தில் இருக்கும்?",
          options: ["ராஜா", "நைட்", "பிஷப்", "ரூக்"],
          correctAnswer: "பிஷப்"
        }
      ]
    },
    advanced: {
      title: "மேம்பட்ட கருத்துக்கள்",
      questions: [
        {
          question: "zugzwang என்றால் என்ன?",
          options: [
            "எதிராளியை பாதகமான நகர்வைச் செய்ய கட்டாயப்படுத்துதல்",
            "மூன்று நகர்வுகளில் ஒரு செக்மேட்",
            "ஒரு நைட்டியை உள்ளடக்கிய ஒரு தந்திரோபாய வரிசை",
            "சிப்பாய் அமைப்பு வகை"
          ],
          correctAnswer: "எதிராளியை பாதகமான நகர்வைச் செய்ய கட்டாயப்படுத்துதல்"
        },
        {
          question: "மிகவும் பொதுவான எண்ட்கேம் செக்மேட் என்ன?",
          options: [
            "ராஜா மற்றும் ராணி எதிராக ராஜா",
            "கிங் மற்றும் ரூக் எதிராக ராஜா",
            "கிங் மற்றும் இரண்டு பிஷப்கள் எதிராக ராஜா",
            "கிங் மற்றும் சிப்பாய் எதிராக ராஜா"
          ],
          correctAnswer: "ராஜா மற்றும் ராணி எதிராக ராஜா"
        },
        // ...other questions
        {
          question: "எந்த சிப்பாய் அமைப்பு வலுவானதாகக் கருதப்படுகிறது?",
          options: ["இரட்டை சிப்பாய்கள்",
            "தனிமைப்படுத்தப்பட்ட சிப்பாய்கள்",
            "கடந்து சென்ற சிப்பாய்கள்",
            "பின்தங்கிய சிப்பாய்கள்"],
          correctAnswer: "கடந்து சென்ற சிப்பாய்கள்"
        },
        {
          question: "சதுரங்கத்தில் முட்கரண்டி என்றால் என்ன?",
          options: ["இரண்டு துண்டுகளை ஒரே நேரத்தில் தாக்கும் தந்திரம்", 
            "மையத்தை இலக்காகக் கொண்ட ஒரு நகர்வு",
            "ஒரு செக்மேட் முறை",
            "ஒரு தற்காப்பு சூழ்ச்சி"],
          correctAnswer: "இரண்டு துண்டுகளை ஒரே நேரத்தில் தாக்கும் தந்திரம்"
        },
        {
          question: "நடு ஆட்டத்தில் முதன்மையான இலக்கு என்ன?",
          options: ["சிறு துண்டுகளை உருவாக்க",
            "எதிராளியின் அரசனைத் தாக்குவது",
            "உங்கள் சிப்பாய்களைப் பாதுகாக்க",
            "வலுவான சிப்பாய் அமைப்பை உருவாக்க"],
          correctAnswer: "எதிராளியின் அரசனைத் தாக்குவது"
        },
        {
          question: "காஸ்ட்லிங்கின் நன்மை எது?",
          options: ["கிங் பாதுகாப்பு", "ரூக் வளர்ச்சி", "சிப்பாய் தியாகம்", "ரூக்குகளை இணைத்தல்"],
          correctAnswer: "சிப்பாய் தியாகம்"
        },
        {
          question: "கடத்தி சிப்பாய் என்றால் என்ன?",
          options: ["எதிரெதிர் சிப்பாய்கள் இல்லாத சிப்பாய் பதவி உயர்வுக்கான பாதையைத் தடுக்கிறது", "பதவி உயர்வு பெற்ற சிப்பாய்", "கைப்பற்றப்பட்ட ஒரு சிப்பாய்", "பலகையின் எதிராளியின் பக்கத்தில் ஒரு சிப்பாய்"],
          correctAnswer: "எதிரெதிர் சிப்பாய்கள் இல்லாத சிப்பாய் பதவி உயர்வுக்கான பாதையைத் தடுக்கிறது"
        },
        {
          question: "ஐம்பது நகர்வு விதி என்றால் என்ன?",
          options: ["ஐம்பது நகர்வுகளில் பிடிப்பு அல்லது சிப்பாய் நகர்த்தல் ஏற்படவில்லை என்றால் விளையாட்டு இழுக்கப்படும்", "ஐம்பது நகர்வுகளுக்குப் பிறகு ஒரு சிப்பாய் பதவி உயர்வு பெறலாம்", "ஒரு வீரர் ஐம்பது நகர்வுகளுக்குப் பிறகு டிராவைக் கோரலாம்", "ஒரு ரூக் மற்றும் ராஜா ஐம்பது நகர்வுகளுக்குள் செக்மேட்டை வழங்க முடியும்"],
          correctAnswer: "ஐம்பது நகர்வுகளில் பிடிப்பு அல்லது சிப்பாய் நகர்த்தல் ஏற்படவில்லை என்றால் விளையாட்டு இழுக்கப்படும்"
        },
        {
          question: "வலுவான சிப்பாய் கட்டமைப்பின் முக்கியத்துவம் என்ன?",
          options: ["இது துண்டுகளுக்கு இயக்கத்தை வழங்குகிறது மற்றும் தாக்குதல்களை ஆதரிக்கிறது", "இது ராஜாவின் பாதுகாப்பை உறுதி செய்கிறது", "இது சமநிலைக்கு உத்தரவாதம் அளிக்கிறது", "இது இறுதி விளையாட்டை எளிதாக்குகிறது"],
          correctAnswer: "இது துண்டுகளுக்கு இயக்கத்தை வழங்குகிறது மற்றும் தாக்குதல்களை ஆதரிக்கிறது"
        },
        {
          question: "எந்த துண்டு ஒரு சூலத்தில் ஈடுபட்டுள்ளது?",
          options: ["பிஷப்", "ரூக்", "ராணி", "மேலே உள்ள ஏதேனும்"],
          correctAnswer: "மேலே உள்ள ஏதேனும்"
        }
      ]
    }
  }
};




const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: '#8E5C00 ! important', // Default color
  },
  '& .MuiStepIcon-text': {
    fill: 'white ! important', // Text color
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
  const [language, setLanguage] = useState('english'); // Add language state
  const sections = ['basic', 'intermediate', 'advanced'];
  const questionContainerRef = useRef(null); // Add this ref
   
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
    quizSections[language][section].questions.forEach((q, index) => {
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
      if (questionContainerRef.current) {
        questionContainerRef.current.scrollTop = 0; // Scroll to top
      }
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

  const currentQuestions = quizSections[language][currentSection].questions;
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
  <Box sx={{ padding: 5, width:650, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LanguageToggle language={language} setLanguage={setLanguage} /> {/* Add Language Toggle */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {sections.map((section, index) => (
          <Step key={section}>
            <CustomStepLabel>
              <Box sx={{ color: '#8E5C00' }}>
                {quizSections[language][section].title}
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
          width: '100%', // Ensures Paper takes full width of the container
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        ref={questionContainerRef} // Add ref here

      >
        <Typography variant="h5" sx={{ mb: 3, color: 'white' , textAlign: 'center'}}>
          {quizSections[language][currentSection].title}
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
                      width: '600px',//560
                      height: '48px',
                      marginBottom: '5px', // Increased gap between options
                      borderRadius: '32px',
                      background: answers[`${currentSection}_${index}`] === option ? 'rgba(255, 192, 8, 0.815)' : 'transparent',
                      color: answers[`${currentSection}_${index}`] === option ? 'black' : 'white',
                      //fontWeight: 'bold',
                      fontSize: '14px',//16
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
