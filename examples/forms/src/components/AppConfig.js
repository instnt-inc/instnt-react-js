import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AppConfig = (props) => {

  return (
    <FormControl component="fieldset" sx={{alignItems:"center", width: '75%'}}>
      <FormLabel component="legend">
        <Typography variant="h5" component="div" gutterBottom>
          Instnt Signup Demo
        </Typography>
      </FormLabel>
      <Box sx={{ alignItems:"center", justifyContent:"center", width: '75%'}}>
        <TextField
          required
          id='serviceURL'
          type='text'
          variant="standard"
          label='Service URL'
          value={props.data['serviceURL'] || ''}
          onChange={props.onChange}
          sx={{ width: '300px' }}
        />
        <TextField  
          required
          id='workflowId'
          type='text'
          variant="standard"
          label='workflow Id'
          value={props.data['workflowId'] || ''}
          onChange={props.onChange}
          sx={{ width: '300px' }}
        />
        <TextField
          required
          id='idmetricsVersion'
          type='text'
          variant="standard"
          label='Idmetrics framework version'
          value={props.data['idmetricsVersion'] || ''}
          onChange={props.onChange}
          sx={{ width: '300px' }}
        />
    </Box>
    </FormControl>
  )
}

export default AppConfig;