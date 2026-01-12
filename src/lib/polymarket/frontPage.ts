// src/lib/polymarket/frontPage.ts
import { gamma } from "@/lib/polymarket/gamma";
import type { GammaMarket } from "@/lib/polymarket/gammaTypes";
import type { CardVM } from "@/lib/homeVm";
import { marketToCard } from "@/lib/gammaMap";
import { diversify } from "@/lib/polymarket/div";
import { inferBucket, parentKey, pickEvent, topicKeyFromMarket } from "@/lib/utils/routing";

const TTL_MS = 5_000;

function scoreTrending(c: CardVM) {
  const v = c.volume24hr ?? 0;
  const l = c.liquidity ?? 0;
  const d = c.oneDayMoveAbs ?? 0;
  return v * 1.0 + l * 0.15 + d * 50;
}
function scoreMover(c: CardVM) {
  const d = c.oneDayMoveAbs ?? 0;
  const v = c.volume24hr ?? 0;
  return d * 100 + v * 0.05;
}

function uniqBy<T>(list: T[], keyOf: (x: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of list) {
    const k = keyOf(item);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

async function fetchMarketsPaged(opts: { pageSize?: number; pages?: number } = {}): Promise<GammaMarket[]> {
  const pageSize = opts.pageSize ?? 500;
  const pages = opts.pages ?? 4;

  const offsets = Array.from({ length: pages }, (_, i) => i * pageSize);

  const pagesRes = await Promise.all(
    offsets.map((offset) =>
      gamma.markets.list(
        {
          active: true,
          closed: false,
          limit: pageSize,
          offset,
          order: "volume24hr",
          ascending: false,
        },
        { ttlMs: TTL_MS }
      )
    )
  );

  const merged = pagesRes.flat().filter(Boolean);
  return uniqBy(merged, (m) => String((m as any).id ?? ""));
}

function topicKeyFromCard(c: CardVM): string {
  // use the market title primarily; href often includes slug
  const t = (c.title ?? "").toLowerCase();
  // strip common date patterns + thresholds to avoid repeated variants
  return t
    .replace(/\b20\d{2}[-/]\d{2}[-/]\d{2}\b/g, " ")
    .replace(/\bby\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}\b/g, " ")
    .replace(/\bon\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}\b/g, " ")
    .replace(/\b(less than|more than|over|under)\s+[-+]?\d+(\.\d+)?\s*(k|m|b|%)?\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type HomeData = {
  updatedAt: string;
  trending: CardVM[];
  movers: CardVM[];
  sections: Record<string, CardVM[]>;
};

export async function getHomeData(): Promise<HomeData> {
  const markets = await fetchMarketsPaged({ pages: 4, pageSize: 500 });

  const cardsRaw = markets
    .map((m) => {
      const section = inferBucket(m);
      const ev = pickEvent(m);
      const p = ev?.id ? String(ev.id) : parentKey(m);

      return marketToCard(m, {
        section,
        parentId: p,
        event: ev,
        // (optional) if your marketToCard supports it you can pass topicKey too
        // topicKey: topicKeyFromMarket(m),
      });
    })
    .filter((c): c is CardVM => Boolean(c && c.id && c.title && c.href));

  const cards = uniqBy(cardsRaw, (c) => c.id);

  const trendingPool = [...cards].sort((a, b) => scoreTrending(b) - scoreTrending(a));
  const moversPool = [...cards].sort((a, b) => scoreMover(b) - scoreMover(a));

  // Global: very strict variety
  const trending = diversify(trendingPool, 24, {
    keyOf: (c) => c.id,
    categoryOf: (c) => (c.section ?? "other").toLowerCase(),
    maxPerCategory: 8,
    parentOf: (c) => c.parentId ?? null,
    maxPerParent: 1,
  }).reduce<CardVM[]>((acc, c) => {
    // extra topic-level cap (avoid date variants even when parentId missing)
    const tk = topicKeyFromCard(c);
    if (acc.some((x) => topicKeyFromCard(x) === tk)) return acc;
    acc.push(c);
    return acc;
  }, []);

  const movers = diversify(moversPool, 24, {
    keyOf: (c) => c.id,
    categoryOf: (c) => (c.section ?? "other").toLowerCase(),
    maxPerCategory: 8,
    parentOf: (c) => c.parentId ?? null,
    maxPerParent: 1,
  }).reduce<CardVM[]>((acc, c) => {
    const tk = topicKeyFromCard(c);
    if (acc.some((x) => topicKeyFromCard(x) === tk)) return acc;
    acc.push(c);
    return acc;
  }, []);

  const wanted = ["geopolitics", "economy", "sports", "entertainment"] as const;
  const sections: Record<string, CardVM[]> = {};

  for (const s of wanted) {
    const pool = cards.filter((c) => (c.section ?? "other").toLowerCase() === s);
    const sorted = [...pool].sort((a, b) => scoreTrending(b) - scoreTrending(a));

    // Sections: allow a little more repetition than homepage,
    // but still cap per parent + per topic.
    const base = diversify(sorted, 120, {
      keyOf: (c) => c.id,
      categoryOf: () => s,
      maxPerCategory: 120,
      parentOf: (c) => c.parentId ?? null,
      maxPerParent: 1,
    });

    const out: CardVM[] = [];
    const topicCount = new Map<string, number>();

    for (const c of base) {
      if (out.length >= 60) break;
      const tk = topicKeyFromCard(c);
      const n = topicCount.get(tk) ?? 0;

      // allow up to 2 per topic in sports (spreads + ML), else 1
      const cap = s === "sports" ? 2 : 1;
      if (n >= cap) continue;

      topicCount.set(tk, n + 1);
      out.push(c);
    }

    sections[s] = out;
  }

  return {
    updatedAt: new Date().toISOString(),
    trending,
    movers,
    sections,
  };
}