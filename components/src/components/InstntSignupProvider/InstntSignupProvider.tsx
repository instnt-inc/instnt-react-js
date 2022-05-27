import React, { useState, useEffect } from 'react';
import InnerHTML from 'dangerously-set-html-content';
import PropTypes from 'prop-types';

const LIVE_SERVICE_URL = 'https://api.instnt.org';
const SANDBOX_SERVICE_URL = 'https://sandbox-api.instnt.org';

const propTypes = {
  formKey: PropTypes.string.isRequired,
  isAsync: PropTypes.bool,
  onEvent: PropTypes.func,
  sandbox: PropTypes.bool,
  serviceURL: PropTypes.string,
  children: PropTypes.node,
};

interface InstntSignupProviderProps {
  formKey: String;
  isAsync?: Boolean;
  onEvent?: Function;
  sandbox?: Boolean;
  serviceURL?: String;
  children?: React.ReactNode;
}

const InstntSignupProvider = ({
  formKey,
  isAsync = false,
  onEvent,
  sandbox = false,
  serviceURL = LIVE_SERVICE_URL,
  children,
}: InstntSignupProviderProps) => {
  const [instntFormCode, setInstntFormCode] = useState('');

  useEffect(() => {
    (window as any).instntSettings = {
      isAsync: isAsync,
      onEvent: onEvent,
    };

    (window as any).onInstntEvent = onEvent; // Deprecated
    (async () => {
      const context = 'initiating Instnt transaction';
      const url =
        (sandbox ? SANDBOX_SERVICE_URL : serviceURL) +
        '/public/transactions';
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

InstntSignupProvider.propTypes = propTypes;

export default InstntSignupProvider;
