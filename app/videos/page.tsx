export default function VideosPage() {
  const videos = [
   {
    title: "El-Roi. The God who sees",
    image: "/banner.jpg",
    link: "https://www.youtube.com/watch?v=jjeudBocn8g"
  },
  {
    title: "Don’t follow the crowd… follow the truth. 2 cchronicles 18",
    image: "/banner.jpg",
    link: "https://www.youtube.com/watch?v=vpJF0BnbTT4"
  },
  {
    title: "Don’t Switch Your Source | 2 Chronicles 16",
    image: "/banner.jpg",
    link: "https://www.youtube.com/watch?v=zXjvNv0iDvFn3oJi"
  }
  ];

  return (
    <main className="min-h-screen bg-yellow-50 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8">
          Bible Story Videos
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.title}
              className="bg-white rounded-3xl shadow-md overflow-hidden"
            >
              <img
                src={video.image}
                alt={video.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-bold text-lg">{video.title}</h3>

                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-3 text-white font-semibold inline-flex justify-center"
                >
                  Watch Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}