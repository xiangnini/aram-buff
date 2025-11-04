import Fuse from "fuse.js";
import { pinyin } from "pinyin-pro";

import type { HeroBuff } from "@/data/hero-buffs";
import { HERO_BUFFS } from "@/data/hero-buffs";
import { HERO_SEARCH_METADATA } from "@/data/hero-search-metadata";

const CJK_REGEX = /[\u3400-\u9fff]/;

export type HeroSearchDocument = HeroBuff & {
  searchAliases: string[];
  searchPinyinFull: string[];
  searchPinyinInitials: string[];
  searchKeywords: string[];
};

const SEARCH_DOCUMENTS: HeroSearchDocument[] = HERO_BUFFS.map((hero) => {
  const metadata = HERO_SEARCH_METADATA[hero.id] ?? {};

  const aliasSet = new Set<string>();
  const keywordSet = new Set<string>();

  const addAlias = (value?: string | null) => {
    if (!value) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    aliasSet.add(trimmed);
    const lower = trimmed.toLowerCase();
    aliasSet.add(lower);
  };

  const addKeyword = (value?: string | null) => {
    if (!value) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    keywordSet.add(trimmed);
    keywordSet.add(trimmed.toLowerCase());
  };

  addAlias(hero.nameZh);
  addAlias(hero.nameEn);
  addAlias(hero.slug);
  addAlias(hero.id);

  metadata.aliases?.forEach(addAlias);

  metadata.keywords?.forEach(addKeyword);
  hero.tags?.forEach(addKeyword);
  hero.roles?.forEach(addKeyword);

  const searchAliases = Array.from(aliasSet).filter(Boolean);

  const pinyinFullSet = new Set<string>();
  const pinyinInitialSet = new Set<string>();

  for (const term of searchAliases) {
    if (!term || !CJK_REGEX.test(term)) continue;
    const syllables = pinyin(term, { toneType: "none", type: "array" }) as string[];
    if (!Array.isArray(syllables) || syllables.length === 0) continue;

    const joinedSpace = syllables.join(" ");
    const joined = syllables.join("");
    const joinedDash = syllables.join("-");

    pinyinFullSet.add(joinedSpace);
    pinyinFullSet.add(joined);
    pinyinFullSet.add(joinedDash);

    const initials = syllables
      .map((syllable) => syllable?.charAt(0) ?? "")
      .join("")
      .trim();
    if (initials) {
      pinyinInitialSet.add(initials);
      pinyinInitialSet.add(initials.toLowerCase());
    }

    const spacedInitials = syllables
      .map((syllable) => syllable?.charAt(0) ?? "")
      .join(" ")
      .trim();
    if (spacedInitials) {
      pinyinInitialSet.add(spacedInitials);
      pinyinInitialSet.add(spacedInitials.toLowerCase());
    }
  }

  const searchPinyinFull = Array.from(pinyinFullSet).filter(Boolean);
  const searchPinyinInitials = Array.from(pinyinInitialSet).filter(Boolean);
  const searchKeywords = Array.from(keywordSet).filter(Boolean);

  return {
    ...hero,
    searchAliases,
    searchPinyinFull,
    searchPinyinInitials,
    searchKeywords
  };
});

const fuse = new Fuse(SEARCH_DOCUMENTS, {
  keys: [
    { name: "nameZh", weight: 0.25 },
    { name: "searchAliases", weight: 0.25 },
    { name: "nameEn", weight: 0.12 },
    { name: "searchKeywords", weight: 0.08 },
    { name: "searchPinyinFull", weight: 0.18 },
    { name: "searchPinyinInitials", weight: 0.12 },
    { name: "slug", weight: 0.1 }
  ],
  threshold: 0.35,
  includeScore: true,
  ignoreLocation: true,
  shouldSort: true,
  minMatchCharLength: 1
});

export function searchHeroes(query: string): HeroSearchDocument[] {
  const normalized = query.trim();
  if (!normalized) return SEARCH_DOCUMENTS.slice(0, 10);

  const results = fuse.search(normalized).map(({ item }) => item);
  return results.slice(0, 10);
}

export function getHeroById(id: string) {
  return HERO_BUFFS.find((hero) => hero.id === id);
}
