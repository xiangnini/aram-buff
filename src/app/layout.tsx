import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { SITE_CONFIG } from "@/data/site-config";

const title = SITE_CONFIG.name;
const description = SITE_CONFIG.description;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`
  },
  description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [
    {
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.links.github
    }
  ],
  creator: SITE_CONFIG.author,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_CONFIG.url,
    title,
    description,
    siteName: title,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: title
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [SITE_CONFIG.ogImage],
    creator: `@${SITE_CONFIG.author}`
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
