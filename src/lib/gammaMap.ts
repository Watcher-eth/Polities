// src/lib/gammaMap.ts
import type { CardVM } from "@/lib/homeVm";
import type { GammaEvent, GammaMarket } from "@/lib/polymarket/gammaTypes";

const toNum = (x: any): number | null => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string") {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const parseMaybeJsonArray = (x: any): string[] | null => {
  if (!x) return null;
  if (Array.isArray(x)) return x.map(String);
  if (typeof x === "string") {
    // sometimes outcomePrices is a JSON string like '["0.62","0.38"]'
    const s = x.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        return Array.isArray(arr) ? arr.map(String) : null;
      } catch {
        return null;
      }
    }
    // or a single string (rare) → not useful as array
    return null;
  }
  return null;
};

const slugToHref = (slug?: string | null) => (slug ? `/m/${slug}` : "#");

function inferYesNo(outcomes: string[] | null, prices: string[] | null) {
  if (!outcomes || !prices || outcomes.length !== prices.length) return { pYes: null, pNo: null };

  const idxYes = outcomes.findIndex((o) => String(o).toLowerCase() === "yes");
  const idxNo = outcomes.findIndex((o) => String(o).toLowerCase() === "no");

  if (idxYes === -1 || idxNo === -1) return { pYes: null, pNo: null };

  const pYes = toNum(prices[idxYes]);
  const pNo = toNum(prices[idxNo]);

  // sanity clamp
  const clamp01 = (v: number | null) => (v == null ? null : Math.max(0, Math.min(1, v)));
  return { pYes: clamp01(pYes), pNo: clamp01(pNo) };
}

export function marketToCard(m: GammaMarket, opts?: { category?: string; preferHref?: string }): CardVM {
  const title = m?.question?.trim() || "Untitled market";
  const href = opts?.preferHref ?? slugToHref(m?.slug);

  const outcomes = parseMaybeJsonArray(m?.outcomes);
  const prices = parseMaybeJsonArray(m?.outcomePrices);

  const { pYes, pNo } = inferYesNo(outcomes, prices);

  const volume = toNum(m?.volume);
  const liquidity = toNum(m?.liquidity);

  const oneDayPriceChange = typeof m?.oneDayPriceChange === "number" ? m.oneDayPriceChange : null;
  const oneDayMoveAbs = oneDayPriceChange == null ? null : Math.abs(oneDayPriceChange);

  // Prefer explicit event id if your feed contains it, else conditionId, else null
  const parentId =
    (Array.isArray(m?.events) && m.events?.[0]?.id != null ? String(m.events[0].id) : null) ??
    (m?.conditionId ? String(m.conditionId) : null);

  return {
    id: String(m.id),
    title,
    href,
    description: m?.description ?? null,

    imageUrl: m?.image ?? null,
    iconUrl: m?.icon ?? null,

    pYes,
    pNo,

    volume24hr: null, // Gamma "Get Markets" doesn’t guarantee 24h volume; keep null unless you compute it elsewhere
    liquidity,

    oneDayPriceChange,
    oneDayMoveAbs,

    endDate: m?.endDate ?? null,

    parentId,
    section: opts?.category ?? null,
  };
}

export function eventToFeatured(event: GammaEvent) {
  const title = event?.title || event?.slug || "Featured";
  const href = event?.slug ? `/e/${event.slug}` : "#";

  return {
    title,
    href,
    imageUrl: event?.image ?? event?.icon ?? null,
    imageCaption: undefined,
  };
}