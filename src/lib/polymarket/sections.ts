// src/lib/polymarket/sections.ts

export type SectionSlug =
  | "geopolitics"
  | "economy"
  | "sports"
  | "entertainment"
  | "politics"
  | "crypto"
  | "tech";

export const SECTION_TAG_ID: Record<SectionSlug, number> = {
  // These match widely used Polymarket category tag ids
  // (you already referenced these in earlier work)
  politics: 2,
  sports: 100639,
  crypto: 21,
  tech: 1401,
  entertainment: 596, // "Culture"
  geopolitics: 100265,

  // Economy tag id can vary across time; keep configurable.
  // If you already know your economy tag id, set it here.
  // If unsure, you can fetch /tags and resolve by slug/label at runtime.
  economy: 100000, // TODO: replace with actual economy tag id you use
};

export function isValidSection(x: string): x is SectionSlug {
  return x in SECTION_TAG_ID;
}