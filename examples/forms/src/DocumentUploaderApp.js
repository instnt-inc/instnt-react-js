import React, {useState, useRef, useEffect} from 'react';
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
import GettingStarted from './components/GettingStarted';
import ChooseDocument from './components/ChooseDocument';
import ReviewCapture from './components/ReviewCapture';
import ShowDecision from './components/ShowDecision';
import EnterOtpCode from './components/EnterOtpCode';
import EnterName from './components/signup_form/EnterName';
import EnterContact from './components/signup_form/EnterContact';
import EnterAddress from './components/signup_form/EnterAddress';
import ShowProgress from './components/ShowProgress';
import { Grid } from '@mui/material';
import AppConfig from './components/AppConfig';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const defaultMessage = { message: "", type: "info" };

const DocumentUploaderApp = () => {
  const theme = useTheme(darkTheme);
  const [instnt, setInstnt] = useState(null);
  const instntRef = useRef(instnt);
  const [documentType, setDocumentType] = useState("License");
  const [decision, setDecision] = useState({});
  const [data, setData] = useState({});

  const [message, setMessage] = useState(defaultMessage);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(activeStep);

  const [documentSettingsToApply, setDocumentSettingsToApply] = useState({});
  const [documentSettingsApplied, setDocumentSettingsApplied] = useState(null);
  const [captureResult, setCaptureResult] = useState(null);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [otpCode, setOtpCode] = useState(null);
  const [formData, setFormData] = useState({});
  const formDataRef = useRef(formData);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [backDisabled, setBackDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [customDocCaptureSettings, setCustomDocCaptureSettings] = useState(false);
  const [appConfig, setAppConfig] = useState({ 'workflowId': process.env.REACT_APP_FORM_KEY, 'serviceURL': process.env.REACT_APP_SERVICE_URL, 'idmetricsVersion': process.env.REACT_APP_IDMETRICS_VERSION });
  const [workflowId, setWorkflowId] = useState(process.env.REACT_APP_FORM_KEY);
  const [serviceURL, setServiceURL] = useState(process.env.REACT_APP_SERVICE_URL);
  const [idmetricsVersion, setIdMetricsVersion] = useState(process.env.REACT_APP_IDMETRICS_VERSION);
  const [config, setConfig] = useState(true);

  useEffect(() => {
    setDocumentSettingsToApply({
      documentType: "License",
      documentSide: "Front",
      frontFocusThreshold: 30,
      frontGlareThreshold: 2.5,
      frontCaptureAttempts: 4,
      captureMode: "Manual",
      overlayText: "Align ID and Tap <br/> to Capture.",
      overlayTextAuto: "Align ID within box and Hold.",
      overlayColor: "yellow",
      enableFaceDetection: true,
      setManualTimeout: 8,
      backFocusThreshold: 30,
      backGlareThreshold: 2.5,
      backCaptureAttempts: 4,
      isBarcodeDetectedEnabled: false,
      enableLocationDetection: false,
    });
  }, [])

  const [documentVerification, setDocumentVerification] = useState(false);
  const [otpVerification, setOtpVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignupFormElementChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    window.instnt["formData"] = formData;
  };

  const onDocumentTypeChanged = (event) => {
    instnt["documentType"] = event.target.value;
    setDocumentType(event.target.value);
  };

  const onToggleDocCaptureSettings = (newValue) => {
    console.log(newValue)
    setCustomDocCaptureSettings(newValue);
  };

  const restart = (event) => {
    window.location.reload();
  };

  const mobileNumberOnBlur = (event) => {
    window.instnt["formData"]["mobileNumber"] = event.target.value;
  };

  const otpCodeEntered = (event) => {
    window.instnt.verifyOTP(
      window.instnt["formData"].mobileNumber,
      event.target.value
    );
    setOtpCode(event.target.value);
  };

  const formSubmitProcessingMessage = {
    title: "Processing signup request",
    detail: "Please wait while we process your signup request",
  };

  const otpVerifyProcessingMessage = {
    title: "Verifying OTP",
    detail: "Please wait while we verify the OTP",
  };

  const changeDocumentSettings = (key, value) => {
    setDocumentSettingsToApply({
      ...documentSettingsToApply,
      [key]: value
    })
  }

  const frontLicenseSettings = {
    documentType: "License",
    documentSide: "Front",
    frontFocusThreshold: 30,
    frontGlareThreshold: 2.5,
    frontCaptureAttempts: 4,
    captureMode: "Manual",
    overlayText: "Align ID and Tap <br/> to Capture.",
    overlayTextAuto: "Align ID within box and Hold",
    overlayColor: "yellow",
    enableFaceDetection: false,
    setManualTimeout: 8,
    backFocusThreshold: 30,
    backGlareThreshold: 2.5,
    backCaptureAttempts: 4,
    isBarcodeDetectedEnabled: false,
    enableLocationDetection: false,
  };

  const backLicenseSettings = Object.assign({}, documentSettingsToApply);
  backLicenseSettings.documentSide = "Back";

  const selfieSettings = {
    enableFarSelfie: true,
    selfieCaptureAttempt: 4,
    captureMode: "Auto",
    compressionType: "JPEG",
    compressionQuality: "50",
    useBackCamera: false,
    overlayText: "Align Face and Tap button</br> to Capture.",
    overlayTextAuto: "Align Face and Hold",
    overlayColor: "#808080",
    orientationErrorText:
      "Landscape orientation is not supported. Kindly rotate your device to Portrait orientation.",
    enableFaceDetection: true,
    setManualTimeout: 8,
    enableLocationDetection: false,
  };

  const steps = [
    <GettingStarted data={formData} otpVerification={otpVerification} documentVerification={documentVerification} loading={loading} />, //Step 0 == activeStep
    <EnterName data={formData} errorMessage={errorMessage} onChange={onSignupFormElementChange}/>,
    <EnterContact data={formData} errorMessage={errorMessage} onChange={onSignupFormElementChange} mobileNumberOnBlur={mobileNumberOnBlur}/>,
    <EnterAddress data={formData} errorMessage={errorMessage} onChange={onSignupFormElementChange}/>,
    <ShowProgress message={formSubmitProcessingMessage}/>,
    <ShowDecision decision={decision} restart={restart}/>,
  ];

  if (otpVerification) {
    steps.splice(
      3,
      0,
      <EnterOtpCode
        errorMessage={errorMessage}
        setOtpCode={otpCodeEntered}
        onChange={onSignupFormElementChange}
      />, //Step 3
      <ShowProgress message={otpVerifyProcessingMessage} /> //Step 4
    );
  }

  if (documentVerification) {
    steps.splice(
      steps.length - 2,
      0,
    <ChooseDocument customDocCaptureSettings={customDocCaptureSettings} onToggleDocCaptureSettings={onToggleDocCaptureSettings} onDocumentTypeChanged={onDocumentTypeChanged} documentSettingsToApply={documentSettingsToApply} changeDocumentSettings={changeDocumentSettings} />, // step 6
    <InstntDocumentProcessor documentSettings={documentSettingsToApply} />, //DL front
    <ReviewCapture documentSettings={documentSettingsApplied} captureResult={captureResult} />, // step 8
    <InstntDocumentProcessor documentSettings={backLicenseSettings} />, //DL back
    <ReviewCapture documentSettings={documentSettingsApplied} captureResult={captureResult} />, // step 10
    <InstntSelfieProcessor selfieSettings={selfieSettings}/>, //selfie
    <ReviewCapture documentSettings={documentSettingsApplied} captureResult={captureResult} />, // step 12
    );
  }

  const maxSteps = steps.length;

  const handleNext = () => {
    console.log(
      "In handleNext(): activeStepRef.current: " + activeStepRef.current
    );

    console.log('newly added');
    if (activeStepRef.current == 0 && config) {
      setLoading(true);
      setConfig(false);
      return false;
    }

    if (!validateActiveStep(activeStep)) {
      return false;
    }
    if(otpVerification && activeStep === 2) {
      instntRef.current.sendOTP(instntRef.current.formData.mobileNumber);
      //handle next based on otp.sent or otp.error events
      return false;
    }

    if(!documentVerification) {
      if(otpVerification) {
        if(activeStep === 5) {
          instntRef.current.submitData(instntRef.current.formData);
        }
      } else {
        if(activeStep === 3) {
          instntRef.current.submitData(instntRef.current.formData);
        }
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    activeStepRef.current += 1;
    console.log(
      "In handleNext(): Incremented activeStepRef:" + activeStepRef.current
    );
    enableNavigationButtons();
    setMessage({});
    setShowMessageDrawer(false);
  };

  const handleNextOnEventSuccess = () => {
    console.log("In handleNextOnEventSuccess(): " + activeStepRef.current);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    activeStepRef.current += 1;
    console.log(
      "In handleNextOnEventSuccess(): Incremented activeStepRef:" +
        activeStepRef.current
    );

    enableNavigationButtons();
    setMessage({});
    setShowMessageDrawer(false);
  };

  const enableNavigationButtons = () => {
    setBackDisabled(false);
    setNextDisabled(false);
  };

  const handleBack = () => {
    console.log("In handleBack(): " + activeStepRef.current);

    setErrorMessage({});
    if (otpVerification && activeStepRef.current === 5) {
      setActiveStep((prevActiveStep) => prevActiveStep - 2);
      activeStepRef.current -= 2;
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      activeStepRef.current -= 1;
    }
    console.log(
      "In handleBack(): decremented activeStepRef:" + activeStepRef.current
    );

    enableNavigationButtons();
    setMessage({});
    setShowMessageDrawer(false);
  };

  const validateAddress = () => {
    let isError=false;
    if (!formData.physicalAddress || formData.physicalAddress.length < 8) {
      isError = true;
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, physicalAddress: "enter valid address line 1"}
      });
    } 
    if (!formData.city || formData.city.length < 2) {
      isError = true;
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, city: "enter valid city"}
      });
    } 
    if (!formData.state || formData.state.length < 2) {
      isError = true;
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, state: "enter valid state code"}
      });
    } 
    if (!formData.zip || formData.zip.length < 5) {
      isError = true;
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, zip: "enter valid zipcode"}
      });
    } 
    if (!formData.country || formData.country.length < 2) {
      isError = true;
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, country: "enter valid country code"}
      });
    }
    return isError;
  }

  const validateName = () => {
    let isError = false;
    if (!formData.firstName || formData.firstName.length < 2) {
      isError = true;
      setError(true);
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, firstName: "enter valid first name"}
      });
    } 
    if (!formData.surName || formData.surName.length < 2) {
      isError = true;
      setError(true);
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, surName: "enter valid last name"}
      });
    }
    return isError;
  }

  const validateContact = () => {
    let isError=false;
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
      isError = true;
      setError(true);
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, mobileNumber: "enter valid mobilenumber"}
      });
    } 
    if (!formData.email || formData.email.length < 5) {
      isError = true;
      setError(true);
      setErrorMessage(prevErrorMessage => {
        return {...prevErrorMessage, email: "enter valid email address"}
      });
    } 
    return isError;
  }

  const otpValidation = () => {
    let isError=false;
    if (!formData.otpCode || formData.otpCode.length < 5) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, otpCode: "enter valid OTP code" };
      });
    }
    return isError;
  }

  const validateActiveStep = (activeStep) => {
    let isError = false;
    setErrorMessage({});
    switch (activeStep) {
      case 0:
        break;
       case 1:
         isError = validateName();
        break;
      case 2:
        isError=validateContact();
        break;
      case 3:
        if (otpVerification) {
          isError=otpValidation();
        }else {
          isError=validateAddress();
        }
        break;
      case 5:
        isError=validateAddress();
        break;
    }
    if (isError) {
      return false;
    } else {
      setErrorMessage({});
      return true;
    }
  };

  const onEventHandler = (event) => {
    console.log(
      "onEventHandler: activeStepRef.current: " + activeStepRef.current
    );
    console.log("Instnt event: ", event);
    switch (event.type) {
      case "transaction.initiated":
        setInstnt(event.data.instnt);
        instntRef.current = event.data.instnt;
        setDocumentVerification(event.data.instnt.documentVerification);
        setOtpVerification(event.data.instnt.otpVerification);
        setLoading(false);
        break;
      case "document.captured":
        // If necesary capture the setting and results for further review before upload
        console.log(event);
        console.log(
          "Document capture settings applied: " + event.data.documentSettings
            ? event.data.documentSettings
            : event.data.selfieSettings
        );
        setDocumentSettingsApplied(
          event.data.documentSettings
            ? event.data.documentSettings
            : event.data.selfieSettings
        );
        setCaptureResult(event.data.captureResult);
        handleNext();
        break;
      case "document.capture-cancelled":
        // Reset any relevant settings
        handleBack();
        break;
      case "document.uploaded":
        // Trigger docVerification when all uploads are done 
        if(instntRef.current.otpVerification) {
          if (activeStepRef.current >= 12) {
            instntRef.current.verifyDocuments(documentType);
            instntRef.current.submitData(instntRef.current.formData);
            handleNext();
          } 
        } else {
          if (activeStepRef.current >= 10) {
            instntRef.current.verifyDocuments(documentType);
            instntRef.current.submitData(instntRef.current.formData);
            handleNext();
          } 
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
        setMessage({ message: "OTP verified", type: "success" });
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
  };

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
        style={{ minHeight: "80vh", minWidth: "40vh", width: "100%" }}
      >
        <Grid
          item
          xs={8}
          sx={{
            height: "80%",
            justifyContent: "top",
            width: "100%",
            flexGrow: 1,
          }}
        >
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
          {(!config) ?  
            idmetricsVersion ? (
              <InstntSignupProvider formKey={workflowId} onEvent={onEventHandler} serviceURL={serviceURL} idmetrics_version={idmetricsVersion}>
                {steps[activeStep]}
              </InstntSignupProvider>
            ) : (
                <InstntSignupProvider formKey={workflowId} onEvent={onEventHandler} serviceURL={serviceURL}>
              {steps[activeStep]}
              </InstntSignupProvider>
            )
            : (<AppConfig data={appConfig} workflowIdOnChange={setWorkflowId} serviceUrlOnChange={setServiceURL}
              idmetricVersionOnChange={setIdMetricsVersion} />
            )}
        </Grid>
        {!loading && (
          <Grid item xs={8} sx={{ width: '80%', justifyContent: "top"}}>
            <MobileStepper
              variant="text"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={message.type === 'error' || (otpVerification && activeStep === 4) || activeStep >= maxSteps - 2}
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
                <Button size="small" onClick={handleBack} disabled={ activeStep === 0 || (otpVerification && activeStep === 4) || activeStep >= maxSteps - 2}>
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
        )}
    </Grid>
    </Paper>
  );
};

export default DocumentUploaderApp;
