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

    fetch(manifestUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${manifestUrl}`);
        return res.json() as Promise<SriManifest>;
      })
      .then((manifest) => {
        const scriptEntry = manifest?.scripts?.['instnt.js'];

        if (!scriptEntry?.sri) throw new Error('Manifest missing scripts["instnt.js"].sri');
        if (!scriptEntry.sri.startsWith('sha384-')) {
          throw new Error(`SRI hash must use sha384, received: ${scriptEntry.sri.slice(0, 10)}`);
        }

        const resolvedVersion = manifest.version ?? 'unknown';
        const resolvedSri = scriptEntry.sri;

        // CDN uses the same CORS policy for instnt.js as manifest.json,
        // so crossOrigin="anonymous" is safe and SRI can be enforced.
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
