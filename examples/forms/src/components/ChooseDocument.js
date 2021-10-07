import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import '../App.css';

const ChooseDocument = (props) => {
  return (
  
    <FormControl component="fieldset">
      <FormLabel component="legend">Choose Your Document</FormLabel>
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
    </FormControl>
  )
}

export default ChooseDocument;


