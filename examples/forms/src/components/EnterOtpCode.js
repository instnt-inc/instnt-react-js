import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";


const EnterOtpCode = (props) => {
  const onBlur = (event) => {
    if (event.target.value === "") {
      // Nothing to do
    } else {
      props.setOtpCode(event);
    }
  };

  return (
    <FormControl className= 'otp-code-component' component="fieldset" sx={{
      minWidth: {
        xs: "100%",
        sm: "500px",
      },
    }}>
      <FormLabel component="legend">
        <Typography
          variant="h6"
          component="div"
          className="otp-code-component-heading"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Enter OTP
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          component="div"
          className="otp-code-component-sub-heading"
          color="#000"
          align="left"
        >
          We sent a one time passcode to your mobile number. Please enter that
          here
        </Typography>
      </FormLabel>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <TextField
          required
          id="otpCode"
          label="OTP Code"
          variant="filled"
          fullWidth
          sx={{ mb: 2 }}
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
  );
};

export default EnterOtpCode;
