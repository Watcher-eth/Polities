type Entry<T> = { value: T; expiresAt: number };

export function createTtlCache() {
  const store = new Map<string, Entry<any>>();
  const inFlight = new Map<string, Promise<any>>();

  function get<T>(key: string): T | null {
    const hit = store.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expiresAt) {
      store.delete(key);
      return null;
    }
    return hit.value as T;
  }

  function set<T>(key: string, value: T, ttlMs: number) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async function wrap<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
    const cached = get<T>(key);
    if (cached) return cached;

    const inflight = inFlight.get(key);
    if (inflight) return inflight as Promise<T>;

    const p = fn()
      .then((val) => {
        set(key, val, ttlMs);
        return val;
      })
      .finally(() => {
        inFlight.delete(key);
      });

    inFlight.set(key, p);
    return p;
  }

  return { get, set, wrap };
}

export const ttlCache = createTtlCache();