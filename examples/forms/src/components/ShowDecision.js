import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import '../App.css';

const ShowDecision = (props) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Decision
        </Typography>
        <div>
          {props.data? props.data.decision: null}
        </div>

        <div>
          {props.error? props.error: null}        
        </div>
      </CardContent>
    </Card>
  )
}

export default ShowDecision;


