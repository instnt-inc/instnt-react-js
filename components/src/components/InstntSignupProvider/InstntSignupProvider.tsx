import React, { useState, useEffect } from 'react';
import InnerHTML from 'dangerously-set-html-content';
import PropTypes from 'prop-types';


const propTypes = {
  formKey: PropTypes.string.isRequired,
  serviceURL: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};

interface InstntSignupProviderProps {
  formKey: String;
  onEvent: any;
  sandbox: any;
  serviceURL: any;
  children: any;
}

const InstntSignupProvider = (props: InstntSignupProviderProps) => {
  const [instntFormCode, setInstntFormCode] = useState('');

  useEffect(() => {
    (window as any).onInstntEvent = props.onEvent;
    (async () => {
      const url = props.serviceURL + '/public/transactions/';
      try {
        const response = await fetch(
          url,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form_key: props.formKey,
              hide_form_fields: true,
              redirect: false,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setInstntFormCode(data.html);
        } else {
          console.log("Error processing " + url, data);
          props.onEvent({
            type: 'instnt_error',
            message: { 'text': data.errorMessage + ' ' + url, 'status': data.status, 'type': 'error' }
          });
        }
      } catch (error) {
        console.log("Error while connecting to " + url, error);
        props.onEvent({
          type: 'instnt_error',
          message: { 'text': error.message + ' ' + url, 'type': 'error' }
        });
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
      {props.children}
    </React.Fragment>
  );
};

InstntSignupProvider.propTypes = propTypes;

export default InstntSignupProvider;
