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
}

const MANIFEST_ORIGIN = 'https://sdk.instnt.org';

// Module-level cache so multiple mounts in the same session never re-fetch
const manifestCache = new Map<string, { sri: string; version: string }>();

const useSriManifest = (environment: string): UseSriManifestResult => {
  const [sri, setSri] = useState<string | undefined>(() => manifestCache.get(environment)?.sri);
  const [version, setVersion] = useState<string | undefined>(() => manifestCache.get(environment)?.version);
  const [status, setStatus] = useState<ManifestStatus>(() =>
    manifestCache.has(environment) ? 'ready' : 'idle'
  );

  useEffect(() => {
    if (!environment || environment === 'Unknown Environment') {
      console.warn('[Instnt] Cannot fetch SRI manifest: unrecognised serviceURL, script will load without integrity check');
      setStatus('error');
      return;
    }

    // Already resolved from cache — nothing to do
    if (manifestCache.has(environment)) {
      return;
    }

    setStatus('loading');

    const manifestUrl = `${MANIFEST_ORIGIN}/${environment}/manifest.json`;

    fetch(manifestUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} fetching manifest from ${manifestUrl}`);
        }
        return res.json() as Promise<SriManifest>;
      })
      .then((manifest) => {
        const scriptEntry = manifest?.scripts?.['instnt.js'];

        if (!scriptEntry?.sri) {
          throw new Error('Manifest is missing scripts["instnt.js"].sri field');
        }

        // Enforce sha384 prefix — reject weaker hashes
        if (!scriptEntry.sri.startsWith('sha384-')) {
          throw new Error(`SRI hash must use sha384, got: ${scriptEntry.sri.slice(0, 10)}`);
        }

        const resolvedVersion = manifest.version ?? 'unknown';

        manifestCache.set(environment, { sri: scriptEntry.sri, version: resolvedVersion });

        setSri(scriptEntry.sri);
        setVersion(resolvedVersion);
        setStatus('ready');
      })
      .catch((err: Error) => {
        console.warn(
          `[Instnt] SRI manifest fetch failed (${err.message}). Script will load without integrity check.`
        );
        setStatus('error');
      });
  }, [environment]);

  return { sri, version, status };
};

export default useSriManifest;
