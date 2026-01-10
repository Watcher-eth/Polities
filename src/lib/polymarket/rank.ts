// src/lib/polymarket/rank.ts
import type { MarketCard } from "./frontpageTypes";

const n = (x: any, fallback = 0) => (typeof x === "number" && Number.isFinite(x) ? x : fallback);

export function scoreTrending(c: MarketCard) {
  const v = n(c.volume24hr);
  const l = n(c.liquidityNum);
  const d = n(c.oneDayMoveAbs);
  return v * 1.0 + l * 0.15 + d * 50;
}

export function scoreMover(c: MarketCard) {
  const d = n(c.oneDayMoveAbs);
  const v = n(c.volume24hr);
  return d * 100 + v * 0.05;
}