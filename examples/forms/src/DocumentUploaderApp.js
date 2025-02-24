import React, {useState, useRef, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import { useTheme, createTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/joy/CircularProgress';
import { InstntSignupProvider, InstntVerifyProvider, logMessage} from '@instnt/instnt-react-js';
import GettingStarted from './components/GettingStarted';
import ChooseDocument from './components/ChooseDocument';
import ShowDecision from './components/ShowDecision';
import EnterOtpCode from './components/EnterOtpCode';
import EnterName from './components/signup_form/EnterName';
import EnterContact from './components/signup_form/EnterContact';
import EnterAddress from './components/signup_form/EnterAddress';
import ShowProgress from './components/ShowProgress';
import { Grid } from '@mui/material';
import Nav from './components/Nav';
import UploadDocuments from './components/UploadDocuments';
import EnterEmail from './components/verify_form/EnterEmail';
import EnterBalanceTransferDetail from './components/verify_form/EnterBalanceTransferDetail';
import OverviewDetailScreen from './components/verify_form/OverviewDetailScreen';
import LoginScreen from './components/login_form/loginScreen';
import './App.css';


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
  const [message, setMessage] = useState(defaultMessage);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(activeStep);
  const [documentSettingsToApply, setDocumentSettingsToApply] = useState({});
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [customDocCaptureSettings, setCustomDocCaptureSettings] = useState(false);
  const [captureFrameworkDebug,setCaptureFrameworkDebug]= useState(undefined);
  const [appConfig, setAppConfig] = useState({ 'workflowId': process.env.REACT_APP_FORM_KEY, 'serviceURL': process.env.REACT_APP_SERVICE_URL, 'idmetricsVersion': process.env.REACT_APP_IDMETRICS_VERSION,'instnttxnid':'' });
  const [config, setConfig] = useState(true);
  const [documentVerification, setDocumentVerification] = useState(false);
  const [otpVerification, setOtpVerification] = useState(false);
  const documentVerificationRef = useRef(documentVerification);
  const otpVerificationRef = useRef(otpVerification);
  const [frontCapture, setFrontCapture] = useState(null);
  const [backCapture, setBackCapture] = useState(null);
  const [selfieCapture, setSelfieCapture] = useState(null);

  //start camera...
  const [startFront, setStartFront] = useState(false);
  const [startBack, setStartBack] = useState(false);
  const [startSelfie, setStartSelfie] = useState(false);

  //Login

  const [isLogin, setIsLogin] = useState(false);

  //Verfiy Document

  const [isSignUp,setIsSignUp]= useState(true);
  const [instntTxnId,setInstntTxnId]= useState('');
  const [verifyFormData, setVerifyFormData] = useState({});

  //Resume Signup

  const [resumeSignup, setResumeSignup] = useState(false);

  //Verify 

  const [isVerify,setIsVerify]= useState(false);

  // Multipass

  const [isMultipassEnable, setIsMultipassEnable] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState('');

  
  useEffect(() => {
    setDocumentSettingsToApply({
      documentType: "License",
      documentSide: "Front",
      //frontFocusThreshold: 30,
      frontFocusThreshold: 27,
      //frontGlareThreshold: 2.5,
      frontGlareThreshold: 8,
      frontCaptureAttempts: 4,
      captureMode: "Manual",
      orientationCaptureMode: "Any",
      loadingScreenPrimaryText: "Camera is initializing",
      loadingScreenNoticeText: "Rotating device will reset progress",
      overlayText: "Align ID and Tap <br/> to Capture.",
      overlayTextAuto: "Align ID within box and Hold.",
      overlayColor: "yellow",
      enableFaceDetection: true,
      //setManualTimeout: 8,
      setManualTimeout: 15,
      //backFocusThreshold: 30,
      backFocusThreshold: 34,
      //backGlareThreshold: 2.5,
      backGlareThreshold: 10,
      backCaptureAttempts: 4,
      //isBarcodeDetectedEnabled: false,
      isBarcodeDetectedEnabled: true,
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

  const removeErrorMessage = (id,value)=>{
    if(value){
    setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, [id]: "" };
      });
    }
  }

  const onVerfiyFormElementChange = (e) =>{
       const _updatedFormData = { ...verifyFormData, [e.target.id]: e.target.value };
       removeErrorMessage(e.target.id,e.target.value);
       instntRef.current = {...instntRef.current ,verifyFormData : _updatedFormData};
       setVerifyFormData(_updatedFormData);
       if(window.instnt){
        window.instnt["verifyFormData"] = verifyFormData;
      }
  }

  const onDocumentTypeChanged = (event) => {
    instnt["documentType"] = event.target.value;
    setDocumentType(event.target.value);
  };

  const onToggleDocCaptureSettings = (newValue) => {
    logMessage('info', newValue);
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

  const backLicenseSettings = Object.assign({}, documentSettingsToApply);
  backLicenseSettings.documentSide = "Back";

  const selfieSettings = {
    //enableFarSelfie: true,
    enableFarSelfie: false,
    //selfieCaptureAttempt: 4,
    captureAttempts: 4,
    //captureMode: "Auto",
    captureMode: "Manual",
    compressionType: "JPEG",
    compressionQuality: "50",
    useBackCamera: false,
    overlayText: "Align Face and Tap button</br> to Capture.",
    overlayTextAuto: "Align Face and Hold",
    overlayColor: "#808080",
    orientationErrorText:
      "Landscape orientation is not supported. Kindly rotate your device to Portrait orientation.",
    enableFaceDetection: true,
    //setManualTimeout: 8,
    setManualTimeout: 15,
    enableLocationDetection: false,
  };

  /**ADDING STEPS */
  // Adding steps as per OTP and Document Verification Enable or Not
  const steps = [
    <EnterName // step 0
      data={formData}
      errorMessage={errorMessage}
      onChange={onSignupFormElementChange}
      isMultipassEnable={isMultipassEnable}
      invitationUrl={invitationUrl}
      localTransactionId={instntTxnId}
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
    <ShowDecision decision={decision} restart={restart} isMultipassEnable={isMultipassEnable} localTransactionId={instntTxnId} />, // step 4
  ];

  //Verify Steps 

  const verifyFormSubmitProcessingMessage = {
    title: "Processing verify request",
    detail: "Please wait while we process your verification request",
  };

  const verifySteps =[
    <EnterEmail data={verifyFormData} errorMessage={errorMessage} onChange={onVerfiyFormElementChange}/>,
    <OverviewDetailScreen data={verifyFormData}/>,
    <EnterBalanceTransferDetail data={verifyFormData} errorMessage={errorMessage} onChange={onVerfiyFormElementChange} />,
    <ShowProgress message={verifyFormSubmitProcessingMessage} />,
    <ShowDecision decision={decision} restart={restart} />
  ]

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

  /**VERIFY MAX STEPS LENGTH */

  const verifyMaxSteps = verifySteps.length;

  /** VERIFY NEXT and Back  */

  const validateVerifyEmail = ()=>{
    let isError =false;
     if (!verifyFormData.email || verifyFormData.email.length < 5) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, email: "enter valid email address" };
      });
    }
    return isError
  }

  const validateBalanceTransfer = ()=>{
    let isError =false;
     if (!verifyFormData.firstName || verifyFormData.firstName.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, firstName: "enter valid first name more than 2 character" };
      });
    }
    if (!verifyFormData.surName || verifyFormData.surName.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, surName: "enter valid last name more than 2 character" };
      });
    }
    if (!verifyFormData.amount || verifyFormData.amount.length < 1) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, amount: "enter valid amount" };
      });
    }
    if (!verifyFormData.mobileNumber || verifyFormData.mobileNumber.length < 10) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          mobileNumber: "enter valid mobile number of 10 character",
        };
      });
    }
      if (!verifyFormData.notes || verifyFormData.notes.length < 1) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, notes: "enter valid notes" };
      });
    }
    return isError
  }

  const handleVerifyNext = ()=>{
    if(activeStepRef.current===0){
      if(validateVerifyEmail()){
        return ;
      }
    }
    if(activeStepRef.current===2){
      if(validateBalanceTransfer()){
        return ;
      }
      instntRef.current.submitVerifyData(instntRef.current.verifyFormData);
    }
    activeStepRef.current+=1;
    setActiveStep(activeStepRef.current)
  }

  const handleVerifyBack = ()=>{
    activeStepRef.current-=1;
    setActiveStep(activeStepRef.current);
  }

  const handleNext = () => {
    logMessage('info', 'In handleNext(): activeStepRef.current: ', activeStepRef.current);
    logMessage('info', 'newly added');

    // added resume signup to skip particular validation
    if (!resumeSignup && !validateActiveStep(activeStepRef.current)) {
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
    activeStepRef.current += 1;
    logMessage('info', 'In handleNext(): Incremented activeStepRef: ', activeStepRef.current);
    setMessage({});
    setShowMessageDrawer(false);
  };

  const handleNextOnEventSuccess = () => {
    logMessage('info', 'In handleNextOnEventSuccess(): ', activeStepRef.current);
    activeStepRef.current += 1;
    logMessage('info', 'In handleNextOnEventSuccess(): Incremented activeStepRef: ', activeStepRef.current);
    setMessage({});
    setShowMessageDrawer(false);
  };

  const handleBack = () => {
    logMessage('info', 'In handleBack(): ', activeStepRef.current);
    setErrorMessage({});
    if (otpVerificationRef.current && activeStepRef.current === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep - 3);
      activeStepRef.current -= 2;
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      activeStepRef.current -= 1;
    }
    logMessage('info', 'In handleBack(): decremented activeStepRef: ', activeStepRef.current);
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
    if (!formData.country || !validateCountry(formData.country)) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, country: "Please enter a valid 2-letter ISO country code in uppercase." };
      });
    }
    return isError;
  };

  const validateNationalID = (nationalID) =>{
     if (!nationalID) return false;
     const regex = /^(\d{3})-(\d{2})-(\d{4})$/;
     return regex.test(nationalID.toLowerCase());
  }

   const validateCountry = (country) =>{
     if (!country) return false;
     const regex = /^[A-Z]{2}$/;
     return regex.test(country);
  }

  const validateDob = (dob)=>{
    if (!dob) return false;
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    return regex.test(dob.toLowerCase());
  }

  const validateName = () => {
    let isError = false;
    if (!formData.firstName || formData.firstName.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, firstName: "enter valid first name" };
      });
    }
    if (!formData.surName || formData.surName.length < 2) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, surName: "enter valid last name" };
      });
    }
    if (!formData.email || formData.email.length < 5) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, email: "enter valid email address" };
      });
    }

    if (!formData.nationalId || !validateNationalID(formData.nationalId)) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, nationalId: "enter valid national ID in proper format XXX-XX-XXXX" };
      });
    }
    if (!formData.dob || !validateDob(formData.dob)) {
      isError = true;
      setErrorMessage((prevErrorMessage) => {
        return { ...prevErrorMessage, dob: "enter valid dob in proper format YYYY-MM-DD" };
      });
    }

    return isError;
  };

  const validateContact = () => {
    let isError = false;
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
      isError = true;
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
      default:
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
    logMessage('log',
      'onEventHandler: activeStepRef.current: ' , activeStepRef.current
    );
    logMessage('log','event: ' , event);
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
        setInstntTxnId(eventData.instnt.instnttxnid);
        console.log('eventData.instnt.isAsync', eventData.instnt.isAsync)
        setIsMultipassEnable(eventData.instnt.isAsync);
        setInvitationUrl(eventData.instnt.invitation_url);
        break;
      case "document.captured":
        logMessage('log', 'Document capture settings applied:', eventData.documentSettings
            ? eventData.documentSettings
            : eventData.selfieSettings);
        if ("documentSettings" in eventData) {
          if (eventData.documentSettings._documentSide === "Front") {
            setFrontCapture(eventData.captureResult);
          } else {
            setBackCapture(eventData.captureResult);
          }
        } else {
          setSelfieCapture(eventData.captureResult);
        }
        setStartFront(false);
        setStartBack(false);
        setStartSelfie(false);
        break;
      case 'document.capture-cancelled':
        setStartFront(false);
        setStartBack(false);
        setStartSelfie(false);
        logMessage('log', 'document.capture-cancelled: ', eventData?.error.errorType);
        break;
      case 'document.capture-onEvent':
        logMessage('log', 'document.capture-onEvent: ', `${eventData.statusCode}, ${eventData.statusCodeMessage}`);
        setMessage({ message: eventData.statusCodeMessage, type: 'warning' });
        setShowMessageDrawer(true);
        break;
      case "document.uploaded":
         break;    
      case "transaction.accepted":
        setDecision(eventData.decision);
        activeStepRef.current = maxSteps - 1;
      case "transaction.processed":
      case "transaction.rejected":
      case "transaction.review":
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
        break;
      case "otp.error":
        setMessage(eventData);
        setShowMessageDrawer(true);
        handleBack();
        break;
      case "transaction.error":
      case "transaction.failed":
        setMessage({ message: eventData.message, type: eventData.type});
        setShowMessageDrawer(true);
        break;
      default:
        logMessage('error', 'unhandled instnt event :', event);
    }
  };

  /** Verify Event Handler */

  const onVerifyEventHandler = (event) =>{
    const eventType = event?.type ? event.type : event.event_type;
    const eventData = event?.data ? event.data : event.event_data;
    switch (eventType) {
      case 'transaction.initiated':
        setInstnt(eventData.instnt);
        instntRef.current = eventData.instnt;
        setInstntTxnId(eventData.instnt.instnttxnid);
        break;
      case 'transaction.error':
        setMessage({ message: eventData.message || 'Something went wrong!!!', type: eventData.type || 'error'});
        setShowMessageDrawer(true);
        break;
      case "transaction.processed":
        setDecision(eventData.decision);
        handleVerifyNext();
        break;
      default:
        logMessage('error', 'unhandled instnt event :' , event);
    }
    }
  

  const handleClose = (event) => {
    setShowMessageDrawer(false);
  };

  const demoOptionChange = (value) =>{
    switch(value){
      case 'verify':
        setIsVerify(true);
        setIsSignUp(false);
        setResumeSignup(false);
        setIsLogin(false);
        break;
      case 'login':
        setIsSignUp(false);
        setResumeSignup(false);
        setIsVerify(false);
        setIsLogin(true);
        break;
      case 'resumeSignup':
        setIsSignUp(false);
        setResumeSignup(true);
        setIsVerify(false);
        setIsLogin(false);
        break;
      case 'signup':
        setIsSignUp(true);
        setResumeSignup(false);
        setIsVerify(false);
        setIsLogin(false);
        break;
      default:
        break;
    }
  }

  const onChangeAppConfig = (key, value) => {
    setAppConfig({
      ...appConfig,
      [key]: value
    })
  }
  

  return (
    <div>
      <Nav isSignUp={isSignUp} resumeSignup={resumeSignup}/>
      {config ? (<GettingStarted data={appConfig} onChange={onChangeAppConfig} setConfig={setConfig} demoOptionChange={demoOptionChange} isSignUp={isSignUp} resumeSignup={resumeSignup} isVerify={isVerify} isLogin={isLogin}/>) : ((isSignUp || resumeSignup )? (
        <Paper sx={{ py: 1, px: 2 }}>      
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
        {appConfig.idmetricsVersion ? (
          appConfig.instnttxnid ?
          <InstntSignupProvider
            formKey={appConfig.workflowId}
            onEvent={(event)=>onEventHandler(event)}
            serviceURL={appConfig.serviceURL}
            idmetrics_version={appConfig.idmetricsVersion}
            instnttxnid={appConfig.instnttxnid}
          >
            {steps[activeStepRef.current]}
          </InstntSignupProvider> :
          <InstntSignupProvider
            formKey={appConfig.workflowId}
            onEvent={(event)=>onEventHandler(event)}
            serviceURL={appConfig.serviceURL}
            idmetrics_version={appConfig.idmetricsVersion}
          >
            {steps[activeStepRef.current]}
          </InstntSignupProvider> 
        ) : (
          appConfig.instnttxnid ?
          <InstntSignupProvider
            formKey={appConfig.workflowId}
            onEvent={(event)=>onEventHandler(event)}
            serviceURL={appConfig.serviceURL}
            instnttxnid={appConfig.instnttxnid}
          >
            {steps[activeStepRef.current]}
          </InstntSignupProvider>:
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
      ): isVerify ?
      <Paper sx={{ py: 1, px: 2 }}>
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
        { appConfig.instnttxnid && (
        <InstntVerifyProvider instnttxnid={appConfig.instnttxnid} serviceURL={appConfig.serviceURL}  onEvent={(event)=>onVerifyEventHandler(event)}>
          {instntTxnId ? verifySteps[activeStepRef.current] :  <CircularProgress />}
        </InstntVerifyProvider> )
        }
        {/* </Grid> */}
        {instntTxnId &&
        <Grid>
          <MobileStepper
            variant="text"
            steps={verifyMaxSteps}
            position="static"
            activeStep={activeStepRef.current}
            nextButton={
              <Button
                variant="contained"
                size="medium"
                onClick={()=>handleVerifyNext()}
                disabled={activeStepRef.current===verifyMaxSteps-1 || activeStepRef.current===verifyMaxSteps-2}
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
                onClick={()=>handleVerifyBack()}
                disabled={activeStepRef.current===0 || activeStepRef.current===verifyMaxSteps-1}
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
        </Grid> }
        {/* </Grid> */}
      </Paper>: 
      <Paper sx={{ py: 1, px: 2 }}>
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
       <LoginScreen formKey={appConfig.workflowId} serviceURL={appConfig.serviceURL}/>
      </Paper>
    )}
    </div>
  );
};

export default DocumentUploaderApp;
