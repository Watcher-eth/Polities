// lib/polymarket/inferCategory.ts
import type { Market } from "@/lib/polymarket/rank";

const lc = (x: any) => String(x ?? "").toLowerCase();

export function isSportsMarket(m: Market) {
  const mm: any = m as any;

  // explicit signals (if Gamma provides them)
  if (mm.sportsMarketType || mm.sport || mm.league || mm.team) return true;

  // URL heuristics (very reliable for NFL props)
  const h = lc(m.href);
  if (
    h.includes("super-bowl") ||
    h.includes("nfc-championship") ||
    h.includes("afc-championship") ||
    h.includes("offensive-rookie") ||
    h.includes("coach-of-the-year") ||
    h.includes("passing-yards")
  ) {
    return true;
  }

  // image heuristics
  const img = lc(m.imageUrl);
  if (img.includes("nfl+team+logos") || img.includes("/nfl")) return true;

  return false;
}

export function inferCategory(m: Market) {
  // you can expand this later (politics, crypto, etc.)
  if (isSportsMarket(m)) return "sports";

  // “GTA VI”-style / memes / pop culture end up in entertainment
  const q = lc(m.title) + " " + lc(m.description);
  if (q.includes("gta") || q.includes("rockstar") || q.includes("take-two") || q.includes("game")) {
    return "entertainment";
  }

  // fallback: use reported category only if it’s not obviously wrong
  const c = lc(m.category);
  if (c && c !== "sports") return c;

  return "other";
}