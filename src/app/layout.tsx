import type { ReactNode } from "react";

import { Merriweather, Outfit } from "next/font/google";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  SITE_APPLE_TOUCH_ICON_PATH,
  SITE_APP_ICON_192_PATH,
  SITE_APP_ICON_512_PATH,
  SITE_DESCRIPTION,
  SITE_FAVICON_PATH,
  SITE_ICON_PATH,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_OG_LOCALE,
  SITE_SHORT_DESCRIPTION,
  SITE_THEME_COLOR,
  SITE_URL,
} from "@/lib/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | AI water, power, costs, and impact`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "AI water usage",
    "AI energy consumption",
    "AI electricity cost",
    "data center water",
    "AI compute cost",
    "GPU shortage",
    "AI carbon footprint",
    "AI environmental impact",
    "AI power usage",
    "AI infrastructure cost",
    "data center energy",
    "AI training cost",
    "AI resource consumption",
    "AI sustainability",
    "AI usage global",
    "artificial intelligence cost",
    "AI water footprint",
    "AI cooling water",
    "AI power demand",
    "AI data center",
  ],
  authors: [{ name: "AUG Bot", url: `${SITE_URL}/about` }],
  creator: "administraktor.com",
  publisher: SITE_NAME,
  category: "Technology",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} | AI news on usage, regulation, and impact`,
    },
    description: SITE_SHORT_DESCRIPTION,
    type: "website",
    locale: SITE_OG_LOCALE,
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        type: "image/png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${SITE_SHORT_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} | AI water, power, costs, and impact`,
    },
    description: SITE_SHORT_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
  icons: {
    icon: [
      { url: SITE_FAVICON_PATH },
      { url: SITE_ICON_PATH, type: "image/png", sizes: "32x32" },
    ],
    shortcut: [SITE_FAVICON_PATH],
    apple: [{ url: SITE_APPLE_TOUCH_ICON_PATH, sizes: "180x180" }],
    other: [
      {
        rel: "icon",
        url: SITE_APP_ICON_192_PATH,
        sizes: "192x192",
      },
      {
        rel: "icon",
        url: SITE_APP_ICON_512_PATH,
        sizes: "512x512",
      },
    ],
  },
  other: {
    "application-name": SITE_NAME,
    "msapplication-TileColor": SITE_THEME_COLOR,
  },
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html
      lang={SITE_LANGUAGE}
      className={cn(
        outfit.variable,
        merriweather.variable,
        "flex min-h-full w-full scroll-smooth",
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full w-full flex-auto flex-col">
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;