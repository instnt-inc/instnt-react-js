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
import Nav from './components/Nav';
import UploadDocuments from './components/UploadDocuments';


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
  //const [data, setData] = useState({});

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
  const [captureFrameworkDebug,setCaptureFrameworkDebug]= useState(undefined);
  const [appConfig, setAppConfig] = useState({ 'workflowId': process.env.REACT_APP_FORM_KEY, 'serviceURL': process.env.REACT_APP_SERVICE_URL, 'idmetricsVersion': process.env.REACT_APP_IDMETRICS_VERSION });
  //const [workflowId, setWorkflowId] = useState(process.env.REACT_APP_FORM_KEY);
  // const [serviceURL, setServiceURL] = useState(process.env.REACT_APP_SERVICE_URL);
  // const [idmetricsVersion, setIdMetricsVersion] = useState(process.env.REACT_APP_IDMETRICS_VERSION);
  const [config, setConfig] = useState(true);
  const [documentVerification, setDocumentVerification] = useState(false);
  const [otpVerification, setOtpVerification] = useState(false);
  const documentVerificationRef = useRef(documentVerification);
  const otpVerificationRef = useRef(otpVerification);
  const [loading, setLoading] = useState(false);

  const [frontCapture, setFrontCapture] = useState(null);
  const [backCapture, setBackCapture] = useState(null);
  const [selfieCapture, setSelfieCapture] = useState(null);

  //start camera...
  const [startFront, setStartFront] = useState(false);
  const [startBack, setStartBack] = useState(false);
  const [startSelfie, setStartSelfie] = useState(false);

  
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
  }, []);

  const onSignupFormElementChange = (e) => {
    const _updatedFormData = { ...formData, [e.target.id]: e.target.value };
    instntRef.current = {...instntRef.current ,formData : _updatedFormData};
    setFormData(_updatedFormData);
    if(window.instnt){
      window.instnt["formData"] = formData;
    }
  };

  const onDocumentTypeChanged = (event) => {
    instnt["documentType"] = event.target.value;
    setDocumentType(event.target.value);
  };

  const onToggleDocCaptureSettings = (newValue) => {
    console.log(newValue);
    setCustomDocCaptureSettings(newValue);
  };

  const onToggleCaptureFrameworkDebug = (newValue) =>{
    newValue ?setCaptureFrameworkDebug(1):setCaptureFrameworkDebug(undefined);
  }

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
    if(value==="true" || value==="false") {
      value = JSON.parse(value.toLowerCase());
    }
    setDocumentSettingsToApply({
      ...documentSettingsToApply,
      [key]: value,
    });
  };
  const onChangeStart = (type) => {
    if (type === "front") {
      setStartFront(true);
    } else if (type === "back") {
      setStartBack(true);
    } else if (type === "selfie") {
      setStartSelfie(true);
    }
  };

  // const frontLicenseSettings = {
  //   documentType: "License",
  //   documentSide: "Front",
  //   frontFocusThreshold: 30,
  //   frontGlareThreshold: 2.5,
  //   frontCaptureAttempts: 4,
  //   captureMode: "Manual",
  //   overlayText: "Align ID and Tap <br/> to Capture.",
  //   overlayTextAuto: "Align ID within box and Hold",
  //   overlayColor: "yellow",
  //   enableFaceDetection: false,
  //   setManualTimeout: 8,
  //   backFocusThreshold: 30,
  //   backGlareThreshold: 2.5,
  //   backCaptureAttempts: 4,
  //   isBarcodeDetectedEnabled: false,
  //   enableLocationDetection: false,
  // };

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

  /**ADDING STEPS */
  // Adding steps as per OTP and Document Verification Enable or Not
  const steps = [
    <EnterName // step 0
      data={formData}
      errorMessage={errorMessage}
      onChange={onSignupFormElementChange}
    />,
    <EnterContact // step 1
      data={formData}
      errorMessage={errorMessage}
      onChange={onSignupFormElementChange}
      mobileNumberOnBlur={mobileNumberOnBlur}
      otpVerification={otpVerification}
    />,
    <EnterAddress // step 2
      data={formData}
      errorMessage={errorMessage}
      onChange={onSignupFormElementChange}
    />,
    <ShowProgress message={formSubmitProcessingMessage} />, // step 3
    <ShowDecision decision={decision} restart={restart} />, // step 4
  ];

  if (otpVerification) {
    steps.splice(
      2,
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
      <ChooseDocument
        customDocCaptureSettings={customDocCaptureSettings}
        onToggleDocCaptureSettings={onToggleDocCaptureSettings}
        onDocumentTypeChanged={onDocumentTypeChanged}
        documentSettingsToApply={documentSettingsToApply}
        changeDocumentSettings={changeDocumentSettings}
        captureFrameworkDebug={captureFrameworkDebug}
        onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
      />,
      <UploadDocuments
        frontLicenseSettings={documentSettingsToApply}
        backLicenseSettings={backLicenseSettings}
        selfieSettings={selfieSettings}
        frontCapture={frontCapture}
        backCapture={backCapture}
        selfieCapture={selfieCapture}
        startFront={startFront}
        startBack={startBack}
        startSelfie={startSelfie}
        onChangeStart={onChangeStart}
        captureFrameworkDebug={captureFrameworkDebug}
      />
    );
  }
  /**END OF ADDING STEPS */

  const maxSteps = steps.length;

  const handleNext = () => {
    console.log(
      "In handleNext(): activeStepRef.current: " + activeStepRef.current
    );
    console.log('newly added');
    // if (activeStepRef.current == 0) {
    //   setLoading(false);
    //   return false;
    // }
    if (!validateActiveStep(activeStepRef.current)) {
      return false;
    }
    if (otpVerificationRef.current && activeStepRef.current === 1) {
      instntRef.current.sendOTP(instntRef.current.formData.mobileNumber);
      //handle next based on otp.sent or otp.error events
      return false;
    }
    if (!documentVerificationRef.current) {
      if (otpVerificationRef.current) {
        if (activeStepRef.current === 4) {
          instntRef.current.submitSignupData(instntRef.current.formData);
        }
      } else {
        if (activeStepRef.current === 2) {
          instntRef.current.submitSignupData(instntRef.current.formData);
        }
      }
    } else {
      if(otpVerificationRef.current) {
        if (activeStepRef.current === 6) {
          instntRef.current.verifyDocuments(documentType);
          instntRef.current.submitSignupData(instntRef.current.formData);
        }
      } else if(activeStepRef.current===4) {// when document verification enable and OTP Verification disable
        instntRef.current.verifyDocuments(documentType);
        instntRef.current.submitSignupData(instntRef.current.formData);
      }
    }
    //setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    //setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    if (otpVerificationRef.current && activeStepRef.current === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep - 3);
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
    let isError = false;
    if (!formData.physicalAddress || formData.physicalAddress.length < 8) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          physicalAddress: "enter valid address line 1",
        };
      });
    }
    if (!formData.city || formData.city.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, city: "enter valid city" };
      });
    }
    if (!formData.state || formData.state.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, state: "enter valid state code" };
      });
    }
    if (!formData.zip || formData.zip.length < 5) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, zip: "enter valid zipcode" };
      });
    }
    if (!formData.country || formData.country.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, country: "enter valid country code" };
      });
    }
    return isError;
  };

  const validateName = () => {
    let isError = false;
    if (!formData.firstName || formData.firstName.length < 2) {
      isError = true;
      setError(true);
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, firstName: "enter valid first name" };
      });
    }
    if (!formData.surName || formData.surName.length < 2) {
      isError = true;
      setError(true);
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, surName: "enter valid last name" };
      });
    }
    if (!formData.email || formData.email.length < 5) {
      isError = true;
      setError(true);
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, email: "enter valid email address" };
      });
    }
    return isError;
  };

  const validateContact = () => {
    let isError = false;
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
      isError = true;
      setError(true);
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          mobileNumber: "enter valid mobile number",
        };
      });
    }
    return isError;
  };

  const otpValidation = () => {
    let isError = false;
    if (!formData.otpCode || formData.otpCode.length < 5) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, otpCode: "enter valid OTP code" };
      });
    }
    return isError;
  };

  const validateActiveStep = (activeStep) => {
    let isError = false;
    setErrorMessage({});
    switch (activeStep) {
      // case 0:
      //   break;
      case 0:
        isError = validateName();
        break;
      case 1:
        isError = validateContact();
        break;
      case 2:
        if (otpVerificationRef.current) {
          isError = otpValidation();
        } else {
          isError = validateAddress();
        }
        break;
      case 4:
        isError = validateAddress();
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
    const eventType = event?.type ? event.type : event.event_type;
    const eventData = event?.data ? event.data : event.event_data;
    switch (eventType) {
      case "transaction.initiated":
        setInstnt(eventData.instnt);
        instntRef.current = eventData.instnt;
        setDocumentVerification(eventData.instnt.documentVerification);
        documentVerificationRef.current = eventData.instnt.documentVerification;
        setOtpVerification(eventData.instnt.otpVerification);
        otpVerificationRef.current = eventData.instnt.otpVerification;
        setLoading(false);
        break;
      case "document.captured":
        // If necesary capture the setting and results for further review before upload
        console.log(event);
        console.log(
          "Document capture settings applied: " + eventData.documentSettings
            ? eventData.documentSettings
            : eventData.selfieSettings
        );
        setDocumentSettingsApplied(
          eventData.documentSettings
            ? eventData.documentSettings
            : eventData.selfieSettings
        );
        setCaptureResult(eventData.captureResult);
        if ("documentSettings" in eventData) {
          if (eventData.documentSettings._documentSide === "Front") {
            setFrontCapture(eventData.captureResult);
          } else {
            setBackCapture(eventData.captureResult);
          }
        } else {
          setSelfieCapture(eventData.captureResult);
        }
        // setFrontCapture(eventData.captureResult);
        // setBackCapture(eventData.captureResult);
        // setSelfieCapture(eventData.captureResult)
        // handleNext();
        setStartFront(false);
        setStartBack(false);
        setStartSelfie(false);
        break;
      case 'document.capture-cancelled':
        // Reset any relevant settings
        // handleBack();
        setStartFront(false);
        setStartBack(false);
        setStartSelfie(false);
        console.log(
            'document.capture-cancelled: ' + eventData?.error.errorType,
        )
        break;
      case 'document.capture-onEvent':
        console.log(
            'document.capture-onEvent: ' +
              eventData.statusCode +
              ', ' +
              eventData.statusCodeMessage,
        );
        setMessage({ message: eventData.statusCodeMessage, type: 'warning' });
        setShowMessageDrawer(true);
        break;
      case "document.uploaded":
        //Trigger docVerification when all uploads are done
        // if (instntRef.current.otpVerification) {
        //   if (activeStepRef.current >= 12) {
        //     instntRef.current.verifyDocuments(documentType);
        //     instntRef.current.submitSignupData(instntRef.current.formData);
        //     handleNext();
        //   }else if(activeStepRef.current >=7){
        //     handleNext();
        //   }
        // } else {
        //   if (activeStepRef.current >= 7) {
        //     instntRef.current.verifyDocuments(documentType);
        //     instntRef.current.submitSignupData(instntRef.current.formData);
        //     handleNext();
        //   }
        // }
         break;
      case "transaction.processed":
        setDecision(eventData.decision);
        handleNext();
        break;
      case "otp.sent":
        handleNextOnEventSuccess();
        break;
      case "otp.verified":
        handleNextOnEventSuccess();
        setMessage({ message: "OTP verified", type: "success" });
        setShowMessageDrawer(true);
        //handleNext();
        break;
      case "otp.error":
        setMessage(eventData);
        setShowMessageDrawer(true);
        handleBack();
        break;
      
      // case ".error":
      // case event.type.match(/.error/g):
      case 'transaction.error':
        setMessage({ message: eventData.errorMessage, type: 'error'});
        setShowMessageDrawer(true);
        break;
      default:
        console.log("unhandled instnt event ", event);
    }
  };

  const handleClose = (event) => {
    setShowMessageDrawer(false);
  };

  const onChangeAppConfig = (key, value) => {
    setAppConfig({
      ...appConfig,
      [key]: value
    })
  }
  

  return (
    <div>
      <Nav />
      {config ? (<GettingStarted data={appConfig} onChange={onChangeAppConfig} setConfig={setConfig} />) : (
        <Paper sx={{ py: 1, px: 2 }}>      
        {/* <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "40vh", minWidth: "40vh", width: "100%" }}
      > */}
        {/* <Grid
          item
          xs={8}
          sx={{
            height: "80%",
            justifyContent: "top",
            width: "100%",
            flexGrow: 1,
          }}
        > */}
        <Snackbar
          style={{ position: "relative", top: "20px", zIndex: 99999999 }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={showMessageDrawer}
          autoHideDuration={6000000}
          onClose={()=>handleClose()}
        >
          <Alert
            onClose={()=>handleClose()}
            severity={message.type}
            sx={{ width: "80%" }}
          >
            {message.message}
          </Alert>
        </Snackbar>
        {appConfig.idmetrics_version ? (
          <InstntSignupProvider
            formKey={appConfig.workflowId}
            onEvent={(event)=>onEventHandler(event)}
            serviceURL={appConfig.serviceURL}
            idmetrics_version={appConfig.idmetrics_version}
          >
            {steps[activeStepRef.current]}
          </InstntSignupProvider>
        ) : (
          <InstntSignupProvider
            formKey={appConfig.workflowId}
            onEvent={(event)=>onEventHandler(event)}
            serviceURL={appConfig.serviceURL}
          >
            {steps[activeStepRef.current]}
          </InstntSignupProvider>
        )}
        {/* </Grid> */}
        <Grid>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStepRef.current}
            nextButton={
              <Button
                variant="contained"
                size="medium"
                onClick={()=>handleNext()}
                disabled={
                  ((documentVerificationRef.current && otpVerificationRef.current && activeStepRef.current===6)&&(!frontCapture || !backCapture || !selfieCapture)) ||
                  ((documentVerificationRef.current && !otpVerificationRef.current && activeStepRef.current===4)&&(!frontCapture || !backCapture || !selfieCapture)) ||
                  message.type === "error" ||
                  (otpVerificationRef.current && activeStepRef.current === 3) ||
                  activeStepRef.current >= maxSteps - 2
                }
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                variant="contained"
                size="medium"
                onClick={()=>handleBack()}
                disabled={
                  activeStepRef.current === 0 ||
                  (otpVerificationRef.current && activeStepRef.current === 3) ||
                  activeStepRef.current >= maxSteps - 2
                }
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Grid>
        {/* </Grid> */}
      </Paper>
      )}
    </div>
  );
};

export default DocumentUploaderApp;
