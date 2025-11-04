import "dotenv/config";

import heroBuffs from "@/data/hero-buffs.json";
import type { HeroBuff } from "@/data/hero-buffs";
import { prisma } from "@/lib/prisma";

type HeroBuffRecord = HeroBuff & {
  roles?: string[];
  tags?: string[];
  patch?: string;
};

const FALLBACK_PATCH = process.env.DEFAULT_PATCH ?? "latest";

async function main() {
  console.log(`即将同步 ${heroBuffs.length} 个英雄的 ARAM Buff 数据…`);

  for (const hero of heroBuffs as HeroBuffRecord[]) {
    const roles = hero.roles ?? [];
    const tags = hero.tags ?? [];
    const patch = hero.patch ?? FALLBACK_PATCH;

    const heroRecord = await prisma.hero.upsert({
      where: { slug: hero.slug },
      create: {
        slug: hero.slug,
        nameZh: hero.nameZh,
        nameEn: hero.nameEn,
        iconUrl: null,
        roles,
        tags
      },
      update: {
        nameZh: hero.nameZh,
        nameEn: hero.nameEn,
        roles,
        tags
      }
    });

    await prisma.heroBuff.upsert({
      where: {
        heroId_patch: {
          heroId: heroRecord.id,
          patch
        }
      },
      create: {
        heroId: heroRecord.id,
        patch,
        damageDealtMultiplier: hero.damageDealtMultiplier,
        damageTakenMultiplier: hero.damageTakenMultiplier,
        healingGivenMultiplier: hero.healingGivenMultiplier,
        shieldingGivenMultiplier: hero.shieldingGivenMultiplier,
        abilityHasteBonus: hero.abilityHasteBonus,
        attackSpeedBonus: hero.attackSpeedBonus,
        notes: hero.notes ?? null
      },
      update: {
        damageDealtMultiplier: hero.damageDealtMultiplier,
        damageTakenMultiplier: hero.damageTakenMultiplier,
        healingGivenMultiplier: hero.healingGivenMultiplier,
        shieldingGivenMultiplier: hero.shieldingGivenMultiplier,
        abilityHasteBonus: hero.abilityHasteBonus,
        attackSpeedBonus: hero.attackSpeedBonus,
        notes: hero.notes ?? null
      }
    });
  }

  console.log("同步完成 ✅");
}

main()
  .catch((error) => {
    console.error("同步失败", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
