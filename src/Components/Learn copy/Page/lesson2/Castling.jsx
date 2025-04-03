import * as React from 'react';
import { useState,useMemo } from 'react';
import { Box,Container,MobileStepper,Stepper,Step,StepLabel,StepContent, Button,Typography} from '@mui/material';
import { Chessboard } from 'react-chessboard';
import toast, { Toaster } from 'react-hot-toast';
import '../../Learn.css'
import { Chess } from 'chess.js';
import { useSelector, useDispatch } from 'react-redux';
import {setNotifySate} from '../../../../Middleware/Global'


// image

import Img204 from '../../../../assets/Image/LeanPageImages/lesson2/204.png'
import Img205 from '../../../../assets/Image/LeanPageImages/lesson2/205.png'











function Castling() {

  const dispatch = useDispatch();
  const GuideTaskList =[
    {Fen:'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R',Move:{Source:'e1',Target:'g1',color:'orange'} ,FinalFen:'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R4RK1'}
  ]
  const AssenmentList =[
    {Fen:'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R',Move:{Source:'e1',Target:'c1',color:'orange'} ,FinalFen:'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/2KR3R'},
  ]
  const NextLessonPath='/Learn'



  const [TaskList,setTaskList] = useState([true,false,false])
  const [GCount,setGCount] = useState(0);
  const [GFEN,setGFEN] = useState(GuideTaskList[GCount].Fen)
  const [ACount,setACount] = useState(0);
  const [AFEN,setAFEN] = useState(AssenmentList[ACount].Fen)
  const steps = [
      {
        label: 'Introduction',
        description: `Next assignment depends on this article, so carefully read it. `,

      },
      {
        label: 'Guided Test',
        description:`This is a practice exam; if you still don't understand, carefully read the instructions again.`,

      },
      {
        label: 'Assessment',
        description: `This assessment based on previous task`,

      },
    ];




  function Media() {

      return (
        <>
          <Typography variant="h4" className='TitleText' component="div">
          CASTLING
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          Castling is a special rule that allows your king to move two spaces to its right or left, while the rook on that side moves to the opposite side of the king. There are two types: King-side castling & Queen-side castling
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          <strong> King-side castling –</strong> where the White king goes two spaces to his right, and on the other side of the board the Black king can go two spaces to his left. See this diagram with the kings moving along the red line and the rooks along the green line:
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img204}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />
          </Box>
          <br />
          <Typography variant="h6" component="div">
          <strong>Queen-side castling –</strong>  similar in that the king moves two spaces but this time the White king goes left and the Black king goes right. See here:

          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img205}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />
          </Box>
          <br />
          <Typography variant="h6" component="div">
          In both cases, the rook jumps over the king and settles next to him. One thing to remember is that if you want to castle you need to pick up the king first – not the rook. This is very important!
          </Typography>
          <br />
          <Box sx={{textAlign:'left',width:'100%'}}>
          <Typography variant="h6" component="div">
          1)  Castling can only happen if all of the following conditions are met in a game
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          2) The king has not previously moved..
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          3) Your chosen rook has not previously moved
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          4) There must be no pieces between the king and the chosen rook
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          5) The king is not currently in check
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          6) Your king must not pass through a square that is under attack by enemy pieces
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          7) The king must not end up in check
          </Typography>
          </Box>
          <br />

          <br />
          <br />
          <br />
          <br />
          <br />
        </>
      )
  }


  function MakeTest() {


      function onDrop(sourceSquare, targetSquare, piece) {

        if(targetSquare==GuideTaskList[GCount].Move.Target && !TaskList[1]){
              toast.success('Good Job.',{position: 'buttom-center',    style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },icon: '👏'});
                if(GCount+1<GuideTaskList.length){
                  setGCount(GCount+1);
                  setGFEN(GuideTaskList[GCount+1].Fen);
                  return true;
                }
                  setTaskList([true,true,false])
                  setGFEN(GuideTaskList[GCount].FinalFen);
                  GuideTaskList[GCount].Move.color='green'
                  return false;

          }else{
              toast.error('Task is Pending',{position: 'buttom-right'});

          }

        }

    return (
      <>
      <Box sx={{width:'60%',display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
          <h1>King-side castling</h1>
          <Chessboard
          position={GFEN}
          onPieceDrop={onDrop}
          customArrows={[
                [
                  GuideTaskList[GCount].Move.Source,
                  GuideTaskList[GCount].Move.Target,
                  GuideTaskList[GCount].Move.color,
                ],
              ]
            }
          />

      </Box>
      <Toaster />
      </>
    )
  }

  function Assessment() {

    const pieces = [
        "bP"
      ];


    const customPieces = useMemo(() => {
        const pieceComponents = {};
        pieces.forEach((piece) => {
          pieceComponents[piece] = ({ squareWidth }) => (
            <div
              style={{
                justifySelf:'center',
                width: squareWidth,
                height: squareWidth,
                backgroundImage: `url('https://cdn.pixabay.com/animation/2022/10/27/12/57/12-57-22-874_512.gif')`,
                backgroundSize: "100%",
                backgroundRepeat:'no-repeat'
              }}
            />
          );
        });
        return pieceComponents;
      }, []);
    function onDrop(sourceSquare, targetSquare, piece) {
      if(targetSquare==AssenmentList[ACount].Move.Target){
        toast.success('Good Job.',{position: 'buttom-center',    style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },icon: '👏'});
          if(ACount+1<AssenmentList.length){
            setACount(ACount+1);
            setAFEN(AssenmentList[ACount+1].Fen);
            return true;
          }

            setTaskList([true,true,true])
            setAFEN(AssenmentList[ACount].FinalFen);

            return false;
    }else{
        toast.error('Task is Pending',{position: 'buttom-right'});

    }

      }

  return (
    <>
    <Box sx={{width:'60%',display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
      <h1>Queen-side castling(white)</h1>
        <Chessboard
        position={AFEN}
        onPieceDrop={onDrop}

        />

    </Box>
    <Toaster />
    </>
  )
}









  const containerbox =[<Media/>,<MakeTest/>,<Assessment/>]



    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = useState(true);


    const handleNext = () => {
      if(activeStep === steps.length - 1){
        console.log(activeStep);
        dispatch(setNotifySate({Notify:true,LessonPath:NextLessonPath}))
      }else{
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }


    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  let screenHeight = screen.availHeight
  return (
    <>
    <Container className='SideBar' sx={{position:'fixed',right:'2%',padding:'0',margin:'0',width:'15%',height:'80vh'}}>
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={TaskList[index]?false:true}
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  {index>0 &&
                  <Button

                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 ,color:'white'}}
                  >
                    Back
                  </Button>}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>


    </Container>




    <Container className='LeanContainer' sx={{overflow:'scroll',height:screenHeight,width:'100%'}} >
      <Button  className='TopicButton' sx={{position:'absolute',top:'5%',backgroundColor:'var(--ButtonBackgroundColor)',color:'white',width:'10%'}}>Castling</Button>
    <MobileStepper
      variant="progress"
      className='MobileStepper'
      steps={steps.length}
      position="static"
      activeStep={activeStep}
      sx={{width:'100%',padding:'0',backgroundColor:'transparent'}}
    />




      <Box sx={{padding:'10%'}}>

        <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
            {containerbox[activeStep]}
        </Box>

      </Box>





    </Container>

    </>
  )
}

export default Castling