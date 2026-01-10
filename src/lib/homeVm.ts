export type ReadTime = string; // e.g. "4 MIN READ"

export type CardVM = {
    id: string;                 // stable key (market id)
    title: string;              // market.question (or event.title fallback)
    href: string;               // `/m/${slug}`
    image?: string | null;
    icon?: string | null;
  
    // odds
    pYes?: number | null;       // 0..1 for Yes/No markets
    pNo?: number | null;
  
    // ranking / display
    volume24hr?: number | null;
    liquidity?: number | null;
    oneDayPriceChange?: number | null;
    endDate?: string | null;
  
    // clustering
    parentId?: string | null;   // event id if present
    section?: string;           // "sports" | "politics" | ...
    topic?: string;             // optional
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
    transcriptTag?: string; // "[explosions]" style
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