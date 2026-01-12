// src/components/article/index.tsx
import * as React from "react";
import { ArticleShell, ArticleGrid } from "./shell";
import { ArticleHeader } from "./header";
import { ArticleHero } from "./hero";
import { ArticleBody } from "./body";
import { ArticleFooter } from "./footer";
import type { ArticleProps } from "../../types/article";

/**
 * NYT-ish Market Article page component
 * - left column: optional (you can inject later)
 * - center: header + hero + body + footer stats/actions
 * - right: related markets (footer component handles)
 */
export function ArticlePage(props: ArticleProps) {
  const {
    section,
    title,
    dek,
    byline,
    publishedLabel,
    endDate,
    imageUrl,
    imageAlt,
    imageCaption,
    body,
    volume24hr,
    liquidity,
    pYes,
    pNo,
    related,
  } = props;

  return (
    <ArticleShell>
      <ArticleGrid
        left={
          <div className="hidden lg:block">
            {/* Placeholder for “left rail” like NYT (headlines, promos, etc.) */}
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {section ? `${section} — More` : "More"}
            </div>
            <div className="mt-3 border-t border-border" />
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Add a left rail later (top headlines, “live updates”, etc.).
              </p>
            </div>
          </div>
        }
        center={
          <div>
            <ArticleHeader
              section={section ?? null}
              title={title}
              dek={dek ?? null}
              byline={byline ?? null}
              publishedLabel={publishedLabel ?? null}
              endDate={endDate ?? null}
              sectionLinks={[
                { label: "What moved", href: "#" },
                { label: "Most traded", href: "#" },
                { label: "Close calls", href: "#" },
              ]}
            />

            <ArticleHero
              imageUrl={imageUrl ?? null}
              imageAlt={imageAlt ?? null}
              imageCaption={imageCaption ?? null}
            />

            <ArticleBody body={body ?? null} />

            <ArticleFooter
              volume24hr={volume24hr ?? null}
              liquidity={liquidity ?? null}
              pYes={pYes ?? null}
              pNo={pNo ?? null}
              related={related ?? []}
            />
          </div>
        }
        right={
          <div className="hidden lg:block">
            {/* Right rail is mostly handled by footer's RelatedList,
                but you can add extra modules here if desired. */}
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Trending
            </div>
            <div className="mt-3 border-t border-border" />
            <div className="mt-3 text-sm text-muted-foreground">
              Keep this rail for later (newsletter, tickers, etc.).
            </div>
          </div>
        }
      />
    </ArticleShell>
  );
}