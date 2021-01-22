import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InnerHTML from 'dangerously-set-html-content';

const LIVE_SERVICE_URL = 'https://api.instnt.org';
const SANDBOX_SERVICE_URL = 'https://sandbox2-api.instnt.org';

const propTypes = {
  formId: PropTypes.string.isRequired,
  serviceURL: PropTypes.string,
  hideFormFields: PropTypes.bool,
};

interface InstntSignUpProps {
  formId: String;
  serviceURL?: String;
  sandbox?: Boolean;
  hideFormFields: Boolean;
}

const InstntSignUp = ({
  formId,
  serviceURL = LIVE_SERVICE_URL,
  sandbox = false,
  hideFormFields = false,
}: InstntSignUpProps) => {
  const [instntFormCode, setInstntFormCode] = useState('');

  useEffect(() => {
    fetch(
      (sandbox ? SANDBOX_SERVICE_URL : serviceURL) +
        '/public/getformcodes/' +
        formId +
        (hideFormFields ? '?hide_form_fields=true' : '')
    )
      .then((res) => res.json())
      .then((data) => {
        setInstntFormCode(data.html);
      });
  }, [formId, serviceURL, hideFormFields]);

  return (
    <React.Fragment>
      <InnerHTML html='<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' />
      {instntFormCode && (
        <InnerHTML id='instnt-form-generator' html={instntFormCode} />
      )}
    </React.Fragment>
  );
};

InstntSignUp.propTypes = propTypes;

export default InstntSignUp;
