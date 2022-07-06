import React from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
//import '../styles.css';

const EnterName = (props) => {
  return (
    <FormControl
      sx={{
        minWidth: {
          xs: "100%",
          sm: "500px",
        },
      }}
      component="fieldset"
    >
      <FormLabel component="legend">
        <Typography
          variant="h6"
          // gutterBottom
          component="div"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Enter Your Contact Information
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
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
          id="firstName"
          type="text"
          variant="filled"
          label="First Name"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['firstName'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.firstName}
          helperText={
            props.errorMessage.firstName &&
            props.errorMessage.firstName
          }
        />
        <TextField
          required
          id="surName"
          type="text"
          variant="filled"
          label="Last Name"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['surName'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.surName}
          helperText={
            props.errorMessage.surName &&
            props.errorMessage.surName
          }
        />
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
          error={!!props.errorMessage.email}
          helperText={
            props.errorMessage.email &&
            props.errorMessage.email
          }
        />
      </Box>
    </FormControl>
  );
};

export default EnterName;
