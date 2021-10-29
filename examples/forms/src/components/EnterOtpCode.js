import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


//import '../App.css';

const EnterOtpCode = (props) => {

  const onBlur = (event) => {
    if(event.target.value === "") {
      //show validTION ERROR
    } else {
      props.setOtpCode(event);
    }
  }

  return (
  
    <FormControl component="fieldset" sx={{alignItems:"center", width: '75%'}}>
      <FormLabel component="legend">
         <Typography variant="h5" component="div" gutterBottom>
          Enter OTP        
        </Typography>
      </FormLabel>
       <Box sx={{ width: '75%', p: 1, my: 0.5, mb: 2.5 }}>
        <FormLabel component="legend">
          <Typography sx={{ mb: 1.5 }} >  
            We sent a one time passcode to your mobile number. 
            <br/>Please enter that here
          </Typography>
        </FormLabel>
        <TextField 
          required 
          id="otpCode" 
          label="OTP Code" 
          variant="standard"
          onChange={props.onChange}
          onBlur={onBlur}
          error={!!props.errorMessage.otpCode}
          helperText={
            props.errorMessage.otpCode &&
            props.errorMessage.otpCode
          }
        />
      </Box>
    </FormControl>
  )
}

export default EnterOtpCode;


