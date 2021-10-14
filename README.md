# Instnt React SDK

This documentation covers the basics of Instnt React SDK implementation. Put simply, React is an open-source front-end developer library utilized by Instnt to create a more streamlined and elegant integration with your company's forms. For a more detailed look at this implementation, visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

[![build status](https://img.shields.io/travis/instnt/instnt-react-js/master.svg?style=flat-square)](https://travis-ci.org/instnt/instnt-react-js)
[![npm version](https://img.shields.io/npm/v/@instnt/instnt-react-js.svg?style=flat-square)](https://www.npmjs.com/package/@instnt/instnt-react-js)

### Table of Contents
- [Getting Started](https://github.com/instnt-inc/instnt-react-js#getting-started)
- [Rendering a Standard Signup Workflow with Instnt React SDK](https://github.com/instnt-inc/instnt-react-js#rendering-a-standard-signup-form-with-instnt-react-sdk)
- [Rendering a Custom Signup Workflow with Instnt React SDK](https://github.com/instnt-inc/instnt-react-js#rendering-a-custom-signup-form-with-instnt-react-sdk)
- [Submit Workflow to Instnt Using the JavaScript Helper Function](https://github.com/instnt-inc/instnt-react-js#submit-form-to-instnt-using-the-javascript-helper-function)
- [Submit Workflow to Instnt via API](https://github.com/instnt-inc/instnt-react-js#submit-form-to-instnt-via-api)
- [Instnt's Sandbox](https://github.com/instnt-inc/instnt-react-js#instnts-sandbox)
- [FAQ](https://github.com/instnt-inc/instnt-react-js#faq)

### Related Material
- [Instnt API Endpoints](https://swagger.instnt.org/)

# Getting Started

In order to begin utilizing Instnt React SDK, enter the following command to install Instnt's React components:

```sh
npm i @instnt/instnt-react-js
```
This process should only take a few moments. Once complete, import Instnt's React Workflow component:

```jsx
import { InstntSignUp } from '@instnt/instnt-react-js'
```
InstntSignUp imports a boilerplate Instnt workflow with the following fields:

* Email Address
* First Name
* Surname
* Mobile Number
* State
* Street Address
* Zip code
* City
* Country
* Submit My Workflow Button

# Rendering a Standard Signup Workflow with Instnt React SDK

Now that the components have been installed and imported, it's time to set up the function using the [following command](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L44):

```jsx
function App () {
  return (
      <div className= 'App'>
        <InstntSignUp sandbox
         formId= 'v879876100000'/>
      </div>
    )
  }
```

### Parameters


* `formId` - a Workflow ID is required in order to properly execute this function. For more information concerning Workflow IDs, please visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

* The `sandbox` parameter is added to connect the workflow components to Instnt's Sandbox environment. More information concerning the sandbox environment is available in this [quick start guide](https://github.com/instnt-inc/instnt-react-js#instnts-sandbox).

* `redirect` - Optional. Default: true. When set to false, user will not be automatically redirected the the success/failure page

* `onResponse` - Optional. Event handler invoked after the response is received from Instnt. The handler will be passed to parameters: onResponse(error, data). `error` will contain error information if one occurred.


With the above code complete, start the application by running the following command:

```jsx
npm start
```
A rotating React icon will appear onscreen as the application takes a few moments to load. Once the application has loaded, a fully rendered workflow will appear including a unique signature and expiring token.


# Rendering a Custom Signup Workflow with Instnt React SDK

If you'd like to integrate Instnt's back-end functionality with your company's UI, import the [InstntCustomSignUp](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L11) workflow and set the [data object parameters](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L24-L26) using the following commands:

```jsx
import { InstntCustomSignUp } from '@instnt/instnt-react-js'

const submitMyForm = () -> {
  window.instnt.submitCustomForm(data);
};
```
The import command imports Instnt's Custom Signup workflow, which hides all of the standard workflow fields and application functionality when rendered, allowing for the addition of new workflow fields a la carte.

The second command takes all of the data objects referenced throughout your sign-up process via your company's own UI and passes them through the InstntCustomSignUp function, allowing for your UI to integrate with Instnt without having to change a pixel.

To set up the function, enter the [following command](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L49):

```jsx
const onResponse = (error, data) => {
  console.log(`Decision: ${data['decision']}`)
}

function App () {
  return (
      <div className= 'App'>
        <InstntCustomSignUp
         sandbox
         formId= 'v879876100000'/>
         redirect={false}
         onResponse={onResponse}
      </div>
    )
  }
```

## Submit Workflow to Instnt Using the JavaScript Helper Function

```jsx
const submitMyForm = () -> {
  window.instnt.submitCustomForm(data);
};
```

## Submit Workflow to Instnt via API

This submission method can be utilized for submitting data from either the front end or the backend by collecting data from the applicant, using Instnt SDK's functionality `window.instnt.getToken()` to retrieve an `instnt_token` that encapsulates Instnt system data as well as the applicant's device and behavioral information, and then submitting all of the data to Instnt.

When submitting this data from the backend, the `instnt_token` should be collected on the web app and transferred to the backend.

### Sandbox

```jsx
  const submitFormViaAPI = () => {
    // 'data' contains user data fields
    // Get system information using window.instnt.getToken() and send it along with data using 'instnt_token' key
    const token = window.instnt.getToken();
    const dataWithToken = { ...data, instnt_token: token };

    fetch('https://sandbox-api.instnt.org/public/submitformdata/v1.0'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithToken),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
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

# FAQ

### What if I want to add some custom text fields onto my workflows?

After setting up the InstntCustomSignUp function, simply install the following Material UI components and import the text field using the following commands:

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

The 'email' text here is used as an example and can be anything you'd like to have appear on the workflow. Always include the value and onChange fields as written in the example above, as they mark the text field as data to be passed through the InstntCustomSignUp function.

### Minimum requirements

The minimum supported version of React is v16.8. If you use an older version,
upgrade React to use this library.

# Document Verification

Document Verification Pre-requisites
------------------------------------

*   Document verification can be employed on mobile-reactive web-apps
    
*   iOS and Android Mobile devices with Chrome or Safari browsers is supported
    
*   Desktop devices (laptops, PCs) are unsupported due to poor quality of embedded cameras and lack of gyroscopes for orientation detection. While the feature will work on such devices running Chrome or Safari browsers, the experience can vary
    
*   Do not include HTML tags with IDs containing the prefix 'aid'. for e.g. <div id=’aidFooter’> in your webapp as this prefix is reserved for user by the toolkit 
    

Setup
-----

1.  In order to begin utilizing Instnt React SDK, enter the following command to install Instnt's React components:
    

`npm i @instnt/instnt-react-js`

or

yarn add `@instnt/instnt-react-js`

2\. Once complete, import Instnt's React Workflow component:

`import { InstntSignupProvider, InstntImageProcessor } from '@instnt/instnt-react-js'`

3\. InstantSignupProvider acts as a top level container component which is responsible for initiate the session and return the accompanying Javascript functions and configurations that customer application can use to take different actions.

4\. InstntImageProcessor component is a child component that can be composed nested in InstntSignupProvider and each render of this component initiate a document capture event.

5\. Instnt SDK bundles various 3rd party SDKs one of which is AuthenticID SDK which is responsible for the document capture. InstntImageProcessor abstract the document capture functionality by providing a simplified React component interface.

6\. The customer can include any number of steps in the signup process by including its own react components as child component of `InstntSignUpProvider`.

### Example configuration

Setup the workflow steps:

```java
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
    <ShowDecision data={decision} error={error} />,
  ];
```

*   Wrapup the components with InstntSignupProvider. In this example only one of the child component gets rendered based on the activeStep state.
    
*   InstntSignupProvider connects to Instnt’s backend API onMount (or when it receives a new property like form\_key) and initiates a new transaction identified by a unique transactionID. It also downloads additional scripts and client side APIs.
    
*   On the successful initialization, InstntSignupProvider invokes onInitHandler callback function passing a globally available reference to instnt object and associated functions.
    

```java
<InstntSignupProvider form_key={form_key} onEvent={onEventHandler}>
    {steps[activeStep]}
</InstntSignupProvider>
```

The calling code then use the use the Instnt object to access signup related configurations and functionalities

```java
const [instnt, setInstnt] = useState({});  // Instnt object
const [data, setData] = useState({}); // Data fields entered by the user

onEventHandler = async (event: InstntEvent) => {
    switch (event.type) {
      case 'init': 
          setInstnt(event.data.instnt); // save the Instnt object in state
          break;
      case 'image_captured': 
          // If returns true, the document is uploaded to Instnt
          return true;
      case 'image_cancelled': 
          // Show an error to the user
          break;
      case 'transaction_processed': 
          // Customer approval completed
          setShowSpinner(false);
          setDecision(event.data);
          handleNext();
          break;
    }
}

onSubmitButtonClick = async () => {
  instnt.submitData(data)
}
```

Components
----------

### InstntSignupProvider

#### Properties

*   **formId** - Required. A Workflow ID. For more information concerning Workflow IDs, please visit Instnt's documentation library.
    
*   **sandbox** - Optional. If set to true, a sandbox (test) environment will be used instead of a production environment
    
*   **onEvent** - Optional. Use to provide and event handler invoked when various Instnt events occur. onEventHandler(event)
    

### InstntImageProcessor

Properties

*   documentType: “License”
    
*   documentSide: “Front”
    
*   captureMode: “Manual”
    

### Events

<table data-layout="default" data-local-id="1160fb90-4271-4e56-bdfe-3e08f28e5d90" class="confluenceTable"><colgroup><col style="width: 159.0px;"><col style="width: 200.0px;"><col style="width: 400.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p></p></th><th class="confluenceTh"><p></p></th><th class="confluenceTh"><p></p></th></tr><tr><td class="confluenceTd"><p>Instnt Initialized</p></td><td class="confluenceTd"><p>{type: ‘init’,</p><p>data: {</p><p>instnt: object</p><p>}}</p></td><td class="confluenceTd"><p>Instnt framework finished initializaing and is ready to accept user input.</p><p>Instnt object contains a transaction ID and SDK functions</p></td></tr><tr><td class="confluenceTd"><p>Image Captured</p></td><td class="confluenceTd"><p>{type: ‘image_captured’,</p><p>data: {</p><p>document_type,</p><p>document_side</p><p>}}</p></td><td class="confluenceTd"><p>Image capture completed</p></td></tr><tr><td class="confluenceTd"><p>Capture Cancelled</p></td><td class="confluenceTd"><p>{type: ‘image_cancelled’,</p><p>data: {</p><p>document_type,</p><p>document_side,</p><p>error</p><p>}}</p></td><td class="confluenceTd"><p>Image capture has been cancelled</p></td></tr><tr><td class="confluenceTd"><p>Documents Verified</p></td><td class="confluenceTd"><p>{type: ‘documents_verified’,</p><p>data: {</p><p>}}</p></td><td class="confluenceTd"><p>Document verification process completed</p></td></tr><tr><td class="confluenceTd"><p>Application Processed</p></td><td class="confluenceTd"><p>{type: ‘processed’,</p><p>data: {</p><p>decision: string,</p><p>instnttxnid: UUID</p><p>}}</p></td><td class="confluenceTd"><p>User approval process completed</p></td></tr></tbody></table>

### Instnt Object

<table data-layout="default" data-local-id="1461e79a-6df4-4f4b-b7df-a9a072096fd3" class="confluenceTable"><colgroup><col style="width: 173.0px;"><col style="width: 121.0px;"><col style="width: 465.0px;"></colgroup><tbody><tr><th class="confluenceTh"><p><strong>Property</strong></p></th><th class="confluenceTh"><p><strong>Type</strong></p></th><th class="confluenceTh"><p><strong>Description</strong></p></th></tr><tr><td class="confluenceTd"><p>instnttxnid</p></td><td class="confluenceTd"><p>UUID</p></td><td class="confluenceTd"><p>Instnt Transaction ID</p></td></tr><tr><td class="confluenceTd"><p>formId</p></td><td class="confluenceTd"><p>string</p></td><td class="confluenceTd"><p>Instnt Form/Workflow ID</p></td></tr><tr><td class="confluenceTd"><p>onEvent</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>An event handler receiving Instnt events</p></td></tr><tr><td class="confluenceTd"><p>uploadAttachment</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>Upload a document file to Instnt server</p></td></tr><tr><td class="confluenceTd"><p>verifyDocuments</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>Initiate document verification on Instnt server</p></td></tr><tr><td class="confluenceTd"><p>submitData</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>Submit user entered data to Instnt server and initiate customer approval process</p></td></tr><tr><td class="confluenceTd"><p>getTransactionStatus</p></td><td class="confluenceTd"><p>function</p></td><td class="confluenceTd"><p>Gets the status of the transaction that includes the form fields verification and documents verification status</p></td></tr></tbody></table>

