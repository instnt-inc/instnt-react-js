import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { logMessage } from '../../logger';
import useInstntScript from '../../hooks/useInstntScript';
import useSriManifest from '../../hooks/useSriManifest';

const LIVE_SERVICE_URL = 'https://api.instnt.org';

const waitForObject = (
  windowProp: string,
  callback: (instntObj: any) => void,
  onTimeout: () => void,
  intervalTime = 100,
  timeout = 10000,
): ReturnType<typeof setInterval> => {
  let elapsedTime = 0;

  const checkInterval = setInterval(() => {
    elapsedTime += intervalTime;

    if ((window as any)[windowProp]) {
      clearInterval(checkInterval);
      callback((window as any)[windowProp]);
      return;
    }

    if (elapsedTime >= timeout) {
      clearInterval(checkInterval);
      onTimeout();
    }
  }, intervalTime);

  return checkInterval;
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
  if (environment === 'Unknown Environment') {
    onEvent?.({ type: 'transaction.error', data: {
      message: `Unrecognized serviceURL: ${serviceURL}`,
      type: 'error'
    }});
    return;
  }
  const scriptSrc = `https://sdk.instnt.org/${environment}/assets/scripts/instntJsResource/instnt.js`;

  const { sri, version: sdkVersion, status: manifestStatus, cdnCorsSupported } = useSriManifest(environment);
  const manifestResolved = manifestStatus === 'ready' || manifestStatus === 'error';

  const scriptStatus = useInstntScript(manifestResolved ? scriptSrc : '', sri, cdnCorsSupported);

  useEffect(() => {
    if (manifestStatus === 'ready') {
      logMessage('log', 'Instnt SDK manifest resolved, version: ', sdkVersion);
    }
    if (scriptStatus === 'error') {
      logMessage('error', 'Failed to load Instnt SDK script');
    }
  }, [manifestStatus, scriptStatus, sdkVersion]);

  useEffect(() => {
    (window as any).instntSettings = Object.freeze({
      isAsync: isAsync,
      onEvent: onEvent,
    });

    try {
      delete (window as any).onInstntEvent;
    } catch {}
    
    Object.defineProperty((window as any), 'onInstntEvent', {
      value: onEvent,
      writable: false,
      configurable: true, // allow re-definition on prop change
    });

    const intervalId = waitForObject(
      "instnt",
      (instntObj: any) => {
        try {
          instntObj.init(formKey, serviceURL, instnttxnid, idmetrics_version);
        } catch (e) {
          logMessage('error', 'Static file not loaded properly');
        }
      },
      () => {
        logMessage('error', 'Timed out waiting for instnt object');
        onEvent?.({ type: 'transaction.error', data: { message: 'Timed out waiting for Instnt SDK to initialize', type: 'error' } });
      },
    );
    return () => {
      clearInterval(intervalId);
    };
  }, [formKey,serviceURL]);
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
