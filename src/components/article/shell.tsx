// src/components/article/ArticleShell.tsx
import * as React from "react";

export function ArticleShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1285px] mx-auto px-4">
      {/* classic newspaper-ish density */}
      <div className="border-t border-border" />
      <div className="py-6">{children}</div>
    </div>
  );
}

export function ArticleGrid({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <div className="lg:col-span-3">{left}</div>
      <div className="lg:col-span-6">{center}</div>
      <div className="lg:col-span-3">{right}</div>
    </div>
  );
}

export function Hr() {
  return <div className="border-t border-border" />;
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </div>
  );
}