// src/components/article/ArticleHero.tsx
import type { ArticleMedia } from "../../types/article";

type Props = ArticleMedia & {
  // Optional overlays (NYT-style: location/date/transcript tags)
  locationLabel?: string | null;
  dateLabel?: string | null;
  transcriptTag?: string | null;
};

export function ArticleHero({
  imageUrl,
  imageAlt,
  imageCaption,
  locationLabel,
  dateLabel,
  transcriptTag,
}: Props) {
  if (!imageUrl) return null;

  return (
    <section className="py-5">
      <div className="relative overflow-hidden bg-muted border border-border">
        <div className="relative w-full aspect-[16/9] md:aspect-[4/3]">
          {/* keep <img> to match your other components; swap to next/image later */}
          <img
            src={imageUrl}
            alt={imageAlt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {(locationLabel || dateLabel) ? (
            <div className="absolute top-4 left-4">
              {locationLabel ? (
                <div className="text-white text-sm font-medium drop-shadow">
                  {locationLabel}
                </div>
              ) : null}
              {dateLabel ? (
                <div className="text-white/80 text-xs drop-shadow">{dateLabel}</div>
              ) : null}
            </div>
          ) : null}

          {transcriptTag ? (
            <div className="absolute bottom-4 left-4">
              <span className="text-white text-xs bg-black/50 px-2 py-1">
                {transcriptTag}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {imageCaption ? (
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {imageCaption}
        </p>
      ) : null}
    </section>
  );
}