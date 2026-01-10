import type { NextApiRequest, NextApiResponse } from "next";
import { gamma } from "@/lib/polymarket/gamma";
import { setApiCache, TWELVE_HOURS_S } from "@/lib/polymarket/types";

const TTL_MS = TWELVE_HOURS_S * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setApiCache(res);

    // Gamma events include `featured` and `featuredOrder` fields.  [oai_citation:1‡Polymarket](https://docs.polymarket.com/api-reference/events/list-events)
    // Not all docs expose every query param table in text, but in practice Gamma supports
    // filtering/sorting via query string for events (and the field exists), so we request:
    // - active + not closed + not archived
    // - featured=true
    // - order by featuredOrder (stable curation order)
    const events = await gamma.events.list(
      {
        featured: true,
        active: true,
        closed: false,
        archived: false,

        order: "featuredOrder",
        ascending: true,

        limit: 100,
        offset: 0,
      },
      { ttlMs: TTL_MS }
    );

    res.status(200).json({
      updatedAt: new Date().toISOString(),
      featuredEvents: events,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "unknown_error" });
  }
}