import React from 'react';
import InstntSignUp from '../InstntSignUp/InstntSignUp';
import PropTypes from 'prop-types';

const propTypes = {
  formId: PropTypes.string.isRequired,
  sandbox: PropTypes.bool,
  serviceURL: PropTypes.string,
  redirect: PropTypes.bool,
  onResponse: PropTypes.func
};

interface InstntCustomSignUpProps {
  formId: String;
  sandbox?: Boolean;
  serviceURL?: String;
  redirect?: Boolean;
  onResponse?: Function;
}

const InstntCustomSignUp = (props: InstntCustomSignUpProps) => {
  return (
    <div style={{ display: 'none' }}>
      <InstntSignUp {...props} hideFormFields={true}></InstntSignUp>
    </div>
  );
};

InstntCustomSignUp.propTypes = propTypes;

export default InstntCustomSignUp;
