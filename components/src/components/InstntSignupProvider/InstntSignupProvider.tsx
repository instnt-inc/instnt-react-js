import React, { useState, useEffect, createContext } from 'react';
import InnerHTML from 'dangerously-set-html-content';

export const InstntSignupContext = createContext({});

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
      const rawResponse = await fetch(
        props.serviceURL + '/public/transactions/',
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
      const data = await rawResponse.json();
      setInstntFormCode(data.html);
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

export default InstntSignupProvider;
