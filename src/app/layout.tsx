import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LOL 大乱斗 Buff 查询",
  description: "快速检索与对比英雄联盟大乱斗模式的英雄增益数据。"
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
