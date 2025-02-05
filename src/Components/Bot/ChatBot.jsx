import { Container, Box, TextField, Typography, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { SPEAK } from '../../Middleware/Utils/Speak'
import { Send_GPT_Request } from '../../Middleware/bot/BotEngine';
import { setMemojiState } from '../../Middleware/Meta/StateController';
import './ChatBot.css'


function ChatBot() {
  const CurrentState = useSelector((state) => state.STATE.value)
  const dispatch = useDispatch();
  const [isChatOpen, setisChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [InputText, setInputText] = useState('');
  var IsRecognition = false;
  const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  recognition.continuous = true;

  useEffect(() => {
    recognition.onresult = (event) => {
      // toast.success('Loading...', { position: 'bottom-center', style: { backgroundColor: '#000', color: '#fff' } });
      const result = event.results[event.resultIndex][0].transcript;
      setInputText(result)
      handleSendMessage(result);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    return () => { recognition.onresult = null; recognition.onerror = null; };
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', handleStopListening);
    window.addEventListener('keydown', handleSpaceBarDown);
  }, []);



  const handleStartListening = () => {
    if (recognition && !IsRecognition) {
      IsRecognition = true;
      dispatch(setMemojiState('Active'));
      recognition.start();
    }
  };

  const handleStopListening = () => {
    IsRecognition = false;
    setTimeout(() => {
      dispatch(setMemojiState('Sleep'));
    }, 60000);
    recognition.stop();
  };

  const handleSpaceBarDown = (event) => {
    if (event.code === 'Space') {
      handleStartListening();
    }
  };
  const handleSendMessage = (InputText) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: InputText, type: 'user' },
    ]);
    Send_GPT_Request(InputText).then((Res) => {
      console.log(Res);
      SPEAK(Res);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: Res, type: 'bot' },
      ]);
    });

    setInputText('')
  }

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <>
      {isChatOpen && <Container className='ChatBox'>
        <Box className='MessageBox' >
          {messages.map((message, index) => (
            <Box key={index} className='MessageText' sx={{ backgroundColor: message.type === 'bot' ? 'var(--SecondaryBackgroud1)' : 'var(--SecondaryBackgroud2)', justifySelf: message.type === 'bot' ? 'left' : 'right' }}>
              {
                message.text
              }
            </Box>
          ))}
        </Box>
        <Box className='MessageInputBox'>
          <TextField fullWidth id="ChatInput" color='warning' value={InputText} label="Type here ...." onChange={handleInputChange} variant="outlined" onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage(InputText);
            }
          }} />
        </Box>
        <IconButton className='ChatCloseButton' onClick={() => {
          setisChatOpen(!isChatOpen); setTimeout(() => {
            dispatch(setMemojiState('Sleep'));
          }, 60000);
        }}>
          <CloseIcon />
        </IconButton>
      </Container>}
      <Box id='ChatBotBox'>
        <img src={CurrentState.MemojiState} className='ChatImage' onClick={() => { setisChatOpen(!isChatOpen); dispatch(setMemojiState('Active')); }} />
      </Box>

    </>
  )
}

export default ChatBot