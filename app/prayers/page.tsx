"use client";

import { useMemo, useState } from "react";
import { prayerVideos } from "@/data/prayerVideos";

export default function PrayerVideosPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return prayerVideos;

    return prayerVideos.filter((video) =>
      [
        video.title,
        video.description,
        video.scripture,
        video.prayerFocus,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="block">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
              Animated Bible TV
            </p>
            <h1 className="text-xl font-extrabold text-slate-950">
              Prayer Videos
            </h1>
          </a>

          <nav className="flex items-center gap-3 text-sm font-semibold">
            <a className="rounded-xl px-3 py-2 hover:bg-sky-50" href="/">
              Home
            </a>
            <a className="rounded-xl px-3 py-2 hover:bg-sky-50" href="/videos">
              Bible Videos
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-xl md:px-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
              Watch • Pray • Believe
            </p>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              Pray with Scripture
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
              Scripture-based prayer videos for daily devotion, encouragement,
              spiritual growth and faith-filled moments with God.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="prayer-search" className="mb-2 block text-sm font-bold text-slate-700">
            Search prayer videos
          </label>
          <input
            id="prayer-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Psalm, Job, protection, provision..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none ring-sky-200 transition focus:ring-4"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-sky-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
              🙏
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Prayer videos are being added
            </h3>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              New Scripture-based prayers will appear here. When a new prayer is
              published, app users can also receive a notification and open it
              directly in Animated Bible TV.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-video bg-slate-950">
                  <iframe
                    className="h-full w-full"
                    src={video.embed}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">
                    {video.scripture}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-950">
                    {video.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {video.description}
                  </p>

                  <div className="mt-4 rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                      Prayer focus
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {video.prayerFocus}
                    </p>
                  </div>

                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-sky-700 px-5 py-3 font-bold text-white transition hover:bg-sky-800"
                  >
                    Watch Prayer
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
