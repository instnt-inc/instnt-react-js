/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import useInstntScript from '../hooks/useInstntScript';

describe('useInstntScript', () => {
  afterEach(() => {
    document.querySelectorAll('script[data-instnt-status]').forEach((s) => s.remove());
  });

  it('returns idle when src is empty', () => {
    const { result } = renderHook(() => useInstntScript(''));
    expect(result.current).toBe('idle');
  });

  it('rejects invalid URL', () => {
    const { result } = renderHook(() => useInstntScript('not-a-url'));
    expect(result.current).toBe('error');
  });

  it('rejects untrusted origin', () => {
    const { result } = renderHook(() =>
      useInstntScript('https://evil.example.com/instnt.js')
    );
    expect(result.current).toBe('error');
  });

  it('allows trusted origin and creates script element', () => {
    const src = 'https://sdk.instnt.org/prod2/assets/scripts/instntJsResource/instnt.js';
    const { result } = renderHook(() => useInstntScript(src));
    expect(result.current).toBe('loading');
    const script = document.querySelector(`script[src="${src}"]`);
    expect(script).not.toBeNull();
  });

  it('sets integrity when hash and CORS support provided', () => {
    const src = 'https://sdk.instnt.org/prod2/assets/scripts/instntJsResource/instnt.js';
    const hash = 'sha384-abc123';
    renderHook(() => useInstntScript(src, hash, true));
    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.integrity).toBe(hash);
    expect(script.crossOrigin).toBe('anonymous');
  });

  it('skips integrity when CORS not supported', () => {
    const src = 'https://sdk.instnt.org/prod2/assets/scripts/instntJsResource/instnt.js';
    const hash = 'sha384-abc123';
    renderHook(() => useInstntScript(src, hash, false));
    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.integrity || '').toBe('');
  });

  // ─── [C1] strictSri ────────────────────────────────────────────────
  describe('[C1] strictSri option', () => {
    const src = 'https://sdk.instnt.org/prod2/assets/scripts/instntJsResource/instnt.js';

    it('refuses load without integrity hash when strict', () => {
      const { result } = renderHook(() =>
        useInstntScript(src, undefined, true, { strictSri: true })
      );
      expect(result.current).toBe('error');
      expect(document.querySelector(`script[src="${src}"]`)).toBeNull();
    });

    it('refuses load when cdnCorsSupported is false under strict', () => {
      const { result } = renderHook(() =>
        useInstntScript(src, 'sha384-abc123', false, { strictSri: true })
      );
      expect(result.current).toBe('error');
      expect(document.querySelector(`script[src="${src}"]`)).toBeNull();
    });

    it('allows load when both hash and cors are present under strict', () => {
      const { result } = renderHook(() =>
        useInstntScript(src, 'sha384-abc123', true, { strictSri: true })
      );
      expect(result.current).toBe('loading');
      const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(script.integrity).toBe('sha384-abc123');
    });

    it('defaults to permissive behaviour when strictSri is not set', () => {
      // No hash, no CORS — without strictSri we still load optimistically.
      const { result } = renderHook(() => useInstntScript(src));
      expect(result.current).toBe('loading');
      expect(document.querySelector(`script[src="${src}"]`)).not.toBeNull();
    });
  });

  // ─── [H4] allowedOrigins ──────────────────────────────────────────
  describe('[H4] allowedOrigins option', () => {
    it('extends the default allowlist, not replaces it', () => {
      const defaultSrc = 'https://sdk.instnt.org/prod2/assets/scripts/instntJsResource/instnt.js';
      const { result } = renderHook(() =>
        useInstntScript(defaultSrc, undefined, undefined, {
          allowedOrigins: ['https://sdk.eu.example.com'],
        })
      );
      expect(result.current).toBe('loading'); // default origin still allowed
    });

    it('permits configured extra origin', () => {
      const extraSrc = 'https://sdk.eu.example.com/prod2/assets/scripts/instntJsResource/instnt.js';
      const { result } = renderHook(() =>
        useInstntScript(extraSrc, undefined, undefined, {
          allowedOrigins: ['https://sdk.eu.example.com'],
        })
      );
      expect(result.current).toBe('loading');
    });

    it('still rejects origins not in default OR configured list', () => {
      const badSrc = 'https://evil.example.com/instnt.js';
      const { result } = renderHook(() =>
        useInstntScript(badSrc, undefined, undefined, {
          allowedOrigins: ['https://sdk.eu.example.com'],
        })
      );
      expect(result.current).toBe('error');
    });
  });

  // ─── [M10] ref-counted cleanup ────────────────────────────────────
  describe('[M10] ref-counted script cleanup', () => {
    const src = 'https://sdk.instnt.org/prod2/assets/scripts/instntJsResource/instnt.js';

    it('removes the script when the only consumer unmounts', () => {
      const { unmount } = renderHook(() => useInstntScript(src));
      expect(document.querySelector(`script[src="${src}"]`)).not.toBeNull();
      unmount();
      expect(document.querySelector(`script[src="${src}"]`)).toBeNull();
    });

    it('keeps the script alive while any consumer is still mounted', () => {
      const h1 = renderHook(() => useInstntScript(src));
      const h2 = renderHook(() => useInstntScript(src));
      const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(script.getAttribute('data-instnt-refcount')).toBe('2');

      h1.unmount();
      expect(document.querySelector(`script[src="${src}"]`)).not.toBeNull();
      expect(script.getAttribute('data-instnt-refcount')).toBe('1');

      h2.unmount();
      expect(document.querySelector(`script[src="${src}"]`)).toBeNull();
    });
  });
});
