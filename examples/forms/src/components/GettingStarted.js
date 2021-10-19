import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import StarBorder from '@mui/icons-material/StarBorder';

import '../App.css';

const GettingStarted = (props) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Document Verification
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton >
              <ListItemText>
                <Typography sx={{ mb: 1.5 }} >
                  As an added layer of security, we need to verify your identity before approving your application
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton >
              <ListItemText primary="The process consist of the below steps"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Capture Photos of your ID"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Take Selfie"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Submit"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Approve and Verify"/>
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

export default GettingStarted;


