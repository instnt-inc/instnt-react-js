import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import '../App.css';

const ChooseDocument = (props) => {
  return (
  
    <FormControl component="fieldset" sx={{alignItems:"center", width: '100%'}}>
      <FormLabel component="legend">
         <Typography variant="h5" component="div" gutterBottom>
          Choose the document type
        </Typography>
      </FormLabel>
      <Box sx={{ alignItems:"center", justifyContent:"left", width: '75%'}}>
        <FormLabel component="legend">
          <Typography sx={{ mb: 1.5 }} >  
            As an added layer of security, we need to verify your identity before approving your application
          </Typography>
        </FormLabel>
        <RadioGroup
          aria-label="document"
          defaultValue="License"
          name="radio-buttons-group"
          onChange={props.onDocumentTypeChanged}
        >
          <FormControlLabel value="License" control={<Radio />} label="Driver's License or ID card" />
          <FormControlLabel value="PassportBook" control={<Radio />} label="Passport Book" />
          <FormControlLabel value="passportCard" control={<Radio />} label="Passport Card" />
       </RadioGroup>
      </Box>
    </FormControl>
  )
}

export default ChooseDocument;


