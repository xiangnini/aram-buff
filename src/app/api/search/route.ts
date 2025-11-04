import { NextResponse } from "next/server";

import { searchHeroes } from "@/data/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  const results = searchHeroes(query).map((hero) => ({
    id: hero.id,
    slug: hero.slug,
    nameZh: hero.nameZh,
    nameEn: hero.nameEn,
    aliases: hero.searchAliases,
    pinyin: hero.searchPinyinFull,
    initials: hero.searchPinyinInitials,
    keywords: hero.searchKeywords,
  }));

  return NextResponse.json({ query, results });
}
