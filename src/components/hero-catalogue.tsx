"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HeroBuff } from "@/data/hero-buffs";

import { HeroCard } from "./hero-card";

type SortKey = "damage" | "survival" | "support";

type HeroCatalogueProps = {
  heroes: HeroBuff[];
};

export function HeroCatalogue({ heroes }: HeroCatalogueProps) {
  const [sortKey, setSortKey] = useState<SortKey>("damage");

  const sortedHeroes = useMemo(() => {
    switch (sortKey) {
      case "damage":
        return [...heroes].sort((a, b) => b.damageDealtMultiplier - a.damageDealtMultiplier);
      case "survival":
        return [...heroes].sort((a, b) => a.damageTakenMultiplier - b.damageTakenMultiplier);
      case "support":
        return [...heroes].sort(
          (a, b) =>
            b.healingGivenMultiplier +
            b.shieldingGivenMultiplier -
            (a.healingGivenMultiplier + a.shieldingGivenMultiplier)
        );
      default:
        return heroes;
    }
  }, [heroes, sortKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">排序：</span>
        <Button
          size="sm"
          variant={sortKey === "damage" ? "default" : "outline"}
          onClick={() => setSortKey("damage")}
        >
          输出潜力
        </Button>
        <Button
          size="sm"
          variant={sortKey === "survival" ? "default" : "outline"}
          onClick={() => setSortKey("survival")}
        >
          生存能力
        </Button>
        <Button
          size="sm"
          variant={sortKey === "support" ? "default" : "outline"}
          onClick={() => setSortKey("support")}
        >
          保护增益
        </Button>
      </div>
      <ScrollArea className="max-h-[32rem] pr-2">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedHeroes.map((hero) => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
