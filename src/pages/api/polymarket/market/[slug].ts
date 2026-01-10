import type { NextApiRequest, NextApiResponse } from "next";
import { gamma } from "@/lib/polymarket/gamma";
import { setApiCache, TWELVE_HOURS_S } from "@/lib/polymarket/types";

const TTL_MS = TWELVE_HOURS_S * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setApiCache(res);

    const slug = String(req.query.slug ?? "");
    if (!slug) {
      res.status(400).json({ error: "missing_slug" });
      return;
    }

    // Gamma supports fetching by slug.  [oai_citation:9‡Polymarket](https://docs.polymarket.com/developers/gamma-markets-api/fetch-markets-guide?utm_source=chatgpt.com)
    const market = await gamma.markets.bySlug(slug, { ttlMs: TTL_MS });
    res.status(200).json({ updatedAt: new Date().toISOString(), market });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "unknown_error" });
  }
}