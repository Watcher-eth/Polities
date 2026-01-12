// src/lib/homeVm.ts
export type ReadTime = string; // e.g. "4 MIN READ"

export type CardVM = {
  id: string; // stable key (market id)
  title: string;
  href: string;
  

  // ✅ what your UI actually uses
  description?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  category?: string | null;

  // odds
  pYes?: number | null; // 0..1 for Yes/No markets
  pNo?: number | null;

  // ranking / display
  volume24hr?: number | null;
  liquidity?: number | null;
  oneDayMoveAbs?: number | null;
  endDate?: string | null;

  // clustering
  parentId?: string | null; // event id if present
  section?: string | null;  // "sports" | "politics" | ...
  topic?: string | null;
};

export type HeroVM = {
  left: CardVM[];
  right: CardVM[];
  bottom: CardVM[];
  featured: {
    title: string;
    href: string;
    imageUrl?: string;
    imageCaption?: string;
    locationLabel?: string;
    dateLabel?: string;
    transcriptTag?: string;
    byline?: string;
  };
};

export type SectionVM = {
  title: string;
  tabs?: { label: string; href: string }[];
  left: CardVM[];
  featured?: CardVM & { imageCaption?: string };
  right: CardVM[];
  bottom?: CardVM[];
};

export type HomePageVM = {
  updatedAt: string;
  hero: HeroVM;
  sections: {
    geopolitics: SectionVM;
    economy: SectionVM;
    sports: SectionVM;
    entertainment: SectionVM;
  };
};