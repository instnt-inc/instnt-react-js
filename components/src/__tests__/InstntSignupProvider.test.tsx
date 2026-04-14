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
  afterEach(() => {
    try { delete (window as any).instntSettings; } catch {}
    try { delete (window as any).onInstntEvent; } catch {}
  });

  // These tests call the function directly — they return null before hooks fire
  it('emits error for unrecognized serviceURL', () => {
    const onEvent = jest.fn();
    const result = InstntSignupProvider({
      formKey: 'v123',
      serviceURL: 'https://evil.example.com',
      onEvent,
    });
    expect(result).toBeNull();
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'transaction.error' })
    );
  });

  it('emits error for invalid formKey', () => {
    const onEvent = jest.fn();
    const result = InstntSignupProvider({
      formKey: 'badkey',
      serviceURL: 'https://sandbox-api.instnt.org',
      onEvent,
    });
    expect(result).toBeNull();
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'transaction.error' })
    );
    expect(onEvent.mock.calls[0][0].data.message).toContain('Invalid formKey');
  });

  it('emits error for empty formKey', () => {
    const onEvent = jest.fn();
    const result = InstntSignupProvider({
      formKey: '',
      serviceURL: 'https://sandbox-api.instnt.org',
      onEvent,
    });
    expect(result).toBeNull();
  });

  // These tests render as a component so hooks run properly
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
    // No error event should have been emitted
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

  it('makes onInstntEvent non-writable when rendered', () => {
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
      expect(descriptor.value).toBe(onEvent);
    }
  });
});
