import { BibleChapter, ChapterTeaching, Testament, Video } from "@/types";
import { bibleBookCatalog } from "@/data/bibleBooks";
import { bibleVideos } from "@/data/bibleVideos";

export function getChapterNumbers(bookName: string, testament: Testament): number[] {
  const section = bibleBookCatalog.find((item) => item.testament === testament);
  const book = section?.books.find((item) => item.name === bookName);
  const chapterCount = book?.chapterCount || 1;

  return Array.from({ length: chapterCount }, (_, index) => index + 1);
}

export function getVideosForChapter(testament: Testament, book: string, chapter: number): Video[] {
  return bibleVideos.filter(
    (video) => video.testament === testament && video.book === book && video.chapter === chapter
  );
}

export function generateChapterTeaching(
  chapter: BibleChapter | null,
  selectedPassage: string,
  currentVideo?: Video
): ChapterTeaching {
  if (!chapter || chapter.verses.length === 0) {
    return {
      summary:
        currentVideo?.passageReading ||
        `A child-friendly summary for ${selectedPassage} will appear here once the Bible reading loads.`,
      lesson:
        currentVideo?.lesson ||
        "Children will learn to listen to God, trust Him, obey His word, and live with kindness and courage.",
      memoryVerse: selectedPassage,
      prayer:
        "Dear God, help me to understand Your word, love You more, and obey You every day. Amen.",
    };
  }

  const firstVerse = chapter.verses[0];
  const selectedMemoryVerse =
    chapter.verses.find((verse) => verse.text.length <= 150) || firstVerse;

  return {
    summary:
      currentVideo?.passageReading ||
      `${chapter.reference} teaches an important Bible message. It helps children learn about God, faith, obedience, and trust.`,
    lesson:
      currentVideo?.lesson ||
      `Children can learn from ${chapter.reference} that God wants us to trust Him, listen carefully to His word, and choose what is right.`,
    memoryVerse: `${chapter.reference}:${selectedMemoryVerse.verse} — ${selectedMemoryVerse.text.trim()}`,
    prayer: `Dear God, thank You for the message in ${chapter.reference}. Help me to understand Your word, trust You, obey You, and share Your love with others. Amen.`,
  };
}