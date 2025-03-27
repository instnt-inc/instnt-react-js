/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import EnterBalanceTransferDetail from '../components/verify_form/EnterBalanceTransferDetail';
import { expect } from '@jest/globals';

describe('should render EnterBalanceTransferDetail component properly', ()=>{
    const data = {};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter balance transfer detail form properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const balanceTransferDetailForm = container.getElementsByClassName('balance-transfer-detail-component');
        expect(balanceTransferDetailForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('balance-transfer-detail-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Send Money - Balance Transfer');
        const formSubHeading = container.getElementsByClassName('balance-transfer-detail-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render five input field of enter balance transfer detail form', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(5);
    })

    it('should render first name field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const firstNameLabel = container.querySelector('#firstName-label');
        expect(firstNameLabel).toBeDefined();
        expect(firstNameLabel.textContent).toContain('First Name');
        const firstName = container.querySelector('#firstName');
        expect(firstName).toBeDefined();
    })

    it('should render last name field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const lastNameLabel = container.querySelector('#surName-label');
        expect(lastNameLabel).toBeDefined();
        expect(lastNameLabel.textContent).toContain('Last Name');
        const lastName = container.querySelector('#surName');
        expect(lastName).toBeDefined();
    })

    it('should render amount field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const amountLabel = container.querySelector('#amount-label');
        expect(amountLabel).toBeDefined();
        expect(amountLabel.textContent).toContain('Amount');
        const amount = container.querySelector('#amount');
        expect(amount).toBeDefined();
    })

    it('should render mobile number field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const mobileNumberLabel = container.querySelector('#mobileNumber-label');
        expect(mobileNumberLabel).toBeDefined();
        expect(mobileNumberLabel.textContent).toContain('Mobile Number');
        const mobileNumber = container.querySelector('#mobileNumber');
        expect(mobileNumber).toBeDefined();
    })

    it('should render notes field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const notesLabel = container.querySelector('#notes-label');
        expect(notesLabel).toBeDefined();
        expect(notesLabel.textContent).toContain('Notes');
        const notes = container.querySelector('#notes');
        expect(notes).toBeDefined();
    })


})

describe('should render EnterBalanceTransferDetail component properly with data', ()=>{
    const data = {firstName:'xyz', surName: 'tyu', amount: '10000', mobileNumber:'+12025550156' , notes: 'Hi how are you'};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter balance transfer detail form properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const balanceTransferDetailForm = container.getElementsByClassName('balance-transfer-detail-component');
        expect(balanceTransferDetailForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('balance-transfer-detail-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Send Money - Balance Transfer');
        const formSubHeading = container.getElementsByClassName('balance-transfer-detail-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render five input field of enter balance transfer detail form', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(5);
    })

    it('should render first name field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const firstNameLabel = container.querySelector('#firstName-label');
        expect(firstNameLabel).toBeDefined();
        expect(firstNameLabel.textContent).toContain('First Name');
        const firstName = container.querySelector('#firstName');
        expect(firstName).toBeDefined();
        expect(firstName.value).toBe(data.firstName);
    })

    it('should render last name field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const lastNameLabel = container.querySelector('#surName-label');
        expect(lastNameLabel).toBeDefined();
        expect(lastNameLabel.textContent).toContain('Last Name');
        const lastName = container.querySelector('#surName');
        expect(lastName).toBeDefined();
        expect(lastName.value).toBe(data.surName);
    })

    it('should render amount field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const amountLabel = container.querySelector('#amount-label');
        expect(amountLabel).toBeDefined();
        expect(amountLabel.textContent).toContain('Amount');
        const amount = container.querySelector('#amount');
        expect(amount).toBeDefined();
        expect(amount.value).toBe(data.amount);
    })

    it('should render mobile number field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const mobileNumberLabel = container.querySelector('#mobileNumber-label');
        expect(mobileNumberLabel).toBeDefined();
        expect(mobileNumberLabel.textContent).toContain('Mobile Number');
        const mobileNumber = container.querySelector('#mobileNumber');
        expect(mobileNumber).toBeDefined();
        expect(mobileNumber.value).toBe(data.mobileNumber);
    })

    it('should render notes field properly', ()=>{
        const { container } = render(<EnterBalanceTransferDetail data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const notesLabel = container.querySelector('#notes-label');
        expect(notesLabel).toBeDefined();
        expect(notesLabel.textContent).toContain('Notes');
        const notes = container.querySelector('#notes');
        expect(notes).toBeDefined();
        expect(notes.value).toBe(data.notes);
    })


})