/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import EnterEmail from '../components/verify_form/EnterEmail';
import { expect } from '@jest/globals';

describe('should render EnterEmail component properly', ()=>{
    const data = {};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter email form properly', ()=>{
        const { container } = render(<EnterEmail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const enterEmailForm = container.getElementsByClassName('enter-email-component');
        expect(enterEmailForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('enter-email-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter Your Email');
        const formSubHeading = container.getElementsByClassName('enter-email-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render one input field of enter name form', ()=>{
        const { container } = render(<EnterEmail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render email field properly', ()=>{
        const { container } = render(<EnterEmail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const emailLabel = container.querySelector('#email-label');
        expect(emailLabel).toBeDefined();
        expect(emailLabel.textContent).toContain('Email');
        const email = container.querySelector('#email');
        expect(email).toBeDefined();
    })

})

describe('should render EnterName component properly with data', ()=>{
    const data = {email: 'panh@instnt.org'};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter email form properly', ()=>{
        const { container } = render(<EnterEmail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const enterEmailForm = container.getElementsByClassName('enter-email-component');
        expect(enterEmailForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('enter-email-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter Your Email');
        const formSubHeading = container.getElementsByClassName('enter-email-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render one input field of enter name form', ()=>{
        const { container } = render(<EnterEmail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(1);
    })

    it('should render email field properly', ()=>{
        const { container } = render(<EnterEmail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const emailLabel = container.querySelector('#email-label');
        expect(emailLabel).toBeDefined();
        expect(emailLabel.textContent).toContain('Email');
        const email = container.querySelector('#email');
        expect(email).toBeDefined();
        expect(email.value).toBe(data.email);
    })

})