// src/components/home/article.tsx
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  href: string;
  description?: string | null;
  readTime?: string | null;
  imageUrl?: string | null;
  category?: string | null;

  size?: "small" | "medium" | "large";
  showImage?: boolean;
  layout?: "vertical" | "horizontal";
  tone?: "default" | "rail"; // ✅ right-rail tighter style
}

const titleClamp = {
  small: "line-clamp-3",
  medium: "line-clamp-3",
  large: "line-clamp-4",
};

function toArticleHref(href?: string | null) {
    const h = String(href ?? "");
    // convert /m/<slug> to /a/<slug>
    return h.replace(/^\/m\//, "/a/");
  }

export function ArticleCard({
  title,
  href,
  description,
  readTime,
  imageUrl,
  category,
  size = "medium",
  showImage = false,
  layout = "vertical",
  tone = "default",
}: ArticleCardProps) {
  const titleSizes = {
    small: "text-[15px] md:text-base",
    medium: "text-base md:text-lg",
    large: "text-xl md:text-2xl lg:text-3xl",
  };

  const rail = tone === "rail";

  if (layout === "horizontal") {
    return (
      <Link href={toArticleHref(href)} className="flex gap-4 py-4">
        {showImage && imageUrl ? (
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-24 overflow-hidden bg-muted">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          {category ? <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{category}</span> : null}

          <h3 className={`font-headline font-bold leading-tight ${titleSizes[size]} ${titleClamp[size]}`}>
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          </h3>

          {description ? <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{description}</p> : null}

          {readTime ? <span className="text-[11px] text-muted-foreground uppercase tracking-wider mt-2 block">{readTime}</span> : null}
        </div>
      </Link>
    );
  }

  return (
    <article className={rail ? "py-3" : "py-4"}>
      {showImage && imageUrl ? (
        <div className="mb-3 overflow-hidden bg-muted">
          <img src={imageUrl} alt={title} className="w-full h-48 md:h-56 object-cover" />
        </div>
      ) : null}

      {category ? <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{category}</span> : null}

      <h3 className={`font-headline font-bold leading-tight ${rail ? "text-[15px] md:text-base" : titleSizes[size]} ${titleClamp[size]}`}>
        <Link href={toArticleHref(href)} className="hover:underline">
          {title}
        </Link>
      </h3>

      {!rail && description ? <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed line-clamp-4">{description}</p> : null}

      {readTime ? <span className="text-[11px] text-muted-foreground uppercase tracking-wider mt-2 block">{readTime}</span> : null}
    </article>
  );
}