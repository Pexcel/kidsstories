import { NextResponse } from "next/server";
import { songVideos } from "@/data/songVideos";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: songVideos.length,
    songs: songVideos
  });
}