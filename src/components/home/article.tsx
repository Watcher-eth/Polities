import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  href: string;
  description?: string;
  readTime?: string;
  imageUrl?: string;
  imageCaption?: string;
  category?: string;
  author?: string;
  size?: "small" | "medium" | "large";
  showImage?: boolean;
  layout?: "vertical" | "horizontal";
}

export function ArticleCard({
  title,
  href,
  description,
  readTime,
  imageUrl,
  imageCaption,
  category,
  size = "medium",
  showImage = false,
  layout = "vertical",
}: ArticleCardProps) {
  const titleSizes = {
    small: "text-base md:text-lg",
    medium: "text-lg md:text-xl",
    large: "text-xl md:text-2xl lg:text-3xl",
  };

  if (layout === "horizontal") {
    return (
      <article className="flex gap-4 py-4">
        {showImage && imageUrl && (
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-24">
            <img
              src={imageUrl}
              alt={title}
              width={128}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {category}
            </span>
          )}
          <h3 className={`font-headline font-bold leading-tight ${titleSizes[size]}`}>
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          </h3>
          {description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>}
          {readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{readTime}</span>}
        </div>
      </article>
    );
  }

  return (
    <article className="py-4">
      {showImage && imageUrl && (
        <div className="relative mb-3">
          <img
            src={imageUrl}
            alt={title}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
          {imageCaption && <p className="text-xs text-muted-foreground mt-1 text-right">{imageCaption}</p>}
        </div>
      )}
      {category && <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{category}</span>}
      <h3 className={`font-headline font-bold leading-tight ${titleSizes[size]}`}>
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>
      {description && <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">{description}</p>}
      {readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{readTime}</span>}
    </article>
  );
}