// src/lib/polymarket/gamma.ts
import { ttlCache } from "./cache";
import type { GammaEvent, GammaMarket, GammaTag } from "./gammaTypes";

const GAMMA_BASE = "https://gamma-api.polymarket.com";

export type FetchOpts = { ttlMs?: number; signal?: AbortSignal };

function toQuery(params: Record<string, any>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) for (const item of v) sp.append(k, String(item));
    else sp.set(k, String(v));
  }
  return sp.toString();
}

async function gammaFetch<T>(path: string, params?: Record<string, any>, opts?: FetchOpts): Promise<T> {
  const url = new URL(path, GAMMA_BASE);
  if (params) url.search = toQuery(params);

  const ttlMs = opts?.ttlMs ?? 0;
  const cacheKey = ttlMs > 0 ? `gamma:${url.toString()}` : "";

  const run = async () => {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { accept: "application/json" },
      signal: opts?.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Gamma ${res.status} ${res.statusText} for ${url.toString()} :: ${text.slice(0, 300)}`);
    }
    return (await res.json()) as T;
  };

  return ttlMs > 0 ? ttlCache.wrap<T>(cacheKey, ttlMs, run) : run();
}

export const gamma = {
  events: {
    list: (params: Record<string, any>, opts?: FetchOpts) => gammaFetch<GammaEvent[]>("/events", params, opts),
    bySlug: (slug: string, opts?: FetchOpts) =>
      gammaFetch<GammaEvent>(`/events/slug/${encodeURIComponent(slug)}`, undefined, opts),
  },
  markets: {
    list: (params: Record<string, any>, opts?: FetchOpts) => gammaFetch<GammaMarket[]>("/markets", params, opts),
    bySlug: async (slug: string, opts?: FetchOpts) => {
      const list = await gammaFetch<GammaMarket[]>("/markets", { slug }, opts);
      const m = Array.isArray(list) ? list[0] : null;
      if (!m) throw new Error(`market_not_found: ${slug}`);
      return m;
    },
  },
  tags: {
    list: (params?: Record<string, any>, opts?: FetchOpts) => gammaFetch<GammaTag[]>("/tags", params, opts),
  },
};