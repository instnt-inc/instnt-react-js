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
});
