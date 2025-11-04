import { NextResponse } from "next/server";

import { HERO_BUFFS } from "@/data/hero-buffs";

export async function GET() {
  return NextResponse.json({ heroes: HERO_BUFFS });
}
