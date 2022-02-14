
# Instnt React SDK

This documentation covers the basics of Instnt React SDK implementation. In simple terms, React is an open-source front-end developer library utilized by Instnt to create a more streamlined and elegant integration with your company's/institutions customer sign-up forms. For a more detailed look at this implementation, visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

[![build status](https://img.shields.io/travis/instnt/instnt-react-js/master.svg?style=flat-square)](https://travis-ci.org/instnt/instnt-react-js)
[![npm version](https://img.shields.io/npm/v/@instnt/instnt-react-js.svg?style=flat-square)](https://www.npmjs.com/package/@instnt/instnt-react-js)

### Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  * [Setup for InstntSignupProvider component](#setup-for-instntsignupprovider-component)
- [Document verification](#document-verification)
  * [Document verification prerequisites](#document-verification-prerequisites) 
  * [Setup for InstntImageProcessor component](#setup-for-instntimageprocessor-component)
- [OTP verification](#otp-one-time-passcode)
  * [OTP workflow ](#otp-flow )
- [Event processing](#event-processing)
  * [Instnt signup provider](#instntsignupprovider)
  * [Instnt image processor](#instntimageprocessor)
  * [Events](#events)
  * [Instnt Object](#instnt-object)
- [External dependencies](#external-dependencies)
- [Instnt's sandbox](#instnts-sandbox)
- [Assertion Response Payload](#assertion-response-payload)
- [Resource links](#resource-links)
- [FAQ](#faq)


 
# Prerequisites

* Sign in to your account on the Instnt Accept's dashboard and create a customer signup workflow that works for your company. Refer [Quick start guide](https://support.instnt.org/hc/en-us/articles/4408781136909) and [Developer guide, ](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview) for more information.

* The integration of SDK depends on your workflow; read the [Instnt Accept integration process,](https://support.instnt.org/hc/en-us/articles/4418538578701-Instnt-Accept-Integration-Process) to understand the functionalities provided by Instnt and how to integrate SDK with your application.


# Getting Started

* Instnt React SDK is comprised of React components, Javascript library functions, and an event propagation mechanism to facilitate communication between application, Instnt SDK, and Instnt's APIs.

* To begin utilizing Instnt React SDK, open the terminal and enter the following command to install Instnt's React components:

```sh
npm i @instnt/instnt-react-js
```

## Setup for InstntSignupProvider component

After installing the Instnt npm package, import Instnt's React Workflow component called **InstntSignupProvider**.

```jsx
import { InstntSignUpProvider } from '@instnt/instnt-react-js'
```

* **InstntSignupProvider**- This component provides the functions to render and initiate the signup process. InstantSignupProvider acts as a top-level container component responsible for initiating the session and returning the accompanying Javascript functions and configurations that your application can use to perform different actions. It occurs during the mounting phase of this component.  

* Wrap up your signup components with InstntSignupProvider. In the example app included in the SDK, only one of the child components gets rendered based on the `activestep` state.

```java
<InstntSignupProvider 
  formKey={formKey} 
  sandbox={sandbox} 
  onEvent={onEventHandler} 
  serviceURL={serviceURL}>

  {steps[activeStep]}

</InstntSignupProvider>
```

* **InstntSignupProvider** works as follows:
  1. connects to Instnt’s backend API on mount and initiates a new transaction identified by a unique transactionID. 
  2. It also downloads additional scripts and client side APIs. 
  3. The calling application should pass the **form_key** and an event handler function to this component.

  **form_key** - This is the id of the workflow you created in the Instnt dashboard, and you want to be powered by Instnt.

  Example: form_key= v766520100000

* InstntSignupProvider invokes onEventHandler callback function on successful initialization, passing a globally available reference to  [`instnt object`](#instnt-object) and associated SDK functions listed [below](#events).

* The application should store this [`instnt object`](#instnt-object) and its context for referencing during the signup process and invoke the properties of the function of this object to communicate with Instnt API.

* Once Instnt SDK is initialized, it binds the `onEventHandler` function and emits `transaction.initiated` event. The app can then render any subsequent components or act on the tasks associated with the signup process.

* Once an end-user/applicant fills the signup form, the application can invoke **instnt.submitData** to process the signup request.


# Document Verification

Document verification feature comes into the picture if you have enabled it during the workflow creation.

When this feature is enabled, the physical capture and verification of selfies and Government-issued identification documents such as Passports and Driver's Licenses are available.

Read the [Document Verification](https://support.instnt.org/hc/en-us/articles/4408781136909#heading-6) section of the Quickstart guide to understand better how to enable the feature.

## Document Verification Pre-requisites

* Web applications running on mobile-react can utilize Document Verification.
 
* iOS and Android mobile devices with Chrome or Safari browsers are supported for document verification.
 
* Desktop devices (laptops, PCs) are unsupported due to the poor quality of embedded cameras and lack of gyroscopes for orientation detection. While the feature will work on devices running Chrome or Safari browsers, the experience can vary.
 
* Do not include HTML tags with IDs containing the prefix 'aid.' e.g. `<div id=’aidFooter’>` in your web app as this prefix is reserved to be used by the toolkit. 

* Document verification requires end-to-end communication over SSL to get permission to use the device camera.
    

## Setup for InstntImageProcessor component

1\. `import` Instnt's React components:

`import { InstntImageProcessor } from '@instnt/instnt-react-js'`

2\. InstntImageProcessor component is a child component that can be composed and nested in InstntSignupProvider, and each render of this component initiates a document capture event.

3\.  Instnt SDK bundles various 3rd party SDKs, one of which is **AuthenticID** SDK responsible for the document capture. InstntImageProcessor abstracts the document capture functionality by providing a simplified React component interface.

4\. Your application can include any number of steps in the signup process by having its own react components as child components of `InstntSignUpProvider`.

### Example configuration

Set-up the workflow steps:

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

* As in the above example, `InstntImageProcessor` gets initialized multiple times to capture both the front and back sides of the license, and selfie images.

* The component has an auto-upload feature which is turned on by default. It uploads the image to Instnt cloud storage once the image gets captured successfully. 

* This component triggers different events based on the capture success, like file uploaded, etc. 

* On successful capture, it returns the captured image and the related configurations to your application so that the application can decide to use the captured image or retake.

# OTP (One-Time Passcode)

OTP functionality can be enabled by logging in Instnt dashboard and enabling OTP in your workflow. Refer to the [OTP](https://support.instnt.org/hc/en-us/articles/4408781136909#heading-5) section of the Quickstart guide for more information.

Instnt SDK provides two Javascript library functions to enable OTP.

1. sendOTP (mobileNumber)
2. verifyOTP(mobileNumber, otpCode)

Please refer to the Library function listing below for more details. 

## OTP flow

* User enters mobile number as part of the signup screen.
* Your app calls send OTP() SDK function and pass the mobile number.
* Instnt SDK calls Instnt API and returns the response upon successful OTP delivery.
* Your app shows the user a screen to enter the OTP code.
* User enters the OTP code which they received.
* Your app calls verify the OTP() SDK function to verify the OTP and pass mobile number and OTP code.
* Instnt SDK calls Instnt API and returns the response upon successful OTP verification


# Event processing

Your application can listen to the [events](#events) emitted by Instnt's SDK and respond to it. Below is a sample event handler:

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
<iframe src="https://support.instnt.org/hc/en-us/articles/4418538578701"
          width="100%" height="500" allowfullscreen sandbox>
  </iframe>

# Components

## InstntSignupProvider

### Properties

* **formId** - Required. A Workflow ID. For more information concerning Workflow IDs, please visit Instnt's documentation library.

* **serviceURL** - Required. Instnt's service URL to connect and access API.
 
* **sandbox** - Optional. If this boolean argument is set to true, a sandbox (test) environment will be used instead of a production environment.
 
* **onEvent** - Optional. Used to provide event handling, it is invoked when various Instnt events occur. `onEventHandler(event)`.

* **children** - Optional. Child React components to be rendered by the application.
    

## InstntImageProcessor

### Properties

*   documentType: “License”
    
*   documentSide: “Front”
    
*   captureMode: “Manual”

*   autoupload: true (default)

## Events

<table data-layout="default" data-local-id="1160fb90-4271-4e56-bdfe-3e08f28e5d90" class="confluenceTable"><colgroup><col style="width: 159.0px;"><col style="width: 200.0px;"><col style="width: 400.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p></p></th><th class="confluenceTh"><p></p></th><th class="confluenceTh"><p></p></th></tr>

<tr><td class="confluenceTd"><p>Instnt Initialized</p></td><td class="confluenceTd"><p>{type: ‘transaction.initiated’,</p><p>data: {</p><p>instnt: object</p><p>}}</p></td><td class="confluenceTd"><p>This signifies that the Instnt framework has finished initializing and is ready to accept user input.</p><p>Instnt object contains a transaction ID and SDK functions.</p></td></tr>

<tr><td class="confluenceTd"><p>Document Captured</p></td><td class="confluenceTd"><p>{type: ‘document.captured’,</p><p>data: {</p><p>document_type,</p><p>document_side</p><p>}}</p></td><td class="confluenceTd"><p>Image capture completed.</p></td></tr>

<tr><td class="confluenceTd"><p>Document uploaded </p></td><td class="confluenceTd"><p>{type: ‘document.uploaded’,</p><p>data: {</p><p>document_type,</p><p>document_side,</p><p>error</p><p>}}</p></td><td class="confluenceTd"><p>Captured document has been uploaded.</p></td></tr>

<tr><td class="confluenceTd"><p>Capture Cancelled</p></td><td class="confluenceTd"><p>{type: ‘document.capture-cancelled’,</p><p>data: {</p><p>document_type,</p><p>document_side,</p><p>error</p><p>}}</p></td><td class="confluenceTd"><p>Image capture has been cancelled.</p></td></tr>

<tr><td class="confluenceTd"><p>Documents verification initiated</p></td><td class="confluenceTd"><p>{type: ‘document.verification-initiated’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Document verification process initiated.</p></td></tr>

<tr><td class="confluenceTd"><p>Documents Verified</p></td><td class="confluenceTd"><p>{type: ‘document.verified’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Document verification process completed.</p></td></tr>

<tr><td class="confluenceTd"><p>Document error</p></td><td class="confluenceTd"><p>{type: 'document.error',</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Error processing ocument verification.</p></td></tr>

<tr><td class="confluenceTd"><p>OTP sent</p></td><td class="confluenceTd"><p>{type: 'otp.sent’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>OTP sent.</p></td></tr>

<tr><td class="confluenceTd"><p>OTP Verified</p></td><td class="confluenceTd"><p>{type: 'otp.verified’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>OTP verified.</p></td></tr>

<tr><td class="confluenceTd"><p>OTP error</p></td><td class="confluenceTd"><p>{type: 'otp.error',</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Error while OTP verification process.</p></td></tr>

<tr><td class="confluenceTd"><p>Application Processed</p></td><td class="confluenceTd"><p>{type: ‘transaction.processed’,</p><p>data: {</p><p>decision: string,</p><p>instnttxnid: UUID</p><p>}}</p></td><td class="confluenceTd"><p>User approval process completed.</p></td></tr>

<tr><td class="confluenceTd"><p>Application processing error</p></td><td class="confluenceTd"><p>{type: ‘transaction.error',</p><p>data: {</p><p>decision: string,</p><p>instnttxnid: UUID</p><p>}}</p></td><td class="confluenceTd"><p>Error while user approval processing.</p></td></tr>

</tbody></table>

## Instnt Object

<table data-layout="default" data-local-id="1461e79a-6df4-4f4b-b7df-a9a072096fd3" class="confluenceTable"><colgroup><col style="width: 173.0px;"><col style="width: 121.0px;"><col style="width: 465.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Property</strong></p></th><th class="confluenceTh"><p><strong>Type</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th></tr>

<tr><td class="confluenceTd"><p>instnttxnid</p></td><td class="confluenceTd"><p>UUID</p></td><td class="confluenceTd"><p>Instnt Transaction ID</p></td></tr>

<tr><td class="confluenceTd"><p>formId</p></td><td class="confluenceTd"><p>string</p></td><td class="confluenceTd"><p>Instnt Form/Workflow ID</p></td></tr>

<tr><td class="confluenceTd"><p>otpVerification</p></td><td class="confluenceTd"><p>boolean</p></td><td class="confluenceTd"><p>Whether Instnt Form/Workflow has OTP verification enabled</p></td></tr>

<tr><td class="confluenceTd"><p>documentVerification</p></td><td class="confluenceTd"><p>boolean</p></td><td class="confluenceTd"><p>Whether Instnt Form/Workflow has document verification enabled</p></td></tr>
</tbody></table>

<table data-layout="default" data-local-id="1461e79a-6df4-4f4b-b7df-a9a072096fd3" class="confluenceTable"><colgroup><col style="width: 173.0px;"><col style="width: 71.0px;"><col style="width: 65.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Method</strong></p></th><th class="confluenceTh"><p><strong>Parameters</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th></tr>
<tr><td class="confluenceTd"><p>

<a id="user-content-onevent" class="anchor" aria-hidden="true" href="#onevent">onEvent</a></p></td><td class="confluenceTd"><p>event</p></td><td class="confluenceTd"><p>An event handler receiving Instnt events.</p></td></tr>

<tr><td class="confluenceTd"><p><a id="user-content-init" class="anchor" aria-hidden="true" href="#init">init</a>
</p></td><td class="confluenceTd"><p></p></td><td class="confluenceTd"><p>Initializes an Instnt signup session.</p></td></tr>

<tr><td class="confluenceTd"><p><a id="user-content-uploadAttachment" class="anchor" aria-hidden="true" href="#uploadAttachment">uploadAttachment</a>
</p></td><td class="confluenceTd"><p>imageSettings, captureResult, <br>isSelfie = false</p></td><td class="confluenceTd"><p>Upload a document file to Instnt server.</p></td></tr>

<tr><td class="confluenceTd"><p><a id="user-content-verifyDocuments" class="anchor" aria-hidden="true" href="#verifyDocuments">verifyDocuments</a>
</p></td><td class="confluenceTd"><p>documentType</p></td><td class="confluenceTd"><p>Initiate document verification on Instnt server.</p></td></tr>

<tr><td class="confluenceTd"><p><a id="user-content-submitData" class="anchor" aria-hidden="true" href="#submitData">submitData</a>
</p></td><td class="confluenceTd"><p>data</p></td><td class="confluenceTd"><p>Submit the user entered data to Instnt server and initiate customer approval process.</p></td></tr>

<tr><td class="confluenceTd"><p><a id="user-content-getTransactionStatus" class="anchor" aria-hidden="true" href="#getTransactionStatus">getTransactionStatus</a></p></td><td class="confluenceTd"><p>instnttxnid</p></td><td class="confluenceTd"><p>Gets the status of the transaction that includes the form fields verification and document verification status</p></td></tr>

 <tr><td class="confluenceTd"><p><a id="user-content-sendOTP" class="anchor" aria-hidden="true" href="#sendOTP">sendOTP</a></p></td><td class="confluenceTd"><p>mobileNumber</p></td><td class="confluenceTd"><p>Sends one-time password to the mobile number provided</p></td></tr>
 
<tr><td class="confluenceTd"><p><a id="user-content-verifyOTP" class="anchor" aria-hidden="true" href="#verifyOTP">verifyOTP</a></p></td><td class="confluenceTd"><p>mobileNumber, otpCode</p></td><td class="confluenceTd"><p>Verifies one-time password to the provided mobile number</p></td></tr>

</tbody></table>

# External dependencies

* Material UI components 

```jsx
npm install @material-ui/core

import { TextField } from '@material-ui/core'
```

# Instnt's Sandbox

Instnt's Sandbox is a static environment that assesses provisioned synthetic identities that we give you for onboarding and testing purposes. The provisioned identities contain:

* Email address
* First name
*	Last name
*	Phone number
*	Physical address (city, state, zip)
*	IP address

Please contact support@instnt.org for more information concerning access to the sandbox environment.


# Assertion response payload

Now that you're connected to the sandbox environment, you can begin processing synthetic applicants provided to you by Instnt. The decisions applied to these synthetic applicants will be returned in the form of an assertion response payload that must be decrypted.

For more information concerning the decryption and analysis of the assertion response payload refer to the [Data Encryption and Decryption](https://support.instnt.org/hc/en-us/articles/360045168511) and [Getting and Analyzing the Assertion Response](https://support.instnt.org/hc/en-us/articles/360044671691) articles in the Developer Guide.

# Resource links 
- [Quick start guide](https://support.instnt.org/hc/en-us/articles/4408781136909)
- [Developer guide](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)
- [Instnt API endpoints](https://swagger.instnt.org/)
- [Instnt support](https://support.instnt.org/hc/en-us)



# FAQ

### What if I want to add some custom text fields onto my workflows?

After setting up the InstntSignUpProvider component, install the following **Material UI** components and import the text field using the following commands:

```jsx
npm install @material-ui/core

import { TextField } from '@material-ui/core'
```

Once the components have been installed and imported, collect data from the user as shown below:

```jsx
  <TextField
    id='email'
    type='email'
    label='Email'
    value={data['email']}
    onChange={onChange}
  />
```

The 'email' text here is used as an **example** and can be anything you'd like to appear on the workflow. Always include the value and onChange fields as written in the example above, as they mark the text field as data to be passed through the InstntSignUpProvider component.

### Minimum requirements

The minimum supported version of React is v16.8. If you use an older version,
upgrade React to use this library.

### What about other components like **InstntSignup**  or **InstntCustomSignup**

These are Instnt's legacy React components. These components are kept for backward compatibility but will be removed from the SDK in the future. For any new integration we recommend to use **InstntSignupProvider** instead of InstntSignup or InstntCustomSignup components. InstntSignupProvider is also required to implement features like Document Verification or OTP.

# License

The instnt-reactjs SDK is under MIT license.
