import { NextResponse } from "next/server";
import { bibleVideos } from "@/data/bibleVideos";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: bibleVideos.length,
    videos: bibleVideos,
  });
}