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

import Img112 from '../../../../assets/Image/LeanPageImages/lesson1/112.png'
import Img113 from '../../../../assets/Image/LeanPageImages/lesson1/113.png'
import Img114 from '../../../../assets/Image/LeanPageImages/lesson1/114.png'
import Img115 from '../../../../assets/Image/LeanPageImages/lesson1/115.png'
import Img116 from '../../../../assets/Image/LeanPageImages/lesson1/116.png'










function Notation() {

  const dispatch = useDispatch();
  const GuideTaskList =[
    {Fen:'8/8/8/8/8/8/8/5B2',Move:{Source:'f1',Target:'a6',color:'orange'}},
    {Fen:'8/8/B7/8/8/8/8/8',Move:{Source:'a6',Target:'c8',color:'orange'} ,FinalFen:'2B5/8/8/8/8/8/8/8'}
  ]
  const AssenmentList =[
    {Fen:'8/8/8/8/8/8/8/3B4',Move:{Source:'d1',Target:'a4',color:'orange'}},
    {Fen:'8/8/8/8/B7/8/8/8',Move:{Source:'a4',Target:'e8',color:'orange'} },
    {Fen:'4B3/8/8/8/8/8/8/8',Move:{Source:'e6',Target:'g6',color:'orange'} },
    {Fen:'8/8/6B1/8/8/8/8/8',Move:{Source:'g6',Target:'d3',color:'orange'} ,FinalFen:'8/8/8/8/8/3B4/8/8'},
  ]
  const NextLessonPath='/Lesson2'



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
          THE NOTATION
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          1) Each square on the chessboard is identified by a letter (a to h) horizontally for files and a number (1 to 8) vertically for ranks.
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img112}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />
          </Box>
          <br />
          <Typography variant="h6" component="div">
          2) Pawn moves are simply the destination square (e.g., e4 or d5)
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img113}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            The notation for above given position is e4
            </Typography>
          </Box>
          <br />
          <Typography variant="h6" component="div">
          3) Piece moves start with the first letter of the piece (N for knight, B for bishop,K for king,R for Rook,Q for Queen,square name for pawn.) followed by the destination square.
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img114}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            The notation for above given position is Bc4

            </Typography>
          </Box>
          <Typography variant="h6" component="div">
          4) Captures are denoted by 'x' (e.g., Bxf7 for bishop captures on f7).
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img115}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            The notation for above given image is Bxf7
            </Typography>
          </Box>
          <br />
          <Typography variant="h6" component="div">
          5) Castling is O-O for kingside and O-O-O for queenside
          </Typography>
          <Typography variant="h6" component="div">
          6) Checks are indicated by '+' and checkmate by '#'.
          </Typography>
          <Typography variant="h6" component="div">
          7) When two same pieces, of the same colour, can move to same square.
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img116}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            The notation for above given position is Rce4
            </Typography>
          </Box>
          <br />
          <Typography variant="h6" component="div">
          As we have to write the Rank or File name of the moving piece(whichever is different) and write the square name where the piece is moving
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
      <Box sx={{width:'60%',display:'flex',justifyContent:'center',flexDirection:"column",alignItems:'center'}}>
        <h1>Move {GuideTaskList[GCount].Move.Source} to {GuideTaskList[GCount].Move.Target}</h1>
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
    <h1>Move {AssenmentList[ACount].Move.Source} to {AssenmentList[ACount].Move.Target}</h1>
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
      <Button  className='TopicButton' sx={{position:'absolute',top:'5%',backgroundColor:'var(--ButtonBackgroundColor)',color:'white',width:'10%'}}>Notation</Button>
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

export default Notation