/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import EnterName from '../components/signup_form/EnterName';
import { expect } from '@jest/globals';

describe('should render EnterName component properly', ()=>{
    const data = {};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter name form properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const enterNameForm = container.getElementsByClassName('name-component');
        expect(enterNameForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('name-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter Your Contact Information');
        const formSubHeading = container.getElementsByClassName('name-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render five input field of enter name form', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(5);
    })

    it('should render first name field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const firstNameLabel = container.querySelector('#firstName-label');
        expect(firstNameLabel).toBeDefined();
        expect(firstNameLabel.textContent).toContain('First Name');
        const firstName = container.querySelector('#firstName');
        expect(firstName).toBeDefined();
    })

    it('should render last name field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const lastNameLabel = container.querySelector('#surName-label');
        expect(lastNameLabel).toBeDefined();
        expect(lastNameLabel.textContent).toContain('Last Name');
        const lastName = container.querySelector('#surName');
        expect(lastName).toBeDefined();
    })

    it('should render email field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const emailLabel = container.querySelector('#email-label');
        expect(emailLabel).toBeDefined();
        expect(emailLabel.textContent).toContain('Email');
        const email = container.querySelector('#email');
        expect(email).toBeDefined();
    })

    it('should render national ID field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const nationalIdLabel = container.querySelector('#nationalId-label');
        expect(nationalIdLabel).toBeDefined();
        expect(nationalIdLabel.textContent).toContain('National ID');
        const nationalId = container.querySelector('#nationalId');
        expect(nationalId).toBeDefined();
    })

    it('should render DOB field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const dobLabel = container.querySelector('#dob-label');
        expect(dobLabel).toBeDefined();
        expect(dobLabel.textContent).toContain('Date Of Birth');
        const dob = container.querySelector('#dob');
        expect(dob).toBeDefined();
    })


})

describe('should render EnterName component properly with data', ()=>{
    const data = {firstName:'xyz', surName: 'tyu', email: 'panh@instnt.org', nationalId:'111-11-1111' , dob: '2024-01-01'};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter name form properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const enterNameForm = container.getElementsByClassName('name-component');
        expect(enterNameForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('name-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter Your Contact Information');
        const formSubHeading = container.getElementsByClassName('name-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render five input field of enter name form', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(5);
    })

    it('should render first name field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const firstNameLabel = container.querySelector('#firstName-label');
        expect(firstNameLabel).toBeDefined();
        expect(firstNameLabel.textContent).toContain('First Name');
        const firstName = container.querySelector('#firstName');
        expect(firstName).toBeDefined();
        expect(firstName.value).toEqual(data.firstName);
    })

    it('should render last name field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const lastNameLabel = container.querySelector('#surName-label');
        expect(lastNameLabel).toBeDefined();
        expect(lastNameLabel.textContent).toContain('Last Name');
        const lastName = container.querySelector('#surName');
        expect(lastName).toBeDefined();
        expect(lastName.value).toEqual(data.surName);
    })

    it('should render email field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const emailLabel = container.querySelector('#email-label');
        expect(emailLabel).toBeDefined();
        expect(emailLabel.textContent).toContain('Email');
        const email = container.querySelector('#email');
        expect(email).toBeDefined();
        expect(email.value).toEqual(data.email);
    })

    it('should render national ID field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const nationalIdLabel = container.querySelector('#nationalId-label');
        expect(nationalIdLabel).toBeDefined();
        expect(nationalIdLabel.textContent).toContain('National ID');
        const nationalId = container.querySelector('#nationalId');
        expect(nationalId).toBeDefined();
        expect(nationalId.value).toEqual(data.nationalId);
    })

    it('should render DOB field properly', ()=>{
        const { container } = render(<EnterName data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const dobLabel = container.querySelector('#dob-label');
        expect(dobLabel).toBeDefined();
        expect(dobLabel.textContent).toContain('Date Of Birth');
        const dob = container.querySelector('#dob');
        expect(dob).toBeDefined();
        expect(dob.value).toEqual(data.dob);
    })


})