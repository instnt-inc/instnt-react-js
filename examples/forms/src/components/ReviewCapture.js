import * as React from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import '../App.css';

const ReviewCapture = (props) => {
  let img = document.createElement("IMG");
  img.src = props.captureResult?.result;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Review Captured Image
        </Typography>
        </CardContent>
      <CardMedia
        component="img"
        height="300"
        image={props.captureResult?.result}
        alt="DL front"
      />
      <CardContent>
        
        <Typography variant="body2" color="text.secondary">
          Review your picture and proceed
          Full document image is visible
          Text in the document is clear and readable
          No glare or shadow
        </Typography>
      </CardContent>
      <CardContent>
        <Typography sx={{ mb: 4.5 }} variant="body2" color="text.secondary">
          To retake the picture click Back, to proceed click Next
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ReviewCapture;


