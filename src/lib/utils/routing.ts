// src/lib/utils/routing.ts
import type { GammaMarket, GammaEvent } from "../polymarket/gammaTypes";

export function pickEvent(m: GammaMarket): GammaEvent | null {
  const ev0 = Array.isArray(m.events) && m.events.length ? m.events[0] : null;
  return ev0 ?? null;
}

/** Normalize text for routing / matching */
function norm(s: any): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9\s\-:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function haystack(m: GammaMarket): string {
  const ev = pickEvent(m);
  return norm(
    [
      m.slug,
      m.question,
      m.description,
      m.category,
      ev?.slug,
      ev?.title,
      ev?.description,
      // series fields sometimes live on event
      (ev as any)?.seriesSlug,
      (ev as any)?.ticker,
    ].join(" ")
  );
}

/**
 * Prefer a stable "parent" identifier that collapses:
 * - date variants (e.g. "by Jan 31" / "by Mar 31")
 * - same-event duplicates
 */
export function parentKey(m: GammaMarket): string | null {
  const ev = pickEvent(m);

  // Best: series slug (Gamma frequently exposes this on event)
  const seriesSlug =
    (ev as any)?.seriesSlug ??
    (Array.isArray((ev as any)?.series) && (ev as any).series[0]?.slug ? (ev as any).series[0].slug : null);

  if (seriesSlug) return String(seriesSlug);

  if (ev?.id != null) return String(ev.id);
  if (m.conditionId) return String(m.conditionId);
  if (m.id) return String(m.id);
  if (m.slug) return String(m.slug);
  return null;
}

/**
 * Topic key: collapses "same question, different date/threshold" into one bucket
 * so we can enforce variety.
 */
export function topicKeyFromMarket(m: GammaMarket): string {
  const base = norm(m.question ?? m.slug ?? "");

  // Remove explicit dates
  let s = base.replace(/\b20\d{2}[-/]\d{2}[-/]\d{2}\b/g, " ");

  // Remove "by <month> <day>" patterns (common in these markets)
  s = s.replace(
    /\bby\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}\b/g,
    " "
  );

  // Remove "on <month> <day>" patterns
  s = s.replace(
    /\bon\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}\b/g,
    " "
  );

  // Remove numeric thresholds like "less than 21m", "over 2.5", etc.
  s = s.replace(/\b(less than|more than|over|under)\s+[-+]?\d+(\.\d+)?\s*(k|m|b|%)?\b/g, " ");

  // Remove spread-like tokens
  s = s.replace(/\bspread:\s*/g, " ");
  s = s.replace(/\bmoneyline:\s*/g, " ");

  return norm(s);
}

/* ---------------------------------------------
   Bucket matching helpers (regex-safe)
---------------------------------------------- */

function hasWord(h: string, word: string): boolean {
  // whole-word match for short tokens
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return re.test(h);
}

function hasAnyPhrase(h: string, phrases: string[]): boolean {
  return phrases.some((p) => h.includes(p));
}

export function isSportsMarket(m: GammaMarket): boolean {
  if (m.gameStartTime) return true;

  const h = haystack(m);

  // league prefixes in slugs/questions
  const sportsPhrases = [
    "nfl",
    "nba",
    "nhl",
    "mlb",
    "ufc",
    "mma",
    "pga",
    "atp",
    "wta",
    "fifa",
    "uefa",
    "champions league",
    "premier league",
    "la liga",
    "bundesliga",
    "serie a",
    "ligue 1",
    "super bowl",
    "world cup",
    "playoffs",
    " vs ",
    "spread",
    "moneyline",
    "over",
    "under",
  ];
  if (hasAnyPhrase(h, sportsPhrases)) return true;

  const c = norm(m.category);
  if (c.includes("sport")) return true;

  return false;
}

function isEconomyMarketText(h: string): boolean {
  const economyPhrases = [
    "fed",
    "fomc",
    "interest rate",
    "interest rates",
    "basis points",
    "bps",
    "inflation",
    "cpi",
    "ppi",
    "gdp",
    "recession",
    "soft landing",
    "unemployment",
    "jobs report",
    "nonfarm payroll",
    "nfp",
    "treasury",
    "bond",
    "yield",
    "10y",
    "2y",
    "dxy",
    "dollar index",
    "s&p",
    "sp500",
    "nasdaq",
    "dow",
    "nikkei",
    "ftse",
    "dax",
    "hang seng",
    "earnings",
    "guidance",
    "up or down",
  ];
  if (hasAnyPhrase(h, economyPhrases)) return true;

  // ticker "XYZ (TICKER) up or down"
  if (/\b[a-z0-9\.\-]{1,15}\s*\([a-z]{1,6}\)\s+up or down\b/i.test(h)) return true;

  return false;
}

function isEntertainmentMarketText(h: string): boolean {
  const entertainmentPhrases = [
    "oscar",
    "academy award",
    "golden globe",
    "grammy",
    "emmy",
    "bafta",
    "sag",
    "box office",
    "weekend box office",
    "movie",
    "film",
    "tv",
    "series",
    "season",
    "episode",
    "finale",
    "netflix",
    "hbo",
    "disney",
    "prime video",
    "apple tv",
    "album",
    "song",
    "tour",
    "concert",
    "celebrity",
    "actor",
    "actress",
    "director",
  ];
  return hasAnyPhrase(h, entertainmentPhrases);
}

function isGeopoliticsMarketText(h: string): boolean {
  const geoPhrases = [
    "ukraine",
    "russia",
    "israel",
    "gaza",
    "iran",
    "iraq",
    "syria",
    "yemen",
    "china",
    "taiwan",
    "north korea",
    "south korea",
    "nato",
    "sanctions",
    "ceasefire",
    "strike",
    "missile",
    "invasion",
    "war",
    "coup",
    "assassination",
    "hostage",
    "terror",
    "border",
    "diplomacy",
    "treaty",
  ];
  return hasAnyPhrase(h, geoPhrases);
}

function isPoliticsMarketText(h: string): boolean {
  const polPhrases = [
    "election",
    "primary",
    "nomination",
    "democratic",
    "republican",
    "labour",
    "conservative",
    "president",
    "prime minister",
    "chancellor",
    "senate",
    "house",
    "congress",
    "parliament",
    "governor",
    "mayor",
    "referendum",
    "ballot",
    "impeach",
    "supreme court",
  ];
  return hasAnyPhrase(h, polPhrases);
}

function isCryptoMarketText(h: string): boolean {
  // strict word boundaries for short tokens
  const cryptoWords = ["btc", "eth", "sol", "xrp", "bnb", "usdc", "usdt", "defi", "airdrop", "staking", "onchain", "l2"];
  if (cryptoWords.some((w) => hasWord(h, w))) return true;

  // longer phrases (safe as includes)
  const cryptoPhrases = ["bitcoin", "ethereum", "solana", "stablecoin", "tether", "coinbase", "etf"];
  return hasAnyPhrase(h, cryptoPhrases);
}

/**
 * Main bucket inference.
 * Order matters:
 * - sports is easiest
 * - economy should come BEFORE crypto to avoid accidental crypto matches in long descriptions
 */
export function inferBucket(m: GammaMarket): string {
  if (isSportsMarket(m)) return "sports";

  const h = haystack(m);

  if (isGeopoliticsMarketText(h)) return "geopolitics";
  if (isPoliticsMarketText(h)) return "politics";

  if (isEconomyMarketText(h)) return "economy";

  if (isEntertainmentMarketText(h)) return "entertainment";

  if (isCryptoMarketText(h)) return "crypto";

  // light tech catch-all
  if (hasAnyPhrase(h, ["ai", "openai", "anthropic", "google", "apple", "microsoft", "tesla", "nvidia"])) return "tech";

  return "other";
}