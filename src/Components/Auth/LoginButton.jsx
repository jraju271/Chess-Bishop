import { Box, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import './LoginButton.css';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { FB_Logout } from "../../Middleware/Firebase/FBController";

function LoginButton() {
  const UserState = useSelector((state) => state.USER_STATE.value);
  const [name, setName] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("Name")) {
      setName(localStorage.getItem("Name"));
    }
  }, [localStorage.getItem("Name") !== null]);

  // Hide login button on all pages except the login page
  if (location.pathname === "/Auth") {
    return null;
  }

  return (
    <Box className='LoginButton'>
      {UserState.islogin ? (
        <Button variant="contained" onClick={() => {
          FB_Logout();
          window.location.href = '/'; // Redirect to home page after logout
        }}>
          Log Out
        </Button>
      ) : (
        <Link to="/Auth" style={{ textDecoration: 'none' }}>
          <Button variant="contained">
            Login / Sign Up
          </Button>
        </Link>
      )}
    </Box>
  );
}

export default LoginButton;