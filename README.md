# Instnt React SDK

This documentation covers the basics of Instnt React SDK implementation. Put simply, React is an open-source front-end developer library utilized by Instnt to create a more streamlined and elegant integration with your company's forms. For a more detailed look at this implementation, visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

[![build status](https://img.shields.io/travis/instnt/instnt-react-js/master.svg?style=flat-square)](https://travis-ci.org/instnt/instnt-react-js)
[![npm version](https://img.shields.io/npm/v/@instnt/instnt-react-js.svg?style=flat-square)](https://www.npmjs.com/package/@instnt/instnt-react-js)

### Table of Contents
- [Getting Started](https://github.com/instnt-inc/instnt-react-js#getting-started)
- [Rendering a Standard Signup Workflow with Instnt React SDK](https://github.com/instnt-inc/instnt-react-js#rendering-a-standard-signup-form-with-instnt-react-sdk)
- [Document Verification](https://github.com/instnt-inc/instnt-react-js#document-verification)
- [OTP](https://github.com/instnt-inc/instnt-react-js#otp)
- [Instnt's Sandbox](https://github.com/instnt-inc/instnt-react-js#instnts-sandbox)
- [Appendix](https://github.com/instnt-inc/instnt-react-js#appendix)

### Related Material
- [Instnt API Endpoints](https://swagger.instnt.org/)

# Getting Started

* Instnt React SDK comprises of a set of React components, Javascript library functions and a event progation mechanism to facimilate communication between application, Instnt SDK and Instnt's APIs.

* In order to begin utilizing Instnt React SDK, enter the following command to install Instnt's React components:

```sh
npm i @instnt/instnt-react-js
```
* This process should only take a few moments. Once complete, import Instnt's React Workflow component:

```jsx
import { InstntSignUpProvider } from '@instnt/instnt-react-js'
```

* Next render InstntSignupProvider to initiate the signup process. InstantSignupProvider acts as a top level container component which is responsible for initiate the session and return the accompanying Javascript functions and configurations that customer application can use to take different actions. This is done during the mounting phase of this component. 

*   Wrapup your signup components with InstntSignupProvider. In the example app included in the SDK only one of the child component gets rendered based on the activeStep state.

```java
<InstntSignupProvider 
  formKey={formKey} 
  sandbox={sandbox} 
  onEvent={onEventHandler} 
  serviceURL={serviceURL}>

  {steps[activeStep]}

</InstntSignupProvider>
```
*   InstntSignupProvider connects to Instnt’s backend API on mount and initiates a new transaction identified by a unique transactionID. It also downloads additional scripts and client side APIs. The calling application should pass the form_key and an event handler function to this component.
    
*   On the successful initialization, InstntSignupProvider invokes onEventHandler callback function passing a globally available reference to instnt object and associated SDK functions which are listed below.

* The Application should store this instnt object at its context for referencing during the signup process and invoke the function properties of this object to communicate with Instnt API.

* Once instnt SDK initialized, it binds the onEventHandler funciton and emit transaction.initiated event. the app can then render any subsequent components or take any action related to signup process.

* on user fills the the signup form, application can invoke instnt.submitData to process the signup request.

# Document Verification

Document Verification Pre-requisites
------------------------------------

*   Document verification can be employed on mobile-reactive web-apps
    
*   iOS and Android Mobile devices with Chrome or Safari browsers is supported
    
*   Desktop devices (laptops, PCs) are unsupported due to poor quality of embedded cameras and lack of gyroscopes for orientation detection. While the feature will work on such devices running Chrome or Safari browsers, the experience can vary
    
*   Do not include HTML tags with IDs containing the prefix 'aid'. for e.g. <div id=’aidFooter’> in your webapp as this prefix is reserved for user by the toolkit 

* Requires end to end communication over SSL in order to get  permission to use the device camera
    

Setup
-----

1\. import Instnt's React components:

`import { InstntImageProcessor } from '@instnt/instnt-react-js'`


4\. InstntImageProcessor component is a child component that can be composed nested in InstntSignupProvider and each render of this component initiate a document capture event.

5\. Instnt SDK bundles various 3rd party SDKs one of which is AuthenticID SDK which is responsible for the document capture. InstntImageProcessor abstract the document capture functionality by providing a simplified React component interface.

6\. The customer application can include any number of steps in the signup process by including its own react components as child component of `InstntSignUpProvider`.

### Example configuration

Setup the workflow steps:

```javascript
  const steps = [
    <GettingStarted />,
    <CustomerProvidedSignupForm {...instnt_signup_props} />,
    <ChooseDocument onDocumentTypeChanged={onDocumentTypeChanged} />,
    <InstntImageProcessor documentType="License" documentSide="Front" />, //DL front
    <ReviewCapture documentSettings={documentSettings} captureResult={captureResult} />,
    <InstntImageProcessor documentType="License" documentSide="Back" />, //DL back
    <ReviewCapture documentSettings={documentSettings} captureResult={captureResult} />,
    <InstntImageProcessor documentType="License" />, //selfie
    <ReviewCapture documentSettings={documentSettings} captureResult={captureResult} />,
    <ShowDecision data={decision} error={error} />,
  ];
```

* As in the above example, InstntImageProcessor gets initialized multiple time to capture license front, back and selfie images.

* The component has a autoupload feature which is turned on by default. It uploads the image to Instnt cloud storage once the image get captured successfully. 

* This component triggers different events based on the capture success, file uploaded etc. 

* On successful capture, it returns the captured image as well as the related configurations to customer application so that application can decide to use the captured image or retake.


# OTP (One-Time Passcode)
In order to use OTP in the signup process, first login to Instnt dashboard and enable OTP in your workflow.

Instnt SDK provides two Javascript library functions to enable OTP.

1. sendOTP (mobileNumber)
2. verifyOTP(mobileNumber, otpCode)

Please refer to the Library function listing below for more details. 

## OTP workflow - 

* User enters mobile number as part of the signup screen.
* Customer app calls sendOTP() SDK function passing the mobile number.
* Instnt SDK calls Instnt API and returns the response upon successful OTP send
* Customer app shows user a screen to enter the OTP code
* User enter the OTP code received
* Customer app calls verifyOTP() SDK function to verify the OTP
* Instnt SDK calls Instnt API and returns the response upon successful OTP verification


# Event processing

Customer app can listen to the events (listed below) emitted by Instnt's SDK and react to it. Below is a sample event handler 

```java
const onEventHandler = (event) => {
    switch (event.type) {
      case "transaction.initiated":
        setInstnt(event.data.instnt);
        instntRef.current = event.data.instnt;
        break;
      case "document.captured":
        // If necesary capture the setting and results for further review before upload
        setDocumentSettings(event.data.documentSettings);
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
      case ".error":
      case event.type.match(/.error/)?.input:
        console.log("Received instnt error event: " + event.type);
        setMessage(event.data);
        setShowMessageDrawer(true);
        break;
      default:
        console.log("unhandled instnt event ", event);
    }
  }
  ```

Components
----------

### InstntSignupProvider

#### Properties

*   **formId** - Required. A Workflow ID. For more information concerning Workflow IDs, please visit Instnt's documentation library.

*   **serviceURL** - Required. Instnt's service URL to connect
    
*   **sandbox** - Optional. If set to true, a sandbox (test) environment will be used instead of a production environment
    
*   **onEvent** - Optional. Use to provide and event handler invoked when various Instnt events occur. onEventHandler(event)

*   **children** - Optional. child react components to be rendered
    

### InstntImageProcessor

Properties

*   documentType: “License”
    
*   documentSide: “Front”
    
*   captureMode: “Manual”

*   autoupload: true (default)

### Events

<table data-layout="default" data-local-id="1160fb90-4271-4e56-bdfe-3e08f28e5d90" class="confluenceTable"><colgroup><col style="width: 159.0px;"><col style="width: 200.0px;"><col style="width: 400.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p></p></th><th class="confluenceTh"><p></p></th><th class="confluenceTh"><p></p></th></tr>

<tr><td class="confluenceTd"><p>Instnt Initialized</p></td><td class="confluenceTd"><p>{type: ‘transaction.initiated’,</p><p>data: {</p><p>instnt: object</p><p>}}</p></td><td class="confluenceTd"><p>Instnt framework finished initializaing and is ready to accept user input.</p><p>Instnt object contains a transaction ID and SDK functions</p></td></tr>

<tr><td class="confluenceTd"><p>Document Captured</p></td><td class="confluenceTd"><p>{type: ‘document.captured’,</p><p>data: {</p><p>document_type,</p><p>document_side</p><p>}}</p></td><td class="confluenceTd"><p>Image capture completed</p></td></tr>

<tr><td class="confluenceTd"><p>Document uploaded </p></td><td class="confluenceTd"><p>{type: ‘document.uploaded’,</p><p>data: {</p><p>document_type,</p><p>document_side,</p><p>error</p><p>}}</p></td><td class="confluenceTd"><p>Captured document has been uploaded</p></td></tr>

<tr><td class="confluenceTd"><p>Capture Cancelled</p></td><td class="confluenceTd"><p>{type: ‘document.capture-cancelled’,</p><p>data: {</p><p>document_type,</p><p>document_side,</p><p>error</p><p>}}</p></td><td class="confluenceTd"><p>Image capture has been cancelled</p></td></tr>

<tr><td class="confluenceTd"><p>Documents verification initiated</p></td><td class="confluenceTd"><p>{type: ‘document.verification-initiated’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Document verification process initiated</p></td></tr>

<tr><td class="confluenceTd"><p>Documents Verified</p></td><td class="confluenceTd"><p>{type: ‘document.verified’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Document verification process completed</p></td></tr>

<tr><td class="confluenceTd"><p>Document error</p></td><td class="confluenceTd"><p>{type: 'document.error',</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Error processing ocument verification</p></td></tr>

<tr><td class="confluenceTd"><p>OTP sent</p></td><td class="confluenceTd"><p>{type: 'otp.sent’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>OTP sent</p></td></tr>

<tr><td class="confluenceTd"><p>OTP Verified</p></td><td class="confluenceTd"><p>{type: 'otp.verified’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>OTP verified</p></td></tr>

<tr><td class="confluenceTd"><p>OTP error</p></td><td class="confluenceTd"><p>{type: 'otp.error',</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Error while OTP verification process</p></td></tr>

<tr><td class="confluenceTd"><p>Application Processed</p></td><td class="confluenceTd"><p>{type: ‘transaction.processed’,</p><p>data: {</p><p>decision: string,</p><p>instnttxnid: UUID</p><p>}}</p></td><td class="confluenceTd"><p>User approval process completed</p></td></tr>

<tr><td class="confluenceTd"><p>Application processing error</p></td><td class="confluenceTd"><p>{type: ‘transaction.error',</p><p>data: {</p><p>decision: string,</p><p>instnttxnid: UUID</p><p>}}</p></td><td class="confluenceTd"><p>Error while user approval processing</p></td></tr>

</tbody></table>

### Instnt Object

<table data-layout="default" data-local-id="1461e79a-6df4-4f4b-b7df-a9a072096fd3" class="confluenceTable"><colgroup><col style="width: 173.0px;"><col style="width: 121.0px;"><col style="width: 465.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Property</strong></p></th><th class="confluenceTh"><p><strong>Type</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th></tr>

<tr><td class="confluenceTd"><p>instnttxnid</p></td><td class="confluenceTd"><p>UUID</p></td><td class="confluenceTd"><p>Instnt Transaction ID</p></td></tr>

<tr><td class="confluenceTd"><p>formId</p></td><td class="confluenceTd"><p>string</p></td><td class="confluenceTd"><p>Instnt Form/Workflow ID</p></td></tr>

<tr><td class="confluenceTd"><p>otpVerification</p></td><td class="confluenceTd"><p>boolean</p></td><td class="confluenceTd"><p>Whether Instnt Form/Workflow has OTP verification enabled</p></td></tr>

<tr><td class="confluenceTd"><p>documentVerification</p></td><td class="confluenceTd"><p>boolean</p></td><td class="confluenceTd"><p>Whether Instnt Form/Workflow has document verification enabled</p></td></tr>
</tbody></table>

<table data-layout="default" data-local-id="1461e79a-6df4-4f4b-b7df-a9a072096fd3" class="confluenceTable"><colgroup><col style="width: 173.0px;"><col style="width: 71.0px;"><col style="width: 65.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Property</strong></p></th><th class="confluenceTh"><p><strong>Type</strong></p></th><th class="confluenceTh"><p><strong>Parameters</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th></tr>
<tr><td class="confluenceTd"><p>onEvent</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>event</p></td><td class="confluenceTd"><p>An event handler receiving Instnt events</p></td></tr>

<tr><td class="confluenceTd"><p>init</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p></p></td><td class="confluenceTd"><p>Initializes an Instnt signup session</p></td></tr>

<tr><td class="confluenceTd"><p>uploadAttachment</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>imageSettings, captureResult, <br>isSelfie = false</p></td><td class="confluenceTd"><p>Upload a document file to Instnt server</p></td></tr>

<tr><td class="confluenceTd"><p>verifyDocuments</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>documentType</p></td><td class="confluenceTd"><p>Initiate document verification on Instnt server</p></td></tr>

<tr><td class="confluenceTd"><p>submitData</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>data</p></td><td class="confluenceTd"><p>Submit user entered data to Instnt server and initiate customer approval process</p></td></tr>

<tr><td class="confluenceTd"><p>getTransactionStatus</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>instnttxnid</p></td><td class="confluenceTd"><p>Gets the status of the transaction that includes the form fields verification and documents verification status</p></td></tr>
<tr><td class="confluenceTd"><p>sendOTP</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>mobileNumber</p></td><td class="confluenceTd"><p>sends one time password to the provided mobile number</p></td></tr>
<tr><td class="confluenceTd"><p>verifyOTP</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>mobileNumber, otpCode</p></td><td class="confluenceTd"><p>verifies one time password to the provided mobile number</p></td></tr>

</tbody></table>

# Instnt's Sandbox

Instnt's Sandbox is a static environment that assesses provisioned synthetic identities that we give you for onboarding and testing purposes. The provisioned identities contain:

* Email address
* First name
*	Last name
*	Phone number
*	Physical address (city, state, zip)
*	IP address

Please contact support@instnt.org for more information concerning access to the sandbox environment.

# FAQ

### * What if I want to add some custom text fields onto my workflows?

After setting up the InstntSignUpProvider component, simply install the following Material UI components and import the text field using the following commands:

```jsx
npm install @material-ui/core

import { TextField } from '@material-ui/core'
```

Once the components have been installed and imported, collect data from the user. Example:

```jsx
  <TextField
    id='email'
    type='email'
    label='Email'
    value={data['email']}
    onChange={onChange}
  />
```

The 'email' text here is used as an example and can be anything you'd like to have appear on the workflow. Always include the value and onChange fields as written in the example above, as they mark the text field as data to be passed through the InstntSignUpProvider component.

### * Minimum requirements

The minimum supported version of React is v16.8. If you use an older version,
upgrade React to use this library.

### * what about other components like InstntSignup  or InstntCustomSignup

These are Instnt's legacy React components. This components are kept for backward compatibility but will be removed from the SDK in future. For any new integration we recommend to use InstntSignupProvider instead of InstntSignup or InstntCustomSignup components. InstntSignupProvider is also required to inplement features like document verification or OTP.
