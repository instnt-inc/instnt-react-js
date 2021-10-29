import React from 'react';
import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const EnterAddress = (props) => {

  return (
     <FormControl component="fieldset" sx={{alignItems:"center", width: '300px'}}>
      <FormLabel component="legend">
      <Typography variant="h5" component="div" gutterBottom>
        Enter your address          
      </Typography>
      </FormLabel>
      <Box sx={{ alignItems:"center", justifyContent:"center", width: '75%'}}>
        <TextField
          required
          id='physicalAddress'
          type='text'
          variant="standard"
          label='Address'
          value={props.data['physicalAddress'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.physicalAddress}
          helperText={
            props.errorMessage.physicalAddress &&
            props.errorMessage.physicalAddress
          }
        />
        <TextField
          required
          id='city'
          type='text'
          variant="standard"
          label='City'
          value={props.data['city'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.city}
          helperText={
            props.errorMessage.city &&
            props.errorMessage.city
          }
        />
        <TextField
          required
          id='state'
          type='text'
          variant="standard"
          label='State'
          value={props.data['state'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.state}
          helperText={
            props.errorMessage.state &&
            props.errorMessage.state
          }
        />
        <TextField
          required
          id='zip'
          type='text'
          variant="standard"
          label='Zip Code'
          value={props.data['zip'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.zip}
          helperText={
            props.errorMessage.zip &&
            props.errorMessage.zip
          }
        />
        <TextField
          required
          id='country'
          type='text'
          variant="standard"
          label='Country'
          value={props.data['country'] || ''}
          onChange={props.onChange}
          sx={{ width: '200px' }}
          error={!!props.errorMessage.country}
          helperText={
            props.errorMessage.country &&
            props.errorMessage.country
          }
        />
      </Box>
    </FormControl>
  )
}

export default EnterAddress;