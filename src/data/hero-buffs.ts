import heroBuffs from "@/data/hero-buffs.json";

export type HeroBuff = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  damageDealtMultiplier: number;
  damageTakenMultiplier: number;
  healingGivenMultiplier: number;
  shieldingGivenMultiplier: number;
  abilityHasteBonus: number;
  attackSpeedBonus: number;
  tenacity?: number;
  energyRegenBonus?: number;
  notes?: string;
  roles?: string[];
  tags?: string[];
  patch?: string;
};

export const HERO_BUFFS: HeroBuff[] = heroBuffs satisfies HeroBuff[];
