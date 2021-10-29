import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Box from '@mui/material/Box';
import './styles.css';


const GettingStarted = (props) => {
  return (
     
      <>
          <Typography variant="h5" component="div" gutterBottom>
            Instnt Signup Demo
          </Typography>
          <Box sx={{ alignItems:"center", justifyContent:"center", width: '100%'}}>
            <Box className="title-wrapper">
              <Typography variant="h6" gutterBottom component="div"> 
                The process consist of the below steps
              </Typography>
            </Box>
            <List>
              <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon />
                  </ListItemIcon>
                  <ListItemText primary="Fill up the signup form"/>
              </ListItem>
              <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon />
                  </ListItemIcon>
                  <ListItemText primary="Submit OTP"/>
              </ListItem>
              <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon />
                  </ListItemIcon>
                  <ListItemText primary="Capture Photos of your ID"/>
              </ListItem>
              <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon />
                  </ListItemIcon>
                  <ListItemText primary="Take Selfie"/>
              </ListItem>
              <ListItem>
                  <ListItemIcon>
                    <FiberManualRecordIcon />
                  </ListItemIcon>
                  <ListItemText primary="Verify and Approve"/>
              </ListItem>
            </List>
          </Box>
      </>
  )
}

export default GettingStarted;


