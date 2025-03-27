import React from "react";
import NavStyle from "./styles.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const getHeaderTitle = ({isSignUp,resumeSignup})=>{
  if(isSignUp){
    return 'Instnt Signup Demo';
  }else if(resumeSignup){
    return 'Instnt Resume Signup';
  }else{
    return 'Instnt Login Demo';
  }
}

const Navbar = ({isSignUp = true,resumeSignup=false}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="primary">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6">{getHeaderTitle({isSignUp,resumeSignup})}</Typography>
          <Button onClick={() => window.location.reload(false)} color="inherit">Restart</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
