import "dotenv/config";

import heroBuffs from "@/data/hero-buffs.json";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log(`即将同步 ${heroBuffs.length} 个英雄的 ARAM Buff 数据…`);

  for (const hero of heroBuffs) {
    const heroRecord = await prisma.hero.upsert({
      where: { slug: hero.slug },
      create: {
        slug: hero.slug,
        nameZh: hero.nameZh,
        nameEn: hero.nameEn,
        iconUrl: null,
        roles: hero.roles,
        tags: hero.tags
      },
      update: {
        nameZh: hero.nameZh,
        nameEn: hero.nameEn,
        roles: hero.roles,
        tags: hero.tags
      }
    });

    await prisma.heroBuff.upsert({
      where: {
        heroId_patch: {
          heroId: heroRecord.id,
          patch: hero.patch
        }
      },
      create: {
        heroId: heroRecord.id,
        patch: hero.patch,
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
