// src/pages/m/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { MainLayout } from "@/components/layout/rootLayout";
import { ArticlePage } from "@/components/article";
import { getBaseUrl } from "@/lib/utils/baseUrl";
import type { CardVM } from "@/lib/homeVm";
import type { GammaMarket } from "@/lib/polymarket/gammaTypes";
import type { ArticleProps } from "@/types/article";
import { clampText } from "@/lib/utils/format";

type Props = { article: ArticleProps };

export default function ArticleRoute({ article }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MainLayout>
      <ArticlePage {...article} />
    </MainLayout>
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return (await r.json()) as T;
}

function jsonSafe<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function slugFromHref(href?: string | null): string | null {
  const h = String(href ?? "").trim();
  const m = h.match(/\/(?:m|a)\/([^?#/]+)/i);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

// Build related list: same section first, then fallback; remove self; unique by id.
function buildRelated(opts: { id: string; section?: string | null; pools: CardVM[] }) {
  const { id, section, pools } = opts;
  const seen = new Set<string>();
  const out: CardVM[] = [];
  const wantSection = (section ?? "").toLowerCase();

  const push = (c: CardVM | null | undefined) => {
    if (!c?.id || c.id === id) return;
    if (seen.has(c.id)) return;
    seen.add(c.id);
    out.push(c);
  };

  for (const c of pools) {
    if ((c.section ?? "").toLowerCase() === wantSection) push(c);
    if (out.length >= 10) break;
  }

  for (const c of pools) {
    push(c);
    if (out.length >= 10) break;
  }

  return out;
}

function normalizeMarketToArticle(m: GammaMarket, related: CardVM[]): ArticleProps {
  const title = m.question ?? "";
  const section =
    (m.category ?? null) ||
    (m.tags?.[0]?.label ?? null) ||
    null;

  const imageUrl = (m.image ?? m.icon ?? null) as string | null;
  const dek = clampText(m.description ?? "", 220);

  const p0 =
    Array.isArray(m.outcomePrices)
      ? Number((m.outcomePrices as any)[0])
      : null;
  const p1 =
    Array.isArray(m.outcomePrices)
      ? Number((m.outcomePrices as any)[1])
      : null;

  return {
    section,
    title,
    dek,
    byline: "Polytimes Markets Desk",
    publishedLabel: null,
    endDate: (m.endDateIso ?? m.endDate ?? null) as any,

    volume24hr: m.volume24hr ?? null,
    liquidity: (m.liquidityNum ?? m.liquidity ?? null) as any,

    pYes: Number.isFinite(p0 as any) ? (p0 as number) : null,
    pNo: Number.isFinite(p1 as any) ? (p1 as number) : null,

    imageUrl,
    imageAlt: title,
    imageCaption: imageUrl ? "Source: Polymarket" : null,

    body: m.description ?? null,
    related,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const base = getBaseUrl();

  const [home, geo, eco, spo, ent] = await Promise.all([
    fetchJson<any>(`${base}/api/polymarket/home`),
    fetchJson<any>(`${base}/api/polymarket/sections/geopolitics`),
    fetchJson<any>(`${base}/api/polymarket/sections/economy`),
    fetchJson<any>(`${base}/api/polymarket/sections/sports`),
    fetchJson<any>(`${base}/api/polymarket/sections/entertainment`),
  ]);

  const slugs = new Set<string>();

  const collectCards = (arr: any[], n = 60) => {
    for (const x of arr?.slice(0, n) ?? []) {
      const s = slugFromHref(x?.href);
      if (s) slugs.add(s);
    }
  };

  collectCards(home?.trending, 60);
  collectCards(home?.movers, 60);
  collectCards(geo?.markets, 60);
  collectCards(eco?.markets, 60);
  collectCards(spo?.markets, 60);
  collectCards(ent?.markets, 60);

  return {
    paths: [...slugs].map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug ?? "");
  if (!slug) return { notFound: true };

  const base = getBaseUrl();

  const [marketRes, home] = await Promise.all([
    fetchJson<{ market: GammaMarket }>(`${base}/api/polymarket/market/${encodeURIComponent(slug)}`),
    fetchJson<any>(`${base}/api/polymarket/home`),
  ]);

  const m = marketRes?.market;
  if (!m) return { notFound: true };

  const pools: CardVM[] = (home?.trending ?? []).filter(Boolean);

  const related = buildRelated({
    id: String(m.id ?? ""),
    section: (m.category ?? null) as any,
    pools,
  });

  const article = normalizeMarketToArticle(m, related);

  return {
    props: jsonSafe({ article }),
    revalidate: 5,
  };
};