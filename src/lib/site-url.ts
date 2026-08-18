// Η βασική διεύθυνση του site.
// Ορίζεται με το env var VITE_SITE_URL (π.χ. https://www.frontistirio.gr)
// στο Vercel / Netlify / Cloudflare Pages. Αν δεν οριστεί, χρησιμοποιούνται
// σχετικές διαδρομές, που παραμένουν σωστές σε οποιοδήποτε domain.
const raw = (import.meta.env['VITE_SITE_URL'] as string | undefined) ?? "";

export const SITE_URL = raw.replace(/\/+$/, "");

export function siteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
