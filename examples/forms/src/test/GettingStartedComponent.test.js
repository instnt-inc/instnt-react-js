/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import GettingStarted from '../components/GettingStarted';
import { expect } from '@jest/globals';


describe('should render GettingStarted component when isSignUp true', ()=>{
    const appConfig = { 'workflowId': 'v626673100000', 'serviceURL': 'https://sandbox-api.instnt.org"', 'idmetricsVersion': '4.8.1','instnttxnid':'' }
    let isSignUp = true;
    let resumeSignup = false;
    
    it('should render demo option label properly', ()=>{
        const { getByText, queryAllByTestId } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        expect(queryAllByTestId('demo-radio-buttons-group-label').length).toBe(1);
        expect(getByText('Demo Option')).toBeInTheDocument()
    })

    it('should render all the demo options properly', ()=>{
        const { getAllByRole, getAllByText} = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        expect(getAllByRole('radiogroup').length).toBe(1)
        const radioButton = getAllByRole('radio')
        expect(radioButton.length).toBe(3);
        expect(radioButton[0].value).toBe('signup');
        expect(radioButton[1].value).toBe('resumeSignup');
        expect(radioButton[2].value).toBe('login');
    })

    it('should render selected radio button in demo options', ()=>{
        const { getAllByRole } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const radioButton = getAllByRole('radio')
        expect(radioButton.length).toBe(3)// For Selection Of a signup radio button
        expect(radioButton[0].checked).toBeTruthy()
        expect(radioButton[1].checked).toBeFalsy()
        expect(radioButton[2].checked).toBeFalsy()
    })

    it('should render description headline properly', ()=>{
        const { container, getAllByText } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const signupRadio = container.querySelector('.description-headline');
        expect(signupRadio).toBeDefined()
        expect(getAllByText('This process consist of the following steps')).toBeDefined()
    })

    it('should render description details properly', ()=>{
        const { container, getAllByText} = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const signupRadio = container.querySelector('.description-headline');
        expect(signupRadio).toBeDefined();
        const ulItem = container.getElementsByClassName('MuiList-root');
        expect(ulItem.length).toBe(1);
        const liItem = container.getElementsByClassName('MuiListItem-root');
        expect(liItem.length).toBe(4);
        const bulletIconOfLi = container.getElementsByClassName('MuiListItemIcon-root');
        expect(bulletIconOfLi.length).toBe(4);
        const liItemText = container.getElementsByClassName('MuiListItemText-root');
        expect(liItemText.length).toBe(4);
        expect(getAllByText('Collect User Information')).toBeDefined();
        expect(getAllByText(`If OTP is enabled, it'll text the mobile number to send an OTP, then verifies it.`)).toBeDefined();
        expect(getAllByText(`Captures photos of the user's driver's license and the user itself via a selfie.`)).toBeDefined();
        expect(getAllByText('Allows the user to review and submit the application, then it displays the decision.')).toBeDefined();
    })

    it('should render input box for signup page', ()=>{
        const { container } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const signupPageInputHeading = container.getElementsByClassName('input-element-container-heading');
        expect(signupPageInputHeading.length).toBe(1);
        expect(signupPageInputHeading[0].textContent).toBe('Enter your workflow ID and service URL.');
        /** Workflow ID Input Element and Value */
        const workflowIdElementLabel = container.querySelector('#workflowId-label');
        expect(workflowIdElementLabel).toBeDefined();
        expect(workflowIdElementLabel.textContent).toContain('Workflow ID');
        const workflowIdElementValue = container.querySelector('#workflowId');
        expect(workflowIdElementValue).toBeDefined();
        expect(workflowIdElementValue.value).toEqual(appConfig.workflowId);
        /** Service URL Input Element and Value */
        const serviceURLElementLabel = container.querySelector('#serviceURL-label');
        expect(serviceURLElementLabel).toBeDefined();
        expect(serviceURLElementLabel.textContent).toContain('Service URL');
        const serviceURLElementValue = container.querySelector('#serviceURL');
        expect(serviceURLElementValue).toBeDefined();
        expect(serviceURLElementValue.value).toEqual(appConfig.serviceURL);
        /** IDMetric Input Element and Value */
        const idMetricElementLabel = container.querySelector('#idmetricsVersion-label');
        expect(idMetricElementLabel).toBeDefined();
        expect(idMetricElementLabel.textContent).toContain('Idmetrics framework version');
        const idMetricElementValue = container.querySelector('#idmetricsVersion');
        expect(idMetricElementValue).toBeDefined();
        expect(idMetricElementValue.value).toEqual(appConfig.idmetricsVersion);
    })

    it('should render get started button properly', ()=>{
        const { container } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const submitButton = container.getElementsByClassName('signup-submit-button');
        expect(submitButton.length).toBe(1)
        expect(submitButton[0].textContent).toBe('Get Started');
    })
})

describe('should render GettingStarted component when resumeSignup true', ()=>{
    const appConfig = { 'workflowId': 'v626673100000', 'serviceURL': 'https://sandbox-api.instnt.org"', 'idmetricsVersion': '4.8.1','instnttxnid':'1234' }
    let isSignUp = false;
    let resumeSignup = true;
    
    it('should render demo option label properly', ()=>{
        const { getByText, queryAllByTestId } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        expect(queryAllByTestId('demo-radio-buttons-group-label').length).toBe(1);
        expect(getByText('Demo Option')).toBeInTheDocument()
    })

    it('should render all the demo options properly', ()=>{
        const { getAllByRole, getAllByText} = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        expect(getAllByRole('radiogroup').length).toBe(1)
        const radioButton = getAllByRole('radio')
        expect(radioButton.length).toBe(3);
        expect(radioButton[0].value).toBe('signup');
        expect(radioButton[1].value).toBe('resumeSignup');
        expect(radioButton[2].value).toBe('login');
    })

    it('should render selected radio button in demo options', ()=>{
        const { container, getAllByRole } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const radioButton = getAllByRole('radio')
        expect(radioButton.length).toBe(3)
        const selectedRadioButton = container.querySelector('.Mui-checked');
        expect(selectedRadioButton).toBeDefined()
    })

    it('should render description headline properly', ()=>{
        const { container, getAllByText } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const resumeSignupRadio = container.querySelector('.description-headline');
        expect(resumeSignupRadio).toBeDefined()
        expect(getAllByText('This process consist of the following steps')).toBeDefined()
    })

    it('should render description details properly', ()=>{
        const { container, getAllByText} = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const resumeSignupRadio = container.querySelector('.description-headline');
        expect(resumeSignupRadio).toBeDefined();
        const ulItem = container.getElementsByClassName('MuiList-root');
        expect(ulItem.length).toBe(1);
        const liItem = container.getElementsByClassName('MuiListItem-root');
        expect(liItem.length).toBe(2);
        const bulletIconOfLi = container.getElementsByClassName('MuiListItemIcon-root');
        expect(bulletIconOfLi.length).toBe(2);
        const liItemText = container.getElementsByClassName('MuiListItemText-root');
        expect(liItemText.length).toBe(2);
        expect(getAllByText('Collect Transaction ID to resume signup.')).toBeDefined();
        expect(getAllByText(`This will help to update information for selected transaction id.`)).toBeDefined();
    })

    it('should render input box for resume signup page', ()=>{
        const { container } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const resumeSignupPageInputHeading = container.getElementsByClassName('input-element-container-heading');
        expect(resumeSignupPageInputHeading.length).toBe(1);
        expect(resumeSignupPageInputHeading[0].textContent).toBe('Enter your instnt transaction ID.');
        /** Workflow ID Input Element and Value */
        const workflowIdElementLabel = container.querySelector('#workflowId-label');
        expect(workflowIdElementLabel).toBeDefined();
        expect(workflowIdElementLabel.textContent).toContain('Workflow ID');
        const workflowIdElementValue = container.querySelector('#workflowId');
        expect(workflowIdElementValue).toBeDefined();
        expect(workflowIdElementValue.value).toEqual(appConfig.workflowId);
        /** Service URL Input Element and Value */
        const serviceURLElementLabel = container.querySelector('#serviceURL-label');
        expect(serviceURLElementLabel).toBeDefined();
        expect(serviceURLElementLabel.textContent).toContain('Service URL');
        const serviceURLElementValue = container.querySelector('#serviceURL');
        expect(serviceURLElementValue).toBeDefined();
        expect(serviceURLElementValue.value).toEqual(appConfig.serviceURL);
        /** Transaction ID/Instnt Txn ID Input Element and Value */
        const transactionIdElementLabel = container.querySelector('#instnttxnid-label');
        expect(transactionIdElementLabel).toBeDefined();
        expect(transactionIdElementLabel.textContent).toContain('Transaction ID');
        const transactionIdElementValue = container.querySelector('#instnttxnid');
        expect(transactionIdElementValue).toBeDefined();
        expect(transactionIdElementValue.value).toEqual(appConfig.instnttxnid);
    })

    it('should render resume signup button properly', ()=>{
        const { container } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const submitButton = container.getElementsByClassName('resumeSignup-submit-button');
        expect(submitButton.length).toBe(1)
        expect(submitButton[0].textContent).toBe('Resume Sign Up');
    })
})

describe('should render GettingStarted component when resumeSignup and  isSignup false', ()=>{
    const appConfig = { 'workflowId': 'v626673100000', 'serviceURL': 'https://sandbox-api.instnt.org"', 'idmetricsVersion': '4.8.1','instnttxnid':'1234' }
    let isSignUp = false;
    let resumeSignup = false;
    
    it('should render demo option label properly', ()=>{
        const { getByText, queryAllByTestId } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        expect(queryAllByTestId('demo-radio-buttons-group-label').length).toBe(1);
        expect(getByText('Demo Option')).toBeInTheDocument()
    })

    it('should render all the demo options properly', ()=>{
        const { getAllByRole, getAllByText} = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        expect(getAllByRole('radiogroup').length).toBe(1)
        const radioButton = getAllByRole('radio')
        expect(radioButton.length).toBe(3);
        expect(radioButton[0].value).toBe('signup');
        expect(radioButton[1].value).toBe('resumeSignup');
        expect(radioButton[2].value).toBe('login');
    })

    it('should render selected radio button in demo options', ()=>{
        const { container, getAllByRole } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const radioButton = getAllByRole('radio')
        expect(radioButton.length).toBe(3)
        const selectedRadioButton = container.querySelector('.Mui-checked');
        expect(selectedRadioButton).toBeDefined()
    })

    it('should render description headline properly', ()=>{
        const { container, getAllByText } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const loginRadio = container.querySelector('.description-headline');
        expect(loginRadio).toBeDefined()
        expect(getAllByText('This process consist of the following steps')).toBeDefined()
    })

    it('should render description details properly', ()=>{
        const { container, getAllByText} = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const loginRadio = container.querySelector('.description-headline');
        expect(loginRadio).toBeDefined();
        const ulItem = container.getElementsByClassName('MuiList-root');
        expect(ulItem.length).toBe(1);
        const liItem = container.getElementsByClassName('MuiListItem-root');
        expect(liItem.length).toBe(5);
        const bulletIconOfLi = container.getElementsByClassName('MuiListItemIcon-root');
        expect(bulletIconOfLi.length).toBe(5);
        const liItemText = container.getElementsByClassName('MuiListItemText-root');
        expect(liItemText.length).toBe(5);
        expect(getAllByText('Collect User Information')).toBeDefined();
        expect(getAllByText(`If Instnt Verify™ is enable in workflow, It will generate verified_id.`)).toBeDefined();
        expect(getAllByText('Collect payment information which is one of the use case of verification.')).toBeDefined();
        expect(getAllByText('Allows the user to submit the application for verification, then it displays the decision.')).toBeDefined();
        expect(getAllByText(`Above Steps to ensures the system's security and confirm that it is still the same person using the system.`)).toBeDefined();
    })

    it('should render input box for signup page', ()=>{
        const { container } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const loginPageInputHeading = container.getElementsByClassName('input-element-container-heading');
        expect(loginPageInputHeading.length).toBe(1);
        expect(loginPageInputHeading[0].textContent).toBe('Enter your workflow ID and service URL.');
        /** Workflow ID Input Element and Value */
        const workflowIdElementLabel = container.querySelector('#workflowId-label');
        expect(workflowIdElementLabel).toBeDefined();
        expect(workflowIdElementLabel.textContent).toContain('Workflow ID');
        const workflowIdElementValue = container.querySelector('#workflowId');
        expect(workflowIdElementValue).toBeDefined();
        expect(workflowIdElementValue.value).toEqual(appConfig.workflowId);
        /** Service URL Input Element and Value */
        const serviceURLElementLabel = container.querySelector('#serviceURL-label');
        expect(serviceURLElementLabel).toBeDefined();
        expect(serviceURLElementLabel.textContent).toContain('Service URL');
        const serviceURLElementValue = container.querySelector('#serviceURL');
        expect(serviceURLElementValue).toBeDefined();
        expect(serviceURLElementValue.value).toEqual(appConfig.serviceURL);
         /** IDMetric Input Element and Value */
        const idMetricElementLabel = container.querySelector('#idmetricsVersion-label');
        expect(idMetricElementLabel).toBeDefined();
        expect(idMetricElementLabel.textContent).toContain('Idmetrics framework version');
        const idMetricElementValue = container.querySelector('#idmetricsVersion');
        expect(idMetricElementValue).toBeDefined();
        expect(idMetricElementValue.value).toEqual(appConfig.idmetricsVersion);
        /** Transaction ID/Instnt Txn ID Input Element and Value */
        const transactionIdElementLabel = container.querySelector('#instnttxnid-label');
        expect(transactionIdElementLabel).toBeDefined();
        expect(transactionIdElementLabel.textContent).toContain('Transaction ID');
        const transactionIdElementValue = container.querySelector('#instnttxnid');
        expect(transactionIdElementValue).toBeDefined();
        expect(transactionIdElementValue.value).toEqual(appConfig.instnttxnid);
    })

    it('should render resume signup button properly', ()=>{
        const { container } = render(<GettingStarted data={appConfig} isSignUp={isSignUp} resumeSignup={resumeSignup}/>)
        const submitButton = container.getElementsByClassName('login-submit-button');
        expect(submitButton.length).toBe(1)
        expect(submitButton[0].textContent).toBe('Get Started');
    })
})
