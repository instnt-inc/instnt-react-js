import * as React from "react";
import { Card, CardContent, CardMedia } from "@mui/material";
import Typography from "@mui/material/Typography";
import "../App.css";
import "./styles.css"

const ReviewCapture = (props) => {
  let img = document.createElement("IMG");
  img.src = props.captureResult?.result;
  console.log(props);

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
          Review your picture and proceed Full document image is visible Text in
          the document is clear and readable No glare or shadow
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          To retake the picture click Back, to proceed click Next
        </Typography>
      </CardContent>
      <CardContent>
        <Typography component={'span'} variant="body2" color="text.secondary"align="left">
          <p style={{color: '#00008b'}}>Settings applied to capture this document:</p>
          <div className="review-capture-settings">
            {Object.keys(props.documentSettings).map((key, i) => (
              <p key={i}>
                <span style={{color:'#000', wordWrap: 'break-word'}}>{key.split('_')[1]} : </span>
                <span>{JSON.stringify(props.documentSettings[key])}</span>
              </p>
            ))}
          </div>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCapture;
