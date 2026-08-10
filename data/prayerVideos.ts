import type { PrayerVideo } from "@/types";

/*
  Add every prayer video here after you publish it on YouTube.

  Example:

  {
    id: "psalm-1-prayer",
    title: "Prayer from Psalm 1",
    image: "/banner.jpg",
    link: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
    embed: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
    description: "A prayer based on Psalm 1.",
    scripture: "Psalm 1",
    prayerFocus: "Fruitfulness, godly choices and spiritual stability",
    publishedAt: "2026-08-09"
  }

  Keep each id unique. The Android app and notification deep-link system use this id.
*/
export const prayerVideos: PrayerVideo[] = [];
