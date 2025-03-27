/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import EnterOtpCode from '../components/EnterOtpCode';
import { expect } from '@jest/globals';

describe('should render EnterOtpCode component properly when otpVerification is true', ()=>{
    const errorMessage = {};
    const otpCodeEntered = () => {};
    const onSignupFormElementChange = () => {};

    it('should render enter otp code form properly', ()=>{
        const { container } = render(<EnterOtpCode errorMessage={errorMessage} setOtpCode={otpCodeEntered} onChange={onSignupFormElementChange}/>)
        const enterContactForm = container.getElementsByClassName('otp-code-component');
        expect(enterContactForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('otp-code-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter OTP');
        const formSubHeading = container.getElementsByClassName('otp-code-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`We sent a one time passcode to your mobile number. Please enter that here`);
    })

    it('should render one input field of enter otp code form', ()=>{
        const { container } = render(<EnterOtpCode errorMessage={errorMessage} setOtpCode={otpCodeEntered} onChange={onSignupFormElementChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render enter otp code field properly', ()=>{
       const { container } = render(<EnterOtpCode errorMessage={errorMessage} setOtpCode={otpCodeEntered} onChange={onSignupFormElementChange}/>)
       const otpCodeLabel = container.querySelector('#otpCode-label');
       expect(otpCodeLabel).toBeDefined();
       expect(otpCodeLabel.textContent).toContain('OTP Code');
       const otpCode = container.querySelector('#otpCode');
       expect(otpCode).toBeDefined();
    })

})
