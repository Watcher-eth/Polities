import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { MainLayout } from "@/components/layout/rootLayout";
import { HomeStream } from "@/components/home/homeStream";
import type { HomeStreamVM } from "@/lib/home/modules";
import { getBaseUrl } from "@/lib/utils/baseUrl";
import { marketToCard } from "@/lib//gammaMap";

type Props = { vm: HomeStreamVM };

export default function HomePage({ vm }: InferGetStaticPropsType<typeof getStaticProps>) {
  // console.log("vm", vm.right)
  return (
    <MainLayout>
      <HomeStream vm={vm} />
    </MainLayout>
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${url}`);
  return (await r.json()) as T;
}

// removes all undefined recursively (Next serialization-safe)
function jsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const base = getBaseUrl();

  const [home, geopolitics, economy, sports, entertainment] = await Promise.all([
    fetchJson<any>(`${base}/api/polymarket/home`),
    fetchJson<any>(`${base}/api/polymarket/sections/geopolitics`),
    fetchJson<any>(`${base}/api/polymarket/sections/economy`),
    fetchJson<any>(`${base}/api/polymarket/sections/sports`),
    fetchJson<any>(`${base}/api/polymarket/sections/entertainment`),
  ]);

  const trending = (home.trending ?? []).map((m: any) => marketToCard(m, { category: "Trending" }));
  const movers = (home.movers ?? []).map((m: any) => marketToCard(m, { category: "Moved (24h)" }));

  const geo = (geopolitics.markets ?? []).map((m: any) => marketToCard(m, { category: "Geopolitics" }));
  const eco = (economy.markets ?? []).map((m: any) => marketToCard(m, { category: "Economy" }));
  const spo = (sports.markets ?? []).map((m: any) => marketToCard(m, { category: "Sports" }));
  const ent = (entertainment.markets ?? []).map((m: any) => marketToCard(m, { category: "Entertainment" }));


// console.log("geo", geo)
// console.log("eco", eco)
// console.log("spo", spo)
// console.log("ent", ent)


  // Left stream: mix topic blocks + breaks (like NYT does)
  const vm: HomeStreamVM = {
    updatedAt: home.updatedAt ?? new Date().toISOString(),
    right: {
      title: "Trending",
      items: trending.slice(0, 12),
    },
    left: [
      {
        type: "hero",
        hero: {
          lead: movers[0] ?? trending[0],
          left: geo.slice(0, 2),
          right: trending.slice(2, 4),
          bottom: movers.slice(1, 3),
        },
      },
      { type: "divider", label: "Top developments" },

      {
        type: "topic",
        title: "Geopolitics",
        tabs: [
          { label: "What moved", href: "#" },
          { label: "Most traded", href: "#" },
          { label: "Close calls", href: "#" },
        ],
        left: geo.slice(0, 3),
        featured: geo[3] ?? null,
        right: geo.slice(4, 8),
        bottom: geo.slice(8, 10),
      },

      // Break component to avoid repetitive blocks
      { type: "split", left: movers[3] ?? trending[5], right: movers[4] ?? trending[6] },

      {
        type: "topic",
        title: "Economy",
        tabs: [
          { label: "Rates", href: "#" },
          { label: "Inflation", href: "#" },
          { label: "Earnings", href: "#" },
        ],
        left: eco.slice(0, 3),
        featured: eco[3] ?? null,
        right: eco.slice(4, 8),
        bottom: eco.slice(8, 10),
      },

      // Another break: a compact “ticker” list
      { type: "ticker", title: "Fast movers", items: movers.slice(0, 6) },

      // You can keep adding “headline clusters” without turning them into categories
      {
        type: "topic",
        title: "Watchlist",
        tabs: [{ label: "Close to resolution", href: "#" }, { label: "High volume", href: "#" }],
        left: trending.slice(0, 3),
        featured: trending[3] ?? null,
        right: trending.slice(4, 8),
        bottom: trending.slice(8, 10),
      },
    ],
    // Lower categories “only way down”
    lower: [
      {
        type: "categoryGrid",
        title: "Entertainment",
        featured: ent[0] ?? movers[0],
        items: ent.slice(1, 3),
      },
      {
        type: "categoryList",
        title: "Sports",
        items: spo.slice(0, 8),
      },
    ],
  };

  return {
    props: jsonSafe({ vm }),
    revalidate: 5 ,
  };
};