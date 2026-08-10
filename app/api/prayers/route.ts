import { NextResponse } from "next/server";
import { prayerVideos } from "@/data/prayerVideos";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: prayerVideos.length,
    prayers: prayerVideos,
  });
}
