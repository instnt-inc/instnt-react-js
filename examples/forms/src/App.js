import React from 'react';
import {
  AppBar,
  TextField,
  Tab,
  Tabs,
  Box,
  Typography,
} from '@material-ui/core';

import { InstntCustomSignUp, InstntSignUp } from '@instnt/instnt-react-js';

import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}

function App() {
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState({});

  const submitMyForm = () => {
    window.instnt.submitCustomForm(data);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  return (
    <div className='App'>
      <AppBar position='static'>
        <Tabs value={value} onChange={handleChange}>
          <Tab label='Standard Form' />
          <Tab label='Custom Form' />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <InstntSignUp sandbox
          formId={process.env.REACT_APP_FORM_ID}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant='h2'>Bank of Mars</Typography>
        <InstntCustomSignUp
          sandbox
          formId={process.env.REACT_APP_FORM_ID}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            id='email'
            type='email'
            label='Email'
            value={data['email']}
            onChange={onChange}
          />
          <TextField
            id='firstName'
            type='text'
            label='First Name'
            value={data['firstName']}
            onChange={onChange}
          />
          <TextField
            id='surName'
            type='text'
            label='Last Name'
            value={data['surName']}
            onChange={onChange}
          />
          <TextField
            id='mobileNumber'
            type='text'
            label='Mobile Number'
            value={data['mobileNumber']}
            onChange={onChange}
          />
          <TextField
            id='physicalAddress'
            type='text'
            label='Address'
            value={data['physicalAddress']}
            onChange={onChange}
          />
          <TextField
            id='zip'
            type='text'
            label='Zip Code'
            value={data['zip']}
            onChange={onChange}
          />
          <TextField
            id='city'
            type='text'
            label='City'
            value={data['city']}
            onChange={onChange}
          />
          <TextField
            id='state'
            type='text'
            label='State'
            value={data['state']}
            onChange={onChange}
          />
          <TextField
            id='country'
            type='text'
            label='Country'
            value={data['country']}
            onChange={onChange}
          />
          <button onClick={submitMyForm}>Submit My Form</button>
        </div>
      </TabPanel>
    </div>
  );
}

export default App;
