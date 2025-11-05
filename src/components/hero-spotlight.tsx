"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HeroBuff } from "@/data/hero-buffs";
import { SITE_CONFIG } from "@/data/site-config";

import { HeroSearch, type HeroSuggestion } from "./hero-search";
import { HeroCard } from "./hero-card";

type HeroSpotlightProps = {
  heroes: HeroBuff[];
};

export function HeroSpotlight({ heroes }: HeroSpotlightProps) {
  const heroMap = useMemo(() => new Map(heroes.map((hero) => [hero.id, hero])), [heroes]);
  const [selected, setSelected] = useState<HeroBuff | null>(heroes[0] ?? null);

  const handleSelect = (hero: HeroSuggestion) => {
    const full = heroMap.get(hero.id);
    if (full) {
      setSelected(full);
    }
  };

  return (
    <Card className="border-0 bg-slate-100 text-slate-900 shadow-2xl dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-800 dark:text-slate-50">
      <CardHeader className="space-y-4">
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-3xl font-bold">
          <span>快速检索英雄 Buff</span>
          <Badge variant="secondary" className="bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900">
            版本 {SITE_CONFIG.gameVersion}
          </Badge>
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          输入英雄、绰号或标签，快速锁定需要了解的英雄增益详情。
        </p>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <HeroSearch onSelect={handleSelect} placeholder="输入英雄名，例如 阿狸 / 阿卡丽" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            支持模糊匹配与拼音首字母，按回车可在下方快速查看详情。
          </p>
        </div>
        {selected ? (
          <HeroCard hero={selected} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-slate-200 bg-slate-100/30 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900/30 dark:text-slate-300">
            选择一个英雄，查看详细增益数据。
          </div>
        )}
      </CardContent>
    </Card>
  );
}
