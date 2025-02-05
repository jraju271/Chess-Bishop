import { Container, Box } from '@mui/material'
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

import '../../Learn.css'

import VideoPlayer from './videoPlay';


function Lesson0() {

  return (
    <>
      <Container  >
        <VideoPlayer />
      </Container>
    </>
  )
}

export default Lesson0
