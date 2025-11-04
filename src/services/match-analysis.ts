import { z } from "zod";

import type { HeroBuff } from "@/data/hero-buffs";
import { HERO_BUFFS } from "@/data/hero-buffs";

export const MatchRequestSchema = z.object({
  heroIds: z.array(z.string()).min(1).max(10)
});

export type MatchAnalysis = {
  teamBuffs: {
    averageDamageDealt: number;
    averageDamageTaken: number;
    averageHealing: number;
    averageShielding: number;
    averageAbilityHaste: number;
    averageAttackSpeed: number;
  };
  // rolesBreakdown: Record<string, number>;
  heroes: HeroBuff[];
};

export function analyzeMatch(ids: string[]): MatchAnalysis | null {
  const heroes = ids
    .map((id) => HERO_BUFFS.find((hero) => hero.id === id))
    .filter((hero): hero is HeroBuff => Boolean(hero));

  if (!heroes.length) {
    return null;
  }

  const sum = heroes.reduce(
    (acc, hero) => {
      acc.damageDealt += hero.damageDealtMultiplier;
      acc.damageTaken += hero.damageTakenMultiplier;
      acc.healing += hero.healingGivenMultiplier;
      acc.shielding += hero.shieldingGivenMultiplier;
      acc.abilityHaste += hero.abilityHasteBonus;
      acc.attackSpeed += hero.attackSpeedBonus;
      // hero.roles.forEach((role) => {
      //   acc.roles[role] = (acc.roles[role] ?? 0) + 1;
      // });
      return acc;
    },
    {
      damageDealt: 0,
      damageTaken: 0,
      healing: 0,
      shielding: 0,
      abilityHaste: 0,
      attackSpeed: 0,
      // roles: {} as Record<string, number>
    }
  );

  const count = heroes.length;

  return {
    teamBuffs: {
      averageDamageDealt: sum.damageDealt / count,
      averageDamageTaken: sum.damageTaken / count,
      averageHealing: sum.healing / count,
      averageShielding: sum.shielding / count,
      averageAbilityHaste: sum.abilityHaste / count,
      averageAttackSpeed: sum.attackSpeed / count
    },
    // rolesBreakdown: sum.roles,
    heroes
  };
}
