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
import "./styles.css";

const GettingStarted = (props) => {
  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        component="div"
        style={{ fontWeight: 600 }}
        align="left"
      >
        This process consist of the following steps
      </Typography>
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
      <Typography variant="body2" gutterBottom component="div" align="left">
        Enter your workflow ID and service URL.
      </Typography>

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
    </Box>
  );
};

export default GettingStarted;
