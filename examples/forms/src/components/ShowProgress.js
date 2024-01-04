import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import '../App.css';

const ShowProgress = (props) => {
  return (
    <>
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div" className='show-progress-title'>
          {props.message.title}
        </Typography>
        <div className='show-progress-detail'>
          {props.message.detail}
        </div>
      </CardContent>
    </Card>
    <Card sx={{ minWidth: 275 }}>
      <CardContent className='show-progress-bar-section'>
      <LinearProgress />
      </CardContent>
    </Card>
    </>
  )
}

export default ShowProgress;


