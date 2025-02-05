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

import Img109 from '../../../../assets/Image/LeanPageImages/lesson1/109.png'










function King() {

  const dispatch = useDispatch();
  const GuideTaskList =[
    {Fen:'8/8/8/8/8/8/8/4K3',Move:{Source:'e1',Target:'d2',color:'orange'}},
    {Fen:'8/8/8/8/8/8/3K4/8',Move:{Source:'d2',Target:'d3',color:'orange'} ,FinalFen:'8/8/8/8/8/3K4/8/8'}
  ]
  const AssenmentList =[
    {Fen:'8/1p6/2p5/2p1K3/3p4/8/8/8',Move:{Source:'d1',Target:'d4',color:'orange'}},
    {Fen:'8/1p6/2p5/2p5/3K4/8/8/8',Move:{Source:'a4',Target:'c5',color:'orange'} },
    {Fen:'8/1p6/2p5/2K5/8/8/8/8',Move:{Source:'c6',Target:'c6',color:'orange'} },
    {Fen:'8/1p6/2K5/8/8/8/8/8',Move:{Source:'h6',Target:'b7',color:'orange'} ,FinalFen:'8/1K6/8/8/8/8/8/8'},
  ]
  const NextLessonPath='/Lesson1/Notation'



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
          THE KING
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          The king moves one square in any direction (horizontally, vertically, or diagonally).The king is a vital piece, and its safety is of paramount importance throughout the game.Castling is a unique move involving the king and one of the rooks, providing both safety and centralization.
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img109}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />
          </Box>
          <br />
          <Typography variant="h6" component="div">
          The king does not have a point value as this piece is the most valuable piece in chess since its objective is to be safeguarded rather than captured.
          </Typography>


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
      <Box sx={{width:'60%',display:'flex',justifyContent:'center'}}>
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
    <Box sx={{width:'60%',display:'flex',justifyContent:'center'}}>
        <Chessboard
        position={AFEN}
        onPieceDrop={onDrop}
        customPieces={customPieces}
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
      <Button  className='TopicButton' sx={{position:'absolute',top:'5%',backgroundColor:'var(--ButtonBackgroundColor)',color:'white',width:'10%'}}>The King</Button>
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

export default King