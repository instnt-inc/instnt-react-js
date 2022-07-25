import React from 'react';
import InstntSignUp from '../InstntSignUp/InstntSignUp';
import PropTypes from 'prop-types';


// interface InstntCustomSignUpProps {
//   formId: String;
//   sandbox?: Boolean;
//   serviceURL?: String;
//   redirect?: Boolean;
//   onResponse?: Function;
// }
/**NO NEED TO USE INTERFACE AS WE ARE NOT CALLING INSTNTCUSTOMSIGNUPPROCESSOR IN ITERATION */

const InstntCustomSignUp = (props: any) => {
  return (
    <div style={{ display: 'none' }}>
      <InstntSignUp {...props} hideFormFields={true}></InstntSignUp>
    </div>
  );
};

InstntCustomSignUp.propTypes = {
  formId: PropTypes.string.isRequired,
  sandbox: PropTypes.bool,
  serviceURL: PropTypes.string,
  redirect: PropTypes.bool,
  onResponse: PropTypes.func
};

export default InstntCustomSignUp;
