import React, {useState, useRef} from 'react';
import Paper from '@mui/material/Paper';
import { useTheme, createTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import './App.css';
import { InstntSignupProvider, InstntDocumentProcessor, InstntSelfieProcessor } from '@instnt/instnt-react-js';
import ReviewCapture from './components/ReviewCapture';
import { Grid } from '@mui/material';

const sandbox = (process.env.REACT_APP_SANDBOX === true);
const LIVE_SERVICE_URL = 'https://api.instnt.org';
const SANDBOX_SERVICE_URL = 'https://sandbox-api.instnt.org';

let formKey = process.env.REACT_APP_FORM_KEY || "v879876100000";

const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('workflow_id')) {
  formKey = urlParams.get('workflow_id');
}

let idmetrics_version = "4.5.12";

if (urlParams.has('idmetrics_version')) {
  idmetrics_version = urlParams.get('idmetrics_version');
}

const serviceURL = process.env.REACT_APP_SERVICE_URL || (sandbox ? SANDBOX_SERVICE_URL : LIVE_SERVICE_URL);
console.log("serviceURL: " + serviceURL);
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const defaultMessage = {message: '', type: 'info'}

const SingleDocumentApp = () => {
  const theme = useTheme(darkTheme);
  const [instnt, setInstnt] = useState(null);
  const instntRef = useRef(instnt);
  const [documentType, setDocumentType] = useState('License');
  const [decision, setDecision] = useState({});

  const [message, setMessage] = useState(defaultMessage);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(activeStep);

  const [documentSettingsApplied, setDocumentSettingsApplied] = useState(null);
  const [captureResult, setCaptureResult] = useState(null);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [formData, setFormData] = useState({});
  const formDataRef = useRef(formData);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [backDisabled, setBackDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  const frontLicenseSettings = {
    documentType: "License",
    documentSide: "Front",
    frontFocusThreshold: 30,
    frontGlareThreshold: 2.5,
    frontCaptureAttempts: 4,
    captureMode: "Manual",
    overlayTextManual: "Align ID and Tap <br/> to Capture.",
    overlayTextAuto: "Align ID within box and Hold",
    overlayColor: "yellow",
    enableFaceDetection: false,
    setManualTimeout: 8,
    backFocusThreshold: 30,
    backGlareThreshold: 2.5,
    backCaptureAttempts: 4,
    isBarcodeDetectedEnabled: false,
    enableLocationDetection: false
  }

  const steps = [
    <InstntDocumentProcessor documentSettings={frontLicenseSettings} />,
    <ReviewCapture
      documentSettings={documentSettingsApplied}
      captureResult={captureResult}
    />,
  ];

  const maxSteps = steps.length;

  const handleNext = () => {
    console.log("In handleNext(): activeStepRef.current: " +activeStepRef.current);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    activeStepRef.current += 1;
    console.log("In handleNext(): Incremented activeStepRef:" + activeStepRef.current);
    enableNavigationButtons();
    setMessage({});
    setShowMessageDrawer(false);
  };

  const handleNextOnEventSuccess = () => {
    console.log("In handleNextOnEventSuccess(): " +activeStepRef.current);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    activeStepRef.current += 1;
    console.log("In handleNextOnEventSuccess(): Incremented activeStepRef:" + activeStepRef.current);

    enableNavigationButtons();
    setMessage({});
    setShowMessageDrawer(false);
  }

  const enableNavigationButtons = () => {
    setBackDisabled(false);
    setNextDisabled(false);
  }

  const handleBack = () => {
    console.log("In handleBack(): " + activeStepRef.current);
    setErrorMessage({});
    console.log("In handleBack(): decremented activeStepRef:" + activeStepRef.current);
    enableNavigationButtons();
    setMessage({});
    setShowMessageDrawer(false);
  };


  const onEventHandler = (event) => {
    console.log("onEventHandler: activeStepRef.current: " + activeStepRef.current);
    console.log("Instnt event: ", event);
    switch (event.type) {
      case "transaction.initiated":
        setInstnt(event.data.instnt);
        instntRef.current = event.data.instnt;
        break;
      case "document.captured":
        // If necesary capture the setting and results for further review before upload
        console.log("Document capture settings applied: " + event.data.documentSettings);
        setDocumentSettingsApplied(event.data.documentSettings);
        setCaptureResult(event.data.captureResult);
        handleNext();
        break;
      case "document.capture-cancelled":
        // Reset any relevant settings
        handleBack();
        break;
      case "document.uploaded":
        // Trigger docVerification when all uploads are done 
        if (activeStepRef.current >= 12) {
          instntRef.current.verifyDocuments(documentType);
          instntRef.current.submitData(instntRef.current.formData);
          handleNext();
        } 
        break;
      case "transaction.processed":
        setDecision(event.data.decision);
        handleNext();
        break;
      case "otp.sent":
        handleNextOnEventSuccess();
        break;
      case "otp.verified":
        handleNextOnEventSuccess();
        setMessage({ message: 'OTP verified', type: "success" });
        setShowMessageDrawer(true);
        break;
      case ".error":
      case event.type.match(/.error/)?.input:
        setMessage(event.data);
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
    <Paper>
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '40vh' , minWidth: '40vh', width: '100%' }}
    >
      <Grid item xs={8} sx={{ height: '80%', justifyContent: "top", width: '100%', flexGrow: 1 }}>
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
            {message.message}
          </Alert>
          </Snackbar>
          {idmetrics_version ? (
            <InstntSignupProvider formKey={formKey} sandbox={sandbox} onEvent={onEventHandler}
              serviceURL={serviceURL} idmetrics_version={idmetrics_version}>
              {steps[activeStep]}
            </InstntSignupProvider>
          ) : (
            <InstntSignupProvider formKey={formKey} sandbox={sandbox} onEvent={onEventHandler}
              serviceURL={serviceURL}>
            {steps[activeStep]}
            </InstntSignupProvider>
          )}
        </Grid>
        <Grid item xs={8} sx={{ width: '80%', justifyContent: "top"}} >
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
            //   disabled={message.type === 'error' || activeStep === 4 || activeStep >= maxSteps - 2}
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
            <Button size="small" onClick={handleBack} disabled={ activeStep === 0 || activeStep === 4 || activeStep >= maxSteps - 2}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            Back
          </Button>
          }
        />
        </Grid>
    </Grid>
    </Paper>
  );
}

export default SingleDocumentApp;
