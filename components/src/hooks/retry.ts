/**
 * [C4] Retry with exponential backoff.
 *
 * Pulled out of useSriManifest so it can be unit-tested in isolation
 * (fake timers cooperate much more smoothly without React's rendering
 * in the loop) and reused by other hooks that need the same semantics.
 */

/** Promise-sleep helper — caller passes the ms. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Classify whether a fetch rejection is worth retrying. Aborts (caller
 * unmounted, browser-triggered) and clean non-network errors aren't.
 * Network-shaped errors and timeouts are.
 */
export function isRetriableFetchError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === 'AbortError') return false;
  return /network|timeout|failed to fetch|load failed|ECONNRESET/i.test(
    err.message || ''
  );
}

export interface RetryOptions {
  attempts: number;
  baseMs: number;
  signal: AbortSignal;
  /**
   * Backoff growth factor. 3 gives 250 / 750 / 2250 with the default base.
   * Kept configurable for tests that want tighter intervals.
   */
  factor?: number;
  /**
   * Optional observer called before each retry so callers can log. Passed
   * the upcoming attempt number (0-indexed) and the error that triggered it.
   */
  onRetry?: (attemptIndex: number, err: unknown) => void;
}

/**
 * Retry a promise-returning factory with exponential backoff on
 * retriable errors. Generic over the thunk's return type. Respects the
 * caller's AbortSignal — once that's triggered, no more attempts are
 * scheduled.
 */
export async function retryWithBackoff<T>(
  attempt: () => Promise<T>,
  opts: RetryOptions
): Promise<T> {
  const factor = opts.factor ?? 3;
  let lastErr: unknown;
  for (let i = 0; i < opts.attempts; i++) {
    if (opts.signal.aborted) break;
    try {
      return await attempt();
    } catch (err) {
      lastErr = err;
      if (!isRetriableFetchError(err) || i === opts.attempts - 1) throw err;
      if (opts.onRetry) opts.onRetry(i, err);
      const wait = opts.baseMs * Math.pow(factor, i);
      await delay(wait);
    }
  }
  throw lastErr;
}
