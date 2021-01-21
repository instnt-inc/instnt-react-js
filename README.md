# Instnt React SDK

This documentation covers the basics of Instnt React SDK implementation. Put simply, React is an open-source front-end developer library utilized by Instnt to create a more streamlined and elegant integration with your company's forms. For a more detailed look at this implementation, visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

[![build status](https://img.shields.io/travis/instnt/instnt-react-js/master.svg?style=flat-square)](https://travis-ci.org/instnt/instnt-react-js)
[![npm version](https://img.shields.io/npm/v/@instnt/instnt-react-js.svg?style=flat-square)](https://www.npmjs.com/package/@instnt/instnt-react-js)

### Table of Contents
- [Getting Started](https://github.com/instnt-inc/instnt-react-js#getting-started)
- [Rendering a Standard Signup Form with Instnt React SDK](https://github.com/instnt-inc/instnt-react-js#rendering-a-standard-signup-form-with-instnt-react-sdk)
- [Rendering a Custom Signup Form with Instnt React SDK](https://github.com/instnt-inc/instnt-react-js#rendering-a-custom-signup-form-with-instnt-react-sdk)
- [Instnt's Sandbox](https://github.com/instnt-inc/instnt-react-js#instnts-sandbox)
- [FAQ](https://github.com/instnt-inc/instnt-react-js#faq)

### Related Material
- [Instnt API Endpoints](https://swagger.instnt.org/)

# Getting Started

In order to begin utilizing Instnt React SDK, enter the following command to install Instnt's React components:

```sh
npm i @instnt/instnt-react-js
```
This process should only take a few moments. Once complete, import Instnt's React Form component:

```jsx
import { InstntSignUp } from '@instnt/instnt-react-js'
```
InstntSignUp imports a boilerplate Instnt form with the following fields:

* Email Address
* First Name
* Surname
* Mobile Number
* State
* Street Address
* Zip code
* City
* Country
* Submit My Form Button

# Rendering a Standard Signup Form with Instnt React SDK

Now that the components have been installed and imported, it's time to set up the function using the [following command](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L44):

```jsx
function App () {
  return (
      <div className= 'App'>
        <InstntSignUp sandbox
         formId= 'xxxxxxxxxxxxxx'/>
      </div>
    )
  }
```
Note that a Form ID is required in order to properly execute this function. For more information concerning Form IDs, please visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

The `sandbox` parameter is added to connect the form components to Instnt's Sandbox environment. More information concerning the sandbox environment is available in this [quick start guide](https://github.com/instnt-inc/instnt-react-js#instnts-sandbox).

With the above code complete, start the application by running the following command:

```jsx
npm start
```
A rotating React icon will appear onscreen as the application takes a few moments to load. Once the application has loaded, a fully rendered form will appear including a unique signature and expiring token.


# Rendering a Custom Signup Form with Instnt React SDK

If you'd like to integrate Instnt's back-end functionality with your company's UI, import the [InstntCustomSignUp](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L11) form and set the [data object parameters](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L24-L26) using the following commands:

```jsx
import { InstntCustomSignUp } from '@instnt/instnt-react-js'

const submitMyForm = () -> {
  window.instnt.submitCustomForm(data);
};
```
The import command imports Instnt's Custom Signup form, which hides all of the standard form fields and application functionality when rendered, allowing for the addition of new form fields a la carte.

The second command takes all of the data objects referenced throughout your sign-up process via your company's own UI and passes them through the InstntCustomSignUp function, allowing for your UI to integrate with Instnt without having to change a pixel.

To set up the function, enter the [following command](https://github.com/instnt-inc/instnt-react-js/blob/48d6d45d7966de5fa809f5eb6e6f0fe86ccc13de/examples/forms/src/App.js#L49):

```jsx
function App () {
  return (
      <div className= 'App'>
        <InstntCustomSignUp
         sandbox
         formId= 'xxxxxxxxxxxxxx'/>
      </div>
    )
  }
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

### What if I want to add some custom text fields onto my forms?

After setting up the InstntCustomSignUp function, simply install the following Material UI components and import the text field using the following commands:

```jsx
npm install @material-ui/core

import { TextField } from '@material-ui/core'
```

Once the components have been installed and imported, use the following code:

```jsx
  <TextField
    id='email'
    type='email'
    label='Email'
    value={data['email']}
    onChange={onChange}
  />
```

The 'email' text here is used as an example and can be anything you'd like to have appear on the form. Always include the value and onChange fields as written in the example above, as they mark the text field as data to be passed through the InstntCustomSignUp function.

### Minimum requirements

The minimum supported version of React is v16.8. If you use an older version,
upgrade React to use this library.
