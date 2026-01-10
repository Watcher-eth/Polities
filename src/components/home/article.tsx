// src/components/home/article.tsx
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  href: string;

  readTime?: string | null;

  // ✅ CardVM uses `image`, not imageUrl
  image?: string | null;

  // Optional metadata
  category?: string | null;
  author?: string | null;

  size?: "small" | "medium" | "large";
  showImage?: boolean;
  layout?: "vertical" | "horizontal";
}

const TITLE_SIZE = {
  small: "text-base md:text-lg",
  medium: "text-lg md:text-xl",
  large: "text-xl md:text-2xl lg:text-3xl",
} as const;

const CLAMP = {
  vertical: {
    small: "line-clamp-3",
    medium: "line-clamp-3",
    large: "line-clamp-3",
  },
  horizontal: {
    small: "line-clamp-2",
    medium: "line-clamp-2",
    large: "line-clamp-2",
  },
} as const;

function ImageBox({
  src,
  alt,
  variant,
}: {
  src: string;
  alt: string;
  variant: "thumb" | "card" | "featured";
}) {
  const klass =
    variant === "thumb"
      ? "w-24 h-24 md:w-32 md:h-24"
      : variant === "featured"
        ? "w-full aspect-[4/3]"
        : "w-full aspect-[16/10]";

  return (
    <div className={`relative overflow-hidden rounded-md bg-muted ${klass}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function ArticleCard({
  title,
  href,
  readTime,
  image,
  category,
  author,
  size = "medium",
  showImage = false,
  layout = "vertical",
}: ArticleCardProps) {
  const eyebrow = category ?? author ?? null;
  const titleClamp = CLAMP[layout][size];

  const imageVariant: "thumb" | "card" | "featured" =
    layout === "horizontal" ? "thumb" : size === "large" ? "featured" : "card";

  if (layout === "horizontal") {
    return (
      <article className="flex gap-4 py-4">
        {showImage && image ? <ImageBox src={image} alt={title} variant="thumb" /> : null}

        <div className="flex-1 min-w-0">
          {eyebrow ? (
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground line-clamp-1">
              {eyebrow}
            </div>
          ) : null}

          <h3 className={`font-headline font-bold leading-tight ${TITLE_SIZE[size]} ${titleClamp}`}>
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          </h3>

          {readTime ? (
            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block line-clamp-1">
              {readTime}
            </span>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className="py-4">
      {showImage && image ? (
        <div className="mb-3">
          <ImageBox src={image} alt={title} variant={imageVariant} />
        </div>
      ) : null}

      {eyebrow ? (
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground line-clamp-1">
          {eyebrow}
        </div>
      ) : null}

      <h3 className={`font-headline font-bold leading-tight ${TITLE_SIZE[size]} ${titleClamp}`}>
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>

      {readTime ? (
        <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block line-clamp-1">
          {readTime}
        </span>
      ) : null}
    </article>
  );
}