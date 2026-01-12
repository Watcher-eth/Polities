export type GammaTag = {
    id: string;
    label?: string | null;
    slug?: string | null;
  };
  
  export type GammaEvent = {
    id: string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
  
    active?: boolean;
    closed?: boolean;
  
    tags?: GammaTag[] | null;
  
    image?: string | null;
    icon?: string | null;
  
    markets?: GammaMarket[] | null;
  };
  
  export type GammaMarket = {
    id: string;
    question?: string | null;
    slug?: string | null;
    description?: string | null;
  
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    resolved?: boolean | null;
  
    startDate?: string | null;
    startDateIso?: string | null;
    endDate?: string | null;
    endDateIso?: string | null;
  
    image?: string | null;
    icon?: string | null;
  
    outcomes?: string | string[] | null;
    outcomePrices?: string | string[] | null;
  
    conditionId?: string | null;
    questionID?: string | null;
  
    volume24hr?: number | null;
    volumeNum?: number | null;
    liquidityNum?: number | null;
    liquidity?: number | string | null;
  
    oneDayPriceChange?: number | null;
  
    gameStartTime?: string | null;
  
    tags?: GammaTag[] | null;
  
    // ✅ keep this — Gamma often includes it in /markets responses
    events?: GammaEvent[] | null;
  
    category?: string | null;
  };