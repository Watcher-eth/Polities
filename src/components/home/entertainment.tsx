import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CardVM } from "@/lib/homeVm";

type Props = {
  title: string;
  featured: CardVM;
  items: CardVM[];
};

export function EntertainmentCarousel({ title, featured, items }: Props) {
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-headline font-bold text-lg">{title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured */}
        <div className="lg:col-span-6">
          {featured.imageUrl && (
            <div className="relative">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
              {featured.imageCaption && (
                <p className="text-xs text-muted-foreground mt-1 text-right">{featured.imageCaption}</p>
              )}
            </div>
          )}
          <h3 className="font-headline font-bold text-xl md:text-2xl leading-tight mt-4">
            <Link href={featured.href} className="hover:underline">
              {featured.title}
            </Link>
          </h3>
          {featured.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{featured.description}</p>}
          {featured.readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{featured.readTime}</span>}
        </div>

        {/* Items */}
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            {items.map((a, i) => (
              <div key={i}>
                {a.imageUrl && (
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    width={240}
                    height={180}
                    className="w-full h-40 object-cover"
                  />
                )}
                <h4 className="font-headline font-bold text-base leading-tight mt-3">
                  <Link href={a.href} className="hover:underline">
                    {a.title}
                  </Link>
                </h4>
                {a.readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{a.readTime}</span>}
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