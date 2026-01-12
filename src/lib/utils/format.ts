// src/components/article/format.ts
export function fmtMoney(x: any): string | null {
    const n = typeof x === "string" ? Number(x) : typeof x === "number" ? x : null;
    if (!Number.isFinite(n as number)) return null;
    const v = n as number;
    if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
    return `$${v.toFixed(0)}`;
  }
  
  export function fmtPct(x: any): string | null {
    const n = typeof x === "number" ? x : null;
    if (!Number.isFinite(n as number)) return null;
    return `${Math.round((n as number) * 100)}%`;
  }
  
  export function safeDateLabel(iso?: string | null): string | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  
  export function splitParagraphs(s?: string | null): string[] {
    const raw = String(s ?? "").trim();
    if (!raw) return [];
    return raw
      .split(/\n\s*\n/g)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }
  
  export function clampText(s?: string | null, max = 200): string | null {
    const t = String(s ?? "").trim();
    if (!t) return null;
    if (t.length <= max) return t;
    return t.slice(0, max).trim() + "…";
  }