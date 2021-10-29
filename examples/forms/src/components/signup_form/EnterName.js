import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
//import '../styles.css';


const EnterName = (props) => {

  return (
    <FormControl component="fieldset" sx={{alignItems:"center", width: '75%'}}>
      <FormLabel component="legend">
      <Typography variant="h5" component="div" gutterBottom>
        Enter your name          
      </Typography>
      </FormLabel>
      <Box sx={{ alignItems:"center", justifyContent:"center", width: '75%'}}>
        <TextField
          required
          id='firstName'
          type='text'
          variant="standard"
          label='First Name'
          value={props.data['firstName'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.firstName}
          helperText={
            props.errorMessage.firstName &&
            props.errorMessage.firstName
          }
        />
        <TextField  
          required
          id='surName'
          type='text'
          variant="standard"
          label='Last Name'
          value={props.data['surName'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.surName}
          helperText={
            props.errorMessage.surName &&
            props.errorMessage.surName
          }
        />
      </Box>
    </FormControl>
  )
}

export default EnterName;