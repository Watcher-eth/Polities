// src/pages/api/polymarket/home.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getHomeData } from "@/lib/polymarket/frontPage";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getHomeData();
    res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=30");
    res.status(200).json({ updatedAt: data.updatedAt, trending: data.trending, movers: data.movers });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Unknown error" });
  }
}