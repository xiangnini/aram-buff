import { HeroCatalogue } from "@/components/hero-catalogue";
import { HeroSpotlight } from "@/components/hero-spotlight";
import { MatchAnalyzer } from "@/components/match-analyzer";
import { ThemeToggle } from "@/components/theme-toggle";
import { HERO_BUFFS } from "@/data/hero-buffs";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">ARAM Intelligence</p>
          <h1 className="text-3xl font-semibold md:text-4xl">英雄联盟大乱斗 Buff 数据中心</h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            一站式查询当版本大乱斗英雄的数值增益、实时筛选阵容并即时对比对局双方的增益曲线。
          </p>
        </div>
        <ThemeToggle />
      </header>

      <HeroSpotlight heroes={HERO_BUFFS} />

      {/* <section className="space-y-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">全英雄增益总览</h2>
          <p className="text-sm text-muted-foreground">
            支持按定位快速过滤，按输出 / 生存 / 保护能力排序，帮助你迅速锁定阵容补充需求。
          </p>
        </div>
        <HeroCatalogue heroes={HERO_BUFFS} />
      </section> */}

      {/* <section className="space-y-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">当局阵容对比</h2>
          <p className="text-sm text-muted-foreground">
            录入我方与敌方阵容，自动计算平均增益能力、位置分布与能力缺口提醒，协助做出开局策略。
          </p>
        </div>
        <MatchAnalyzer />
      </section> */}
    </main>
  );
}
