import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { SDK_VERSION } from '../../version';
import { logMessage } from '../../logger';
import useInstntScript from '../../hooks/useInstntScript';
import useSriManifest from '../../hooks/useSriManifest';

const LIVE_SERVICE_URL = 'https://api.instnt.org';

const waitForObject = (windowProp: string, callback: { (instntObj: any): void; (arg0: Window): void; }, intervalTime = 100, timeout = 10000) => {
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

const environmentMap = {
  dev2: [
    "https://dev-api.instnt.org",
    "https://dev2-api.instnt.org"
  ],
  stage2: [
    "https://stage-api.instnt.org",
    "https://stage2-api.instnt.org"
  ],
  preprod2: [
    "https://preprod-api.instnt.org",
    "https://preprod2-api.instnt.org"
  ],
  prod2: [
    "https://api.instnt.org",
    "https://prod-api.instnt.org",
    "https://prod2-api.instnt.org",
    "https://api-ca.instnt.org",
    "https://ca-prod-api.instnt.org",
    "https://ca-prod2-api.instnt.org"
  ],
  sandbox2: [
    "https://sandbox-api.instnt.org",
    "https://sandbox2-api.instnt.org"
  ]
};

const getEnvironment = (url: string) => {
  for (const [env, urls] of Object.entries(environmentMap)) {
    if (urls.includes(url)) {
      return env;
    }
  }
  return "Unknown Environment";
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

  const environment = getEnvironment(serviceURL);
  const scriptSrc = `https://sdk.instnt.org/${environment}/assets/scripts/instntJsResource/instnt.js`;

  // Step 1: fetch the per-environment manifest to get the SRI hash.
  // The script is held back until the manifest resolves (ready or error).
  const { sri, version: sdkVersion, status: manifestStatus } = useSriManifest(environment);
  const manifestResolved = manifestStatus === 'ready' || manifestStatus === 'error';

  // Step 2: load the script only after manifest resolution.
  // If manifest succeeded, sri is applied as the integrity attribute.
  // If manifest failed, sri is undefined and the script loads without SRI (with a warning already logged by the hook).
  const scriptStatus = useInstntScript(manifestResolved ? scriptSrc : '', sri);

  useEffect(() => {
    if (manifestStatus === 'ready') {
      logMessage('log', 'Instnt SDK manifest resolved, version: ', sdkVersion);
    }
    if (scriptStatus === 'error') {
      logMessage('error', 'Failed to load Instnt SDK script');
    }
  }, [manifestStatus, scriptStatus, sdkVersion]);

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
