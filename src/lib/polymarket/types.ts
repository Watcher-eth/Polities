export const TWELVE_HOURS_S = 5

export function setApiCache(res: any, sMaxAgeSeconds = TWELVE_HOURS_S) {
  // CDN cache + allow SWR at the edge.
  // - s-maxage caches on Vercel/Cloudflare etc
  // - stale-while-revalidate serves cached while refreshing
  res.setHeader("Cache-Control", `public, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=10`);
}
