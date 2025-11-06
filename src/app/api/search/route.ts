import { NextResponse } from "next/server";

export const runtime = 'edge';
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    {
      error: "api_disabled",
      message: "Search API is disabled in static export. Use client-side search instead.",
    },
    { status: 404 }
  );
}
