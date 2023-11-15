import React from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EnterAddress = (props) => {
  return (
    <FormControl
      component="fieldset"
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
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Enter Your Address Information
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
          id="physicalAddress"
          type="text"
          variant="filled"
          label="Address"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['physicalAddress'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.physicalAddress}
          helperText={
            props.errorMessage.physicalAddress &&
            props.errorMessage.physicalAddress
          }
        />
        <TextField
          required
          id="city"
          type="text"
          variant="filled"
          label="City"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['city'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.city}
          helperText={
            props.errorMessage.city &&
            props.errorMessage.city
          }
        />
        <TextField
          required
          id="state"
          type="text"
          variant="filled"
          label="State"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['state'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.state}
          helperText={
            props.errorMessage.state &&
            props.errorMessage.state
          }
        />

        <TextField
          required
          id="zip"
          type="text"
          variant="filled"
          label="Zip Code"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['zip'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.zip}
          helperText={
            props.errorMessage.zip &&
            props.errorMessage.zip
          }
        />
        <TextField
          required
          id="country"
          type="text"
          variant="filled"
          label="Country"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['country'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.country}
          helperText={
            props.errorMessage.country &&
            props.errorMessage.country
          }
        />
      </Box>
    </FormControl>
  );
};

export default EnterAddress;
