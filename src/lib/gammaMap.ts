// src/lib/gammaMap.ts
import type { CardVM } from "@/lib/homeVm";
import type { GammaEvent, GammaMarket } from "@/lib/polymarket/gammaTypes";
import { inferBucket } from "@/lib/utils/routing";

const pickFirstImage = (x: any): string | null => {
  return x?.image || x?.imageUrl || x?.icon || x?.bannerImage || x?.thumbnail || x?.profileImage || null;
};

const slugToHref = (slug?: string | null) => (slug ? `/m/${slug}` : "#");

function numOrNull(x: any): number | null {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function clamp01(x: number) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function parseOutcomePrices(raw: any): number[] | null {
    try {
      const arr =
        typeof raw === "string" ? JSON.parse(raw) :
        Array.isArray(raw) ? raw :
        null;
  
      if (!Array.isArray(arr) || arr.length < 2) return null;
  
      const nums = arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      return nums.length ? nums : null;
    } catch {
      return null;
    }
  }
  
  function parseOutcomes(raw: any): string[] | null {
    try {
      const arr =
        typeof raw === "string" ? JSON.parse(raw) :
        Array.isArray(raw) ? raw :
        null;
  
      if (!Array.isArray(arr) || arr.length < 2) return null;
  
      return arr.map((x) => String(x ?? "").trim()).filter(Boolean);
    } catch {
      return null;
    }
  }
  
  /**
   * Only return pYes/pNo when outcomes are actually Yes/No.
   * Otherwise return nulls.
   */
  function parseYesNo(m: GammaMarket): { pYes: number | null; pNo: number | null } {
    const outcomes = parseOutcomes((m as any).outcomes);
    const prices = parseOutcomePrices((m as any).outcomePrices);
  
    if (!outcomes || !prices) return { pYes: null, pNo: null };
    if (outcomes.length < 2 || prices.length < 2) return { pYes: null, pNo: null };
  
    const o0 = outcomes[0].toLowerCase();
    const o1 = outcomes[1].toLowerCase();
  
    // must be exactly yes/no in first two slots
    const isYesNo = (o0 === "yes" && o1 === "no") || (o0 === "no" && o1 === "yes");
    if (!isYesNo) return { pYes: null, pNo: null };
  
    const p0 = clamp01(Number(prices[0]));
    const p1 = clamp01(Number(prices[1]));
  
    if (o0 === "yes") return { pYes: p0, pNo: p1 };
    return { pYes: p1, pNo: p0 };
  }


export function marketToCard(
  m: GammaMarket,
  opts?: { section?: string; category?: string; parentId?: string | null; event?: GammaEvent | null }
): CardVM | null {
  const slug = m.slug ?? null;
  const title = (m.question ?? "").trim();

  if (!m.id || !slug || !title) return null;

  const { pYes, pNo } = parseYesNo(m);

  const ev = opts?.event ?? (Array.isArray(m.events) && m.events.length ? m.events[0] : null);
  const imageUrl = pickFirstImage(m) ?? pickFirstImage(ev);

  const topic = inferBucket(m); // ✅ bucket for sections

  return {
    id: String(m.id),
    title,
    href: slugToHref(slug),

    description: m.description ?? null,
    imageUrl,
    iconUrl: m.icon ?? ev?.icon ?? null,

    category: opts?.category ?? null,
    section: opts?.section ?? null,      // where it was used (e.g. "trending")
    topic,                                // sports/economy/geopolitics/...

    parentId: opts?.parentId ?? (ev?.id ? String(ev.id) : null),

    pYes,
    pNo,

    volume24hr: numOrNull(m.volume24hr ?? m.volumeNum),
    liquidity: numOrNull(m.liquidityNum ?? m.liquidity),
    oneDayMoveAbs: m.oneDayPriceChange != null ? Math.abs(Number(m.oneDayPriceChange)) : null,
    endDate: m.endDateIso ?? m.endDate ?? null,
  };
}

export function eventToCards(e: GammaEvent, opts?: { section?: string; category?: string }): CardVM[] {
  const markets = Array.isArray(e.markets) ? e.markets : [];
  return markets
    .map((m) =>
      marketToCard(m, {
        section: opts?.section,
        category: opts?.category,
        parentId: e.id ? String(e.id) : null,
        event: e,
      })
    )
    .filter((c): c is CardVM => Boolean(c && c.id && c.title && c.href));
}