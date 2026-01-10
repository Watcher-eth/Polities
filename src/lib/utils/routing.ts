// src/lib/polymarket/routing.ts
import type { GammaMarket, GammaEvent, GammaTag } from "../polymarket/gammaTypes";

/**
 * For collapsing duplicates: prefer event.id if present (this collapses
 * "Super Bowl LX - Team X wins" markets that share the same event).
 */
export function parentKey(m: GammaMarket): string | null {
  const ev = pickEvent(m);
  if (ev?.id != null) return String(ev.id);
  if (m.slug) return String(m.slug);
  return null;
}

export function pickEvent(m: GammaMarket): GammaEvent | null {
  const ev0 = Array.isArray(m.events) && m.events.length ? m.events[0] : null;
  return ev0 ?? null;
}

function tagSlugs(tags?: GammaTag[] | null): string[] {
  if (!tags) return [];
  return tags.map((t) => (t.slug ?? "").toLowerCase()).filter(Boolean);
}

function tagIds(tags?: GammaTag[] | null): string[] {
  if (!tags) return [];
  return tags.map((t) => String(t.id)).filter(Boolean);
}

/**
 * Robust "is sports" based on:
 * - sports tag id (100639) if present
 * - any tag slug containing nfl/nba/mlb/nhl/uefa/etc
 * - gameStartTime presence (Gamma uses this for sports markets)
 */
export function isSportsMarket(m: GammaMarket): boolean {
  const ev = pickEvent(m);
  const allTags = [
    ...(Array.isArray(m.tags) ? m.tags : []),
    ...(Array.isArray(ev?.tags) ? (ev!.tags as any) : []),
  ] as any[];

  const ids = tagIds(allTags);
  if (ids.includes("100639")) return true;

  const slugs = tagSlugs(allTags);
  if (
    slugs.some((s) =>
      ["sports", "nfl", "nba", "mlb", "nhl", "soccer", "football", "tennis", "golf", "ufc", "mma"].some((k) =>
        s.includes(k)
      )
    )
  ) return true;

  if (m.gameStartTime) return true;

  // fallback: category string sometimes
  const c = (m.category ?? "").toLowerCase();
  if (c.includes("sport")) return true;

  return false;
}

/**
 * Tiny homepage bucketing. Keep it simple.
 * We mostly use event/category/tags if present; otherwise "other".
 */
export function inferBucket(m: GammaMarket): string {
  if (isSportsMarket(m)) return "sports";

  const ev = pickEvent(m);
  const c = (m.category ?? "").toLowerCase();
  const title = (ev?.title ?? m.question ?? "").toLowerCase();

  if (c.includes("polit") || title.includes("election") || title.includes("president")) return "politics";
  if (c.includes("crypto") || title.includes("bitcoin") || title.includes("ethereum")) return "crypto";
  if (c.includes("tech")) return "tech";
  if (c.includes("culture") || c.includes("entertain") || title.includes("oscar")) return "entertainment";
  if (c.includes("geo") || title.includes("iran") || title.includes("israel") || title.includes("ukraine")) return "geopolitics";
  if (c.includes("econ") || title.includes("inflation") || title.includes("rates")) return "economy";

  return "other";
}