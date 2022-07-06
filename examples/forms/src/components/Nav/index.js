import React from "react";
import NavStyle from "./styles.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="primary">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6">Instnt Signup Demo</Typography>
          <Button onClick={() => window.location.reload(false)} color="inherit">Restart</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
