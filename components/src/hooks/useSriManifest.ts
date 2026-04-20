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

    manifestFetch.then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${manifestUrl}`);
      return res.json() as Promise<SriManifest>;
    }).then((manifest) => {
        const scriptEntry = manifest?.scripts?.['instnt_v1.js'];

        if (!scriptEntry?.sri) throw new Error('Manifest missing scripts["instnt_v1.js"].sri');
        if (!scriptEntry.sri.startsWith('sha384-')) {
          throw new Error(`SRI hash must use sha384, received: ${scriptEntry.sri.slice(0, 10)}`);
        }

        const resolvedVersion = manifest.version ?? 'unknown';
        const resolvedSri = scriptEntry.sri;

        // Probe the CDN for CORS support AFTER the manifest resolves. Creating
        // this fetch earlier (in parallel with the manifest fetch) meant its
        // `.then/.catch` handlers were only attached inside the manifest's
        // resolution callback — so if the shared AbortController fired before
        // the manifest resolved (e.g. React 18 StrictMode's simulated unmount
        // in dev, or a real unmount during the fetch window), the probe's
        // AbortError rejection had no handler and surfaced as an uncaught
        // promise rejection.
        fetch(scriptUrl, {
          method: 'HEAD',
          mode: 'cors',
          signal: controller.signal,
        })
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
