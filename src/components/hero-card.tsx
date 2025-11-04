import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroBuff } from "@/data/hero-buffs";

type HeroCardProps = {
  hero: HeroBuff;
};

export function HeroCard({ hero }: HeroCardProps) {
  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{hero.nameZh}</CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{hero.nameEn}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <StatRow label="造成伤害" value={hero.damageDealtMultiplier ?? 1} isMultiplier />
          <StatRow label="承受伤害" value={hero.damageTakenMultiplier ?? 1} isMultiplier inverse />
          <StatRow label="攻击速度" value={hero.attackSpeedBonus ?? 0} />
          <StatRow label="技能急速" value={hero.abilityHasteBonus ?? 0} isRaw />
          <StatRow label="治疗效果" value={hero.healingGivenMultiplier ?? 1} isMultiplier />
          <StatRow label="韧性" value={hero.tenacity ?? 0} />
          <StatRow label="护盾效果" value={hero.shieldingGivenMultiplier ?? 1} isMultiplier />
          <StatRow label="能量回复" value={hero.energyRegenBonus ?? 0} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatRow({
  label,
  value,
  inverse,
  isMultiplier,
  isRaw,
}: {
  label: string;
  value: number;
  inverse?: boolean;
  isMultiplier?: boolean;
  isRaw?: boolean;
}) {
  const isNeutral = isMultiplier ? value === 1 : value === 0;

  if (isNeutral) {
    return (
      <div className="rounded-lg border border-border/60 bg-background/40 p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span>{isMultiplier ? "1.00x" : isRaw ? "+0" : "+0.0%"}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
          <span>{isMultiplier ? "+0.0%" : isRaw ? "+0" : "+0.0%"}</span>
        </div>
      </div>
    );
  }

  const diffText = isMultiplier
    ? `${value > 1 ? "+" : ""}${((value - 1) * 100).toFixed(1)}%`
    : isRaw
      ? `${value > 0 ? "+" : ""}${value}`
      : `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;

  const isAdvantage = inverse ? value < (isMultiplier ? 1 : 0) : value > (isMultiplier ? 1 : 0);

  const icon = isAdvantage ? (
    <ArrowUpRight className="h-4 w-4" />
  ) : (
    <ArrowDownRight className="h-4 w-4" />
  );

  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>
          {isMultiplier
            ? `${value.toFixed(2)}x`
            : isRaw
              ? `${value > 0 ? "+" : ""}${value}`
              : `${(value * 100).toFixed(1)}%`}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
        <span className={isAdvantage ? "text-emerald-500" : "text-rose-500"}>{diffText}</span>
        <span
          className={`flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide ${
            isAdvantage ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {icon}
          {isAdvantage ? "优势" : "劣势"}
        </span>
      </div>
    </div>
  );
}
