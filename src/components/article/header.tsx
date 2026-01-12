// src/components/article/ArticleHeader.tsx
import * as React from "react";
import Link from "next/link";
import { Kicker, Hr } from "./shell";
import type { ArticleMeta } from "../../types/article";
import { safeDateLabel } from "../../lib/utils/format";

type Props = ArticleMeta & {
  // optional NYT-like section links row
  sectionLinks?: { label: string; href: string }[];
};

export function ArticleHeader({
  section,
  title,
  dek,
  byline,
  publishedLabel,
  endDate,
  sectionLinks = [],
}: Props) {
  const ends = safeDateLabel(endDate);

  return (
    <header className="pb-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Kicker>{section ? section : "Top Stories"}</Kicker>

          <h1 className="font-headline font-bold text-3xl md:text-4xl leading-[1.05] tracking-tight">
            {title}
          </h1>

          {dek ? (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[70ch]">
              {dek}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground uppercase tracking-wider">
            {byline ? <span className="font-semibold text-foreground/90">{byline}</span> : null}
            {publishedLabel ? <span>{publishedLabel}</span> : null}
            {ends ? <span>Ends {ends}</span> : null}
          </div>

          {sectionLinks.length ? (
            <nav className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {sectionLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        {/* small action cluster (NYT has Save/Share etc) */}
        <div className="hidden md:flex items-center gap-2">
          <button className="h-8 px-3 text-xs font-medium border border-border rounded-full hover:bg-muted transition">
            Save
          </button>
          <button className="h-8 px-3 text-xs font-medium border border-border rounded-full hover:bg-muted transition">
            Share
          </button>
        </div>
      </div>

      <div className="pt-4">
        <Hr />
      </div>
    </header>
  );
}