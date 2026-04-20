/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react-hooks';
import useSriManifest from '../hooks/useSriManifest';

const flushPromises = () => act(async () => {
  await new Promise((r) => setTimeout(r, 0));
});

describe('useSriManifest', () => {
  beforeEach(() => {
    window.fetch = jest.fn() as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns error for empty environment', () => {
    const { result } = renderHook(() => useSriManifest(''));
    expect(result.current.status).toBe('error');
  });

  it('returns error for unknown environment', () => {
    const { result } = renderHook(() => useSriManifest('Unknown Environment'));
    expect(result.current.status).toBe('error');
  });

  it('fetches manifest for valid environment', async () => {
    const mockManifest = {
      version: '2.1.3',
      environment: 'sandbox2',
      published_at: '2026-04-01',
      scripts: {
        'instnt_v1.js': {
          sri: 'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP',
          path: '/sandbox2/assets/scripts/instntJsResource/instnt_v1.js',
        },
      },
    };

    (window.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('manifest.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockManifest),
        });
      }
      // CORS probe succeeds
      return Promise.resolve({ ok: true });
    });

    const { result } = renderHook(() => useSriManifest('sandbox2'));
    expect(result.current.status).toBe('loading');

    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(result.current.status).toBe('ready');
    expect(result.current.sri).toBe(mockManifest.scripts['instnt_v1.js'].sri);
    expect(result.current.version).toBe('2.1.3');
    expect(result.current.cdnCorsSupported).toBe(true);
  });

  it('handles CORS probe failure gracefully', async () => {
    const mockManifest = {
      version: '2.1.3',
      scripts: {
        'instnt_v1.js': {
          sri: 'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP',
          path: '/dev2/assets/scripts/instntJsResource/instnt_v1.js',
        },
      },
    };

    (window.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('manifest.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockManifest),
        });
      }
      // CORS probe fails
      return Promise.reject(new Error('CORS blocked'));
    });

    const { result } = renderHook(() => useSriManifest('dev2'));

    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(result.current.status).toBe('ready');
    expect(result.current.cdnCorsSupported).toBe(false);
    expect(result.current.sri).toBe(mockManifest.scripts['instnt_v1.js'].sri);
  });

  it('does not produce an unhandled rejection when unmounted before manifest resolves', async () => {
    // Regression test: previously `scriptCorsprobe` was created eagerly in
    // parallel with `manifestFetch` sharing the same AbortController. When the
    // effect cleanup fired before the manifest resolved (e.g. React 18
    // StrictMode's simulated unmount in dev), the probe's AbortError had no
    // handler attached and bubbled up as an uncaught promise rejection.
    const unhandled: unknown[] = [];
    const onUnhandled = (e: PromiseRejectionEvent) => {
      unhandled.push(e.reason);
      e.preventDefault();
    };
    window.addEventListener('unhandledrejection', onUnhandled);

    // Never-resolving fetches so the cleanup races with resolution
    (window.fetch as jest.Mock).mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      });
    });

    const { unmount } = renderHook(() => useSriManifest('sandbox2-never-resolves'));

    unmount();

    // Let any microtask-queued rejections flush
    await flushPromises();
    await flushPromises();

    window.removeEventListener('unhandledrejection', onUnhandled);

    expect(unhandled).toEqual([]);
  });

  it('handles manifest fetch failure', async () => {
    (window.fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
      });
    });

    const { result } = renderHook(() => useSriManifest('stage2'));

    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(result.current.status).toBe('error');
    expect(result.current.sri).toBeUndefined();
  });
});
