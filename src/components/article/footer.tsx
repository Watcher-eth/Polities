// src/components/article/ArticleFooter.tsx
import { ArticleMetaBar } from "./Metabar";
import { RelatedList } from "./related";
import type { ArticleMeta, ArticleFooterData } from "../../types/article";

type Props = Pick<ArticleMeta, "volume24hr" | "liquidity" | "pYes" | "pNo"> &
  ArticleFooterData;

export function ArticleFooter({ volume24hr, liquidity, pYes, pNo, related }: Props) {
  return (
    <footer className="pt-2 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8">
          <ArticleMetaBar volume24hr={volume24hr} liquidity={liquidity} pYes={pYes} pNo={pNo} />

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="h-9 px-4 text-sm font-semibold border border-border rounded-full hover:bg-muted transition">
              Trade Yes
            </button>
            <button className="h-9 px-4 text-sm font-semibold border border-border rounded-full hover:bg-muted transition">
              Trade No
            </button>
            <button className="h-9 px-4 text-sm font-medium border border-border rounded-full hover:bg-muted transition">
              View market
            </button>
          </div>
        </div>

        <div className="lg:col-span-4">
          <RelatedList items={related ?? []} />
        </div>
      </div>
    </footer>
  );
}