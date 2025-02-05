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


function Lesson1() {

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
                Chess Board and Pieces
        </Typography>
        <br />
        <Typography variant="h6" component="div">
                    Chessboard is a game board used to play chess. It consists of 64 squares, 8 rows by 8 columns, on which the chess pieces are placed. It is square in shape and uses two colours of squares, one light and one dark, in a chequered pattern
        </Typography>
        <br />
        <Typography variant="h6" style={{fontWeight:'bold'}} component="div">
        Lay out the board with the light square in the bottom-right corner
        </Typography>
        <br />
        <Box sx={{display:'flex',justifyContent:'center'}}>
        <img
        src={img101}
        alt="img101"
        width={'50%'}
        height={'50%'}
        loading="lazy"
      />
        </Box>
        <br />
        <br />
        <Typography variant="h6" style={{fontWeight:'bold'}} component="div">
        Files, Ranks & Diagonal
        </Typography>
        <Typography  variant="h6" component="div">
                The columns of a chessboard are known as files, the rows are known as ranks, and the lines of adjoining same-coloured squares (each running from one edge of the board to an adjacent edge) are known as diagonals.
        </Typography>
        <br />
        <Box sx={{display:'flex',justifyContent:'center'}}>
        <img
        src={img102}
        alt="img102"
        width={'25%'}
        height={'25%'}
        loading="lazy"
      />

        </Box>
        <br />
        <Typography variant="h5" style={{fontWeight:'bold'}} component="div">
                Chess Pieces
        </Typography>
        <br />
        <Typography  variant="h6" component="div">
            How are chess pieces arranged?
        </Typography>
        <br />
        <Typography  variant="h6" component="div">
        At the beginning of the game, the pieces are arranged as shown in the diagram: for each side one king, one queen, two rooks, two bishops, two knights, and eight pawns. The pieces are placed, one per square, as follows: Rooks are placed on the outside corners, right and left edge
        </Typography>
        <br />
        <br />
        <Box sx={{display:'flex',justifyContent:'center'}}>
        <img
        src={img103}
        alt="img103"
        width={'30%'}
        height={'30%'}
        loading="lazy"
      />

        </Box>
        <br />

        <br />
        <Typography variant="h5" style={{fontWeight:'bold'}} component="div">
                OBJECTIVES
        </Typography>
        <Box>
            <ol>
                <li>KING - Moves one square in any direction</li>
                <li>Queen - Moves any number of squares diagonally, horizontally, or vertically</li>
                <li>Rook - Moves any number of squares horizontally or vertically. </li>
                <li>Bishop - Moves any number of squares diagonally. </li>
                <li>Knight - Moves in an ‘L-shape,’ two squares in a straight direction, and then one square perpendicular to that. </li>
                <li>Pawn - Moves one square forward, but on its first move, it can move two squares forward. It captures diagonally one square forward. </li>
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

export default Lesson1




const itemData = [
    {
      path:'/Lesson1/Pawn',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'The Pawn',
      desc:"When a game begins, each side starts with eight pawns. White's pawns are located on the second rank, while Black's pawns are located on the seventh rank."
    },
    {
      path:'/Lesson1/Bishop',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'The Bishop',
      desc:"Each side starts with two bishops, one on a light square and one on a dark square. When a game begins, White's bishops are located on c1 and f1, while Black's bishops are located on c8 and f8."
    },
    {
      path:'/Lesson1/Knight',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'The Knight',
      desc:"The knight moves in an L-shape: two squares in one direction (either horizontally or vertically) and then one square perpendicular to the initial direction.Knights can jump over other pieces on the board"
    },
    {
      path:'/Lesson1/Rook',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'The Rook',
      desc:"Rooks move horizontally or vertically across the board as far as the path is clear.They can control entire ranks or files, making them potent pieces for controlling the board."
    },
    {
      path:'/Lesson1/Queen',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'The Queen',
      desc:"The queen can move horizontally, vertically, and diagonally across the board as far as the path is clear.Its versatile movement allows it to control multiple ranks, files, and diagonals simultaneously."
    },
    {
      path:'/Lesson1/King',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'The King',
      desc:"The king moves one square in any direction.The king is a vital piece, and its safety is of paramount importance throughout the game."
    },
    {
      path:'/Lesson1/Notation',
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Notation symbols',
      desc:"Chess notation is the act of recording or writing down the moves of a chess game."
    },
    ]