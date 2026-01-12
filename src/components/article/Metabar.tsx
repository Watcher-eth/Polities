// src/components/article/ArticleMetaBar.tsx
import { fmtMoney, fmtPct } from "../../lib/utils/format";
import type { ArticleMeta } from "../../types/article";

export function ArticleMetaBar({
  volume24hr,
  liquidity,
  pYes,
  pNo,
}: Pick<ArticleMeta, "volume24hr" | "liquidity" | "pYes" | "pNo">) {
  const vol = fmtMoney(volume24hr);
  const liq = fmtMoney(liquidity);
  const yes = fmtPct(pYes);
  const no = fmtPct(pNo);

  return (
    <div className="border border-border rounded-md px-4 py-3 bg-background">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Yes" value={yes ?? "—"} />
        <Stat label="No" value={no ?? "—"} />
        <Stat label="24h Volume" value={vol ?? "—"} />
        <Stat label="Liquidity" value={liq ?? "—"} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
        {label}
      </div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </div>
  );
}