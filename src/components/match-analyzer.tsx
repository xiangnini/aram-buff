"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchAnalysis } from "@/services/match-analysis";
import { analyzeMatch } from "@/services/match-analysis";

import { HeroSearch, type HeroSuggestion } from "./hero-search";

const MAX_TEAM_SIZE = 5;

type TeamKey = "blue" | "red";

type MatchAnalyzerState = Record<TeamKey, HeroSuggestion[]>;

type FetchState = "idle" | "loading" | "error" | "success";

type AnalysisState = Record<TeamKey, MatchAnalysis | null>;

type MatchAnalyzerProps = {
  initialBlue?: HeroSuggestion[];
  initialRed?: HeroSuggestion[];
};

export function MatchAnalyzer({ initialBlue = [], initialRed = [] }: MatchAnalyzerProps) {
  const [teams, setTeams] = useState<MatchAnalyzerState>({ blue: initialBlue, red: initialRed });
  const [analysis, setAnalysis] = useState<AnalysisState>({ blue: null, red: null });
  const [status, setStatus] = useState<Record<TeamKey, FetchState>>({ blue: "idle", red: "idle" });

  const handleAddHero = (team: TeamKey, hero: HeroSuggestion) => {
    setTeams((prev) => {
      const exists = prev[team].some((item) => item.id === hero.id);
      if (exists || prev[team].length >= MAX_TEAM_SIZE) return prev;
      return { ...prev, [team]: [...prev[team], hero] };
    });
  };

  const handleRemoveHero = (team: TeamKey, heroId: string) => {
    setTeams((prev) => ({
      ...prev,
      [team]: prev[team].filter((hero) => hero.id !== heroId)
    }));
  };

  useEffect(() => {
    let ignore = false;

    async function run() {
      const initialStatus: Record<TeamKey, FetchState> = {
        blue: teams.blue.length ? "loading" : "idle",
        red: teams.red.length ? "loading" : "idle"
      };
      if (!ignore) {
        setStatus(initialStatus);
      }

      const responses = await Promise.all(
        (["blue", "red"] as TeamKey[]).map(async (team) => {
          const teamHeroes = teams[team];
          if (!teamHeroes.length) {
            return { team, data: null as MatchAnalysis | null, status: "idle" as FetchState };
          }
          try {
            // Use client-side analysis instead of API call for static export compatibility
            const heroIds = teamHeroes.map((hero) => hero.id);
            const data = analyzeMatch(heroIds);
            
            if (!data) {
              throw new Error("分析失败");
            }
            
            return { team, data, status: "success" as FetchState };
          } catch (error) {
            console.error("分析失败", error);
            return { team, data: null, status: "error" as FetchState };
          }
        })
      );

      if (ignore) return;

      const nextAnalysis: AnalysisState = { blue: null, red: null };
      const nextStatus: Record<TeamKey, FetchState> = { blue: "idle", red: "idle" };

      for (const item of responses) {
        nextAnalysis[item.team] = item.data;
        nextStatus[item.team] = item.status;
      }

      setAnalysis(nextAnalysis);
      setStatus(nextStatus);
    }

    run();

    return () => {
      ignore = true;
    };
  }, [teams]);

  const combinedHeroes = useMemo(() => {
    return new Set([
      ...teams.blue.map((hero) => hero.id),
      ...teams.red.map((hero) => hero.id)
    ]);
  }, [teams]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <TeamPanel
          title="我方阵容"
          teamKey="blue"
          heroes={teams.blue}
          onAddHero={handleAddHero}
          onRemoveHero={handleRemoveHero}
          status={status.blue}
          analysis={analysis.blue}
        />
        <TeamPanel
          title="敌方阵容"
          teamKey="red"
          heroes={teams.red}
          onAddHero={handleAddHero}
          onRemoveHero={handleRemoveHero}
          status={status.red}
          analysis={analysis.red}
        />
      </div>
      <div className="text-sm text-muted-foreground">
        {MAX_TEAM_SIZE}v{MAX_TEAM_SIZE} 对局可在开局阶段快速录入英雄，系统会自动排除重复录入：当前共有
        {" "}
        <span className="font-semibold text-primary">{combinedHeroes.size}</span> 个唯一英雄。
      </div>
    </div>
  );
}

type TeamPanelProps = {
  title: string;
  teamKey: TeamKey;
  heroes: HeroSuggestion[];
  onAddHero: (team: TeamKey, hero: HeroSuggestion) => void;
  onRemoveHero: (team: TeamKey, heroId: string) => void;
  status: FetchState;
  analysis: MatchAnalysis | null;
};

function TeamPanel({ title, teamKey, heroes, onAddHero, onRemoveHero, status, analysis }: TeamPanelProps) {
  return (
    <Card className="border-border/70 bg-muted/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          {title}
          <span className="text-sm text-muted-foreground">
            {heroes.length}/{MAX_TEAM_SIZE}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <HeroSearch onSelect={(hero) => onAddHero(teamKey, hero)} placeholder="输入英雄名称添加至阵容" />
        <div className="flex flex-wrap gap-2">
          {heroes.map((hero) => (
            <Button
              key={hero.id}
              variant="secondary"
              size="sm"
              onClick={() => onRemoveHero(teamKey, hero.id)}
              className="gap-2"
            >
              {hero.nameZh}
              {/* <Badge variant="outline" className="ml-1">
                {hero.roles.join("/")}
              </Badge> */}
            </Button>
          ))}
          {!heroes.length && <p className="text-sm text-muted-foreground">暂未选择英雄</p>}
        </div>
        <TeamSummary status={status} analysis={analysis} />
      </CardContent>
    </Card>
  );
}

type TeamSummaryProps = {
  status: FetchState;
  analysis: MatchAnalysis | null;
};

function TeamSummary({ status, analysis }: TeamSummaryProps) {
  if (status === "idle") {
    return <p className="text-sm text-muted-foreground">添加英雄后自动计算阵容增益概览。</p>;
  }

  if (status === "loading") {
    return (
      <div className="grid gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (status === "error" || !analysis) {
    return <p className="text-sm text-rose-500">计算出现问题，请稍后重试。</p>;
  }

  const { teamBuffs } = analysis;

  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-2 md:grid-cols-2">
        <SummaryStat label="平均造成伤害" value={`${(teamBuffs.averageDamageDealt * 100).toFixed(1)}%`} trend={teamBuffs.averageDamageDealt} />
        <SummaryStat label="平均承受伤害" value={`${(teamBuffs.averageDamageTaken * 100).toFixed(1)}%`} trend={1 / teamBuffs.averageDamageTaken} />
        <SummaryStat label="平均治疗增益" value={`${(teamBuffs.averageHealing * 100).toFixed(1)}%`} trend={teamBuffs.averageHealing} />
        <SummaryStat label="平均护盾增益" value={`${(teamBuffs.averageShielding * 100).toFixed(1)}%`} trend={teamBuffs.averageShielding} />
        <SummaryStat label="平均能力急速" value={`${teamBuffs.averageAbilityHaste.toFixed(1)}`} trend={teamBuffs.averageAbilityHaste} />
        <SummaryStat label="平均攻速加成" value={`${(teamBuffs.averageAttackSpeed * 100).toFixed(1)}%`} trend={teamBuffs.averageAttackSpeed} />
      </div>
      {/* <div>
        <h4 className="mb-2 text-xs uppercase text-muted-foreground">位置分布</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(rolesBreakdown).map(([role, count]) => (
            <Badge key={role} variant="outline">
              {role} × {count}
            </Badge>
          ))}
        </div>
      </div> */}
    </div>
  );
}

type SummaryStatProps = {
  label: string;
  value: string;
  trend: number;
};

function SummaryStat({ label, value, trend }: SummaryStatProps) {
  const good = trend >= 1;
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold ${good ? "text-emerald-500" : "text-amber-500"}`}>{value}</div>
    </div>
  );
}
