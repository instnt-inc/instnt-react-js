import React from 'react';
import InstntSignUp from '../InstntSignUp/InstntSignUp';
import PropTypes from 'prop-types';

const propTypes = {
  formId: PropTypes.string.isRequired,
  serviceURL: PropTypes.string,
};

interface InstntCustomSignUpProps {
  formId: String;
  serviceURL?: String;
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
