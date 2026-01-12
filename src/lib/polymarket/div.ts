// src/lib/polymarket/div.ts

export type KeyOf<T> = (x: T) => string | null | undefined;

export function collapseByKey<T>(items: T[], keyOf: KeyOf<T>, scoreOf: (x: T) => number): T[] {
  const best = new Map<string, { item: T; score: number }>();
  for (const it of items) {
    const k = keyOf(it);
    if (!k) continue;
    const s = scoreOf(it);
    const prev = best.get(k);
    if (!prev || s > prev.score) best.set(k, { item: it, score: s });
  }
  return [...best.values()].map((x) => x.item);
}

export function diversify<T>(
  items: T[],
  limit: number,
  opts: {
    categoryOf?: (x: T) => string;
    maxPerCategory?: number;

    // alias for older call sites
    maxPerSection?: number;

    keyOf?: (x: T) => string | null | undefined;

    parentOf?: (x: T) => string | null | undefined;
    maxPerParent?: number;
  } = {}
): T[] {
  const categoryOf = opts.categoryOf ?? (() => "all");
  const maxPerCategory = opts.maxPerCategory ?? opts.maxPerSection ?? Infinity;
  const keyOf = opts.keyOf ?? null;

  const parentOf = opts.parentOf ?? null;
  const maxPerParent = opts.maxPerParent ?? Infinity;

  const out: T[] = [];
  const catCounts = new Map<string, number>();
  const parentCounts = new Map<string, number>();
  const seen = new Set<string>();

  for (const it of items) {
    if (out.length >= limit) break;

    if (keyOf) {
      const k = keyOf(it);
      if (k) {
        if (seen.has(k)) continue;
        seen.add(k);
      }
    }

    if (parentOf) {
      const p = parentOf(it);
      if (p) {
        const pc = parentCounts.get(p) ?? 0;
        if (pc >= maxPerParent) continue;
        parentCounts.set(p, pc + 1);
      }
    }

    const c = (categoryOf(it) || "all").toLowerCase();
    const cn = catCounts.get(c) ?? 0;
    if (cn >= maxPerCategory) continue;
    catCounts.set(c, cn + 1);

    out.push(it);
  }

  return out;
}