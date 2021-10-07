import * as React from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import '../App.css';

const ReviewCapture = (props) => {
  let img = document.createElement("IMG");
  img.src = props.captureResult?.result;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardMedia
        component="img"
        height="194"
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
    </Card>
  )
}

export default ReviewCapture;


