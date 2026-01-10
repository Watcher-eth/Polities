import { GammaMarket } from "../polymarket/gammaTypes"
import { inferBucket, pickEvent } from "./routing"

// src/lib/polymarket/normalize.ts
function parseOutcomePrices(outcomePrices?: string | null): number[] | null {
  if (!outcomePrices) return null;
  try {
    const arr = JSON.parse(outcomePrices);
    if (!Array.isArray(arr)) return null;
    const nums = arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
    return nums.length ? nums : null;
  } catch {
    return null;
  }
}

export function marketToCard(m: GammaMarket): MarketCarc | null {
  const slug = m.slug ?? "";
  const title = (m.question ?? "").trim();
  if (!m.id || !slug || !title) return null;

  const prices = parseOutcomePrices(m.outcomePrices);
  const yesPrice = prices?.[0] ?? null;
  const noPrice = prices?.[1] ?? null;

  const ev = pickEvent(m);

  return {
    id: m.id,
    slug,
    title,
    description: m.description ?? null,

    image: m.image ?? m.icon ?? ev?.image ?? ev?.icon ?? null,

    yesPrice: yesPrice != null ? clamp01(yesPrice) : null,
    noPrice: noPrice != null ? clamp01(noPrice) : null,

    volume24hr: m.volume24hr ?? null,
    liquidityNum: m.liquidityNum ?? null,
    oneDayMoveAbs: m.oneDayPriceChange != null ? Math.abs(m.oneDayPriceChange) : null,

    eventId: ev?.id != null ? String(ev.id) : null,
    eventSlug: ev?.slug ?? null,
    eventTitle: ev?.title ?? null,

    bucket: inferBucket(m),
  };
}

function clamp01(x: number) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}