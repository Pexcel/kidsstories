"use client";

import React, { ButtonHTMLAttributes, ReactNode, SVGProps, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { bibleBookCatalog } from "@/data/bibleBooks";
import { getUploadedCount, getBookGroup } from "@/utils/bibleProgress";
import { bibleVideos } from "../data/bibleVideos";
import { BibleChapter, Video, Testament } from "@/types";
import {
  getChapterNumbers,
  getVideosForChapter,
  generateChapterTeaching,
} from "@/utils/bibleHelpers";

type IconName = "upload" | "play" | "book" | "mail" | "star" | "shield" | "search" | "menu";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

type Story = {
  title: string;
  category: string;
  age: string;
  description: string;
};

 



type ChapterTeaching = {
  summary: string;
  lesson: string;
  memoryVerse: string;
  prayer: string;
};


const Icon = ({ name, size = 24, className = "" }: IconProps) => {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className
  };

  const icons: Record<IconName, ReactNode> = {
    upload: (
      <svg {...common}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M17 8l-5-5-5 5" />
        <path d="M12 3v12" />
      </svg>
    ),
    play: (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M10 8l6 4-6 4V8z" />
      </svg>
    ),
    book: (
      <svg {...common}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    star: (
      <svg {...common}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    search: (
      <svg {...common}>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    menu: (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M3 12h18" />
        <path d="M3 18h18" />
      </svg>
    )
  };

  return icons[name];
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline";
};

const Button = ({ children, className = "", variant = "solid", type = "button", ...props }: ButtonProps) => {
  const base = "inline-flex items-center justify-center font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60";
  const styles = variant === "outline" ? "border bg-white text-slate-900 hover:bg-orange-50" : "text-white";

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);


const trendingVideos: Video[] = bibleVideos;

const bibleLibrary = bibleBookCatalog;




const categories = ["Old Testament", "New Testament", "Bible Songs", "Memory Verses", "Bedtime Stories"];

const stories: Story[] = [
  {
    title: "King Jehoshaphat Trusts God",
    category: "Bible Animation",
    age: "Ages 4–10",
    description: "A child-friendly story about prayer, faith, and victory through God."
  },
  {
    title: "Joash and the Brave Priest",
    category: "Bible Story Video",
    age: "Ages 5–12",
    description: "A colorful lesson on courage, obedience, and godly leadership."
  },
  {
    title: "A Child Who Loves the Bible",
    category: "Short Animation",
    age: "Ages 3–8",
    description: "A warm story encouraging children to read and love God's Word."
  }
];

export function filterStories(items: Story[], query: string): Story[] {
  const cleanQuery = String(query || "").trim().toLowerCase();

  if (!cleanQuery) return items;

  return items.filter((story) => {
    const title = story.title.toLowerCase();
    const category = story.category.toLowerCase();
    const description = story.description.toLowerCase();
    return title.includes(cleanQuery) || category.includes(cleanQuery) || description.includes(cleanQuery);
  });
}

export const filterStoryTests = [
  {
    name: "returns all stories when search is empty",
    actual: filterStories(stories, "").length,
    expected: 3
  },
  {
    name: "finds Joash story by title",
    actual: filterStories(stories, "joash").map((story) => story.title),
    expected: ["Joash and the Brave Priest"]
  },
  {
    name: "finds Bible Animation by category",
    actual: filterStories(stories, "animation").length,
    expected: 2
  }
];

export default function KidsStoriesWebsite() {
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [bibleChapter, setBibleChapter] = useState<BibleChapter | null>(null);
  const [isBibleLoading, setIsBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState("");
  const [selectedTestament, setSelectedTestament] = useState<"Old Testament" | "New Testament">("Old Testament");
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [librarySearch, setLibrarySearch] = useState("");
  const filteredStories = useMemo(() => filterStories(stories, search), [search]);

  const currentBooks = bibleLibrary.find((section) => section.testament === selectedTestament)?.books || [];
  const currentBook = currentBooks.find((book) => book.name === selectedBook) || currentBooks[0];
  const currentChapters = getChapterNumbers(currentBook?.name || selectedBook, selectedTestament);
  const currentVideos = getVideosForChapter(selectedTestament, selectedBook, selectedChapter);
  const searchResults = bibleVideos.filter((video) => {
  const search = librarySearch.toLowerCase();

  return (
    video.title.toLowerCase().includes(search) ||
    video.book.toLowerCase().includes(search) ||
    video.passage.toLowerCase().includes(search) ||
    video.description.toLowerCase().includes(search)
  );
});
  const currentReading = currentVideos[0];
  const selectedPassage = `${selectedBook} ${selectedChapter}`;
  const chapterTeaching = useMemo(
    () => generateChapterTeaching(bibleChapter, selectedPassage, currentReading),
    [bibleChapter, selectedPassage, currentReading]
  );

  function handleTestamentChange(testament: "Old Testament" | "New Testament") {
    const section = bibleLibrary.find((item) => item.testament === testament);
    const firstBook = section?.books[0];
    setSelectedTestament(testament);
    setSelectedBook(firstBook?.name || "");
    setSelectedChapter(1);
  }

  function handleBookChange(bookName: string) {
    currentBooks.find((item) => item.name === bookName);
    setSelectedBook(bookName);
    setSelectedChapter(1);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadBibleChapter() {
      setIsBibleLoading(true);
      setBibleError("");
      setBibleChapter(null);

      try {
        const reference = encodeURIComponent(`${selectedBook} ${selectedChapter}`);
        const response = await fetch(`https://bible-api.com/${reference}?translation=kjv`);

        if (!response.ok) {
          throw new Error("Bible passage could not be loaded");
        }

        const data = await response.json();

        if (!isMounted) return;

        setBibleChapter({
          reference: data.reference || `${selectedBook} ${selectedChapter}`,
          verses: Array.isArray(data.verses)
            ? data.verses.map((verse: { verse: number; text: string }) => ({
                verse: verse.verse,
                text: verse.text
              }))
            : []
        });
      } catch {
        if (!isMounted) return;
        setBibleError("Bible text is not available right now. Please check your internet connection or try again later.");
      } finally {
        if (isMounted) {
          setIsBibleLoading(false);
        }
      }
    }

    loadBibleChapter();

    return () => {
      isMounted = false;
    };
  }, [selectedBook, selectedChapter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-sky-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="block">
            <h1 className="text-2xl font-bold text-orange-600">KidsStories</h1>
            <p className="text-xs text-slate-500">kidsstories.com.ng</p>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/videos" className="hover:text-orange-600">Videos</a>
            <a href="#stories" className="hover:text-orange-600">Stories</a>
            <a href="#upload" className="hover:text-orange-600">Upload</a>
            <a href="#about" className="hover:text-orange-600">About</a>
            <a href="#contact" className="hover:text-orange-600">Contact</a>
          </nav>

          <a
            href="/videos"
            className="hidden md:inline-flex rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3 text-white font-semibold items-center justify-center"
          >
            Watch Videos
          </a>
          <Icon name="menu" className="md:hidden text-slate-800" />
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <Icon name="star" size={16} /> Produced by JanetBambiStudio
          </p>

          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
            Bible Stories Animations for Children
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            A safe and joyful Christian platform for uploading, watching, and sharing animated Bible stories, video contents, songs, lessons, and inspiring children’s faith-based media.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/videos"
              className="rounded-2xl px-7 py-4 bg-orange-500 hover:bg-orange-600 text-base text-white font-semibold inline-flex items-center justify-center"
            >
              <Icon name="play" className="mr-2" /> Start Watching
            </a>
            <a
              href="#upload"
              className="rounded-2xl px-7 py-4 border border-orange-300 bg-white text-slate-900 hover:bg-orange-50 text-base font-semibold inline-flex items-center justify-center"
            >
              <Icon name="upload" className="mr-2" /> Upload Content
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
          <div className="relative bg-white rounded-[2rem] shadow-2xl p-6 border">
            <div className="aspect-video rounded-[1.5rem] overflow-hidden shadow-lg bg-orange-100">
              <img
                src="/banner.jpg"
                alt="Kids Bible Stories"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
              <div className="bg-yellow-50 rounded-2xl p-3 font-semibold">Animations</div>
              <div className="bg-sky-50 rounded-2xl p-3 font-semibold">Videos</div>
              <div className="bg-green-50 rounded-2xl p-3 font-semibold">Songs</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <a
              key={category}
              href="/videos"
              className="rounded-full bg-white border px-5 py-3 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-3">Bible Video Library</h2>
        <p className="text-slate-600 mb-8">
          Choose a Testament, Bible book, and chapter. The Bible reading and children’s animation will appear together.
        </p>

        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Search Bible Videos
          </label>

          <input
            value={librarySearch}
            onChange={(e) => setLibrarySearch(e.target.value)}
            placeholder="Search Ezra, Nehemiah, Genesis 16, Hagar..."
            className="w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {librarySearch && (
          <div className="mb-8 bg-orange-50 rounded-3xl border p-4">
            <p className="text-sm font-bold text-orange-700 mb-3">
              Search Results
            </p>

            <div className="space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map((video) => (
                  <button
                    key={`${video.book}-${video.chapter}-${video.title}`}
                    onClick={() => {
                      setSelectedTestament(video.testament);
                      setSelectedBook(video.book);
                      setSelectedChapter(video.chapter);
                      setLibrarySearch("");
                    }}
                    className="w-full text-left bg-white border rounded-2xl p-4 hover:bg-orange-100 transition"
                  >
                    <span className="block font-bold">
                      {video.book} Chapter {video.chapter}
                    </span>

                    <span className="block text-sm text-slate-500 mt-1">
                      {video.title}
                    </span>

                    <span className="block text-xs text-orange-600 font-semibold mt-1">
                      {video.passage}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-slate-500">
                  No uploaded video found.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] border shadow-sm p-5 lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-900 mb-4">1. Choose Testament</h3>
            <div className="grid gap-3">
              {["Old Testament", "New Testament"].map((testament) => (
                <button
                  key={testament}
                  onClick={() => handleTestamentChange(testament as "Old Testament" | "New Testament")}
                  className={`rounded-2xl px-4 py-3 text-left font-semibold border transition ${
                    selectedTestament === testament
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-orange-50 text-slate-700 hover:bg-orange-100"
                  }`}
                >
                  {testament}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">2. Choose Book</h3>
            <div className="grid gap-3 max-h-80 overflow-y-auto pr-1">
             {Object.entries(
  currentBooks.reduce<Record<string, typeof currentBooks>>((groups, book) => {
    const group = getBookGroup(book.name);

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(book);
    return groups;
  }, {})
).map(([group, books]) => (
  <div key={group} className="mb-5">
    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
      {group}
    </p>

    <div className="grid gap-3">
      {books.map((book) => {
        const uploaded = getUploadedCount(selectedTestament, book.name);

        return (
          <button
            key={book.name}
            onClick={() => handleBookChange(book.name)}
            className={`rounded-2xl px-4 py-3 text-left font-semibold border transition ${
              selectedBook === book.name
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-sky-50 text-slate-700 hover:bg-sky-100"
            }`}
          >
            <span className="block">{book.name}</span>
            <span className="block text-xs opacity-80 mt-1">
              {uploaded}/{book.chapterCount} chapters uploaded
            </span>
          </button>
        );
      })}
    </div>
  </div>
))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border shadow-sm p-5 lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-orange-600">{selectedTestament}</p>
                <h3 className="text-2xl font-bold text-slate-900">{selectedBook}</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">3. Choose Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(event) => setSelectedChapter(Number(event.target.value))}
                  className="rounded-2xl border px-4 py-3 bg-white font-semibold"
                >
                  {currentChapters.map((chapter) => (
                    <option key={chapter} value={chapter}>
                      Chapter {chapter}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-3xl overflow-hidden bg-black shadow-lg aspect-video flex items-center justify-center">
                {currentReading ? (
                  <iframe
                    className="w-full h-full"
                    src={currentReading.embed}
                    title={currentReading.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center text-white p-8">
                    <Icon name="book" className="mx-auto mb-4 text-orange-300" size={56} />
                    <h4 className="text-2xl font-bold">Animation Coming Soon</h4>
                    <p className="mt-2 text-slate-300">A video for {selectedPassage} will appear here once uploaded.</p>
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-orange-50 border p-6 max-h-[520px] overflow-y-auto">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-2">Bible Reading</p>
                <h4 className="text-xl font-bold text-slate-900">{bibleChapter?.reference || selectedPassage}</h4>

                {isBibleLoading && (
                  <p className="mt-4 text-slate-600">Loading Bible chapter...</p>
                )}

                {bibleError && (
                  <div className="mt-4 rounded-2xl bg-white border p-4">
                    <p className="text-slate-700">{bibleError}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      You can still add your child-friendly Bible summary, lesson, and animation for {selectedPassage}.
                    </p>
                  </div>
                )}

                {bibleChapter && bibleChapter.verses.length > 0 && (
                  <div className="mt-4 space-y-3 text-left">
                    {bibleChapter.verses.map((verse) => (
                      <p key={verse.verse} className="leading-relaxed text-slate-700">
                        <sup className="font-bold text-orange-600 mr-1">{verse.verse}</sup>
                        {verse.text.trim()}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-white border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700 mb-2">Chapter Summary</p>
                  <p className="text-slate-700 leading-relaxed">{chapterTeaching.summary}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-white border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">Children’s Lesson</p>
                  <p className="text-slate-700 leading-relaxed">{chapterTeaching.lesson}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-white border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-purple-700 mb-2">Memory Verse</p>
                  <p className="text-slate-700 leading-relaxed font-semibold">{chapterTeaching.memoryVerse}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-white border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-700 mb-2">Prayer</p>
                  <p className="text-slate-700 leading-relaxed">{chapterTeaching.prayer}</p>
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-500">{currentReading?.age || "Recommended age will be added with the animation."}</p>
              </div>
            </div>

            {currentVideos.length > 1 && (
              <div className="mt-8">
                <h4 className="font-bold text-lg mb-4">More videos in this chapter</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {currentVideos.map((video) => (
                    <button
                      key={video.title}
                      onClick={() => setSelectedVideo(video)}
                      className="text-left bg-white border rounded-3xl overflow-hidden hover:shadow-lg transition"
                    >
                      <img src={video.image} alt={video.title} className="h-32 w-full object-cover" />
                      <div className="p-4">
                        <p className="font-bold">{video.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{video.passage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2rem] border shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900">Why KidsStories Exists</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            KidsStories was created to help children learn Bible stories in a simple, joyful, and age-appropriate way. Every story is designed to point children to faith, obedience, prayer, kindness, courage, and trust in God.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="rounded-3xl bg-orange-50 p-6">
              <h3 className="font-bold text-lg text-orange-700">For Children</h3>
              <p className="mt-2 text-slate-600">Short, colorful, and easy-to-understand Bible lessons for young hearts.</p>
            </div>
            <div className="rounded-3xl bg-sky-50 p-6">
              <h3 className="font-bold text-lg text-sky-700">For Parents</h3>
              <p className="mt-2 text-slate-600">Safe Christian video content that families can watch and discuss together.</p>
            </div>
            <div className="rounded-3xl bg-green-50 p-6">
              <h3 className="font-bold text-lg text-green-700">For Churches</h3>
              <p className="mt-2 text-slate-600">Helpful Bible story ideas for Sabbath School, children’s ministry, and family worship.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="stories" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Children’s Bible Stories</h2>
            <p className="text-slate-600 mt-2">Watch inspiring, colorful, and age-appropriate Bible animations.</p>
          </div>

          <div className="relative max-w-sm w-full">
            <Icon name="search" className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search stories..."
              aria-label="Search stories"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.title} className="rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-orange-100 to-sky-100 flex items-center justify-center">
                <Icon name="play" size={56} className="text-orange-500" />
              </div>
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600">{story.category}</p>
                <h3 className="text-xl font-bold mt-2">{story.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{story.age}</p>
                <p className="text-slate-600 mt-4">{story.description}</p>
                <a
                  href="/videos"
                  className="mt-5 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-3 text-white font-semibold inline-flex items-center justify-center"
                >
                  Watch Now
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="mt-8 rounded-3xl border bg-white p-8 text-center text-slate-600">
            No story matched your search. Try another Bible character, topic, or category.
          </div>
        )}
      </section>

      <section id="upload" className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-[2rem] shadow-xl border p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">Suggest a Bible Story or Video</h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              KidsStories is currently curated by JanetBambiStudio. Visitors may suggest Bible stories, children’s songs, animation ideas, or YouTube video links for possible review and inclusion.
            </p>
            <div className="mt-6 flex items-start gap-3 text-slate-700">
              <Icon name="shield" className="text-green-600 mt-1 shrink-0" />
              <p>For children’s safety, suggested content will be reviewed before it is considered for the website.</p>
            </div>
          </div>

          <form
            action="https://formspree.io/f/xaqvkdoq"
            method="POST"
            className="bg-slate-50 rounded-3xl p-6 space-y-4"
          >
            <input name="name" className="w-full p-3 rounded-2xl border" placeholder="Your name" aria-label="Your name" required />
            <input name="email" type="email" className="w-full p-3 rounded-2xl border" placeholder="Email address" aria-label="Email address" required />
            <input name="title" className="w-full p-3 rounded-2xl border" placeholder="Suggested story or video title" aria-label="Suggested story or video title" required />
            <select name="category" className="w-full p-3 rounded-2xl border bg-white" aria-label="Content category">
              <option>Old Testament Story</option>
              <option>New Testament Story</option>
              <option>Children&apos;s Bible Song</option>
              <option>Memory Verse</option>
              <option>Bedtime Bible Story</option>
              <option>Other Christian Children&apos;s Content</option>
            </select>
            <input
              name="videoLink"
              type="url"
              className="w-full p-3 rounded-2xl border"
              placeholder="Optional YouTube or video link"
              aria-label="Optional YouTube or video link"
            />
            <textarea
              name="message"
              className="w-full p-3 rounded-2xl border min-h-32"
              placeholder="Tell us why this suggestion will bless children"
              aria-label="Suggestion message"
              required
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 transition"
            >
              Send Suggestion
            </button>
          </form>
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          ["Bible-Based", "Stories are designed to help children know God, love the Bible, and develop godly values."],
          ["Child-Friendly", "Simple language, bright visuals, and safe content for children, families, churches, and schools."],
          ["Creative Ministry", "A platform for Christian animation, storytelling, songs, and digital evangelism for children."]
        ].map(([title, text]) => (
          <Card key={title} className="rounded-3xl shadow-md">
            <CardContent className="p-7">
              <h3 className="text-xl font-bold text-orange-600">{title}</h3>
              <p className="text-slate-600 mt-3 leading-relaxed">{text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="contact" className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Icon name="mail" className="mx-auto mb-4" size={44} />
          <h2 className="text-3xl font-bold">Partner With JanetBambiStudio</h2>
          <p className="mt-4 max-w-2xl mx-auto text-orange-50">
            For children’s Bible animations, video uploads, partnerships, and Christian media productions, connect with KidsStories today.
          </p>
          <form
            action="https://formspree.io/f/xaqvkdoq"
            method="POST"
            className="mt-8 max-w-xl mx-auto bg-white text-slate-900 rounded-3xl p-6 space-y-4"
          >
            <input name="name" className="w-full p-3 rounded-2xl border" placeholder="Your name" required />
            <input name="email" type="email" className="w-full p-3 rounded-2xl border" placeholder="Email address" required />
            <textarea name="message" className="w-full p-3 rounded-2xl border min-h-32" placeholder="Your message" required />
            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-6xl w-full shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                <p className="text-sm text-slate-500">{selectedVideo.passage} • {selectedVideo.age}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-0">
              <div className="lg:col-span-2 aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={selectedVideo.embed}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="p-6 bg-orange-50 text-slate-800">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-2">Bible Passage</p>
                <p className="font-bold text-slate-800">{selectedVideo.passage}</p>

                <div className="mt-5 rounded-2xl bg-white border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-2">Video Description</p>
                  <p className="leading-relaxed text-slate-700">{selectedVideo.description}</p>
                </div>

                <div className="mt-5 rounded-2xl bg-white border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">Bible Lesson</p>
                  <p className="leading-relaxed text-slate-700">{selectedVideo.lesson}</p>
                </div>

                <a
                  href="/videos"
                  className="mt-5 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-3 text-white font-semibold inline-flex items-center justify-center"
                >
                  More Videos
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <p>© 2026 KidsStories.com.ng. All rights reserved.</p>
          <p>Produced by JanetBambiStudio</p>
        </div>
      </footer>
    </div>
  );
}