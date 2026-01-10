import {  diversify } from "@/lib/polymarket/div";
import { scoreTrending, scoreMover,  } from "@/lib/polymarket/rank";
import { GammaMarket } from "./gammaTypes"

function sortByScore(list: GammaMarket[], score: (m: GammaMarket) => number) {
  return [...list].sort((a, b) => score(b) - score(a));
}

function categoryOf(m: GammaMarket) {
  return String(m.category ?? "other").toLowerCase();
}

// ✅ Use your typed field (no events[] needed)
function parentKey(m: GammaMarket) {
  // Prefer eventId if present; fall back to conditionId; fall back to slug
  return (
    (m.eventId != null ? String(m.eventId) : null) ??
    (m.conditionId != null ? String(m.conditionId) : null) ??
    (m.slug != null ? String(m.slug) : null)
  );
}

export function buildTrending(list: GammaMarket[], n: number) {
  const sorted = sortByScore(list, scoreTrending);
  const collapsed = collapseByParent(sorted, parentKey, scoreTrending);

  return diversify(collapsed, n, {
    maxPerCategory: 5,
    categoryOf,
    // ✅ ensure no duplicates even if API returns dup ids
    keyOf: (m) => m.id,
    // ✅ and still keep one per event/parent
    maxPerParent: 1,
    parentOf: parentKey,
  });
}

export function buildMovers(list: Market[], n: number) {
  const sorted = sortByScore(list, scoreMover);
  const collapsed = collapseByParent(sorted, parentKey, scoreMover);

  return diversify(collapsed, n, {
    maxPerCategory: 5,
    categoryOf,
    keyOf: (m) => m.id,
    maxPerParent: 1,
    parentOf: parentKey,
  });
}