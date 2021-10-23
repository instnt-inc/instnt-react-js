import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InnerHTML from 'dangerously-set-html-content';

const LIVE_SERVICE_URL = 'https://api.instnt.org';
const SANDBOX_SERVICE_URL = 'https://sandbox-api.instnt.org';

const propTypes = {
  formId: PropTypes.string.isRequired,
  serviceURL: PropTypes.string,
  sandbox: PropTypes.bool,
  hideFormFields: PropTypes.bool,
  redirect: PropTypes.bool,
  onResponse: PropTypes.func,
};

interface InstntSignUpProps {
  formId: String;
  serviceURL?: String;
  sandbox?: Boolean;
  hideFormFields?: Boolean;
  redirect?: Boolean;
  onResponse?: Function;
}

const InstntSignUp = ({
  formId,
  serviceURL = LIVE_SERVICE_URL,
  sandbox = false,
  hideFormFields = false,
  redirect = true,
  onResponse = undefined,
}: InstntSignUpProps) => {
  const [instntFormCode, setInstntFormCode] = useState('');

  useEffect(() => {
    fetch(
      (sandbox ? SANDBOX_SERVICE_URL : serviceURL) +
        '/public/getformcodes/' +
        formId + "?" +
        (hideFormFields ? '&hide_form_fields=true' : '') +
        (!redirect ? '&redirect=false' : '')
    )
      .then((res) => res.json())
      .then((data) => {
        if (!(window as any).instnt) {
          (window as any).instnt = {};
        }
        (window as any).instnt.onResponse = onResponse
        setInstntFormCode(data.html);
      });
  }, [formId, serviceURL, hideFormFields]);

  return (
    <React.Fragment>
      <InnerHTML html='<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' />
      {instntFormCode && (
        <InnerHTML id="instnt-form-generator" html={instntFormCode} />
      )}
    </React.Fragment>
  );
};

InstntSignUp.propTypes = propTypes;

export default InstntSignUp;
