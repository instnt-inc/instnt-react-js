/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import EnterAddress from '../components/signup_form/EnterAddress';
import { expect } from '@jest/globals';

describe('should render EnterAddress component properly', ()=>{
    const data = {};
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter address form properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const enterAddressForm = container.getElementsByClassName('address-component');
        expect(enterAddressForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('address-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter Your Address Information');
        const formSubHeading = container.getElementsByClassName('address-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render five input field of enter address form', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(5);
    })

    it('should render address field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const addressLabel = container.querySelector('#physicalAddress-label');
        expect(addressLabel).toBeDefined();
        expect(addressLabel.textContent).toContain('Address');
        const address = container.querySelector('#physicalAddress');
        expect(address).toBeDefined();
    })

    it('should render city field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const cityLabel = container.querySelector('#city-label');
        expect(cityLabel).toBeDefined();
        expect(cityLabel.textContent).toContain('City');
        const city = container.querySelector('#city');
        expect(city).toBeDefined();
    })

    it('should render state field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const stateLabel = container.querySelector('#state-label');
        expect(stateLabel).toBeDefined();
        expect(stateLabel.textContent).toContain('State');
        const state = container.querySelector('#state');
        expect(state).toBeDefined();
    })

    it('should render zip code field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const zipLabel = container.querySelector('#zip-label');
        expect(zipLabel).toBeDefined();
        expect(zipLabel.textContent).toContain('Zip Code');
        const zip = container.querySelector('#zip');
        expect(zip).toBeDefined();
    })

    it('should render country field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const countryLabel = container.querySelector('#country-label');
        expect(countryLabel).toBeDefined();
        expect(countryLabel.textContent).toContain('Country');
        const country = container.querySelector('#country');
        expect(country).toBeDefined();
    })


})

describe('should render EnterAddress component properly with data', ()=>{
    const data = {physicalAddress: '123 stry', city:'varanasi', state: 'UP', zip: '221208', country: 'usa'  };
    const errorMessage = {};
    const onChange = () => {};

    it('should render enter address form properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const enterAddressForm = container.getElementsByClassName('address-component');
        expect(enterAddressForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('address-component-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Enter Your Address Information');
        const formSubHeading = container.getElementsByClassName('address-component-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe('All fields are required.');
    })

    it('should render five input field of enter address form', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const inputField = container.getElementsByClassName('MuiTextField-root');
        expect(inputField.length).toBe(5);
    })

    it('should render address field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const addressLabel = container.querySelector('#physicalAddress-label');
        expect(addressLabel).toBeDefined();
        expect(addressLabel.textContent).toContain('Address');
        const address = container.querySelector('#physicalAddress');
        expect(address).toBeDefined();
        expect(address.value).toBe(data.physicalAddress);
    })

    it('should render city field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const cityLabel = container.querySelector('#city-label');
        expect(cityLabel).toBeDefined();
        expect(cityLabel.textContent).toContain('City');
        const city = container.querySelector('#city');
        expect(city).toBeDefined();
        expect(city.value).toBe(data.city);
    })

    it('should render state field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const stateLabel = container.querySelector('#state-label');
        expect(stateLabel).toBeDefined();
        expect(stateLabel.textContent).toContain('State');
        const state = container.querySelector('#state');
        expect(state).toBeDefined();
        expect(state.value).toBe(data.state);
    })

    it('should render zip code field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const zipLabel = container.querySelector('#zip-label');
        expect(zipLabel).toBeDefined();
        expect(zipLabel.textContent).toContain('Zip Code');
        const zip = container.querySelector('#zip');
        expect(zip).toBeDefined();
        expect(zip.value).toBe(data.zip);
    })

    it('should render country field properly', ()=>{
        const { container } = render(<EnterAddress data={data} errorMessage={errorMessage} onChange={onChange}/>)
        const countryLabel = container.querySelector('#country-label');
        expect(countryLabel).toBeDefined();
        expect(countryLabel.textContent).toContain('Country');
        const country = container.querySelector('#country');
        expect(country).toBeDefined();
        expect(country.value).toBe(data.country);
    })


})
