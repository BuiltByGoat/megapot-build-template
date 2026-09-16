/**
 * Cloudflare Pages Function — GET /go
 * Bind MEGAPOT_PLAY_DESTINATION on the Pages project. Never render it.
 */

const PUBLIC_PLAY_FALLBACK = 'https://megapot.io';

function resolvePlayDestination(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return PUBLIC_PLAY_FALLBACK;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return PUBLIC_PLAY_FALLBACK;
    }
    return parsed.toString();
  } catch {
    return PUBLIC_PLAY_FALLBACK;
  }
}

export const onRequestGet: PagesFunction<{ MEGAPOT_PLAY_DESTINATION?: string }> = async (
  context,
) => {
  const destination = resolvePlayDestination(context.env.MEGAPOT_PLAY_DESTINATION);
  return Response.redirect(destination, 302);
};
