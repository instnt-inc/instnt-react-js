import { useState, useEffect } from 'react';

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

const ALLOWED_ORIGINS = ['https://sdk.instnt.org'];

const useInstntScript = (src: string, integrityHash?: string): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return;
    }

    // Validate that the script URL belongs to a known Instnt origin
    let url: URL;
    try {
      url = new URL(src);
    } catch {
      setStatus('error');
      console.error('[Instnt] Invalid script URL:', src);
      return;
    }

    if (!ALLOWED_ORIGINS.includes(url.origin)) {
      setStatus('error');
      console.error('[Instnt] Blocked script load from untrusted origin:', url.origin);
      return;
    }

    // Reuse an existing script tag if it was already injected (e.g. StrictMode double-mount)
    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (script) {
      const existingStatus = script.getAttribute('data-instnt-status') as ScriptStatus | null;
      if (existingStatus === 'ready' || existingStatus === 'error') {
        setStatus(existingStatus);
        return;
      }
      // Still loading — fall through and attach listeners below
    } else {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-instnt-status', 'loading');

      if (integrityHash) {
        script.integrity = integrityHash;
        script.crossOrigin = 'anonymous';
      }

      document.body.appendChild(script);
    }

    const handleLoad = () => {
      script!.setAttribute('data-instnt-status', 'ready');
      setStatus('ready');
    };

    const handleError = () => {
      script!.setAttribute('data-instnt-status', 'error');
      setStatus('error');
      console.error('[Instnt] Failed to load script:', src);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    return () => {
      script!.removeEventListener('load', handleLoad);
      script!.removeEventListener('error', handleError);
    };
  }, [src, integrityHash]);

  return status;
};

export default useInstntScript;
