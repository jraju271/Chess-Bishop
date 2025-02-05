import { useState, useRef } from 'react';
import './Auth.css';
import Webcam from 'react-webcam';
import Avatar from '@mui/material/Avatar';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FormControlLabel, Container, Box, Button, Checkbox, Link, Grid, Typography, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Person, Close, CameraAlt, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Middleware/Firebase/firebase';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import ReactFlagsSelect from 'react-flags-select';
import { FB_Login, FB_SignUp } from '../../Middleware/Firebase/FBController';

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [fideRating, setFideRating] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);
  const [isauthcard, setisauthcard] = useState(true);
  const [SignInemail, setSignInEmail] = useState('');
  const [SignInPassword, setSignInPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCameraDialog, setOpenCameraDialog] = useState(false);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    try {
      if (!SignInemail || !SignInPassword) {
        toast.error('Please enter both email and password.');
        return;
      }
      const userCredential = await auth.signInWithEmailAndPassword(SignInemail, SignInPassword);
      const user = userCredential.user;
      if (user.emailVerified) {
        const userData = await FB_Login(user.uid);
        if (userData) {
          const hasCompletedQuiz = localStorage.getItem(`quizCompleted_${user.uid}`);
          toast.success('User signed in successfully!');
          setIsLoggedIn(true);
          if (!hasCompletedQuiz) {
            navigate('/chess-quiz');
          } else {
            navigate('/');
          }
        } else {
          toast.error('Unable to fetch user data');
        }
      } else {
        toast.error('Verify your email First');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      toast.error('Invalid email or password...');
    }
  };

  const handleSignup = async () => {
    try {
      if (!username || !name || !email || !password) {
        toast.error('Please fill in all required fields.');
        return;
      }
      if (!isEmailValid(email)) {
        toast.error('Invalid email format');
        return;
      }
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      FB_SignUp(user.uid, { uid: user.uid, UserName: username, Name: name, Email: email, Country: country, FIDE: fideRating, Age: age, ProfileImage: selectedImage });
      setisauthcard(true);
      toast.success('Verification email sent to your mail');
      await user.sendEmailVerification();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use.');
      } else {
        toast.error('Error signing up: ' + error.message);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  function changeAuthCard() {
    setisauthcard(!isauthcard);
  }

  function OnClickClose() {
    window.history.back();
  }

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option) => {
    handleClose();
    if (option === 'camera') {
      setOpenCameraDialog(true);
    } else if (option === 'gallery') {
      document.getElementById('image-upload').click();
    }
  };

  const handleDialogClose = () => {
    setOpenCameraDialog(false);
  };

  const handleCaptureFromCamera = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const byteCharacters = atob(imageSrc.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      setSelectedImage(blob);
      setOpenCameraDialog(false);
    }
  };

  return (
    <Box className="auth-container">
      <Box className="auth-background">
        <Box className="auth-content">
          <Typography component="h1" className="auth-title" variant="h5">
            {isauthcard ? 'Log In' : 'Sign Up'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {isauthcard ? (
              <>
                <TextField
                  margin="normal"
                  border-color
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={SignInemail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  autoFocus
                  InputProps={{
                    style: { 
                      fontFamily: 'Open Sans', 
                      color: 'white', 
                      backdropFilter: 'blur(25px)', 
                      WebkitBackdropFilter: 'blur(50px)',  // For Safari support
                      border: '1px solid white',
                    },
                  }}
                  InputLabelProps={{
                    style: { 
                      fontFamily: 'Open Sans', 
                      color: 'white',
                      backdropFilter: 'blur(25px)',
                      WebkitBackdropFilter: 'blur(25px)',  // For Safari support
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  name="Password"
                  type="password"
                  id="password"
                  value={SignInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  InputProps={{
                    style: { 
                      fontFamily: 'Open Sans', 
                      color: 'white', 
                      backdropFilter: 'blur(25px)', 
                      WebkitBackdropFilter: 'blur(25px)',  // For Safari support
                      border: '1px solid white',
                    },
                  }}
                  InputLabelProps={{
                    style: { 
                      fontFamily: 'Open Sans', 
                      color: 'white',
                      backdropFilter: 'blur(25px)',
                      WebkitBackdropFilter: 'blur(25px)',  // For Safari support
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" sx={{
                      color: 'white',
                         '&.Mui-checked': {
                         color: 'white',
                       },
                      // '& .MuiSvgIcon-root': {
                      //   fill: 'none',
                      //   stroke: 'white',
                      // },
                    }}
                    />}
                    label="Remember Me"
                    sx={{
                      color: '#F6F6F6',
                      fontFamily: 'Open Sans',
                    }}
                  />
                  <Link href="#" variant="body2" sx={{ color: '#FAE163', fontFamily: 'Open Sans' }}>
                    Forgot Password?
                  </Link>
                </Box>
                <Button
                  className="auth-action-button"
                  fullWidth
                  variant="contained"
                  onClick={handleLogin}
                  sx={{
                    mt: 3,
                    mb: 2,
                    ml: 17,
                    boxSizing: 'border-box',
                    display: 'flex',
                    // flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    gap: '10px',
                    width: '175px',
                    height: '40px',
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    borderRadius: '32px',
                    color: 'white',
                    '&:hover': {
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  className="auth-action-button"
                  fullWidth
                  variant="contained"
                  onClick={changeAuthCard}
                  sx={{ mt: 3,
                    mb: 2,
                    ml: 17,
                    boxSizing: 'border-box',
                    display: 'flex',
                    // flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    gap: '10px',
                    width: '175px',
                    height: '40px',
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    borderRadius: '32px',
                    color: 'white',
                    '&:hover': {
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    }, 
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap:1, justifyContent: 'center' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="UserName"
                  label="User Name"
                  name="UserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid white' },
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)'},
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                       fontSize: '12px',
                       width: '250px',
                      // height: '40px',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  name="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid white'},
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)'},
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                      fontSize: '12px',
                      width: '250px',
                      //height: '40px',
                    },
                  }}
                />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="fideRating"
                  label="FIDE Rating"
                  name="fideRating"
                  value={fideRating}
                  onChange={(e) => setFideRating(e.target.value)}
                  InputProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid white'},
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)'},
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                      fontSize: '12px',
                      width: '170px',
                      //height: '40px',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  InputProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid white'},
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)'},
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                      fontSize: '12px',
                      width: '170px',
                      //height: '40px',
                    },
                  }}
                />
                <ReactFlagsSelect
                  id="Country"
                  selected={country}
                  value={country}
                  placeholder="Select Country"
                  onSelect={code => setCountry(code)}
                  fullWidth={false}
                  alignOptionsToRight
                  className="menu-flags"
                  selectButtonClassName="menu-flags-button"
                  searchable
                />
                </Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid white'},
                  }}
                  InputLabelProps={{
                    style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)'},
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                      fontSize: '12px',
                      width: '520px',
                      //height: '40px',
                    },
                  }}
                />
                <FormControl sx={{ m: 0, width: '520px', border: '1px solid white' }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password" style={{ fontFamily: 'Open Sans',  color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)' }}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    inputProps={{ style: { fontFamily: 'Open Sans', color: 'white', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid white'} }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                        fontSize: '12px',
                        width: '380px',
                        //height: '40px',
                      },
                    }}
                  />
                </FormControl>
                </Box>
                <Button
                  className="auth-action-button"
                  fullWidth
                  variant="contained"
                  // sx={{ mt: 3, mb: 2 }}
                  onClick={handleSignup}
                  sx={{ mt: 3,
                    mb: 2,
                    ml: 22,
                    boxSizing: 'border-box',
                    display: 'flex',
                    // flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    gap: '10px',
                    width: '200px',
                    height: '40px',
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    borderRadius: '32px',
                    color: 'white',
                    '&:hover': {
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    }, 
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  className="auth-action-button"
                  fullWidth
                  variant="contained"
                  // sx={{ mt: 1, mb: 2 }}
                  onClick={changeAuthCard}
                  sx={{ mt: 3,
                    mb: 2,
                    ml: 22,
                    boxSizing: 'border-box',
                    display: 'flex',
                    // flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    gap: '10px',
                    width: '200px',
                    height: '40px',
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    borderRadius: '32px',
                    color: 'white',
                    '&:hover': {
                    background: 'radial-gradient(120.76% 83.75% at 50% 100%, #FFC008 0%, rgba(255, 192, 8, 0.815) 18.5%, rgba(255, 192, 8, 0.485) 51.5%, rgba(255, 192, 8, 0.3) 70%, rgba(255, 192, 8, 0) 100%), #8E5C00',
                    }, 
                  }}
                >
                  Log In
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Toaster />
      <Dialog open={openCameraDialog} onClose={handleDialogClose}>
        <DialogTitle>Capture from Camera</DialogTitle>
        <DialogContent>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width={500}
            height={400}
            videoConstraints={{
              facingMode: 'user',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCaptureFromCamera}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Auth;
