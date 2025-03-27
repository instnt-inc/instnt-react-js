import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { InstntVerifiableCredentialInvitation } from "@instnt/instnt-react-js";
import '../App.css';

const ShowDecision = (props) => {
  return (
    <>
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5"  className="decision-component-heading" component="div">
          Decision
        </Typography>
        <div className='decision-component-result'>
          {props.decision}
        </div>

      </CardContent>
    </Card>
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        
        <button className="decision-component-button" onClick={props.restart}>Restart</button>
      </CardContent>
    </Card>
    {props.isMultipassEnable && props.decision === 'ACCEPT' && (
      <Card sx={{minWidth: 300}}>
        <InstntVerifiableCredentialInvitation
        invitationType="issuer"
        action={'signup'}
        transactionId={props.localTransactionId}
        customText={'Download your verifiable credential to your wallet'}
      />
      </Card>
    )}
    </>
  )
}

export default ShowDecision;


