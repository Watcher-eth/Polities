// src/components/article/types.ts
import type { CardVM } from "@/lib/homeVm";

export type ArticleMeta = {
  section?: string | null; // e.g. "Economy"
  title: string;
  dek?: string | null; // short summary (optional)
  byline?: string | null; // e.g. "Polytimes Markets Desk"
  publishedLabel?: string | null; // optional label string
  endDate?: string | null;

  volume24hr?: number | null;
  liquidity?: number | string | null;

  pYes?: number | null;
  pNo?: number | null;
};

export type ArticleMedia = {
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageCaption?: string | null; // like "Photo: ..."
};

export type ArticleContent = {
  body?: string | null; // market.description (long)
};

export type ArticleFooterData = {
  related?: CardVM[];
};

export type ArticleProps = ArticleMeta & ArticleMedia & ArticleContent & ArticleFooterData;