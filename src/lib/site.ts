const previewSiteUrl = process.env.CF_PAGES_URL
  ? `https://${process.env.CF_PAGES_URL}`
  : undefined;

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  previewSiteUrl ??
  "https://aiusageglobal.pages.dev";

export const SITE_NAME = "AI Usage Global";
export const SITE_DESCRIPTION =
  "AI Usage Global tracks the real cost of AI — water consumption, energy use, rising compute costs, data center strain, and environmental impact. Daily reporting on how AI usage affects the world.";
export const SITE_SHORT_DESCRIPTION =
  "Daily reporting on AI water use, energy costs, compute strain, and environmental impact.";
export const SITE_TAGLINE =
  "Tracking the real cost of AI — water, power, money, and impact.";

export const SITE_LANGUAGE = "en";
export const SITE_LANGUAGE_TAG = "en-US";
export const SITE_OG_LOCALE = "en_US";

export const SITE_OG_IMAGE_PATH = "/images/og-image.png";
export const SITE_THEME_COLOR = "#16a34a";
export const SITE_BACKGROUND_COLOR = "#f0fdf4";
export const SITE_ICON_PATH = "/favicon/favicon-32x32.png";
export const SITE_FAVICON_PATH = "/favicon/favicon.ico";
export const SITE_APP_ICON_192_PATH = "/favicon/android-chrome-192x192.png";
export const SITE_APP_ICON_512_PATH = "/favicon/android-chrome-512x512.png";
export const SITE_APPLE_TOUCH_ICON_PATH = "/favicon/apple-touch-icon.png";

export const CONTACT_EMAIL = "contact@aiusageglobal.pages.dev";
export const RESPONSIBLE_AI_INITIATIVE_URL =
  "https://responsible-ai-usage.vercel.app";