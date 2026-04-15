import { useState, useEffect } from 'react';

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

const ALLOWED_ORIGINS = ['https://sdk.instnt.org'];

/**
 * @param src              Full URL of the script to inject.
 * @param integrityHash    Optional sha384-... SRI hash from the manifest.
 * @param cdnCorsSupported Set to true only when useSriManifest confirmed the
 *                         CDN manifest endpoint responded with CORS headers.
 *                         This proves instnt_v1.js is also served with CORS support,
 *                         making it safe to set crossOrigin="anonymous".
 *
 *                         Without this guard: setting crossOrigin on a script
 *                         tag whose CDN does not return Access-Control-Allow-Origin
 *                         causes the browser to block the script with a CORS
 *                         error even though the file returns HTTP 200.
 */
const useInstntScript = (
  src: string,
  integrityHash?: string,
  cdnCorsSupported?: boolean
): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return;
    }

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

    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (script) {
      const existingStatus = script.getAttribute('data-instnt-status') as ScriptStatus | null;
      if (existingStatus === 'ready' || existingStatus === 'error') {
        setStatus(existingStatus);
        return;
      }
    } else {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-instnt-status', 'loading');

      if (integrityHash && cdnCorsSupported) {
        // Both conditions required:
        // 1. integrityHash — we have a hash to verify against
        // 2. cdnCorsSupported — CDN confirmed it sends Access-Control-Allow-Origin,
        //    so setting crossOrigin="anonymous" will not block the script load
        script.integrity = integrityHash;
        script.crossOrigin = 'anonymous';
      } else if (integrityHash && !cdnCorsSupported) {
        console.warn(
          '[Instnt] SRI hash available but CDN CORS support unconfirmed. ' +
          'Skipping integrity enforcement to prevent a CORS-blocked script load. ' +
          'Configure Access-Control-Allow-Origin on sdk.instnt.org/instnt_v1.js to enable SRI.'
        );
      }

      document.body.appendChild(script);
    }

    setStatus('loading');

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
  }, [src, integrityHash, cdnCorsSupported]);

  return status;
};

export default useInstntScript;
