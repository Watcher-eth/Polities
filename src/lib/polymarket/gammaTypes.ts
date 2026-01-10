// src/lib/polymarket/gammaTypes.ts

export type GammaTag = {
    id: number | string;
    label?: string | null;
    slug?: string | null;
  };
  
  export type GammaEvent = {
    id: number | string;
    slug?: string | null;
    title?: string | null;
    description?: string | null;
    image?: string | null;
    icon?: string | null;
    tags?: GammaTag[] | null;
    markets?: GammaMarket[] | null; // when fetched from /events
  };
  
  export type GammaMarket = {
    // Core
    id: string;
    question?: string | null;
    slug?: string | null;
    description?: string | null;
  
    // IDs
    conditionId?: string | null;
    questionID?: string | null; // Gamma uses questionID (capital D) in your sample keys
  
    // Status
    active?: boolean;
    closed?: boolean;
    archived?: boolean;
    resolved?: boolean | null;
  
    // Dates
    startDate?: string | null;
    endDate?: string | null;
    startDateIso?: string | null;
    endDateIso?: string | null;
  
    // Display
    image?: string | null;
    icon?: string | null;
  
    // Probabilities (Gamma returns strings in a JSON string sometimes)
    outcomes?: string[] | null;
    outcomePrices?: string | null; // e.g. '["0.62","0.38"]'
    lastTradePrice?: string | number | null;
    bestBid?: string | number | null;
    bestAsk?: string | number | null;
  
    // Volume/Liq (your sample keys show both volume and volumeNum)
    volume?: string | number | null;
    volumeNum?: number | null;
    volume24hr?: number | null;
    liquidity?: string | number | null;
    liquidityNum?: number | null;
  
    // Moves
    oneDayPriceChange?: number | null;
    oneWeekPriceChange?: number | null;
    oneMonthPriceChange?: number | null;
    oneYearPriceChange?: number | null;
  
    // Sports hints in sample keys
    gameStartTime?: string | null;
  
    // IMPORTANT: Gamma markets include `events` in your sample keys
    events?: GammaEvent[] | null;
  
    // Sometimes present
    category?: string | null;
    tags?: GammaTag[] | null;
  };