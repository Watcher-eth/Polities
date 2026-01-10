import * as React from "react";
import type { HomeStreamVM, LeftModule, LowerSection } from "@/lib/home/modules";
import { ArticleCard } from "@/components/home/article";
import { SectionHeader } from "@/components/home/sectionHeader";
import { EntertainmentCarousel } from "@/components/home/entertainment";
import Link from "next/link";

function Divider({ label }: { label?: string | null }) {
  return (
    <div className="border-t border-border py-6">
      {label ? <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div> : null}
    </div>
  );
}

function TopicBlock(m: Extract<LeftModule, { type: "topic" }>) {
  return (
    <section>
      <SectionHeader title={m.title} links={m.tabs ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-4 space-y-0 divide-y divide-border">
          {m.left.map((a, i) => (
            <ArticleCard key={i} {...a} size="medium" />
          ))}
        </div>

        {/* Center featured */}
        <div className="lg:col-span-5">
          {m.featured ? (
            <ArticleCard {...m.featured} size="large" showImage={!!m.featured.imageUrl} />
          ) : null}

          {m.bottom?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              {m.bottom.map((a, i) => (
                <div key={i}>
                  <h4 className="font-headline font-bold text-base leading-tight">
                    <Link href={a.href} className="hover:underline">
                      {a.title}
                    </Link>
                  </h4>
                  {a.readTime ? (
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{a.readTime}</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {m.right.map((a, i) => (
            <ArticleCard key={i} {...a} size="small" />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitPair(m: Extract<LeftModule, { type: "split" }>) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
      <ArticleCard {...m.left} size="medium" showImage={!!m.left.imageUrl} />
      <ArticleCard {...m.right} size="medium" showImage={!!m.right.imageUrl} />
    </section>
  );
}

function Ticker(m: Extract<LeftModule, { type: "ticker" }>) {
  return (
    <section className="border-t border-border pt-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-bold text-base">{m.title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        {m.items.map((a, i) => (
          <div key={i} className="py-3 border-b border-border last:border-0">
            <Link href={a.href} className="font-headline font-bold hover:underline">
              {a.title}
            </Link>
            {a.readTime ? (
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{a.readTime}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderLeft(m: LeftModule) {
  switch (m.type) {
    case "divider":
      return <Divider label={m.label ?? null} />;
    case "topic":
      return <TopicBlock {...m} />;
    case "split":
      return <SplitPair {...m} />;
    case "ticker":
      return <Ticker {...m} />;
    case "hero":
      // Use your existing HeroSection if you want, or render inline.
      // Keeping inline here to preserve “NYT two-sided top”.
      return (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-0 divide-y divide-border">
              {m.hero.left.map((a, i) => (
                <ArticleCard key={i} {...a} size="medium" />
              ))}
            </div>
            <div className="lg:col-span-5">
              <ArticleCard {...m.hero.lead} size="large" showImage={!!m.hero.lead.imageUrl} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                {m.hero.bottom.map((a, i) => (
                  <ArticleCard key={i} {...a} layout="horizontal" size="small" showImage={!!a.imageUrl} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 space-y-0 divide-y divide-border">
              {m.hero.right.map((a, i) => (
                <ArticleCard key={i} {...a} size="medium" />
              ))}
            </div>
          </div>
        </section>
      );
    default:
      return null;
  }
}

function renderLower(s: LowerSection) {
  if (s.type === "categoryGrid") {
    return (
      <EntertainmentCarousel
        title={s.title}
        featured={s.featured}
        items={s.items}
      />
    );
  }
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <SectionHeader title={s.title} links={[]} />
      <div className="space-y-0 divide-y divide-border">
        {s.items.map((a, i) => (
          <ArticleCard key={i} {...a} size="medium" />
        ))}
      </div>
    </section>
  );
}

export function HomeStream({ vm }: { vm: HomeStreamVM }) {
  return (
    <div className="max-w-[1285px] mx-auto px-4 py-6">
      {/* Two-sided NYT layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left stream */}
        <div className="lg:col-span-8 space-y-8">
          {vm.left.map((m, i) => (
            <React.Fragment key={i}>{renderLeft(m)}</React.Fragment>
          ))}
        </div>

        {/* Right rail (trending, no topic) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-6 h-fit border-l border-border pl-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-bold text-base">{vm.right.title}</h3>
            <span className="text-xs text-muted-foreground">{vm.updatedAt ? "" : ""}</span>
          </div>
          <div className="space-y-0 divide-y divide-border">
            {vm.right.items.map((a, i) => (
              <ArticleCard key={i} {...a} size="small" />
            ))}
          </div>
        </aside>
      </div>

      {/* Lower categories (only way down) */}
      <div className="mt-10 space-y-8">
        {vm.lower.map((s, i) => (
          <React.Fragment key={i}>{renderLower(s)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}