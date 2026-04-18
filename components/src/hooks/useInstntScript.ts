import { useState, useEffect } from 'react';

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Default origins the wrapper will accept a script load from. Consumers
 * can extend or replace this via the `allowedOrigins` option below to
 * support staging, dev, regional CDNs, or private mirrors without a
 * code change. (Audit finding H4.)
 */
const DEFAULT_ALLOWED_ORIGINS = ['https://sdk.instnt.org'];

export interface UseInstntScriptOptions {
  /**
   * [C1] When true, refuse to load the script if an integrity hash is
   * not available. Surfaces `status = 'error'` and logs a clear reason.
   * Use this in any deployment where SRI enforcement is required by
   * policy (e.g. CSP `require-sri-for script`). Default: false, which
   * preserves the existing optimistic behaviour for backward compat.
   */
  strictSri?: boolean;
  /**
   * [H4] Additional origins the script may load from, appended to the
   * default `https://sdk.instnt.org`. Supply a fully qualified origin
   * string (scheme + host + port). No wildcards — explicit list only.
   */
  allowedOrigins?: string[];
}

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
 * @param options          Optional strict-SRI / allowed-origins configuration.
 */
const useInstntScript = (
  src: string,
  integrityHash?: string,
  cdnCorsSupported?: boolean,
  options: UseInstntScriptOptions = {}
): ScriptStatus => {
  const { strictSri = false, allowedOrigins = [] } = options;
  const effectiveAllowedOrigins = [...DEFAULT_ALLOWED_ORIGINS, ...allowedOrigins];
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

    if (!effectiveAllowedOrigins.includes(url.origin)) {
      setStatus('error');
      console.error(
        '[Instnt] Blocked script load from untrusted origin:',
        url.origin,
        `(allowed: ${effectiveAllowedOrigins.join(', ')})`
      );
      return;
    }

    // [C1] Strict SRI: if the consumer has opted in, refuse to proceed
    // without a verifiable hash. This closes the silent-degradation gap
    // where a CORS failure or missing manifest entry would quietly load
    // the script unverified. Note: when strictSri is true, a missing
    // integrityHash OR an unconfirmed cdnCorsSupported is fatal — both
    // are required to make SRI enforcement actually run in the browser.
    if (strictSri && !(integrityHash && cdnCorsSupported)) {
      setStatus('error');
      console.error(
        '[Instnt] Strict SRI mode: refusing to load script without a verified integrity hash. ' +
        `integrityHash=${integrityHash ? 'present' : 'missing'}, cdnCorsSupported=${cdnCorsSupported}`
      );
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
  }, [src, integrityHash, cdnCorsSupported, strictSri, effectiveAllowedOrigins.join('|')]);

  return status;
};

export default useInstntScript;
