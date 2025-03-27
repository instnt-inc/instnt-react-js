import React from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EnterEmail = (props) => {
  return (
    <FormControl
      component="fieldset"
      className="enter-email-component"
      sx={{
        minWidth: {
          xs: "100%",
          sm: "500px",
        },
      }}
    >
      <FormLabel component="legend">
        <Typography
          variant="h6"
          component="div"
          className="enter-email-component-heading"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Enter Your Email
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          className="enter-email-component-sub-heading"
          component="div"
          color="#000"
          align="left"
        >
          All fields are required.
        </Typography>
      </FormLabel>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <TextField
          required
          id="email"
          type="email"
          variant="filled"
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['email'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage?.email}
          helperText={
            props.errorMessage?.email &&
            props.errorMessage?.email
          }
        />
      </Box>
    </FormControl>
  );
};

export default EnterEmail;
