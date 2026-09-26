const LOCAL_URL = "http://localhost:3000";

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function normalizeUrl(value: string) {
  return withProtocol(value).replace(/\/$/, "");
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) return normalizeUrl(configuredUrl);

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  return vercelUrl ? normalizeUrl(vercelUrl) : LOCAL_URL;
}

export const SITE_NAME = "Marketa AI";
export const SITE_DESCRIPTION =
  "Turn one promotion idea into brand-aware social captions, WhatsApp messages, ad copy, marketing guidance, and an optional branded poster.";
