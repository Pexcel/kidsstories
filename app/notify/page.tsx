"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ContentType = "" | "prayer" | "story" | "chapter" | "bible";
type Prayer = { id: string; title: string; scripture?: string; description?: string };
type Story = { id: string; title: string; passage?: string; description?: string };
type Video = { title: string; book: string; chapter: number; passage?: string; description?: string };

const BIBLE_BOOKS: { name: string; chapters: number }[] = [
  ["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],
  ["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],
  ["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],
  ["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],
  ["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],
  ["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],
  ["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],
  ["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],["Matthew",28],
  ["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],
  ["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],
  ["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],
  ["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],
  ["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]
].map(([name, chapters]) => ({ name: String(name), chapters: Number(chapters) }));

export default function NotifyPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [contentType, setContentType] = useState<ContentType>("");
  const [contentId, setContentId] = useState("");
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [selectedPrayerId, setSelectedPrayerId] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const [selectedVideoKey, setSelectedVideoKey] = useState("");
  const [bibleBook, setBibleBook] = useState("Genesis");
  const [bibleChapter, setBibleChapter] = useState(1);

  useEffect(() => {
    async function loadContent() {
      try {
        const [pRes, sRes, vRes] = await Promise.all([
          fetch("/api/prayers", { cache: "no-store" }),
          fetch("/api/stories", { cache: "no-store" }),
          fetch("/api/videos", { cache: "no-store" }),
        ]);
        const [p, s, v] = await Promise.all([pRes.json(), sRes.json(), vRes.json()]);
        setPrayers(Array.isArray(p.prayers) ? p.prayers : []);
        setStories(Array.isArray(s.stories) ? s.stories : []);
        setVideos(Array.isArray(v.videos) ? v.videos : []);
      } catch {
        setStatus("The page opened, but the published-content lists could not be loaded. Refresh and try again.");
      } finally {
        setLoadingContent(false);
      }
    }
    loadContent();
  }, []);

  const selectedBibleBook = useMemo(
    () => BIBLE_BOOKS.find((book) => book.name === bibleBook),
    [bibleBook]
  );

  function resetSelection(type: ContentType) {
    setContentType(type);
    setContentId("");
    setSelectedPrayerId("");
    setSelectedStoryId("");
    setSelectedVideoKey("");
    setStatus("");
    if (type === "") {
      setTitle("");
      setBody("");
    }
    if (type === "bible") {
      setBibleBook("Genesis");
      setBibleChapter(1);
      setContentId("Genesis|1");
      setTitle("Read Genesis 1");
      setBody("Open Animated Bible TV and read Genesis chapter 1.");
    }
  }

  function selectPrayer(id: string) {
    setSelectedPrayerId(id);
    setContentId(id);
    const prayer = prayers.find((item) => item.id === id);
    if (!prayer) return;
    setTitle(prayer.title || "New Prayer Available");
    setBody(
      prayer.scripture
        ? `A new Scripture-based prayer from ${prayer.scripture} is now available.`
        : "A new Scripture-based prayer is now available."
    );
  }

  function selectStory(id: string) {
    setSelectedStoryId(id);
    setContentId(id);
    const story = stories.find((item) => item.id === id);
    if (!story) return;
    setTitle(story.title || "New Bible Story");
    setBody(
      story.passage
        ? `A new Bible story from ${story.passage} is now available on Animated Bible TV.`
        : "A new Bible story is now available on Animated Bible TV."
    );
  }

  function selectVideo(key: string) {
    setSelectedVideoKey(key);
    const split = key.lastIndexOf("|");
    const book = key.substring(0, split);
    const chapter = Number(key.substring(split + 1));
    setContentId(`${book}|${chapter}`);
    const video = videos.find((item) => item.book === book && Number(item.chapter) === chapter);
    setTitle(video?.title ? `${book} ${chapter}: ${video.title}` : `${book} ${chapter}`);
    setBody(`A new animated Bible chapter from ${book} ${chapter} is ready to watch on Animated Bible TV.`);
  }

  function updateBible(book: string, chapter: number) {
    setBibleBook(book);
    setBibleChapter(chapter);
    setContentId(`${book}|${chapter}`);
    setTitle(`Read ${book} ${chapter}`);
    setBody(`Open Animated Bible TV and read ${book} chapter ${chapter}.`);
  }

  async function sendNotification(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-notify-secret": secret.trim(),
        },
        body: JSON.stringify({ title, body, contentType, contentId, secret: secret.trim() }),
      });

      const raw = await response.text();
      let result: any = {};
      try { result = JSON.parse(raw); } catch { result = { error: raw }; }

      if (!response.ok || !result.success) {
        setStatus(`ERROR ${response.status}: ${result.error || result.message || raw || "Unknown server error"}`);
        return;
      }

      setStatus("SUCCESS: Notification sent successfully.");
      setTitle("");
      setBody("");
      setContentType("");
      setContentId("");
      setSelectedPrayerId("");
      setSelectedStoryId("");
      setSelectedVideoKey("");
    } catch (error) {
      setStatus(`BROWSER ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Animated Bible TV Admin</p>
        <h1 className="mt-2 text-3xl font-bold">Send App Notification</h1>
        <p className="mt-2 text-slate-600">Select published content and send a notification to app users.</p>
      </div>

      <form onSubmit={sendNotification} className="space-y-6 rounded-3xl border bg-white p-6 shadow-sm">
        <label className="block">
          <span className="font-semibold">What should open when the notification is tapped?</span>
          <select
            value={contentType}
            onChange={(e) => resetSelection(e.target.value as ContentType)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          >
            <option value="">Just open the app</option>
            <option value="prayer">Prayer</option>
            <option value="story">Bible Story</option>
            <option value="chapter">Animated Chapter</option>
            <option value="bible">Bible Reading</option>
          </select>
        </label>

        {contentType === "prayer" && (
          <label className="block">
            <span className="font-semibold">Choose prayer</span>
            <select
              value={selectedPrayerId}
              onChange={(e) => selectPrayer(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              disabled={loadingContent}
              required
            >
              <option value="">{loadingContent ? "Loading prayers..." : "Select a prayer"}</option>
              {prayers.map((prayer) => (
                <option key={prayer.id} value={prayer.id}>
                  {prayer.title}{prayer.scripture ? ` — ${prayer.scripture}` : ""}
                </option>
              ))}
            </select>
          </label>
        )}

        {contentType === "story" && (
          <label className="block">
            <span className="font-semibold">Choose Bible story</span>
            <select
              value={selectedStoryId}
              onChange={(e) => selectStory(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              disabled={loadingContent}
              required
            >
              <option value="">{loadingContent ? "Loading stories..." : "Select a story"}</option>
              {stories.map((story) => (
                <option key={story.id} value={story.id}>
                  {story.title}{story.passage ? ` — ${story.passage}` : ""}
                </option>
              ))}
            </select>
          </label>
        )}

        {contentType === "chapter" && (
          <label className="block">
            <span className="font-semibold">Choose animated chapter</span>
            <select
              value={selectedVideoKey}
              onChange={(e) => selectVideo(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
              disabled={loadingContent}
              required
            >
              <option value="">{loadingContent ? "Loading chapters..." : "Select a chapter"}</option>
              {[...videos]
                .sort((a, b) => a.book.localeCompare(b.book) || Number(a.chapter) - Number(b.chapter))
                .map((video) => {
                  const key = `${video.book}|${video.chapter}`;
                  return (
                    <option key={key} value={key}>
                      {video.book} {video.chapter}{video.title ? ` — ${video.title}` : ""}
                    </option>
                  );
                })}
            </select>
          </label>
        )}

        {contentType === "bible" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-semibold">Bible book</span>
              <select
                value={bibleBook}
                onChange={(e) => updateBible(e.target.value, 1)}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                {BIBLE_BOOKS.map((book) => <option key={book.name} value={book.name}>{book.name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="font-semibold">Chapter</span>
              <select
                value={bibleChapter}
                onChange={(e) => updateBible(bibleBook, Number(e.target.value))}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                {Array.from({ length: selectedBibleBook?.chapters ?? 1 }, (_, i) => i + 1).map((chapter) => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        <label className="block">
          <span className="font-semibold">Notification title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            placeholder="New Prayer: Psalm 3"
            maxLength={100}
            required
          />
        </label>

        <label className="block">
          <span className="font-semibold">Message</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 min-h-28 w-full rounded-xl border px-4 py-3"
            placeholder="A new Scripture-based prayer is now available."
            maxLength={300}
            required
          />
          <span className="mt-1 block text-right text-xs text-slate-500">{body.length}/300</span>
        </label>

        {contentType !== "" && (
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">App destination</div>
            <div className="mt-1 font-mono text-sm">{contentType} → {contentId || "Select content above"}</div>
          </div>
        )}

        <label className="block">
          <span className="font-semibold">Notification secret</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            placeholder="Your private NOTIFY_SECRET"
            autoComplete="current-password"
            required
          />
          <small className="mt-1 block text-slate-500">
            This is sent only to the protected server API and is not saved by this page.
          </small>
        </label>

        <button
          type="submit"
          disabled={sending || !title.trim() || !body.trim() || (contentType !== "" && !contentId)}
          className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>

        {status && (
          <div className={`rounded-xl p-4 text-sm ${status.startsWith("SUCCESS") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {status}
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Notifications are sent to the Animated Bible TV <span className="font-mono">all_users</span> Firebase topic.
      </p>
    </main>
  );
}