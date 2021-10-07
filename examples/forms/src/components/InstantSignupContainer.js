import React from 'react';
import { TextField } from '@material-ui/core';

const InstntSignupContainer = (props) => {

  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          id='email'
          type='email'
          label='Email'
          value={props.data['email'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='firstName'
          type='text'
          label='First Name'
          value={props.data['firstName'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='surName'
          type='text'
          label='Last Name'
          value={props.data['surName'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='mobileNumber'
          type='text'
          label='Mobile Number'
          value={props.data['mobileNumber'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='physicalAddress'
          type='text'
          label='Address'
          value={props.data['physicalAddress'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='zip'
          type='text'
          label='Zip Code'
          value={props.data['zip'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='city'
          type='text'
          label='City'
          value={props.data['city'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='state'
          type='text'
          label='State'
          value={props.data['state'] || ''}
          onChange={props.onChange}
        />
        <TextField
          id='country'
          type='text'
          label='Country'
          value={props.data['country'] || ''}
          onChange={props.onChange}
        />
        <button onClick={props.submitForm}>Submit Form</button>
      </div>
    </React.Fragment>
  )
}

export default InstntSignupContainer;