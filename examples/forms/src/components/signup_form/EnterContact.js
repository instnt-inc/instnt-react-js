import React from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EnterContact = (props) => {
  return (
    <FormControl 
    component="fieldset"
    className="contact-component" 
    sx={{
      minWidth: {
        xs: "100%",
        sm: "500px",
      },
    }}>
      <FormLabel component="legend">
        <Typography
          variant="h6"
          component="div"
          className="contact-component-heading"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          {props.otpVerification ? `OTP Verification is turned on`: `OTP Verification is turned off`}
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          className="contact-component-sub-heading"
          component="div"
          color="#000"
          align="left"
        >
          {props.otpVerification ? `To send an OTP, Please enter a phone number below.`: `To send an OTP, Please enable OTP Verification in your workflow,
          otherwise simply enter a phone number below.`}
        </Typography>
      </FormLabel>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <TextField
          required
          id="mobileNumber"
          type="text"
          variant="filled"
          label="Mobile Number"
          tooltip="Must start with country code"
          value={props.data['mobileNumber'] || ''}
          onChange={props.onChange}
          onBlur={props.mobileNumberOnBlur}
          fullWidth
          sx={{ mb: 2 }}
          error={!!props.errorMessage.mobileNumber}
          helperText={
            props.errorMessage.mobileNumber &&
            props.errorMessage.mobileNumber
          }
        />
      </Box>
    </FormControl>
  );
};

export default EnterContact;
