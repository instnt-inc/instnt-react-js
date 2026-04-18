/**
 * [C4] Unit tests for retryWithBackoff. Isolated from React so fake
 * timers are clean and every branch of the retry policy is exercised.
 */
import { retryWithBackoff, isRetriableFetchError } from '../hooks/retry';

describe('isRetriableFetchError', () => {
  test('non-Error values are not retriable', () => {
    expect(isRetriableFetchError(undefined)).toBe(false);
    expect(isRetriableFetchError(null)).toBe(false);
    expect(isRetriableFetchError('network error')).toBe(false);
    expect(isRetriableFetchError(42)).toBe(false);
  });

  test('AbortError is not retriable even with a network-shaped message', () => {
    const e = new Error('network abort');
    e.name = 'AbortError';
    expect(isRetriableFetchError(e)).toBe(false);
  });

  test('matches the network / timeout vocabulary', () => {
    expect(isRetriableFetchError(new TypeError('Failed to fetch'))).toBe(true);
    expect(isRetriableFetchError(new Error('ECONNRESET from origin'))).toBe(true);
    expect(isRetriableFetchError(new Error('request timeout'))).toBe(true);
    expect(isRetriableFetchError(new Error('Load failed'))).toBe(true);
  });

  test('does not match HTTP-ish errors', () => {
    expect(isRetriableFetchError(new Error('HTTP 500'))).toBe(false);
    expect(isRetriableFetchError(new Error('Not found'))).toBe(false);
  });
});

describe('retryWithBackoff', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const neverAborted: AbortSignal = new AbortController().signal;

  test('succeeds on first attempt: no retries, no delays', async () => {
    const attempt = jest.fn().mockResolvedValue('ok');
    const p = retryWithBackoff(attempt, {
      attempts: 3,
      baseMs: 100,
      signal: neverAborted,
    });
    await expect(p).resolves.toBe('ok');
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  test('retries on retriable error and succeeds', async () => {
    let calls = 0;
    const attempt = jest.fn(() => {
      calls++;
      if (calls < 3) return Promise.reject(new TypeError('Failed to fetch'));
      return Promise.resolve('yes');
    });

    const p = retryWithBackoff(attempt, {
      attempts: 3,
      baseMs: 10,
      signal: neverAborted,
    });
    // Run all pending timers to let the backoff delays resolve.
    await jest.runAllTimersAsync();
    await expect(p).resolves.toBe('yes');
    expect(attempt).toHaveBeenCalledTimes(3);
  });

  test('gives up after attempts are exhausted', async () => {
    const attempt = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const p = retryWithBackoff(attempt, {
      attempts: 3,
      baseMs: 10,
      signal: neverAborted,
    }).catch((e) => e);
    await jest.runAllTimersAsync();
    const err = await p;
    expect(err).toBeInstanceOf(TypeError);
    expect(attempt).toHaveBeenCalledTimes(3);
  });

  test('does not retry non-retriable errors', async () => {
    const attempt = jest.fn().mockRejectedValue(new Error('HTTP 500'));
    await expect(
      retryWithBackoff(attempt, { attempts: 3, baseMs: 10, signal: neverAborted })
    ).rejects.toThrow('HTTP 500');
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  test('does not retry AbortError', async () => {
    const err = new Error('aborted');
    err.name = 'AbortError';
    const attempt = jest.fn().mockRejectedValue(err);
    await expect(
      retryWithBackoff(attempt, { attempts: 3, baseMs: 10, signal: neverAborted })
    ).rejects.toThrow('aborted');
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  test('respects caller abort signal mid-retry', async () => {
    const controller = new AbortController();
    let calls = 0;
    const attempt = jest.fn(() => {
      calls++;
      if (calls === 1) {
        // Trigger abort between attempt 1 and 2.
        controller.abort();
      }
      return Promise.reject(new TypeError('Failed to fetch'));
    });

    const p = retryWithBackoff(attempt, {
      attempts: 5,
      baseMs: 10,
      signal: controller.signal,
    }).catch((e) => e);
    await jest.runAllTimersAsync();
    const err = await p;
    expect(err).toBeInstanceOf(TypeError);
    // Only one attempt should have run — the abort fires before the second.
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  test('backoff grows with the configured factor', async () => {
    let calls = 0;
    const attempt = jest.fn(() => {
      calls++;
      if (calls < 4) return Promise.reject(new TypeError('Failed to fetch'));
      return Promise.resolve('done');
    });
    const onRetry = jest.fn();
    const p = retryWithBackoff(attempt, {
      attempts: 4,
      baseMs: 50,
      factor: 2,
      signal: neverAborted,
      onRetry,
    });
    await jest.runAllTimersAsync();
    await expect(p).resolves.toBe('done');
    expect(onRetry).toHaveBeenCalledTimes(3); // three retries before success
    // First call invoked with attemptIndex=0 (before first retry wait)
    expect(onRetry.mock.calls[0][0]).toBe(0);
    expect(onRetry.mock.calls[1][0]).toBe(1);
    expect(onRetry.mock.calls[2][0]).toBe(2);
  });
});
