/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import InstntSelfieProcessor from '../components/InstntImageProcessor/InstntSelfieProcessor';

describe('InstntSelfieProcessor', () => {
  afterEach(() => {
    delete (window as any).instnt;
  });

  it('renders without instnt on window', () => {
    const { container } = render(<InstntSelfieProcessor selfieSettings={{}} />);
    expect(container).toBeTruthy();
  });

  it('logs error when captureSelfie is missing', () => {
    (window as any).instnt = {};
    const spy = jest.spyOn(console, 'error').mockImplementation();
    render(<InstntSelfieProcessor selfieSettings={{}} />);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('instnt is not initialized'),
      expect.anything()
    );
    spy.mockRestore();
  });

  it('calls captureSelfie when available', () => {
    const mockCapture = jest.fn();
    (window as any).instnt = { captureSelfie: mockCapture };
    render(<InstntSelfieProcessor selfieSettings={{ mode: 'auto' }} />);
    expect(mockCapture).toHaveBeenCalledWith({ mode: 'auto' }, true, undefined);
  });
});
