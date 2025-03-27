/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import ShowProgress from '../components/ShowProgress';
import { expect } from '@jest/globals';

describe('should render ShowProgress component properly', ()=>{
    const message = {
        title: "",
        detail: "",
    };

    it('should render show progress form properly', ()=>{
        const { container } = render(<ShowProgress message={message} />)
        const showProgressTitle = container.getElementsByClassName('show-progress-title');
        expect(showProgressTitle.length).toBe(1);
        expect(showProgressTitle[0].textContent).toBe(message.title);

        const showProgressDetail = container.getElementsByClassName('show-progress-detail');
        expect(showProgressDetail.length).toBe(1);
        expect(showProgressDetail[0].textContent).toBe(message.detail);

        const showDecisionButton = container.getElementsByClassName('show-progress-bar-section');
        expect(showDecisionButton.length).toBe(1);

    })
})

describe('should render ShowDecision component properly with decision', ()=>{
    const message = {
        title: "Processing verify request",
        detail: "Please wait while we process your verification request",
    };

    it('should render show progress form properly', ()=>{
        const { container } = render(<ShowProgress message={message} />)
        const showProgressTitle = container.getElementsByClassName('show-progress-title');
        expect(showProgressTitle.length).toBe(1);
        expect(showProgressTitle[0].textContent).toBe(message.title);

        const showProgressDetail = container.getElementsByClassName('show-progress-detail');
        expect(showProgressDetail.length).toBe(1);
        expect(showProgressDetail[0].textContent).toBe(message.detail);

        const showDecisionButton = container.getElementsByClassName('show-progress-bar-section');
        expect(showDecisionButton.length).toBe(1);

    })
})
