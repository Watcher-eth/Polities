
import type { CardVM } from "./homeVm";

const pickFirstImage = (x: any): string | null => {
  return (
    x?.image ||
    x?.imageUrl ||
    x?.icon ||
    x?.bannerImage ||
    x?.thumbnail ||
    x?.profileImage ||
    null
  );
};

const slugToHref = (slug?: string | null) => (slug ? `/m/${slug}` : "#");

export function marketToCard(m: any, opts?: { category?: string; preferHref?: string }): CardVM {
  const title = m?.question || m?.title || m?.name || "Untitled market";
  const description = m?.description || m?.subtitle || m?.resolutionSource || null;
  const href = opts?.preferHref ?? slugToHref(m?.slug);

  return {
    title,
    description,
    href,
  };
}

export function eventToFeatured(event: any) {
  const title =
    event?.title ||
    event?.name ||
    event?.slug ||
    "Featured";

  const href = event?.slug ? `/e/${event.slug}` : "#";
  const imageUrl = pickFirstImage(event);

  return {
    title,
    href,
    imageUrl,
    imageCaption: undefined,
  };
}