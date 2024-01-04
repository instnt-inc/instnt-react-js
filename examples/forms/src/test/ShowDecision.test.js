/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import ShowDecision from '../components/ShowDecision';
import { expect } from '@jest/globals';

describe('should render ShowDecision component properly', ()=>{
    const decision = '';
    const restart = () => {};

    it('should render show decision form properly', ()=>{
        const { container } = render(<ShowDecision decision={decision} restart={restart} />)
        const showDecisionForm = container.getElementsByClassName('decision-component-heading');
        expect(showDecisionForm.length).toBe(1);
        expect(showDecisionForm[0].textContent).toBe('Decision');

        const showDecisionResult = container.getElementsByClassName('decision-component-result');
        expect(showDecisionResult.length).toBe(1);
        expect(showDecisionResult[0].textContent).toBe('');

        const showDecisionButton = container.getElementsByClassName('decision-component-button');
        expect(showDecisionButton.length).toBe(1);
        expect(showDecisionButton[0].textContent).toBe('Restart');

    })
})

describe('should render ShowDecision component properly with decision', ()=>{
    const decision = 'Reject';
    const restart = () => {};

    it('should render show decision form properly', ()=>{
        const { container } = render(<ShowDecision decision={decision} restart={restart} />)
        const showDecisionForm = container.getElementsByClassName('decision-component-heading');
        expect(showDecisionForm.length).toBe(1);
        expect(showDecisionForm[0].textContent).toBe('Decision');

        const showDecisionResult = container.getElementsByClassName('decision-component-result');
        expect(showDecisionResult.length).toBe(1);
        expect(showDecisionResult[0].textContent).toBe(decision);

        const showDecisionButton = container.getElementsByClassName('decision-component-button');
        expect(showDecisionButton.length).toBe(1);
        expect(showDecisionButton[0].textContent).toBe('Restart');

    })
})
