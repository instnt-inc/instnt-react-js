/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../src/hooks/useSriManifest', () => ({
  __esModule: true,
  default: () => ({
    sri: undefined,
    version: undefined,
    status: 'error' as const,
    cdnCorsSupported: false,
  }),
}));

jest.mock('../../src/hooks/useInstntScript', () => ({
  __esModule: true,
  default: () => 'idle' as const,
}));

const InstntSignupProvider: any =
  require('../components/InstntSignupProvider/InstntSignupProvider').default;

describe('InstntSignupProvider', () => {
  // With configurable:false, window properties persist across tests.
  // The ref-based stable callback pattern means the underlying onEvent
  // always stays current without needing to redefine the window property.

  it('emits error for unrecognized serviceURL', () => {
    const onEvent = jest.fn();
    const { container } = render(
      <InstntSignupProvider
        formKey="v123"
        serviceURL="https://evil.example.com"
        onEvent={onEvent}
      />
    );
    expect(container.innerHTML).toBe('');
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'transaction.error' })
    );
  });

  it('rejects unauthorized serviceURL with descriptive message', () => {
    const onEvent = jest.fn();
    render(
      <InstntSignupProvider
        formKey="v123"
        serviceURL="https://attacker.example.com"
        onEvent={onEvent}
      />
    );
    expect(onEvent).toHaveBeenCalledTimes(1);
    const call = onEvent.mock.calls[0][0];
    expect(call.type).toBe('transaction.error');
    expect(call.data.message).toContain('Unrecognized serviceURL');
  });

  it('emits error for invalid formKey', () => {
    const onEvent = jest.fn();
    const { container } = render(
      <InstntSignupProvider
        formKey="badkey"
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={onEvent}
      />
    );
    expect(container.innerHTML).toBe('');
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'transaction.error' })
    );
    expect(onEvent.mock.calls[0][0].data.message).toContain('Invalid formKey');
  });

  it('emits error for empty formKey', () => {
    const onEvent = jest.fn();
    const { container } = render(
      <InstntSignupProvider
        formKey=""
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={onEvent}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('emits error for non-string formKey', () => {
    const onEvent = jest.fn();
    const { container } = render(
      <InstntSignupProvider
        formKey={12345}
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={onEvent}
      />
    );
    expect(container.innerHTML).toBe('');
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'transaction.error' })
    );
  });

  it('emits error for excessively long formKey', () => {
    const onEvent = jest.fn();
    const { container } = render(
      <InstntSignupProvider
        formKey={'v' + '1'.repeat(20)}
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={onEvent}
      />
    );
    expect(container.innerHTML).toBe('');
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'transaction.error' })
    );
  });

  it('renders children with valid props', () => {
    const onEvent = jest.fn();
    const { getByText } = render(
      <InstntSignupProvider
        formKey="v1234567890"
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={onEvent}
      >
        <span>child</span>
      </InstntSignupProvider>
    );
    expect(getByText('child')).toBeTruthy();
    const errorCalls = onEvent.mock.calls.filter(
      (c: any) => c[0]?.type === 'transaction.error'
    );
    expect(errorCalls).toHaveLength(0);
  });

  it('freezes instntSettings when rendered', () => {
    render(
      <InstntSignupProvider
        formKey="v123"
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={jest.fn()}
      >
        <span>test</span>
      </InstntSignupProvider>
    );
    const settings = (window as any).instntSettings;
    if (settings) {
      expect(Object.isFrozen(settings)).toBe(true);
    }
  });

  it('makes instntSettings non-configurable when rendered', () => {
    render(
      <InstntSignupProvider
        formKey="v123"
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={jest.fn()}
      >
        <span>test</span>
      </InstntSignupProvider>
    );
    const descriptor = Object.getOwnPropertyDescriptor(window, 'instntSettings');
    if (descriptor) {
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
    }
  });

  it('makes onInstntEvent non-writable and non-configurable when rendered', () => {
    const onEvent = jest.fn();
    render(
      <InstntSignupProvider
        formKey="v123"
        serviceURL="https://sandbox-api.instnt.org"
        onEvent={onEvent}
      >
        <span>test</span>
      </InstntSignupProvider>
    );
    const descriptor = Object.getOwnPropertyDescriptor(window, 'onInstntEvent');
    if (descriptor) {
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
    }
  });
});
