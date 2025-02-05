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

import Img201 from '../../../../assets/Image/LeanPageImages/lesson2/201.png'
import Img202 from '../../../../assets/Image/LeanPageImages/lesson2/202.png'
import Img203 from '../../../../assets/Image/LeanPageImages/lesson2/203.png'










function Enpassant() {

  const dispatch = useDispatch();
  const GuideTaskList =[
    {Fen:'4k3/5p2/8/3pP3/8/8/8/4K3',Move:{Source:'e5',Target:'d6',color:'orange'} ,FinalFen:'4k3/5p2/3P4/3p4/8/8/8/4K3'}
  ]
  const AssenmentList =[
    {Fen:'4k3/5p2/8/2pP4/8/8/8/4K3',Move:{Source:'d5',Target:'c6',color:'orange'} ,FinalFen:'4k3/5p2/2P5/2p5/8/8/8/4K3'},
  ]
  const NextLessonPath='/Lesson2/Castling'



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
          EN PASSANT
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          En passant is a special pawn capture rule in chess.
          </Typography>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img201}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            Before En passant
            </Typography>
          </Box>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img202}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            Process
            </Typography>
          </Box>
          <br />
          <Box className='ImageBox'>
              <img
              src={Img203}
              alt="test"
              width={'100%'}
              height={'50%'}
              loading="lazy"
            />

            <Typography sx={{paddingTop:'5%'}}>
            After En passant
            </Typography>
          </Box>
          <br />
          <br />
          <Box sx={{textAlign:'left'}}>
          <Typography variant="h6" component="div">
          1)  The capturing pawn must be on its fifth rank (imagine a White pawn on e5).
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          2) The threatened pawn must have moved two squares from its starting square, and be on an adjacent file (so, if White has a pawn on e5, then Black’s f-pawn and d-pawn could be threatened with en passant capture if they move from their starting squares).
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          3) The capture can only be made on the move immediately after the opposing pawn makes the move, otherwise, the right to capture en passant is lost.
          </Typography>
          <br />
          <Typography variant="h6" component="div">
          4) TIf all these conditions have been met, the threatened pawn can be removed, as if the pawn had moved only one square. So, if White has a pawn on e5, and Black’s d-pawn advances from d7 to d5, White may capture Black’s d-pawn, and White’s own pawn will move to d6
          </Typography>
          </Box>
          <br />
          <br />
          <Typography variant="h6" component="div">
          This essential guide delves into the nuances of the king, the central and most vital piece in chess. Explore the king's unique movement, understand its strategic role in the game, and learn how to safeguard it effectively. From basic rules to advanced endgame considerations, this resource is tailored for players of all levels. Discover the king's special castling ability, its defensive and offensive capabilities, and gain insights into key principles for king safety. Whether you're a novice or an experienced player, this guide will enhance your understanding of the king's centrality in chess strategy and its crucial role in securing victory
          </Typography>

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
      <Button  className='TopicButton' sx={{position:'absolute',top:'5%',backgroundColor:'var(--ButtonBackgroundColor)',color:'white',width:'10%'}}>Enpassant</Button>
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

export default Enpassant