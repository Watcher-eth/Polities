// src/components/home/entertainment.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CardVM } from "@/lib/homeVm";

type Props = {
  title: string;
  featured: CardVM;
  items: CardVM[];
};

function Img({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

export function EntertainmentCarousel({ title, featured, items }: Props) {
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-headline font-bold text-lg">{title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured */}
        <div className="lg:col-span-6">
          {featured.image ? <Img src={featured.image} alt={featured.title} className="w-full aspect-[4/3]" /> : null}

          <h3 className="font-headline font-bold text-xl md:text-2xl leading-tight mt-4 line-clamp-3">
            <Link href={featured.href} className="hover:underline">
              {featured.title}
            </Link>
          </h3>

          {featured.endDate ? (
            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block line-clamp-1">
              Ends {new Date(featured.endDate).toLocaleDateString()}
            </span>
          ) : null}
        </div>

        {/* Items */}
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            {items.map((a, i) => (
              <div key={a.id ?? i}>
                {a.image ? <Img src={a.image} alt={a.title} className="w-full aspect-[4/3]" /> : null}

                <h4 className="font-headline font-bold text-base leading-tight mt-3 line-clamp-3">
                  <Link href={a.href} className="hover:underline">
                    {a.title}
                  </Link>
                </h4>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}