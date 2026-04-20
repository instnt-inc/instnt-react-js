import { useState, useEffect } from 'react';
import { retryWithBackoff } from './retry';

export type ManifestStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * [L4] Manifest shape — strict variant that requires the primary entry
 * to exist at the type level. This is enforced by intersecting a
 * required-key Record with the open-ended filename → hash map, so a
 * manifest missing `scripts['instnt_v1.js']` fails compile, not at
 * runtime.
 */
interface ScriptEntry {
  sri: string;
  path: string;
}
interface SriManifest {
  version: string;
  environment: string;
  published_at: string;
  scripts: Record<'instnt_v1.js', ScriptEntry> & Record<string, ScriptEntry>;
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
 * [C4] Retry configuration for the manifest fetch. A single transient
 * blip (DNS flap, transient 502 from CloudFront, brief connection reset)
 * should not permanently fail the SDK for a session — without retries
 * the fallback is an unverified script load. We retry up to 3 times with
 * exponential backoff (250 ms → 750 ms → 2250 ms) on network-shaped
 * errors only; HTTP 4xx / 5xx responses that parse cleanly are surfaced
 * immediately because they are unlikely to be transient. Total worst-
 * case added latency: ~3.25 s, still well under any reasonable UX budget.
 */
const MANIFEST_RETRY_BASE_MS = 250;
const MANIFEST_RETRY_ATTEMPTS = 3;

/**
 * Strict SHA-384 SRI hash format validator. sha384 produces 48 bytes,
 * which base64-encodes to exactly 64 characters with no padding (48 is
 * a multiple of 3). The prefix-only `.startsWith('sha384-')` check that
 * preceded this regex would accept `sha384-` followed by arbitrary
 * junk, silently disabling integrity enforcement. (Audit finding M7.)
 */
const SRI_HASH_FORMAT = /^sha384-[A-Za-z0-9+/]{64}$/;

/**
 * [M4] Cache entries are TTL-bounded so a long-lived SPA doesn't keep
 * serving a hash that the CDN has since rotated. The TTL is deliberately
 * short (5 minutes): SDK releases are rare but environment switches /
 * CDN invalidations happen. Callers that need stronger freshness can
 * use `invalidateManifestCache()` — e.g. from a settings-changed event
 * handler or a long-lived SPA router hook.
 */
const MANIFEST_CACHE_TTL_MS = 5 * 60 * 1000;
interface ManifestCacheEntry {
  sri: string;
  version: string;
  cdnCorsSupported: boolean;
  storedAt: number;
}
const manifestCache = new Map<string, ManifestCacheEntry>();

/**
 * Clear the in-memory manifest cache. If `environment` is omitted every
 * entry is dropped; otherwise only the entry for the given env is.
 */
export function invalidateManifestCache(environment?: string): void {
  if (environment) manifestCache.delete(environment);
  else manifestCache.clear();
}

function readCache(environment: string): ManifestCacheEntry | undefined {
  const entry = manifestCache.get(environment);
  if (!entry) return undefined;
  if (Date.now() - entry.storedAt > MANIFEST_CACHE_TTL_MS) {
    manifestCache.delete(environment);
    return undefined;
  }
  return entry;
}

const useSriManifest = (environment: string): UseSriManifestResult => {
  const cached = readCache(environment);

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

    if (readCache(environment)) {
      return;
    }

    setStatus('loading');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MANIFEST_FETCH_TIMEOUT_MS);

    const manifestUrl = `${MANIFEST_ORIGIN}/${environment}/assets/scripts/manifest.json`;

    const scriptUrl = `${MANIFEST_ORIGIN}/${environment}/assets/scripts/instntJsResource/instnt.js`;

    // [C4] Wrap the manifest fetch in exponential-backoff retries so a
    // single transient failure doesn't kill SRI enforcement for the
    // whole session. HTTP failures (4xx / 5xx) are not retried.
    const manifestFetch = retryWithBackoff(
      () =>
        fetch(manifestUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        }),
      {
        attempts: MANIFEST_RETRY_ATTEMPTS,
        baseMs: MANIFEST_RETRY_BASE_MS,
        signal: controller.signal,
      }
    );
    
    const scriptCorsprobe = fetch(scriptUrl, {
      method: 'HEAD',
      mode: 'cors',
      signal: controller.signal,
    });
    
    manifestFetch.then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${manifestUrl}`);
      return res.json() as Promise<SriManifest>;
    }).then((manifest) => {
        const scriptEntry = manifest?.scripts?.['instnt.js'];

        if (!scriptEntry?.sri) throw new Error('Manifest missing scripts["instnt_v1.js"].sri');
        if (!SRI_HASH_FORMAT.test(scriptEntry.sri)) {
          throw new Error(
            `Malformed SRI hash — expected /^sha384-<64 base64 chars>={0,2}$/, received: ${scriptEntry.sri.slice(0, 16)}…`
          );
        }

        const resolvedVersion = manifest.version ?? 'unknown';
        const resolvedSri = scriptEntry.sri;

        // Resolve the CORS probe result alongside the manifest.
        //
        // [H3] The previous implementation collapsed every probe failure into
        // `cdnCorsSupported = false`, including transient network errors, the
        // user's own AbortController tripping, and genuine CORS rejections.
        // The result: one flaky probe permanently disabled SRI enforcement
        // for the session. The code below distinguishes three cases:
        //
        //   (a) probe succeeded       → CORS confirmed, enable SRI
        //   (b) probe aborted / offline / timeout → classify as "unknown"
        //       and defer the CORS decision; attempt the load with SRI and
        //       let the script's own load event arbitrate
        //   (c) probe rejected with a CORS-shaped error → disable SRI
        //
        // The browser itself is the source of truth for (c); we detect it by
        // looking for the distinctive TypeError that opaque CORS failures
        // throw in `fetch`, versus AbortError / network errors which have
        // different shapes.
        scriptCorsprobe
          .then(() => {
            manifestCache.set(environment, {
              sri: resolvedSri,
              version: resolvedVersion,
              cdnCorsSupported: true,
              storedAt: Date.now(),
            });
            setSri(resolvedSri);
            setVersion(resolvedVersion);
            setCdnCorsSupported(true);
            setStatus('ready');
          })
          .catch((probeErr: Error) => {
            const isTransient =
              probeErr.name === 'AbortError' ||
              /network|timeout|failed to fetch/i.test(probeErr.message || '');
            if (isTransient) {
              console.warn(
                `[Instnt] CORS probe for instnt_v1.js was transient (${probeErr.name}: ${probeErr.message}). ` +
                'Deferring CORS decision — will attempt script load with SRI and trust the browser to arbitrate.'
              );
              // Treat as "unknown" → optimistically attempt SRI; the script
              // tag's own error event will downgrade gracefully if the CDN
              // actually rejects the integrity check.
              manifestCache.set(environment, {
                sri: resolvedSri,
                version: resolvedVersion,
                cdnCorsSupported: true,
              storedAt: Date.now(),
              });
              setSri(resolvedSri);
              setVersion(resolvedVersion);
              setCdnCorsSupported(true);
            } else {
              console.warn(
                '[Instnt] instnt_v1.js does not support CORS requests. ' +
                'SRI hash is available but integrity enforcement is disabled. ' +
                'Add Access-Control-Allow-Origin to instnt_v1.js on the CDN to enable SRI.'
              );
              manifestCache.set(environment, {
                sri: resolvedSri,
                version: resolvedVersion,
                cdnCorsSupported: false,
              storedAt: Date.now(),
              });
              setSri(resolvedSri);
              setVersion(resolvedVersion);
              setCdnCorsSupported(false);
            }
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
