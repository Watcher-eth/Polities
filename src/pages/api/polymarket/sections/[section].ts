import type { NextApiRequest, NextApiResponse } from "next";
import { gamma } from "@/lib/polymarket/gamma";
import { TWELVE_HOURS_S, setApiCache } from "@/lib/polymarket/types";
import { isValidSection, SECTION_TAG_ID } from "@/lib/polymarket/sections";
import type { GammaEvent } from "@/lib/polymarket/gammaTypes";
import { marketToCard } from "@/lib/utils/normalize";
import { collapseByKey, diversify } from "@/lib/polymarket/div";
import { scoreTrending } from "@/lib/polymarket/rank";

const TTL_MS = TWELVE_HOURS_S * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setApiCache(res);

    const section = String(req.query.section ?? "");
    if (!isValidSection(section)) {
      res.status(400).json({ error: "invalid_section" });
      return;
    }

    const tag_id = SECTION_TAG_ID[section];

    const events = await gamma.events.list(
      {
        active: true,
        closed: false,
        archived: false,
        tag_id,
        related_tags: true,
        // Sorting: volume-heavy for “front page”
        order: "volume24hr",
        ascending: false,
        limit: 80,
        offset: 0,
      },
      { ttlMs: TTL_MS }
    );

    const cards = flattenEventMarkets(events)
      .map(marketToCard)
      .filter(Boolean);

    // Hard filter: keep sports out of non-sports sections
    const filtered =
      section === "sports" ? cards : cards.filter((c) => c && c.bucket !== "sports");

    // Collapse by parent (event id) so you don’t get 20 Super Bowl team markets
    const collapsed = collapseByKey(filtered, (c) => c.eventId ?? c.id, scoreTrending);

    // Diversify lightly within a section
    const final = diversify(
      [...collapsed].sort((a, b) => scoreTrending(b) - scoreTrending(a)),
      40,
      {
        categoryOf: (c) => c.bucket ?? "other",
        maxPerCategory: section === "sports" ? 40 : 12,
        keyOf: (c) => c.id,
      }
    );

    res.status(200).json({
      updatedAt: new Date().toISOString(),
      section,
      markets: final,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "unknown_error" });
  }
}

function flattenEventMarkets(events: GammaEvent[]) {
  const out: any[] = [];
  for (const ev of events ?? []) {
    const markets = Array.isArray(ev.markets) ? ev.markets : [];
    for (const m of markets) {
      // ensure market has events[0] so normalization can pick it
      const mm = { ...m, events: m.events ?? [ev] };
      out.push(mm);
    }
  }
  return out;
}