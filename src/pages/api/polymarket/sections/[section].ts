// src/pages/api/polymarket/sections/[section].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getHomeData } from "@/lib/polymarket/frontPage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const section = String(req.query.section ?? "").toLowerCase().trim();
    const data = await getHomeData();

    res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=30");
    res.status(200).json({ updatedAt: data.updatedAt, markets: data.sections[section] ?? [] });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Unknown error" });
  }
}