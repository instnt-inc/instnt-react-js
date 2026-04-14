/**
 * @jest-environment jsdom
 */
import { logMessage } from '../logger';

describe('logMessage', () => {
  it('prefixes messages with Instnt:', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logMessage('log', 'test message');
    expect(spy).toHaveBeenCalledWith('Instnt: ', 'test message', '');
    spy.mockRestore();
  });

  it('routes error type to console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    logMessage('error', 'something failed');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('routes warn type to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    logMessage('warn', 'warning message');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('falls back to console.log for unknown types', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logMessage('unknown', 'fallback');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
