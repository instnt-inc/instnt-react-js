import React, { useEffect } from 'react';
import InnerHTML from 'dangerously-set-html-content';
import PropTypes from 'prop-types';
import { SDK_VERSION } from '../../version';
import { logMessage } from '../../logger';

const LIVE_SERVICE_URL = 'https://api.instnt.org';

const waitForObject = (windowProp: string, callback: { (instntObj: any): void; (arg0: Window): void; }, intervalTime = 100, timeout = 5000) => {
  let elapsedTime = 0;
  
  // Set up an interval to check for the object
  const checkInterval = setInterval(() => {
    elapsedTime += intervalTime;

    // Check if the property exists on the window object
    if ((window as any)[windowProp]) {
      clearInterval(checkInterval); // Stop the interval
      callback((window as any)[windowProp]); // Call the callback with the object
    }

    // Stop checking if timeout is reached
    if (elapsedTime >= timeout) {
      clearInterval(checkInterval);
      console.error(`Timed out waiting for ${windowProp}`);
    }
  }, intervalTime);
}

const getEnvironment = (url: string) => {
    const match = url.match(/https?:\/\/(.*?)\-api/);
    return match ? match[1] : null;
}

const InstntSignupProvider = ({
  formKey,
  isAsync = false,
  onEvent,
  serviceURL = LIVE_SERVICE_URL,
  children,
  idmetrics_version,
  instnttxnid,
}:any) => {

  useEffect(() => {
    const environment = getEnvironment(serviceURL);
    const script = document.createElement('script');
    script.src = `https://sdk.instnt.org/${environment}/assets/scripts/instntJsResource/instnt.js`; // Change this to the correct path
    script.async = true; // Ensures the script is loaded asynchronously

    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); 

  useEffect(() => {
    (window as any).instntSettings = {
      isAsync: isAsync,
      onEvent: onEvent,
    };

    (window as any).onInstntEvent = onEvent;
    (window as any).instntDebugInfo = {
        sdk: "react",
        sdk_version: SDK_VERSION,
        idmetrics_version: idmetrics_version || (window as any)?.idmetrics_version,
    };
    waitForObject("instnt", (instntObj: any) => {
      try{
        instntObj.init(formKey, serviceURL, instnttxnid, idmetrics_version);
      }catch(e){
        logMessage('error', 'Static file not loaded properly');
      }
    });
    return () => {
      // do any cleanup like script unloading etc
    };
  }, []);
  return (
    <React.Fragment>
      <InnerHTML html='<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' />
      {children}
    </React.Fragment>
  );
};

InstntSignupProvider.propTypes =  {
    formKey: PropTypes.string.isRequired,
    isAsync: PropTypes.bool,
    onEvent: PropTypes.func,
    serviceURL: PropTypes.string.isRequired,
    children: PropTypes.element,
    idmetrics_version: PropTypes.string,
    instnttxnid : PropTypes.string
};

export default InstntSignupProvider;
