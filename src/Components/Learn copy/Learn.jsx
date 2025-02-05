
import './Learn.css'
import TopicBanner from '../../assets/Image/LeanPageImages/TopicBanner.jpg'
import Locked from '../../assets/Image/LeanPageImages/Locked.png'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Container } from '@mui/material'
import { useState } from 'react';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
function Learn() {
    const dispatch = useDispatch()
    const [alignment, setAlignment] = useState('Lesson');
    const theme = useTheme();
    const handleChange = (event, newAlignment) => {
        if (newAlignment != null) {
            setAlignment(newAlignment);
        }

    };
    let screenHeight = screen.availHeight

    return (
        <>
            <Container className='LeanContainer' sx={{ overflow: 'scroll', height: screenHeight }} >
                <div>
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        fullWidth
                        sx={{
                            position: 'fixed',
                            width: '60%'
                        }}
                    >
                        <ToggleButton className='ToggleButton' value="Lesson">Lesson</ToggleButton>

                    </ToggleButtonGroup>

                    <Box sx={{ padding: '10%', paddingBottom: '25%' }} >
                        {itemData.map((item, index) => (
                            <Link key={index} to={item.path} >
                                <Card sx={{ display: 'flex', margin: '4%', backgroundColor: "gray" }}>
                                    <Box sx={{ padding: '10px' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: '300px', height: '250px', borderRadius: '2%' }}
                                            image={TopicBanner}
                                            alt="Live from space album cover"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardContent className='CardContent' sx={{ flex: '1 0 auto' }}>
                                            <Typography component="div" style={{ 'color': 'white' }} variant="h4">
                                                {item.title}
                                            </Typography>
                                            <Typography variant="p" component="div">
                                                {item.desc}
                                            </Typography>
                                        </CardContent>
                                    </Box>

                                </Card>
                            </Link>
                        ))}

                    </Box>

                </div>
            </Container>
        </>
    )
}

export default Learn


const itemData = [
    {
        path: '/Histroy',
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'History of Chess',
        desc: 'The recorded history of chess goes back at least to the emergence of a similar game, chaturanga, in seventh century India. The rules of chess as they are known today emerged in Europe at the end of the 15th century, with standardization and universal acceptance by the end of the 19th century.'
    },
    {
        path: '/Lesson1',
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Chess Board and Pieces',
        desc: 'Chessboard is a game board used to play chess. It consists of 64 squares, 8 rows by 8 columns, on which the chess pieces are placed. It is square in shape and uses two colours of squares, one light and one dark, in a chequered pattern'
    }, {
        path: '/Lesson2',
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Special Moves',
        desc: "If you're just starting your chess journey, you might be caught off guard by weird moves that look too odd to be legal. Don't worry, though. In this chess term, you learn everything about the special moves of chess."
    },
]
