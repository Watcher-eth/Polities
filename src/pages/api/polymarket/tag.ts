import type { NextApiRequest, NextApiResponse } from "next";
import { gamma } from "@/lib/polymarket/gamma";
import { setApiCache, TWELVE_HOURS_S } from "@/lib/polymarket/types";

const TTL_MS = TWELVE_HOURS_S * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    setApiCache(res);
    const tags = await gamma.tags.list({ ttlMs: TTL_MS });
    res.status(200).json({ updatedAt: new Date().toISOString(), tags });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "unknown_error" });
  }
}