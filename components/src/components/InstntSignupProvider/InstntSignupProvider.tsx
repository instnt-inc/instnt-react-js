import React, { useState, useEffect } from 'react';
import InnerHTML from 'dangerously-set-html-content';
import PropTypes from 'prop-types';
import { SDK_VERSION } from '../../version';

const LIVE_SERVICE_URL = 'https://api.instnt.org';

// interface InstntSignupProviderProps {
//   formKey: String;
//   isAsync?: Boolean;
//   onEvent?: Function;
//   serviceURL?: String;
//   children?: React.ReactNode;
//   idmetrics_version?: String;
// }
// Instead of Interface we can pass 'any', but after doing that we are not getting any warning while passing different data type

/**NO NEED TO USE INTERFACE AS WE ARE NOT CALLING INSTNTSIGNUPPROVIDER IN ITERATION */


const InstntSignupProvider = ({
  formKey,
  isAsync = false,
  onEvent,
  serviceURL = LIVE_SERVICE_URL,
  children,
  idmetrics_version,
}:any) => {
  const [instntFormCode, setInstntFormCode] = useState('');

  useEffect(() => {
    if ((window as any).instnt) {
      (window as any).instnt.debug={
        sdk: "react",
        sdk_version: SDK_VERSION,
        idmetrics_version: idmetrics_version || (window as any)?.idmetrics_version,
      }
    }
  }, [instntFormCode]);

  useEffect(() => {
    (window as any).instntSettings = {
      isAsync: isAsync,
      onEvent: onEvent,
    };

    (window as any).onInstntEvent = onEvent; // Deprecated
    (async () => {
      const context = 'initiating Instnt transaction';
      let url = serviceURL + '/public/transactions?sdk=react&sdk_version=' + SDK_VERSION;
      if (idmetrics_version && idmetrics_version.length > 0) {
        url += '&idmetrics_version=' + idmetrics_version;
      }
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form_key: formKey,
            hide_form_fields: true,
            redirect: false,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setInstntFormCode(data.html);
        } else {
          console.log('Error processing ' + url, data);
          if (onEvent) {
            onEvent({
              type: 'transaction.error',
              data: {
                message:
                  'Received error: ' + data.errorMessage + ' while ' + context,
                status: data.status,
                type: 'error',
              },
            });
          }
        }
      } catch (error) {
        console.log('Error while connecting to ' + url, error);
        if (onEvent) {
          onEvent({
            type: 'transaction.error',
            data: {
              message: 'Received error: ' + error.message + ' while ' + context,
              type: 'error',
            },
          });
        }
      }
    })();
    return () => {
      // do any cleanup like script unloading etc
    };
  }, []);
  return (
    <React.Fragment>
      <InnerHTML html='<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' />
      {instntFormCode && (
        <InnerHTML id="instnt-form-generator" html={instntFormCode} />
      )}
      {children}
    </React.Fragment>
  );
};

InstntSignupProvider.propTypes =  {
    formKey: PropTypes.string.isRequired,
    isAsync: PropTypes.bool,
    onEvent: PropTypes.func,
    serviceURL: PropTypes.string,
    children: PropTypes.node,
    idmetrics_version: PropTypes.string
};

export default InstntSignupProvider;
