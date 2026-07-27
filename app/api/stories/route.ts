import { bibleStories } from "@/data/bibleStories";

export async function GET() {
  return Response.json({
    success: true,
    count: bibleStories.length,
    stories: bibleStories,
  });
}