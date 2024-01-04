/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import OverviewDetailScreen from '../components/verify_form/OverviewDetailScreen';
import { expect } from '@jest/globals';

describe('should render OverviewDetailScreen component properly', ()=>{
    const verifyFormData = {};
   
    it('should render overview detail screen form properly', ()=>{
        const { container } = render(<OverviewDetailScreen data={verifyFormData}/>)
        const overviewDetailsForm = container.getElementsByClassName('overview-detail-component');
        expect(overviewDetailsForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('overview-detail-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Money Transfer Detail Overview');
    })


    it('should render date field properly', ()=>{
       const { container } = render(<OverviewDetailScreen data={verifyFormData}/>)
       const dateLabel = container.getElementsByClassName('date-label');
       expect(dateLabel.length).toBe(1);
       expect(dateLabel[0].textContent).toBe('Date :');
       const date = container.querySelector('#date');
       expect(date).toBeDefined();
    })

    it('should render balance field properly', ()=>{
       const { container } = render(<OverviewDetailScreen data={verifyFormData}/>)
       const balanceLabel = container.getElementsByClassName('balance-label');
       expect(balanceLabel.length).toBe(1);
       expect(balanceLabel[0].textContent).toBe('Balance :');
       const balance = container.querySelector('#balance');
       expect(balance).toBeDefined();
    })

    it('should render email field properly', ()=>{
       const { container } = render(<OverviewDetailScreen data={verifyFormData}/>)
       const emailLabel = container.getElementsByClassName('email-label');
       expect(emailLabel.length).toBe(1);
       expect(emailLabel[0].textContent).toBe('Email :');
       const email = container.querySelector('#email');
       expect(email).toBeDefined();
    })

     it('should render account number field properly', ()=>{
       const { container } = render(<OverviewDetailScreen data={verifyFormData}/>)
       const accountNumberLabel = container.getElementsByClassName('account-number-label');
       expect(accountNumberLabel.length).toBe(1);
       expect(accountNumberLabel[0].textContent).toBe('A/C Number :');
       const accountNumber = container.querySelector('#account-number');
       expect(accountNumber).toBeDefined();
    })

})
