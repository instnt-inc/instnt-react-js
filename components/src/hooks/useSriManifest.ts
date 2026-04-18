import { useState, useEffect } from 'react';

export type ManifestStatus = 'idle' | 'loading' | 'ready' | 'error';

interface SriManifest {
  version: string;
  environment: string;
  published_at: string;
  scripts: {
    [filename: string]: {
      sri: string;
      path: string;
    };
  };
}

interface UseSriManifestResult {
  sri: string | undefined;
  version: string | undefined;
  status: ManifestStatus;
  cdnCorsSupported: boolean;
}

const MANIFEST_ORIGIN = 'https://sdk.instnt.org';
const MANIFEST_FETCH_TIMEOUT_MS = 2000;

/**
 * Strict SHA-384 SRI hash format validator. sha384 produces 48 bytes,
 * which base64-encodes to exactly 64 characters with no padding (48 is
 * a multiple of 3). The prefix-only `.startsWith('sha384-')` check that
 * preceded this regex would accept `sha384-` followed by arbitrary
 * junk, silently disabling integrity enforcement. (Audit finding M7.)
 */
const SRI_HASH_FORMAT = /^sha384-[A-Za-z0-9+/]{64}$/;

const manifestCache = new Map<string, { sri: string; version: string; cdnCorsSupported: boolean }>();

const useSriManifest = (environment: string): UseSriManifestResult => {
  const cached = manifestCache.get(environment);

  const [sri, setSri] = useState<string | undefined>(cached?.sri);
  const [version, setVersion] = useState<string | undefined>(cached?.version);
  const [status, setStatus] = useState<ManifestStatus>(cached ? 'ready' : 'idle');
  const [cdnCorsSupported, setCdnCorsSupported] = useState<boolean>(cached?.cdnCorsSupported ?? false);

  useEffect(() => {
    if (!environment || environment === 'Unknown Environment') {
      console.warn(
        '[Instnt] SRI manifest skipped: unrecognised serviceURL. Script will load without integrity check.'
      );
      setStatus('error');
      return;
    }

    if (manifestCache.has(environment)) {
      return;
    }

    setStatus('loading');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MANIFEST_FETCH_TIMEOUT_MS);

    const manifestUrl = `${MANIFEST_ORIGIN}/${environment}/assets/scripts/manifest.json`;

    const scriptUrl = `${MANIFEST_ORIGIN}/${environment}/assets/scripts/instntJsResource/instnt_v1.js`;

    const manifestFetch = fetch(manifestUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    
    const scriptCorsprobe = fetch(scriptUrl, {
      method: 'HEAD',
      mode: 'cors',
      signal: controller.signal,
    });
    
    manifestFetch.then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${manifestUrl}`);
      return res.json() as Promise<SriManifest>;
    }).then((manifest) => {
        const scriptEntry = manifest?.scripts?.['instnt_v1.js'];

        if (!scriptEntry?.sri) throw new Error('Manifest missing scripts["instnt_v1.js"].sri');
        if (!SRI_HASH_FORMAT.test(scriptEntry.sri)) {
          throw new Error(
            `Malformed SRI hash — expected /^sha384-<64 base64 chars>={0,2}$/, received: ${scriptEntry.sri.slice(0, 16)}…`
          );
        }

        const resolvedVersion = manifest.version ?? 'unknown';
        const resolvedSri = scriptEntry.sri;

        // Resolve the CORS probe result alongside the manifest
        scriptCorsprobe
          .then(() => {
            // instnt_v1.js responded to a CORS request — safe to set crossOrigin
            manifestCache.set(environment, {
              sri: resolvedSri,
              version: resolvedVersion,
              cdnCorsSupported: true,
            });
            setSri(resolvedSri);
            setVersion(resolvedVersion);
            setCdnCorsSupported(true);
            setStatus('ready');
          })
          .catch(() => {
            // instnt_v1.js does not have CORS headers.
            // We still store the hash for informational purposes but mark
            // cdnCorsSupported false so crossOrigin is never set.
            console.warn(
              '[Instnt] instnt_v1.js does not support CORS requests. ' +
              'SRI hash is available but integrity enforcement is disabled. ' +
              'Add Access-Control-Allow-Origin to instnt_v1.js on the CDN to enable SRI.'
            );
            manifestCache.set(environment, {
              sri: resolvedSri,
              version: resolvedVersion,
              cdnCorsSupported: false,
            });
            setSri(resolvedSri);
            setVersion(resolvedVersion);
            setCdnCorsSupported(false);
            setStatus('ready');
          });
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') {
          console.warn(
            `[Instnt] SRI manifest fetch timed out after ${MANIFEST_FETCH_TIMEOUT_MS}ms. ` +
            'Script will load without integrity check.'
          );
        } else {
          console.warn(
            `[Instnt] SRI manifest unavailable (${err.message}). ` +
            'Script will load without integrity check.'
          );
        }
        setStatus('error');
      })
      .finally(() => clearTimeout(timeoutId));

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [environment]);

  return { sri, version, status, cdnCorsSupported };
};

export default useSriManifest;
