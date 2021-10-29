import React from 'react';
import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const EnterContact = (props) => {

  return (
    <FormControl component="fieldset" sx={{alignItems:"center", width: '75%'}}>
      <FormLabel component="legend">
         <Typography variant="h5" component="div" gutterBottom>
          Enter your contact Information        
        </Typography>
      </FormLabel>
      <Box sx={{ width: '75%', p: 1, my: 0.5, mb: 2.5 }}>
        <TextField
          required
          id='mobileNumber'
          type='text'
          variant="standard"
          label='Mobile Number'
          tooltip="Must start with country code"
          value={props.data['mobileNumber'] || ''}
          onChange={props.onChange}
          onBlur={props.mobileNumberOnBlur}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.mobileNumber}
          helperText={
            props.errorMessage.mobileNumber &&
            props.errorMessage.mobileNumber
          }
        />
        <TextField
          required
          id='email'
          type='email'
          variant="standard"
          label='Email'
          value={props.data['email'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.email}
          helperText={
            props.errorMessage.email &&
            props.errorMessage.email
          }
        />
      </Box>
    </FormControl>
  )
}

export default EnterContact;