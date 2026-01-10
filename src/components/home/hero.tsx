import Image from "next/image";
import { ArticleCard } from "./article";
import type { HeroVM } from "@/lib/homeVm";

type Props = HeroVM;

export function HeroSection({ left, right, bottom, featured }: Props) {
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {left.map((a, i) => (
            <ArticleCard key={i} {...a} size="medium" />
          ))}
        </div>

        {/* Center featured */}
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="relative aspect-[4/3] bg-black">
              {featured.imageUrl ? (
                <img src={featured.imageUrl} alt={featured.title} className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}

              {featured.locationLabel && (
                <div className="absolute top-4 left-4 text-white text-sm">
                  <p className="font-medium">{featured.locationLabel}</p>
                  {featured.dateLabel && <p className="text-white/80">{featured.dateLabel}</p>}
                </div>
              )}

              {featured.transcriptTag && (
                <div className="absolute bottom-16 left-4 right-4">
                  <span className="text-white text-sm bg-black/50 px-2 py-1">{featured.transcriptTag}</span>
                </div>
              )}

              {featured.imageCaption && (
                <p className="absolute bottom-4 left-4 text-white/80 text-xs">{featured.imageCaption}</p>
              )}
            </div>

            {featured.byline && (
              <p className="text-xs text-muted-foreground mt-2 text-center">{featured.byline}</p>
            )}
          </div>

          {/* Bottom articles under hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
            {bottom.map((a, i) => (
              <ArticleCard
                key={i}
                {...a}
                showImage={true}
                layout="horizontal"
                size="small"
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-4 space-y-0 divide-y divide-border">
          {right.map((a, i) => (
            <ArticleCard key={i} {...a} size="medium" />
          ))}
        </div>
      </div>
    </section>
  );
}