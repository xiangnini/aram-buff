"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { HeroBuff } from "@/data/hero-buffs";

import { Badge } from "@/components/ui/badge";

export type HeroSuggestion = Pick<HeroBuff, "id" | "slug" | "nameZh" | "nameEn"> & {
  aliases: string[];
  pinyin: string[];
  initials: string[];
  keywords: string[];
};

type HeroSearchProps = {
  onSelect?: (hero: HeroSuggestion) => void;
  placeholder?: string;
};

export function HeroSearch({ onSelect, placeholder }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [suggestions, setSuggestions] = useState<HeroSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function run() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(debouncedQuery)}`
        );
        const data = (await res.json()) as { results: HeroSuggestion[] };
        if (!ignore) {
          const normalized = data.results.map((hero) => ({
            ...hero,
            aliases: hero.aliases ?? [],
            pinyin: hero.pinyin ?? [],
            initials: hero.initials ?? [],
            keywords: hero.keywords ?? [],
          }));
          setSuggestions(normalized);
        }
      } catch (error) {
        console.error("搜索失败", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const emptyText = useMemo(() => {
    if (loading) return "正在载入建议…";
    if (!debouncedQuery) return "输入英雄名称、绰号或标签";
    return "没有找到匹配的英雄";
  }, [debouncedQuery, loading]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <Command className="max-h-64">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={placeholder ?? "搜索英雄或标签"}
          className="h-12 text-base"
        />
        <CommandList>
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup heading="英雄">
            <ScrollArea className="max-h-66">
              {suggestions.map((hero) => (
                <CommandItem
                  key={hero.id}
                  value={[
                    hero.slug,
                    hero.nameZh,
                    hero.nameEn,
                    ...hero.aliases,
                    ...hero.pinyin,
                    ...hero.initials,
                    ...hero.keywords,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onSelect={() => {
                    onSelect?.(hero);
                    setQuery(hero.nameZh);
                  }}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="flex w-full items-center justify-between text-sm font-medium">
                    <span>{hero.nameZh}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{hero.nameEn}</span>
                    {hero.aliases
                      .filter((alias) => alias !== hero.nameZh && alias !== hero.nameEn)
                      .slice(0, 3)
                      .map((alias) => (
                      <Badge key={alias} variant="outline">
                        {alias}
                      </Badge>
                    ))}
                  </div>
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
