type PlayerPageProps = {
  searchParams: Promise<{
    videoId?: string;
  }>;
};

export default async function PlayerPage({
  searchParams,
}: PlayerPageProps) {
  const params = await searchParams;
  const videoId = params.videoId;

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
          fontFamily: "Arial, sans-serif",
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