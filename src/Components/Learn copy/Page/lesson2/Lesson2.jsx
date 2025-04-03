import { Container,Box } from '@mui/material'
import { Link } from 'react-router-dom';
import {Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TopicBanner from '../../../../assets/Image/LeanPageImages/TopicBanner.jpg'
import Locked from '../../../../assets/Image/LeanPageImages/lessonimge.jpg'
import '../../Learn.css'
// Image
import img101 from '../../../../assets/Image/LeanPageImages/lesson1/101.png'
import img102 from '../../../../assets/Image/LeanPageImages/lesson1/102.png'
import img103 from '../../../../assets/Image/LeanPageImages/lesson1/103.png'

// topic


function Lesson2() {

    let screenHeight = screen.availHeight
  return (
    <>

    <Container className='LeanContainer' sx={{overflow:'scroll',height:screenHeight}} >
    <img
        src={TopicBanner}
        alt="test"
        width={'100%'}
        height={'50%'}
        loading="lazy"
      />
      <Box sx={{display:'flex',justifyContent:'left',flexDirection:'column',marginTop:'2%',padding:'5%'}}>
        <Typography variant="h2" style={{fontWeight:'bold'}}  component="div">
        Special Moves
        </Typography>
        <br />
        <Typography variant="h6" component="div">
        Special moves are those that allow different types of movement or capture when compared to standard movements. There are only a few of these to learn, but they are extremely important to know!
When learning how to play chess, most people focus on the basic movements of the pieces and what it means to give or receive a check or checkmate. These rules usually cover most games between beginners, but the time comes when you (or your opponents) have the possibility of playing a special move. Those moves are castling, promoting a pawn, and capturing en passant.
</Typography>
        <br />
        <br />
        <Typography variant="h5" style={{fontWeight:'bold'}} component="div">
                OBJECTIVES
        </Typography>
        <Box>
            <ol>
                <li>En passant Rule</li><br />
                <li>Castling</li><br />
                <li>Pawn Promotion</li><br />

            </ol>
        </Box>
        <hr style={{'borderColor':'gray',width:"80%"}} />
        <br /><br />
        <Typography variant="h4" style={{fontWeight:'bold',textAlign:'center'}} component="div">
                    TOPIC
        </Typography>
        <Box sx={{padding:'5%',paddingBottom:'25%'}} >
                    {itemData.map((item,index) => (
                        <Link to={item.path}>
                        <Card sx={{ display: 'flex', margin:'4%' }}>
                            <CardMedia
                            component="img"
                            sx={{ width: '300px',height:'200px' }}
                            image={Locked}
                            alt="Live from space album cover"
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography component="div" style={{fontWeight:'bold'}}  variant="h5">
                                    {item.title}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        {item.desc}
                                    </Typography>
                                </CardContent>
                            </Box>

                        </Card>
                        </Link>
                    ))}

                </Box>

      </Box>

    </Container>
    </>
  )
}

export default Lesson2




const itemData = [
    {
      path:'/Lesson2/Enpassant',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'En passant Rule',
      desc:"En passant is a special pawn capture rule in chess."
    },
    {
      path:'/Lesson2/Castling',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Castling',
      desc:"Castling is a special rule that allows your king to move two spaces to its right or left, while the rook on that side moves to the opposite side of the king."
    }
    ,
    {
      path:'/Lesson2',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Pawn Promotion',
      desc:"In chess, promotion is the replacement of a pawn with a new piece when the pawn is moved to its last rank. The player replaces the pawn immediately with a queen, rook, bishop, or knight of the same color."
    }
    ]