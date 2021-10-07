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
import DocumentUploaderApp from './DocumentUploaderApp';
import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}

function App() {
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState({});
  const [apiResponse, setApiResponse] = React.useState('');

  const submitFormHelperFunction = () => {
    // 'data' contains user data fields
    // submitCustomForm() function adds system information, submits to the API and redirects user to pre-configured URL
    window.instnt.submitCustomForm(data);
  };

  const onResponse = (error, data) => {
    setApiResponse(error || `Decision: ${data['decision']}`)
  }

  const submitFormViaAPI = () => {
    // 'data' contains user data fields
    // We need to get system information using window.instnt.getToken() and send it along with data using 'instnt_token' key
    const token = window.instnt.getToken();
    const dataWithToken = { ...data, instnt_token: token };

    fetch('https://sandbox-api.instnt.org/public/submitformdata/v1.0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithToken),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setApiResponse(JSON.stringify(data,' ',2))
      });
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
          <Tab label='Document Uploader' />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <InstntSignUp sandbox formId={process.env.REACT_APP_FORM_ID} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant='h2'>Bank of Mars</Typography>
        <InstntCustomSignUp sandbox formId={process.env.REACT_APP_FORM_ID} redirect={false} onResponse={onResponse} serviceURL="https://dev2-api.instnt.org/" />
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
          <button onClick={submitFormHelperFunction}>
            Submit Form using Helper Function
          </button>
          <button onClick={submitFormViaAPI}>Submit Form via API</button>
          <div>{apiResponse}</div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DocumentUploaderApp/>
      </TabPanel>
    </div>
  );
}

export default App;
