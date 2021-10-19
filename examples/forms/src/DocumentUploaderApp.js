import React, {useState, useRef} from 'react';
import Box from '@mui/material/Box';
import { useTheme, createTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import './App.css';
import { InstntSignupProvider, InstntImageProcessor } from '@instnt/instnt-react-js';
import GettingStarted from './components/GettingStarted';
import ChooseDocument from './components/ChooseDocument';
import ReviewCapture from './components/ReviewCapture';
import InstntSignupContainer from './components/InstantSignupContainer';
import ShowDecision from './components/ShowDecision';

const sandbox = process.env.REACT_APP_SANDBOX || false
const LIVE_SERVICE_URL = 'https://api.instnt.org';
const SANDBOX_SERVICE_URL = 'https://sandbox-api.instnt.org';

const formKey = process.env.REACT_APP_FORM_KEY || "v879876100000";
const serviceURL = process.env.REACT_APP_SERVICE_URL || (sandbox ? SANDBOX_SERVICE_URL : LIVE_SERVICE_URL);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const defaultMessage = {text: '', type: 'info'}

const DocumentUploaderApp = () => {
  const theme = useTheme(darkTheme);
  const [instnt, setInstnt] = useState(null);
  const instntRef = useRef(instnt);
  const [documentType, setDocumentType] = useState('License');
  const [showSpinner, setShowSpinner] = useState(false);
  const [decision, setDecision] = useState({});
  const [data, setData] = useState({});

  const [message, setMessage] = useState(defaultMessage);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(activeStep);

  const [documentSettings, setDocumentSettings] = useState(null);
  const [captureResult, setCaptureResult] = useState(null);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);


  const submitForm = () => {
    // 'data' contains user data fields
    // submitCustomForm() function adds system information, submits to the API and redirects user to pre-configured URL
    setShowSpinner(true);
    instnt.submitData(data);
  };

  const onSignupFormElementChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const instnt_signup_props = {
    data: data,
    onChange: onSignupFormElementChange,
    submitForm,
  }

  const onDocumentTypeChanged = (event) => {
    instnt['documentType'] =event.target.value; 
    setDocumentType(event.target.value);
  }

  const steps = [
    <GettingStarted />,
    <ChooseDocument onDocumentTypeChanged={onDocumentTypeChanged} />,
    <InstntImageProcessor documentType="License" documentSide="Front" />, //DL front
    <ReviewCapture documentSettings={documentSettings} captureResult={captureResult} />,
    <InstntImageProcessor documentType="License" documentSide="Back" />, //DL back
    <ReviewCapture documentSettings={documentSettings} captureResult={captureResult} />,
    <InstntImageProcessor documentType="License" />, //selfie
    <ReviewCapture documentSettings={documentSettings} captureResult={captureResult} />,
    <InstntSignupContainer {...instnt_signup_props} />,
    <ShowDecision data={decision} error={message.text} />,
  ];

  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    activeStepRef.current += 1;
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    activeStepRef.current -= 1;
  };

  const onEventHandler = (event) => {
    console.log("Instnt event: ", event);
    switch (event.type) {
      case "init":
        setInstnt(event.data.instnt);
        instntRef.current = event.data.instnt;
        break;
      case "image_captured":
        // If necesary capture the setting and results for further review before upload
        setDocumentSettings(event.data.documentSettings);
        setCaptureResult(event.data.captureResult);
        handleNext();
        break;
      case "capture_aborted":
        // Reset any relevant settings
        handleBack();
        break;
      case "attachment_uploaded":
        // Trigger docVerification when all uploads are done (assumping no instntForm used)
        if (activeStepRef.current >= 7) {
          instntRef.current.verifyDocuments(documentType);
        } 
        break;
      case "doc-verify-initiated":
        break;
      case "documents_verified":
        break;
      case "transaction_processed":
        setShowSpinner(false);
        setDecision(event.data);
        handleNext();
        break;
      case "instnt_error":
        setMessage(event.message);
        setShowMessageDrawer(true);
        break;
      default:
        console.log("unhandled instnt event ", event);
    }
  }

  const handleClose = (event) => {
    setShowMessageDrawer(false);
  };

  return (
    <div className="App">
      <Box sx={{ height: '100%', justifyContent: "top", width: '100%', minHeight: 750, flexGrow: 1 }}>
        <Snackbar style={{ position: "relative", top: "20px" }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={showMessageDrawer}
          autoHideDuration={6000000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={message.type} sx={{ width: '80%' }}>
            {message.text}
          </Alert>
        </Snackbar>
        <Box justifyContent="center" sx={{ height: '100%', justifyContent: "center", width: '100%', minHeight: 700, p: 2 }}>
          <InstntSignupProvider formKey={formKey} sandbox={sandbox} onEvent={onEventHandler} serviceURL={serviceURL}>
            {steps[activeStep]}
          </InstntSignupProvider>
        </Box>
        {showSpinner ? <CircularProgress /> : null}
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
            {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={message.type === 'error' || activeStep === 0 || activeStep === maxSteps - 1}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            Back
          </Button>
          }
        />
      </Box>
    </div>
  );
}

export default DocumentUploaderApp;
