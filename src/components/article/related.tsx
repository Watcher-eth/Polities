// src/components/article/RelatedList.tsx
import Link from "next/link";
import type { CardVM } from "@/lib/homeVm";

export function RelatedList({
  title = "Related Markets",
  items = [],
}: {
  title?: string;
  items?: CardVM[];
}) {
  if (!items?.length) return null;

  return (
    <aside className="border-t border-border pt-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-bold text-base">{title}</h3>
      </div>

      <div className="space-y-0 divide-y divide-border">
        {items.slice(0, 10).map((a, i) => (
          <div key={a?.id ?? i} className="py-3">
            <Link
              href={a?.href ?? "#"}
              className="font-headline font-bold hover:underline leading-tight line-clamp-2"
            >
              {a?.title ?? ""}
            </Link>
            {a?.section ? (
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
                {a.section}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}