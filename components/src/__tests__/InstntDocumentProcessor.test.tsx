/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import InstntDocumentProcessor from '../components/InstntImageProcessor/InstntDocumentProcessor';

describe('InstntDocumentProcessor', () => {
  afterEach(() => {
    delete (window as any).instnt;
  });

  it('renders without instnt on window', () => {
    const { container } = render(<InstntDocumentProcessor documentSettings={{}} />);
    expect(container).toBeTruthy();
  });

  it('logs error when captureDocument is missing', () => {
    (window as any).instnt = {};
    const spy = jest.spyOn(console, 'error').mockImplementation();
    render(<InstntDocumentProcessor documentSettings={{}} />);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('instnt is not initialized'),
      expect.anything()
    );
    spy.mockRestore();
  });

  it('calls captureDocument when available', () => {
    const mockCapture = jest.fn();
    (window as any).instnt = { captureDocument: mockCapture };
    render(<InstntDocumentProcessor documentSettings={{ type: 'License' }} />);
    expect(mockCapture).toHaveBeenCalledWith({ type: 'License' }, true, undefined);
  });

  it('exports DOCUMENT_TYPES', () => {
    expect(InstntDocumentProcessor.DOCUMENT_TYPES).toBeDefined();
    expect(InstntDocumentProcessor.DOCUMENT_TYPES.license).toBe('License');
  });
});
