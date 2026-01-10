import type { CardVM } from "@/lib/homeVm";

export type LeftModule =
  | { type: "hero"; hero: { lead: CardVM; left: CardVM[]; right: CardVM[]; bottom: CardVM[] } }
  | { type: "topic"; title: string; tabs?: { label: string; href: string }[]; left: CardVM[]; featured?: CardVM; right: CardVM[]; bottom?: CardVM[] }
  | { type: "split"; left: CardVM; right: CardVM } // break component
  | { type: "ticker"; title: string; items: CardVM[] } // small break component
  | { type: "divider"; label?: string | null };

export type RightRail = {
  title: string;
  items: CardVM[];
};

export type LowerSection =
  | { type: "categoryGrid"; title: string; featured: CardVM; items: CardVM[] }
  | { type: "categoryList"; title: string; items: CardVM[] };

export type HomeStreamVM = {
  updatedAt: string;
  left: LeftModule[];
  right: RightRail;
  lower: LowerSection[];
};