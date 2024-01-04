/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import EnterContact from '../components/signup_form/EnterContact';
import { expect } from '@jest/globals';

describe('should render EnterContact component properly when otpVerification  is false', ()=>{
    const data = {};
    const errorMessage = {};
    const onChange = () => {};
    const mobileNumberOnBlur = () => {};
    const otpVerification = false; 

    it('should render enter contact form properly', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const enterContactForm = container.getElementsByClassName('contact-component');
        expect(enterContactForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('contact-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('OTP Verification is turned off');
        const formSubHeading = container.getElementsByClassName('contact-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`To send an OTP, Please enable OTP Verification in your workflow,
          otherwise simply enter a phone number below.`);
    })

    it('should render one input field of enter contact form', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render mobile number field properly', ()=>{
       const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const mobileNumberLabel = container.querySelector('#mobileNumber-label');
        expect(mobileNumberLabel).toBeDefined();
        expect(mobileNumberLabel.textContent).toContain('Mobile Number');
        const mobileNumber = container.querySelector('#mobileNumber');
        expect(mobileNumber).toBeDefined();
    })

})

describe('should render EnterContact component properly when otpVerification  is true', ()=>{
    const data = {};
    const errorMessage = {};
    const onChange = () => {};
    const mobileNumberOnBlur = () => {};
    const otpVerification = true; 

    it('should render enter contact form properly', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const enterContactForm = container.getElementsByClassName('contact-component');
        expect(enterContactForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('contact-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('OTP Verification is turned on');
        const formSubHeading = container.getElementsByClassName('contact-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`To send an OTP, Please enter a phone number below.`);
    })

    it('should render one input field of enter contact form', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render mobile number field properly', ()=>{
       const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const mobileNumberLabel = container.querySelector('#mobileNumber-label');
        expect(mobileNumberLabel).toBeDefined();
        expect(mobileNumberLabel.textContent).toContain('Mobile Number');
        const mobileNumber = container.querySelector('#mobileNumber');
        expect(mobileNumber).toBeDefined();
    })
    
})

describe('should render EnterContact component properly when otpVerification  is false with data', ()=>{
    const data = {mobileNumber: '+12025550156'};
    const errorMessage = {};
    const onChange = () => {};
    const mobileNumberOnBlur = () => {};
    const otpVerification = false; 

    it('should render enter contact form properly', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const enterContactForm = container.getElementsByClassName('contact-component');
        expect(enterContactForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('contact-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('OTP Verification is turned off');
        const formSubHeading = container.getElementsByClassName('contact-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`To send an OTP, Please enable OTP Verification in your workflow,
          otherwise simply enter a phone number below.`);
    })

    it('should render one input field of enter contact form', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render mobile number field properly', ()=>{
       const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const mobileNumberLabel = container.querySelector('#mobileNumber-label');
        expect(mobileNumberLabel).toBeDefined();
        expect(mobileNumberLabel.textContent).toContain('Mobile Number');
        const mobileNumber = container.querySelector('#mobileNumber');
        expect(mobileNumber).toBeDefined();
        expect(mobileNumber.value).toBe(data.mobileNumber)
    })

})

describe('should render EnterContact component properly when otpVerification  is true with data', ()=>{
    const data = {mobileNumber: '+12025550156'};
    const errorMessage = {};
    const onChange = () => {};
    const mobileNumberOnBlur = () => {};
    const otpVerification = true; 

    it('should render enter contact form properly', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const enterContactForm = container.getElementsByClassName('contact-component');
        expect(enterContactForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('contact-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('OTP Verification is turned on');
        const formSubHeading = container.getElementsByClassName('contact-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`To send an OTP, Please enter a phone number below.`);
    })

    it('should render one input field of enter contact form', ()=>{
        const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render mobile number field properly', ()=>{
       const { container } = render(<EnterContact data={data} errorMessage={errorMessage} onChange={onChange} mobileNumberOnBlur={mobileNumberOnBlur} otpVerification={otpVerification}/>)
        const mobileNumberLabel = container.querySelector('#mobileNumber-label');
        expect(mobileNumberLabel).toBeDefined();
        expect(mobileNumberLabel.textContent).toContain('Mobile Number');
        const mobileNumber = container.querySelector('#mobileNumber');
        expect(mobileNumber).toBeDefined();
         expect(mobileNumber.value).toBe(data.mobileNumber)
    })
    
})
