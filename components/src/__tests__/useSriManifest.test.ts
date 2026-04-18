/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react-hooks';
import useSriManifest, { invalidateManifestCache } from '../hooks/useSriManifest';

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
          sri: 'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFabcdefghijklmnopqrstuv',
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
          sri: 'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFabcdefghijklmnopqrstuv',
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

  // ─── [M7] SRI hash format validation ─────────────────────────────
  describe('[M7] SRI hash format', () => {
    const validHash =
      'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFabcdefghijklmnopqrstuv';
    beforeEach(() => {
      invalidateManifestCache();
    });

    function mockManifestWithHash(hash: string) {
      (window.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('manifest.json')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                version: '2.1.3',
                environment: 'sandbox2',
                published_at: '2026-04-01',
                scripts: {
                  'instnt_v1.js': {
                    sri: hash,
                    path: '/sandbox2/assets/scripts/instntJsResource/instnt_v1.js',
                  },
                },
              }),
          });
        }
        return Promise.resolve({ ok: true }); // CORS probe succeeds
      });
    }

    it('accepts the canonical 64-char base64 form', async () => {
      mockManifestWithHash(validHash);
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('ready');
      expect(result.current.sri).toBe(validHash);
    });

    it('rejects a short hash (prefix-only was the audit gap)', async () => {
      mockManifestWithHash('sha384-abc123');
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('error');
    });

    it('rejects a hash with wrong algorithm prefix', async () => {
      const badHash = 'sha256-' + validHash.slice('sha384-'.length);
      mockManifestWithHash(badHash);
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('error');
    });

    it('rejects a hash with disallowed base64 chars', async () => {
      mockManifestWithHash('sha384-' + '!'.repeat(64));
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('error');
    });
  });

  // ─── [M4] cache TTL + invalidation ───────────────────────────────
  describe('[M4] manifest cache', () => {
    const validHash =
      'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFabcdefghijklmnopqrstuv';

    function primeCache() {
      (window.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('manifest.json')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                version: '2.1.3',
                environment: 'sandbox2',
                published_at: '2026-04-01',
                scripts: {
                  'instnt_v1.js': {
                    sri: validHash,
                    path: '/sandbox2/assets/scripts/instntJsResource/instnt_v1.js',
                  },
                },
              }),
          });
        }
        return Promise.resolve({ ok: true });
      });
    }

    it('invalidateManifestCache(env) drops a single entry', async () => {
      primeCache();
      const first = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      await flushPromises();
      expect(first.result.current.status).toBe('ready');

      // Next render with same env should hit cache (fetch not called again).
      (window.fetch as jest.Mock).mockClear();
      const second = renderHook(() => useSriManifest('sandbox2'));
      expect(second.result.current.status).toBe('ready');
      expect(window.fetch).not.toHaveBeenCalled();

      // Invalidate, re-render; fetch should fire again.
      invalidateManifestCache('sandbox2');
      (window.fetch as jest.Mock).mockClear();
      primeCache(); // re-install mock (mockClear may have reset behaviour)
      renderHook(() => useSriManifest('sandbox2'));
      expect(window.fetch).toHaveBeenCalled();
    });

    it('invalidateManifestCache() (no arg) drops all entries', async () => {
      primeCache();
      renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      await flushPromises();

      invalidateManifestCache();
      (window.fetch as jest.Mock).mockClear();
      primeCache();
      renderHook(() => useSriManifest('sandbox2'));
      expect(window.fetch).toHaveBeenCalled();
    });
  });

  // ─── [H3] CORS probe classification ──────────────────────────────
  describe('[H3] CORS probe error classification', () => {
    const validHash =
      'sha384-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFabcdefghijklmnopqrstuv';

    beforeEach(() => {
      invalidateManifestCache();
    });

    function mockManifestPlusProbeError(probeErr: Error) {
      (window.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('manifest.json')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                version: '2.1.3',
                environment: 'sandbox2',
                published_at: '2026-04-01',
                scripts: {
                  'instnt_v1.js': {
                    sri: validHash,
                    path: '/sandbox2/assets/scripts/instntJsResource/instnt_v1.js',
                  },
                },
              }),
          });
        }
        return Promise.reject(probeErr);
      });
    }

    it('treats AbortError as transient — cdnCorsSupported stays true', async () => {
      const abortErr = new Error('The user aborted a request.');
      abortErr.name = 'AbortError';
      mockManifestPlusProbeError(abortErr);
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('ready');
      expect(result.current.cdnCorsSupported).toBe(true);
    });

    it('treats network failure as transient — cdnCorsSupported stays true', async () => {
      mockManifestPlusProbeError(new TypeError('network request failed'));
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('ready');
      expect(result.current.cdnCorsSupported).toBe(true);
    });

    it('treats a non-transient rejection as real CORS failure — disables SRI', async () => {
      mockManifestPlusProbeError(new Error('Origin not allowed'));
      const { result } = renderHook(() => useSriManifest('sandbox2'));
      await flushPromises();
      await flushPromises();
      await flushPromises();
      expect(result.current.status).toBe('ready');
      expect(result.current.cdnCorsSupported).toBe(false);
    });
  });
});
