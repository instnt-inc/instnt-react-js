import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import "./styles.css";

const RadioButtonsGroup =({demoOptionChange}) =>{
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Demo Option</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="signup"
        name="radio-buttons-group"
        onChange={(e)=>demoOptionChange(e.target.value)}
      >
        <FormControlLabel value="signup" control={<Radio />} label="Sign Up" />
        <FormControlLabel value="resumeSignup" control={<Radio />} label="Resume Sign Up" />
        <FormControlLabel value="login" control={<Radio />} label="Login" />
      </RadioGroup>
    </FormControl>
  );
}

const GetDemoDescriptionItem =({isSignUp,resumeSignup})=>{
  if(isSignUp){
    return (
      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Collect User Information" />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="If OTP is enabled, it'll text the mobile number to send an OTP, then verifies it." />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Captures photos of the user's driver's license and the user itself via a selfie." />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Allows the user to review and submit the application, then it displays the decision." />
        </ListItem>
      </List>
    )
  }else if(resumeSignup){
    return (
      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Collect Transaction ID to resume signup." />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="This will help to update information for selected transaction id." />
        </ListItem>
      </List>
    )
  }else{
    return (
    <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Collect User Information" />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="If Instnt Verify™ is enable in workflow, It will generate verified_id." />
        </ListItem>
         <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Collect payment information which is one of the use case of verification." />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Allows the user to submit the application for verification, then it displays the decision." />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            <FiberManualRecordIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Above Steps to ensures the system's security and confirm that it is still the same person using the system." />
        </ListItem>
      </List>)
  } 
}

const InputElementDescription=({isSignUp,resumeSignup})=>{
  if(isSignUp){
    return (
      <Typography variant="body2" gutterBottom component="div" align="left">
        Enter your workflow ID and service URL.
      </Typography>
    )
  }else if(resumeSignup){
    return (
      <Typography variant="body2" gutterBottom component="div" align="left">
        Enter your instnt transaction ID.
      </Typography>
    )
  }else{
    return (
      <Typography variant="body2" gutterBottom component="div" align="left">
        Enter your workflow ID and service URL.
      </Typography>
    )
  }
}

const GetInputElement=(props)=>{
  if(props.isSignUp){
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 2, width: "100%" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id='workflowId'
          label="Workflow ID"
          variant="filled"
          value={props.data["workflowId"] || ""}
          onChange={(event) => {
            props.onChange("workflowId", event.target.value);
          }}
        />
        <TextField
          required
          id='serviceURL'
          type='text'
          variant="filled"
          label='Service URL'
          value={props.data['serviceURL'] || ''}
          onChange={(event) => {
            props.onChange('serviceURL', event.target.value)
          }}
        />
        <TextField
          required
          id='idmetricsVersion'
          type='text'
          variant="filled"
          label='Idmetrics framework version'
          value={props.data['idmetricsVersion'] || ''}
          onChange={(event) => {
            props.onChange('idmetricsVersion', event.target.value)
          }}
        />
      </Box>
    )
  }else if(props.resumeSignup){
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 2, width: "100%" },
        }}
        noValidate
        autoComplete="off"
      >
         <TextField
          required
          id='workflowId'
          label="Workflow ID"
          variant="filled"
          value={props.data["workflowId"] || ""}
          onChange={(event) => {
            props.onChange("workflowId", event.target.value);
          }}
        />
        <TextField
          required
          id='serviceURL'
          type='text'
          variant="filled"
          label='Service URL'
          value={props.data['serviceURL'] || ''}
          onChange={(event) => {
            props.onChange('serviceURL', event.target.value)
          }}
        />
        <TextField
          required
          id='instnttxnid'
          label="Transaction ID"
          variant="filled"
          value={props.data["instnttxnid"] || ""}
          onChange={(event) => {
            props.onChange("instnttxnid", event.target.value);
          }}
        />
      </Box>
    )
  }else{
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 2, width: "100%" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id='workflowId'
          label="Workflow ID"
          variant="filled"
          value={props.data["workflowId"] || ""}
          onChange={(event) => {
            props.onChange("workflowId", event.target.value);
          }}
        />
        <TextField
          required
          id='serviceURL'
          type='text'
          variant="filled"
          label='Service URL'
          value={props.data['serviceURL'] || ''}
          onChange={(event) => {
            props.onChange('serviceURL', event.target.value)
          }}
        />
        <TextField
          required
          id='idmetricsVersion'
          type='text'
          variant="filled"
          label='Idmetrics framework version'
          value={props.data['idmetricsVersion'] || ''}
          onChange={(event) => {
            props.onChange('idmetricsVersion', event.target.value)
          }}
        />
         <TextField
          required
          id='instnttxnid'
          label="Transaction ID"
          variant="filled"
          value={props.data["instnttxnid"] || ""}
          onChange={(event) => {
            props.onChange("instnttxnid", event.target.value);
          }}
        />
      </Box>
    )
  }
}

const GetSubmitButton=(props)=>{
  if(props.isSignUp){
    return (
       <div style={{ textAlign: "center" }}>
        <Button
          sx={{ textTransform: "capitalize", m: 2 }}
          variant="contained"
          size="medium"
          align="center"
          onClick={() => {
            props.setConfig(false);
          }}
        >
          Get Started
        </Button>
      </div>
    )
  }else if(props.resumeSignup){
    return (
       <div style={{ textAlign: "center" }}>
        <Button
          sx={{ textTransform: "capitalize", m: 2 }}
          variant="contained"
          size="medium"
          align="center"
          onClick={() => {
            props.setConfig(false);
          }}
        >
          Resume Sign Up
        </Button>
      </div>
    )
  }else{
    return (
       <div style={{ textAlign: "center" }}>
        <Button
          sx={{ textTransform: "capitalize", m: 2 }}
          variant="contained"
          size="medium"
          align="center"
          onClick={() => {
            props.setConfig(false);
          }}
        >
          Get Started
        </Button>
      </div>
    )
  }
} 

const GettingStarted = (props) => {
  return (
    <Box>
      {RadioButtonsGroup({demoOptionChange : props.demoOptionChange})}
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        style={{ fontWeight: 600 }}
        align="left"
      >
        This process consist of the following steps
      </Typography>
     {GetDemoDescriptionItem(props)}
     {InputElementDescription(props)}
     {GetInputElement(props)}
     {GetSubmitButton(props)}
    </Box>
  );
};

export default GettingStarted;
