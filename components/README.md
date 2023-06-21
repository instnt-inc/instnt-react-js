
# Instnt React SDK

This documentation covers the basics of Instnt React SDK implementation. In simple terms, React is an open-source front-end developer library utilized by Instnt to create a more streamlined and elegant integration with your company's/institutions customer sign-up forms. For a more detailed look at this implementation, visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

[![npm version](https://img.shields.io/npm/v/@instnt/instnt-react-js.svg?style=flat-square)](https://www.npmjs.com/package/@instnt/instnt-react-js)

### Table of Contents
- [Instnt React SDK](#instnt-react-sdk)
    - [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Quick Start Setup](#quick-start-setup)
- [Step 1 : Install \& Setup InstntSignupProvider component](#step-1--install--setup-instntsignupprovider-component)
- [Step 2 : Submit your Signup data using submitSignupData](#step-2--submit-your-signup-data-using-submitsignupdata)
- [Additional Feature Integration](#additional-feature-integration)
  - [Document Verification](#document-verification)
    - [Document Verification Pre-requisites](#document-verification-pre-requisites)
    - [Setup for InstntDocumentProcessor component](#setup-for-instntdocumentprocessor-component)
      - [Example configuration](#example-configuration)
      - [Properties](#properties)
    - [Setup for InstntSelfieProcessor component](#setup-for-instntselfieprocessor-component)
      - [Properties](#properties-1)
  - [OTP (One-Time Passcode)](#otp-one-time-passcode)
    - [OTP flow](#otp-flow)
- [Example App](#example-app)
- [Event processing](#event-processing)
- [Instnt's core library objects, functions, and events](#instnts-core-library-objects-functions-and-events)
- [Instnt's Sandbox](#instnts-sandbox)
- [Resource links](#resource-links)
- [License](#license)


 
# Prerequisites

* Sign in to your account on the Instnt Accept's dashboard and create a customer signup workflow that works for your company. Refer to the [Quick start guide](https://support.instnt.org/hc/en-us/articles/4408781136909) and [Developer guide](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview) for more information.

* The integration of SDK depends on your workflow; read the [Instnt Accept integration process](https://support.instnt.org/hc/en-us/articles/4418538578701-Instnt-Accept-Integration-Process), to understand the functionalities provided by Instnt and how to integrate SDK with your application.

# Getting Started

* Instnt React SDK is comprised of React components, Javascript library functions, and an event propagation mechanism to facilitate communication between applications, Instnt SDK, and Instnt's APIs. 

* Instnt React SDK is built on top of Instnt core JavaScript Library which provides the base functionality and event triggering mechanism that React SDK depends on. For more information please refer to this following article https://support.instnt.org/hc/en-us/articles/4997119804301

# Quick Start Setup

  # Step 1 : Install & Setup InstntSignupProvider component
  
  To begin utilizing Instnt React SDK, open the terminal and enter the following command to install Instnt's React components:

```sh
npm i @instnt/instnt-react-js
```
  
  After installing the Instnt npm package, import Instnt's React Workflow component called **InstntSignupProvider**.
  ```jsx
  import { InstntSignupProvider } from '@instnt/instnt-react-js'
  ```

  * **InstntSignupProvider**- This component provides the functions to render and initiate the signup process. **InstntSignupProvider** acts as a top-level container component responsible for initiating the session and returning the accompanying Javascript functions and configurations that your application can use to perform different actions. It occurs during the mounting phase of this component. Further in this guide we will view how we can use these functions and configurations.

   The next thing to do will be to just wrap up your signup components with the **InstntSignupProvider**.

  ```jsx
  <InstntSignupProvider 
    formKey={'v626673100000'} 
    onEvent={onEventHandler} 
    serviceURL={"https://sandbox-api.instnt.org"}>

    {{ Your singup components can go here }}

  </InstntSignupProvider>
  ```

  > **_NOTE:_**  The above code snippet is a design recommendation. Developers can decide how they use this component to adjust to their use case.

* **InstntSignupProvider** works as follows:
  1. connects to Instnt’s backend API on mount and initiates a new transaction identified by a unique transactionID.
  2. It also downloads additional scripts and client side APIs.
  3. The calling application should pass the **formKey**, **serviceURL** and an **onEventHandler** function to this component.  

 **formKey** - This is the **Workflow ID** you created in the Instnt dashboard, and you want to be powered by Instnt.
  
  Example:

  ```formKey={"v626673100000"}```

**onEvent** - Optional. Used to provide event handling, it is invoked when various Instnt events occur `onEventHandler(event)`.

**serviceURL** - Required. Instnt's service URL to connect and access API. This API can point to instnt production, sandbox or pre-prod environments and as described here at [Instnt Enviroments](https://support.instnt.org/hc/en-us/articles/5165465750797#h_01GXZYPZEH2JW528C926BW3EGY).

* InstntSignupProvider invokes onEventHandler callback function on successful initialization, passing a globally available reference to  [`instnt object`](https://support.instnt.org/hc/en-us/articles/4997119804301#h_01G9QM0XM2YEZ9ZBH5GC1GJM62) and associated SDK functions listed [here](https://support.instnt.org/hc/en-us/articles/4997119804301#h_01G9QM1D05P9EE1S63AM3SH0PE).

* The application should store this [`instnt object`](https://support.instnt.org/hc/en-us/articles/4997119804301#h_01G9QM0XM2YEZ9ZBH5GC1GJM62) and its context for referencing during the signup process and invoke the properties of the function of this object to communicate with Instnt API.

* Once Instnt SDK is initialized, it binds the `onEventHandler` function and emits `transaction.initiated` event. The app can then render any subsequent components or act on the tasks associated with the signup process.

# Step 2 : Submit your Signup data using submitSignupData

  Once an end-user/applicant fills out the signup form, the application can invoke **submitSignupData** to process the signup request.

  Submitting your data form is done by calling the **submitSignupData** function that we get from the **instnt** object after a transaction is initiated.

  ```javascript
  event.data.instnt.submitSignupData(formData)
  ```
  Where as,

  * The **instnt** object is [`instnt object`](https://support.instnt.org/hc/en-us/articles/4997119804301#h_01G9QM0XM2YEZ9ZBH5GC1GJM62)

  * **formData** is like

  ```javascript
  {
    "city" : "testCity",
    "country" : "usa",
    "email" : "test@gmail.com",
    "firstName" : "test",
    "mobileNumber" : "+18505903218",
    "physicalAddress" : "testAddress",
    "state" : "testState",
    "surName" : "testlastName",
    "zip" : "11230"
  }
  ```
  After submitting your data, you will receive an event of type `transaction.processed ` (refer to [Event Processing](#event-processing) for more event types) located at `event.type`. This means your transaction was processed successfully by our backend.

  At the same time, you will see a data object at ```event.data``` that contains the following:
  ```javascript
    {
        "status": String,
        "formKey": String,
        "url": String,
        "success": Boolean,
        "instntjwt": String,
        "decision": String
    }
  ```
  ```decsion``` will represent either: `REJECT`, `REVIEW`, or `ACCEPT`.
  
# Additional Feature Integration 
## Document Verification

Document verification feature is applicable if you have enabled it during the workflow creation.

When this feature is enabled, the physical capture and verification of selfies and Government-issued identification documents such as Passports and Driver's Licenses are available.

Read the [Document Verification](https://support.instnt.org/hc/en-us/articles/4408781136909#h_01GXC1F0V6A29QWRRHD3FHZ0YM) section of the Quickstart guide to understand better how to enable the feature.

### Document Verification Pre-requisites

* Web applications running on mobile-react can utilize Document Verification.
 
* Latest iOS and Android mobile devices with Chrome or Safari browsers and good quality camera are supported for document verification.
 
* Desktop devices (laptops, PCs) are unsupported due to the poor quality of embedded cameras and lack of gyroscopes for orientation detection. While the feature will work on devices running Chrome or Safari browsers, the experience can vary.
 
* Do not include HTML tags with IDs containing the prefix 'aid.' e.g. `<div id=’aidFooter’>` in your web app as this prefix is reserved to be used by the toolkit. 

* Document verification requires end-to-end communication over SSL to get permission to use the device camera.
    

### Setup for InstntDocumentProcessor component

1\. `import` Instnt's React components:

`import { InstntDocumentProcessor } from '@instnt/instnt-react-js'`

2\. InstntDocumentProcessor component is a child component that can be composed and nested in InstntSignupProvider, and each render of this component initiates a document capture event.

3\.  Instnt SDK includes various partner libraries, one of which is responsible for the document capture. InstntDocumentProcessor abstracts the document capture functionality by providing a simplified React component interface over our partner library.

4\. Your application can include any number of steps in the signup process by having its own react components as child components of `InstntSignupProvider`.

#### Example configuration

Set-up the workflow steps:

```javascript
  const steps = [
    <GettingStarted />, //Step 0 == activeStep
    <EnterName data={formData} errorMessage={errorMessage} onChange={onSignupFormElementChange}/>,
    <EnterContact data={formData} errorMessage={errorMessage} onChange={onSignupFormElementChange} mobileNumberOnBlur={mobileNumberOnBlur}/>,
    <EnterOtpCode errorMessage={errorMessage} setOtpCode={otpCodeEntered} onChange={onSignupFormElementChange}/>,
    <ShowProgress message={otpVerifyProcessingMessage}/>, //step 4
    <EnterAddress data={formData} errorMessage={errorMessage} onChange={onSignupFormElementChange}/>,
    <ChooseDocument customDocCaptureSettings={customDocCaptureSettings} onToggleDocCaptureSettings={onToggleDocCaptureSettings} onDocumentTypeChanged={onDocumentTypeChanged} />, // step 6
    <InstntDocumentProcessor documentSettings={frontLicenseSettings} />, //DL front
    <ReviewCapture documentSettings={documentSettingsApplied} captureResult={captureResult} />, // step 8
    <InstntDocumentProcessor documentSettings={backLicenseSettings} />, //DL back
    <ReviewCapture documentSettings={documentSettingsApplied} captureResult={captureResult} />, // step 10
    <InstntSelfieProcessor selfieSettings={selfieSettings}/>, //selfie
    <ReviewCapture documentSettings={documentSettingsApplied} captureResult={captureResult} />, // step 12
    <ShowProgress message={formSubmitProcessingMessage}/>,
    <ShowDecision decision={decision} restart={restart}/>,
  ];
```

* As in the above example, `InstntDocumentProcessor` gets initialized multiple times to capture both the front and back sides of the license. In case of license, the front capture is required with back capture can be optional. In case of passport, one time initialization to capture the front info page of the passport is sufficient. 

* The component has an auto-upload feature which is turned on by default. It uploads the image to Instnt cloud storage once the image gets captured successfully. 

* This component triggers different events based on the capture success, like file uploaded, etc. 

* On successful capture, it returns the captured image and the related configurations to your application so that the application can decide to use the captured image or retake.

* The InstntDocumentProcessor component takes a documentSettings parameter which is a simple JavaScript Key-value pair object. This object can be used to override the default document capture configurations. Below is an example configuration - 

```javascript
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
    enableFaceDetection: true,
    setManualTimeout: 8,
    backFocusThreshold: 30,
    backGlareThreshold: 2.5,
    backCaptureAttempts: 4,
    isBarcodeDetectedEnabled: false,
    enableLocationDetection: false
  }
```
* The customers are only expected to use the first two settings documentType and documentSide in general to setup this component.

* For more details about Document verification workflow steps please refer to this article [Document Verification](https://support.instnt.org/hc/en-us/articles/8277032114829#h_01GXZZEA2W4N3WA18EQ26WHBMA)

#### Properties

*   documentSettings: Object (required)

*   autoupload: true (default)

*   captureFrameworkDebug: undefined (default)

### Setup for InstntSelfieProcessor component

1\. `import` Instnt's React components:

`import { InstntSelfieProcessor } from '@instnt/instnt-react-js'`

2\. InstntSelfieProcessor component is a child component that can be composed and nested in InstntSignupProvider, and each render of this component initiates a document capture event.

3\. Instnt SDK includes various partner libraries, one of which is responsible for the selfie processor. InstntSelfieProcessor abstracts the selfie capture functionality by providing a simplified React component interface over our partner library.

4\. Your application can include any number of steps in the signup process by having its own react components as child components of `InstntSignupProvider`.

5\. Similar to InstntDocumentProcessor component, SDK provides InstntSelfieProcessor component which can be used to capture a selfie image. The setup and function of this component is very similar to InstntDocumentProcessor. Here is an example of selfieSettings parameter object that can be used to customize its behavior.

*

```javascript
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
    orientationErrorText: "Landscape orientation is not supported. Kindly rotate your device to Portrait orientation.",
    enableFaceDetection: true,
    setManualTimeout: 8,
    enableLocationDetection: false
  }
```
* Please refer to the reference application bundled with React SDK for more detail code examples.

* The SDK by default loads a optimized set of configurations based on the device family for well known devices.

* Please note that InstntImageProcessor component is removed in the latest version of the SDK but customers are encouraged to use specific components InstntDocumentProcessor and InstntSelfieProcessor.

#### Properties

*   selfieSettings: Object (required)

*   autoupload: true (default)

*   captureFrameworkDebug: undefined (default)

## OTP (One-Time Passcode)

OTP functionality can be enabled by logging in Instnt dashboard and enabling OTP in your workflow. Refer to the [OTP](https://support.instnt.org/hc/en-us/articles/4408781136909#h_01GFKXKDFW0D8HQXND70K0CYCY) section of the Quickstart guide for more information.

Instnt SDK provides two Javascript library functions to enable OTP.

1. sendOTP (mobileNumber)
2. verifyOTP(mobileNumber, otpCode)

Please refer to the Library function listing below for more details. 

### OTP flow

* User enters mobile number as part of the signup screen.
* Your app calls send OTP() SDK function and pass the mobile number.
* Instnt SDK calls Instnt API and returns the response upon successful OTP delivery.
* Your app shows the user a screen to enter the OTP code.
* User enters the OTP code which they received.
* Your app calls verify the OTP() SDK function to verify the OTP and pass mobile number and OTP code.
* Instnt SDK calls Instnt API and returns the response upon successful OTP verification

# Example App
This repo contains a simple example of how to implement the Instnt SDK. If you wish to run the example project please do the following:

From the root folder do:
```sh
cd /examples/forms/
```
Then, install npm packages with:
```sh
npm i
```
Lastly, just run the project by running the following command:
```sh
npm start
```
From here you will see the server startup and open up the sample project. Usually at: ```http://localhost:3000/```

# Event processing

Your application can listen to the events emitted by Instnt's SDK and respond to it. Please refer to our support site for more information: [Instnt SDK events](https://support.instnt.org/hc/en-us/articles/4997119804301#h_01G9QKPB5315XFKZ7FAG093NK8)


# Instnt's core library objects, functions, and events
>**NOTE:**
>Please refer to [Instnt's Core JavaScript Library ](https://support.instnt.org/hc/en-us/articles/4997119804301) for details regarding the Instnt's core Javascript library objects, functions, and events.

# Instnt's Sandbox

Instnt's Sandbox is a static environment that assesses provisioned synthetic identities that we give you for onboarding and testing purposes. The provisioned identities contain:

* Email address
* First name
*	Last name
*	Phone number
*	Physical address (city, state, zip)
*	IP address

Please contact support@instnt.org for more information concerning access to the sandbox environment.


# Resource links 
- [Quick start guide](https://support.instnt.org/hc/en-us/articles/4408781136909)
- [Developer guide](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)
- [Instnt API endpoints](https://swagger.instnt.org/)
- [Instnt support](https://support.instnt.org/hc/en-us)

# License

The instnt-reactjs SDK is under MIT license.
