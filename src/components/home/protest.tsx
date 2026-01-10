import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "./sectionHeader";
import type { SectionVM } from "@/lib/homeVm";

type Props = SectionVM;

export function SectionBlock({ title, tabs = [], left, featured, right, bottom }: Props) {
  return (
    <section className="max-w-[1285px] mx-auto px-4 py-6 border-t border-border">
      <SectionHeader title={title} links={tabs} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-0 divide-y divide-border">
          {left.map((a, i) => (
            <div key={i} className="py-4 first:pt-0">
              <h3 className="font-headline font-bold text-lg md:text-xl leading-tight">
                <Link href={a.href} className="hover:underline">
                  {a.title}
                </Link>
              </h3>
              {a.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.description}</p>}
              {a.readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{a.readTime}</span>}
            </div>
          ))}
        </div>

        {/* Center featured */}
        <div className="lg:col-span-5">
          {featured?.imageUrl && (
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

          {featured && (
            <>
              <h3 className="font-headline font-bold text-xl md:text-2xl leading-tight mt-4">
                <Link href={featured.href} className="hover:underline">
                  {featured.title}
                </Link>
              </h3>
              {featured.description && (
                <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
                  {featured.description}
                </p>
              )}
              {featured.readTime && (
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">
                  {featured.readTime}
                </span>
              )}
            </>
          )}

          {bottom?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              {bottom.map((a, i) => (
                <div key={i}>
                  <h4 className="font-headline font-bold text-base leading-tight">
                    <Link href={a.href} className="hover:underline">
                      {a.title}
                    </Link>
                  </h4>
                  {a.readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{a.readTime}</span>}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-0 divide-y divide-border">
          {right.map((a, i) => (
            <div key={i} className="py-4 first:pt-0">
              <h3 className="font-headline font-bold text-lg md:text-xl leading-tight">
                <Link href={a.href} className="hover:underline">
                  {a.title}
                </Link>
              </h3>
              {a.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.description}</p>}
              {a.readTime && <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block">{a.readTime}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}