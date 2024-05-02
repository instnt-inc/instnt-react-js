import React, { useState, useEffect } from 'react';
import InnerHTML from 'dangerously-set-html-content';
import PropTypes from 'prop-types';
import { logMessage } from '../../logger';
const LIVE_SERVICE_URL = 'https://api.instnt.org';

const InstntVerifyProvider = ({
  instnttxnid,
  serviceURL= LIVE_SERVICE_URL,
  onEvent,
  children
}:any) => {
  const [instntFormCode, setInstntFormCode] = useState('');
  useEffect(() => {
    (window as any).instntSettings = {
      onEvent: onEvent,
    };

    (window as any).onInstntEvent = onEvent;
    (async () => {
      const context = 'initiating Instnt transaction';
      let url = serviceURL + '/public/verify/'+ instnttxnid;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setInstntFormCode(data.html);
        } else {
          logMessage('error', 'Error processing :', `${url}, ${data}`);
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
        logMessage('error', 'Error while initiating verify transaction process');
        logMessage('error', 'Error while connecting to :' ,`${url}, ${error}`);
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

InstntVerifyProvider.propTypes =  {
    instnttxnid: PropTypes.string.isRequired,
    onEvent: PropTypes.func,
    serviceURL: PropTypes.string.isRequired,
    children: PropTypes.element,
};

export default InstntVerifyProvider;
