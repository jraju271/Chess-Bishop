import React, { useState } from 'react';
import { Card, CardContent, Select, MenuItem, IconButton, Typography } from '@mui/material';
import TamilVideo from '../../../../assets/Video/History(tamil).mp4';
import EnglishVideo from '../../../../assets/Video/History(Eng).mp4';

import LanguageIcon from '@mui/icons-material/Language';


const VideoPlayer = () => {
  const [videoSource, setVideoSource] = useState(TamilVideo);
  const [selectedValue, setSelectedValue] = useState('');
  const [cardVisible, setCardVisible] = useState(false);
  const primaryFontFamily = 'var(--PrimaryFontFamily)';


  const handleAudioTrack = (event) => {
    setSelectedValue(event.target.value);
    setVideoSource(event.target.value);
    setCardVisible(false);
  };

  const toggleCard = () => {
    setCardVisible(!cardVisible);
  };

  return (
    <Card style={{ position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0)', width: '110%', height: '80vh', margin: 'auto' }}>
      <CardContent>
        <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
          <iframe src={videoSource} width="100%" height="100%" allow="autoplay" style={{ position: 'absolute', top: 0, left: 0 }} title="Video Player"></iframe>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 0, padding: '16px', display: 'flex', justifyContent: 'end', width: '100%' }}>

          <IconButton onClick={toggleCard}>
            <LanguageIcon style={{ color: '#fff' }} />
          </IconButton>

          {cardVisible && (
            <Card style={{ position: 'absolute', top: '40px', right: 0, width: '150px',  borderRadius: '8px', boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.1)', background: 'rgba(0,0,0,0)' }}>
              <CardContent>
                <Typography variant="body1" gutterBottom  sx={{fontSize:'14px !important',fontFamily: primaryFontFamily}}>
                  Language
                </Typography>
                <Select
                  value={videoSource}
                  onChange={handleAudioTrack}
                  label="Language"
                  fullWidth
                  style={{ fontFamily: primaryFontFamily,fontSize: '12px', color:'white'  }}
                  InputLabelProps={{
                      style: { fontFamily: primaryFontFamily ,fontSize: '12px' },
                  }}
                >
                  <MenuItem key={1} value={EnglishVideo} selected={videoSource === EnglishVideo}>
                    English
                  </MenuItem>
                  <MenuItem key={2} value={TamilVideo} selected={videoSource === TamilVideo}>
                    Tamil
                  </MenuItem>
                </Select>
              </CardContent>
            </Card>
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
