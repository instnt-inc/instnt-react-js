import React from "react";
import { InstntVerifiableCredentialInvitation } from "@instnt/instnt-react-js";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const EnterName = (props) => {
  return (
    <div className="enter-name-component">
      <FormControl
      sx={{
        minWidth: {
          xs: "100%",
          sm: "500px",
        },
      }}
      className="name-component"
      component="fieldset"
      >
      <FormLabel component="legend">
        <Typography
          variant="h6"
          component="div"
          className="name-component-heading"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Enter Your Contact Information
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          className="name-component-sub-heading"
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
        <TextField
          required
          id="nationalId"
          type="text"
          variant="filled"
          label="National ID"
          fullWidth
          sx={{ mb: 2 }}
          placeholder="111-11-1111"
          value={props.data['nationalId'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.nationalId}
          helperText={props.errorMessage.nationalId ? props.errorMessage.nationalId : "National ID should be only number separated with hyphen(-). for ex: XXX-XX-XXXX"}
        />
        <TextField
          required
          id="dob"
          type="text"
          variant="filled"
          label="Date Of Birth"
          fullWidth
          sx={{ mb: 2 }}
          placeholder="YYYY-MM-DD"
          value={props.data['dob'] || ''}
          onChange={props.onChange}
          error={!!props.errorMessage.dob}
          helperText={props.errorMessage.dob ? props.errorMessage.dob : 'Date should be in past date format YYYY-MM-DD'}
        />
      </Box>
      </FormControl>
      {props.isMultipassEnable && (
      <InstntVerifiableCredentialInvitation
        invitationType="verifier"
        action={'signup'}
        transactionId={props.localTransactionId}
        customText={'Scan with your wallet to signup with your verifiable credential'}
      />
      )}
    </div>
  );
};

export default EnterName;
