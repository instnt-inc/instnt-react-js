import React from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const OverviewDetailScreen = (props) => {
  const date = new Date();
  const dateString = date.toLocaleDateString();
  return (
    <FormControl
      component="fieldset"
      className="overview-detail-component"
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
          className="overview-detail-component-heading"
          component="div"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Money Transfer Detail Overview

        </Typography>
      </FormLabel>
      <Box
        sx={{
          mt: 2,
        }}
        style={{ display: 'contents' }}
      >
        <FormControl>
            <Typography className='date-label' variant="h6" gutterBottom>
                Date : 
            </Typography>
            <TextField  id="date" disabled label={dateString} />
        </FormControl>
         <FormControl>
            <Typography className='balance-label' variant="h6" gutterBottom>
                Balance : 
            </Typography>
            <TextField id="balance" disabled label={'100000'} />
        </FormControl>
        <FormControl>
            <Typography className='email-label' variant="h6" gutterBottom>
                Email : 
            </Typography>
            <TextField id="email" disabled label={props.data['email']} />
        </FormControl>
        <FormControl>
            <Typography className='account-number-label' variant="h6" gutterBottom>
                A/C Number : 
            </Typography>
            <TextField id='account-number' disabled label={'XXXX-YYYY-ZZZZ-1234'} />
        </FormControl>
      </Box>
    </FormControl>
  );
};

export default OverviewDetailScreen;
