// src/components/home/homeStream.tsx
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
            <ArticleCard
              key={a.id ?? i}
              title={a.title}
              href={a.href}
              image={a.image}
              readTime={a.endDate ?? null}
              category={m.title}
              size="medium"
              showImage={false}
            />
          ))}
        </div>

        {/* Center featured */}
        <div className="lg:col-span-5">
          {m.featured ? (
            <ArticleCard
              title={m.featured.title}
              href={m.featured.href}
              image={m.featured.image}
              category={m.title}
              size="large"
              showImage={true}
            />
          ) : null}

          {m.bottom?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              {m.bottom.map((a, i) => (
                <div key={a.id ?? i}>
                  <h4 className="font-headline font-bold text-base leading-tight line-clamp-3">
                    <Link href={a.href} className="hover:underline">
                      {a.title}
                    </Link>
                  </h4>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {m.right.map((a, i) => (
            <ArticleCard
              key={a.id ?? i}
              title={a.title}
              href={a.href}
              image={a.image}
              category={m.title}
              size="small"
              showImage={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitPair(m: Extract<LeftModule, { type: "split" }>) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
      <ArticleCard title={m.left.title} href={m.left.href} image={m.left.image} size="medium" showImage={true} />
      <ArticleCard title={m.right.title} href={m.right.href} image={m.right.image} size="medium" showImage={true} />
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
          <div key={a.id ?? i} className="py-3 border-b border-border last:border-0">
            <Link href={a.href} className="font-headline font-bold hover:underline line-clamp-2">
              {a.title}
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
    case "topic":
      return <TopicBlock {...m} />;
    case "split":
      return <SplitPair {...m} />;
    case "ticker":
      return <Ticker {...m} />;
    case "hero":
      return (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-0 divide-y divide-border">
              {m.hero.left.map((a, i) => (
                <ArticleCard
                  key={a.id ?? i}
                  title={a.title}
                  href={a.href}
                  image={a.image}
                  category={null}
                  size="medium"
                  showImage={false}
                />
              ))}
            </div>

            <div className="lg:col-span-5">
              <ArticleCard
                title={m.hero.lead.title}
                href={m.hero.lead.href}
                image={m.hero.lead.image}
                size="large"
                showImage={true}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                {m.hero.bottom.map((a, i) => (
                  <ArticleCard
                    key={a.id ?? i}
                    title={a.title}
                    href={a.href}
                    image={a.image}
                    layout="horizontal"
                    size="small"
                    showImage={true}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-0 divide-y divide-border">
              {m.hero.right.map((a, i) => (
                <ArticleCard
                  key={a.id ?? i}
                  title={a.title}
                  href={a.href}
                  image={a.image}
                  size="medium"
                  showImage={false}
                />
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
    return <EntertainmentCarousel title={s.title} featured={s.featured} items={s.items} />;
  }
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <SectionHeader title={s.title} links={[]} />
      <div className="space-y-0 divide-y divide-border">
        {s.items.map((a, i) => (
          <ArticleCard key={a.id ?? i} title={a.title} href={a.href} image={a.image} size="medium" showImage={false} />
        ))}
      </div>
    </section>
  );
}

export function HomeStream({ vm }: { vm: HomeStreamVM }) {
  return (
    <div className="max-w-[1285px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {vm.left.map((m, i) => (
            <React.Fragment key={i}>{renderLeft(m)}</React.Fragment>
          ))}
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-6 h-fit border-l border-border pl-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-bold text-base">{vm.right.title}</h3>
          </div>
          <div className="space-y-0 divide-y divide-border">
            {vm.right.items.map((a, i) => (
              <ArticleCard key={a.id ?? i} title={a.title} href={a.href} image={a.image} size="small" showImage={false} />
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-10 space-y-8">
        {vm.lower.map((s, i) => (
          <React.Fragment key={i}>{renderLower(s)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}