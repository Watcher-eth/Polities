// src/components/home/homeStream.tsx
import * as React from "react";
import type { HomeStreamVM, LeftModule, LowerSection } from "@/lib/home/modules";
import { ArticleCard } from "@/components/home/article";
import { SectionHeader } from "@/components/home/sectionHeader";
import { EntertainmentCarousel } from "@/components/home/entertainment";
import Link from "next/link";

function Divider({ label }: { label?: string | null }) {
  return (
    <div className="border-t border-border pt-6">
      {label ? <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div> : null}
    </div>
  );
}

function HeroBlock(m: Extract<LeftModule, { type: "hero" }>) {
  const lead = m.hero.lead;
  if (!lead) return null;

  return (
    <section className="border-t border-border pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left rail (2 headlines) */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {m.hero.left.map((a, i) => (
            <div key={a?.id ?? i} className="py-4 first:pt-0">
              <h3 className="font-headline font-bold text-lg leading-tight line-clamp-3">
                <Link href={a?.href ?? ""} className="hover:underline">
                  {a?.title ?? ""}
                </Link>
              </h3>
              {a?.endDate ? <span className="text-[11px] text-muted-foreground uppercase tracking-wider mt-2 block">{a.endDate}</span> : null}
            </div>
          ))}
        </div>

        {/* Center lead */}
        <div className="lg:col-span-6">
          {lead.imageUrl ? (
            <div className="relative overflow-hidden bg-muted">
              <img src={lead.imageUrl} alt={lead.title} className="w-full h-auto object-cover" />
            </div>
          ) : null}

          <h1 className="font-headline font-extrabold text-3xl md:text-4xl leading-[1.05] mt-4">
            <Link href={lead.href ?? ""} className="hover:underline">
              {lead.title ?? ""}
            </Link>
          </h1>

          {lead.description ? <p className="text-base text-muted-foreground mt-3 leading-relaxed line-clamp-3">{lead.description}</p> : null}

          {/* bottom two */}
          {m.hero.bottom?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              {m.hero.bottom.map((a, i) => (
                <ArticleCard
                  key={a?.id ?? i}
                  title={a?.title ?? ""}
                  href={a?.href ?? ""}
                  imageUrl={a?.imageUrl ?? ""}
                  layout="horizontal"
                  size="small"
                  showImage={true}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Right rail list */}
        <aside className="lg:col-span-3 border-l border-border pl-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="font-bold text-base">Trending</h3>
          </div>
          <div className="space-y-0 divide-y divide-border">
            {m.hero.right.map((a, i) => (
              <ArticleCard
                key={a?.id ?? i}
                title={a?.title ?? ""}
                href={a?.href ?? ""}
                imageUrl={a?.imageUrl ?? ""}
                size="small"
                showImage={false}
                tone="rail"
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function TopicBlock(m: Extract<LeftModule, { type: "topic" }>) {
  return (
    <section className="border-t border-border pt-6">
      <SectionHeader title={m.title} links={m.tabs ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {m.left.map((a, i) => (
            <ArticleCard
              key={a?.id ?? i}
              title={a?.title ?? ""}
              href={a?.href ?? ""}
              imageUrl={a?.imageUrl ?? ""}
              readTime={a?.endDate ?? null}
              category={null}
              size="medium"
              showImage={false}
            />
          ))}
        </div>

        {/* Center featured */}
        <div className="lg:col-span-6">
          {m.featured ? (
            <ArticleCard
              title={m.featured?.title ?? ""}
              href={m.featured?.href ?? ""}
              imageUrl={m.featured?.imageUrl ?? ""}
              description={m.featured?.description ?? null}
              category={null}
              size="large"
              showImage={true}
            />
          ) : null}

          {m.bottom?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              {m.bottom.map((a, i) => (
                <div key={a?.id ?? i}>
                  <h4 className="font-headline font-bold text-base leading-tight line-clamp-3">
                    <Link href={a?.href ?? ""} className="hover:underline">
                      {a?.title ?? ""}
                    </Link>
                  </h4>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right */}
        <div className="lg:col-span-3 border-l border-border pl-6 space-y-0 divide-y divide-border">
          {m.right.map((a, i) => (
            <ArticleCard
              key={a?.id ?? i}
              title={a?.title ?? ""}
              href={a?.href ?? ""}
              imageUrl={a?.imageUrl ?? ""}
              category={null}
              size="small"
              showImage={false}
              tone="rail"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitPair(m: Extract<LeftModule, { type: "split" }>) {
  if (!m.left || !m.right) return null;
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
      <ArticleCard title={m.left.title ?? ""} href={m.left.href ?? ""} imageUrl={m.left.imageUrl ?? ""} size="medium" showImage={true} />
      <ArticleCard title={m.right.title ?? ""} href={m.right.href ?? ""} imageUrl={m.right.imageUrl ?? ""} size="medium" showImage={true} />
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
          <div key={a?.id ?? i} className="py-3 border-b border-border last:border-0">
            <Link href={a?.href ?? ""} className="font-headline font-bold hover:underline line-clamp-2">
              {a?.title ?? ""}
            </Link>
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
    case "hero":
      return <HeroBlock {...m} />;
    case "topic":
      return <TopicBlock {...m} />;
    case "split":
      return <SplitPair {...m} />;
    case "ticker":
      return <Ticker {...m} />;
    default:
      return null;
  }
}

function renderLower(s: LowerSection) {
  if (s.type === "categoryGrid") {
    return <EntertainmentCarousel title={s.title ?? ""} featured={s.featured} items={s.items} />;
  }
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <SectionHeader title={s.title ?? ""} links={[]} />
      <div className="space-y-0 divide-y divide-border">
        {s.items.map((a, i) => (
          <ArticleCard key={a?.id ?? i} title={a?.title ?? ""} href={a?.href ?? ""} imageUrl={a?.imageUrl ?? ""} size="medium" showImage={false} />
        ))}
      </div>
    </section>
  );
}

export function HomeStream({ vm }: { vm: HomeStreamVM }) {
  return (
    <div className="max-w-[1285px] mx-auto px-4 py-6">
      <div className="space-y-8">
        {vm.left.map((m, i) => (
          <React.Fragment key={i}>{renderLeft(m)}</React.Fragment>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        {vm.lower.map((s, i) => (
          <React.Fragment key={i}>{renderLower(s)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}