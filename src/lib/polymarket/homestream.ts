// src/lib/home/buildHomeStreamVm.ts
import type { CardVM } from "@/lib/homeVm";
import type { HomeData } from "@/lib/polymarket/frontPage";
import type { HomeStreamVM, LeftModule, LowerSection } from "@/lib/home/modules";

function take<T>(arr: T[] | null | undefined, n: number): T[] {
  return Array.isArray(arr) ? arr.slice(0, n) : [];
}

function pickFeatured(arr: CardVM[]): CardVM | null {
  return arr.length ? arr[0] : null;
}

export function buildHomeStreamVm(data: HomeData): HomeStreamVM {
  const trending = take(data.trending, 24);
  const movers = take(data.movers, 24);

  const geo = take(data.sections.geopolitics, 60);
  const econ = take(data.sections.economy, 60);
  const sports = take(data.sections.sports, 60);
  const ent = take(data.sections.entertainment, 60);

  const left: LeftModule[] = [];

  // HERO from trending (simple + looks good)
  left.push({
    type: "hero",
    hero: {
      left: take(trending, 6),
      lead: trending[0] ?? null,
      bottom: take(trending.slice(1), 4),
      right: take(trending.slice(5), 6),
    },
  });

  // Split pair from movers
  if (movers.length >= 2) {
    left.push({
      type: "split",
      left: movers[0] ?? null,
      right: movers[1] ?? null,
    });
  }

  // Topic blocks
  const addTopic = (title: string, items: CardVM[]) => {
    const featured = pickFeatured(items);
    if (!featured) return;

    left.push({
      type: "topic",
      title,
      tabs: [
        { label: "More", href: `/c/${title.toLowerCase()}` }, // optional, or remove
      ],
      left: take(items.slice(1), 6),
      featured,
      right: take(items.slice(7), 6),
      bottom: take(items.slice(13), 4),
    });
  };

  addTopic("Geopolitics", geo);
  addTopic("Economy", econ);
  addTopic("Sports", sports);

  // Right rail: movers (or trending)
  const right = {
    title: "Movers",
    items: take(movers, 16),
  };

  // Lower sections: entertainment grid + optionally more lists
  const lower: LowerSection[] = [];

  if (ent.length) {
    lower.push({
      type: "categoryGrid",
      title: "Entertainment",
      featured: ent[0]!,
      items: take(ent.slice(1), 8),
    });
  }

  // Optional: add “More” list blocks
  const addLowerList = (title: string, items: CardVM[]) => {
    if (!items.length) return;
    lower.push({
      type: "list",
      title,
      items: take(items, 16),
    } as any);
  };

  addLowerList("More Geopolitics", geo.slice(20));
  addLowerList("More Economy", econ.slice(20));

  return { left, right, lower };
}