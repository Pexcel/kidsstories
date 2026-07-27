"use client";

import { useSearchParams } from "next/navigation";

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return (
      <main
        style={{
          margin: 0,
          background: "#000",
          color: "#fff",
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Video unavailable.
      </main>
    );
  }

  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        background: "#000",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?playsinline=1&controls=1&rel=0`}
        title="KidsStories video player"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </main>
  );
}