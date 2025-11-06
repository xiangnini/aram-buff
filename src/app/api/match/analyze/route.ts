import { NextResponse } from "next/server";

import { MatchRequestSchema, analyzeMatch } from "@/services/match-analysis";

export const runtime = 'edge';
export const dynamic = "force-static";

export async function POST(request: Request) {
  const json = await request.json();
  const parseResult = MatchRequestSchema.safeParse(json);

  if (!parseResult.success) {
    return NextResponse.json({ error: "invalid_payload", details: parseResult.error.format() }, { status: 400 });
  }

  const ids = parseResult.data.heroIds;
  const analysis = analyzeMatch(ids);

  if (!analysis) {
    return NextResponse.json({ error: "heroes_not_found" }, { status: 404 });
  }

  return NextResponse.json(analysis);
}
