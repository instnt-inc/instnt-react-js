import React from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EnterBalanceTransferDetail = (props) => {
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
          Send Money - Balance Transfer
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
          error={!!props.errorMessage?.firstName}
          helperText={
            props.errorMessage?.firstName &&
            props.errorMessage?.firstName
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
          error={!!props.errorMessage?.surName}
          helperText={
            props.errorMessage?.surName &&
            props.errorMessage?.surName
          }
        />
        <TextField
          required
          id="amount"
          type="text"
          variant="filled"
          label="Amount"
          fullWidth
          sx={{ mb: 2 }}
          value={props.data['amount'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage?.amount}
          helperText={
            props.errorMessage?.amount &&
            props.errorMessage?.amount
          }
        />
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
          error={!!props.errorMessage?.mobileNumber}
          helperText={
            props.errorMessage?.mobileNumber &&
            props.errorMessage?.mobileNumber
          }
        />
       <TextField
          required
          id="notes"
          type="text"
          variant="filled"
          label="Notes"
          value={props.data['notes'] || ''}
          onChange={props.onChange}
          onBlur={props.notesOnBlur}
          fullWidth
          sx={{ mb: 2 }}
          error={!!props.errorMessage?.notes}
          helperText={
            props.errorMessage?.notes &&
            props.errorMessage?.notes
          }
        />
      </Box>
    </FormControl>
  );
};

export default EnterBalanceTransferDetail;
