import type { NextApiRequest, NextApiResponse } from "next";
import { gamma } from "@/lib/polymarket/gamma";
import { TWELVE_HOURS_S, setApiCache } from "@/lib/polymarket/types";
import type { GammaMarket } from "@/lib/polymarket/gammaTypes";
import { marketToCard } from "@/lib/utils/normalize";
import { collapseByKey, diversify } from "@/lib/polymarket/div";
import { scoreMover, scoreTrending } from "@/lib/polymarket/rank";

const TTL_MS = TWELVE_HOURS_S * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setApiCache(res);

    const markets = await gamma.markets.list(
      { active: true, closed: false, limit: 1200, offset: 0 },
      { ttlMs: TTL_MS }
    );

    const usable = (markets as GammaMarket[]).filter((m) => m && m.active && !m.closed);

    const cards = usable
      .map(marketToCard)
      .filter(Boolean);

    // Collapse duplicates by parent (eventId -> conditionId -> slug)
    const collapsedTrending = collapseByKey(
      [...cards].sort((a, b) => scoreTrending(b) - scoreTrending(a)),
      (c) => c.eventId ?? c.id,
      scoreTrending
    );

    const collapsedMovers = collapseByKey(
      [...cards].sort((a, b) => scoreMover(b) - scoreMover(a)),
      (c) => c.eventId ?? c.id,
      scoreMover
    );

    // Cap sports so homepage isn’t 80% sports
    const trending = mixWithSportsCap(collapsedTrending, 20, 0.25); // 25% sports max
    const movers = mixWithSportsCap(collapsedMovers, 20, 0.25);

    res.status(200).json({
      updatedAt: new Date().toISOString(),
      trending,
      movers,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "unknown_error" });
  }
}

function mixWithSportsCap(list: any[], take: number, sportsFrac: number) {
  const sportsN = Math.max(0, Math.floor(take * sportsFrac));
  const nonSportsN = take - sportsN;

  const nonSports = list.filter((c) => c.bucket !== "sports");
  const sports = list.filter((c) => c.bucket === "sports");

  const a = diversify(nonSports, nonSportsN, {
    categoryOf: (c) => c.bucket ?? "other",
    maxPerCategory: 5,
    keyOf: (c) => c.id,
  });

  const b = diversify(sports, sportsN, {
    categoryOf: () => "sports",
    maxPerCategory: sportsN,
    keyOf: (c) => c.id,
  });

  return [...a, ...b].slice(0, take);
}