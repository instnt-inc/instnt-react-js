import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import '../App.css';

const GettingStarted = (props) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
Capture ID        </Typography>
        <Typography variant="h5" component="div">
          Capture Photos of your ID        </Typography>
        <br/>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Take Selfie
        </Typography>
        <Typography variant="body2">
          Take Selfie of your face         
        </Typography>
        <br/>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Submit
        </Typography>
        <Typography variant="body2">
Approve and Verify        </Typography>
      </CardContent>
    </Card>
  )
}

export default GettingStarted;


