import { bibleVideos } from "@/data/bibleVideos";
import { Testament } from "@/types";

export function getUploadedCount(testament: Testament, book: string): number {
  const chapters = new Set(
    bibleVideos
      .filter((video) => video.testament === testament && video.book === book)
      .map((video) => video.chapter)
  );

  return chapters.size;
}

export function getBookGroup(book: string): string {
  const groups: Record<string, string[]> = {
    "Pentateuch": ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    "Historical Books": ["Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"],
    "Poetry & Wisdom": ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"],
    "Major Prophets": ["Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel"],
    "Minor Prophets": ["Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"],
    "Gospels": ["Matthew", "Mark", "Luke", "John"],
    "History": ["Acts"],
    "Pauline Epistles": ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"],
    "General Epistles": ["Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude"],
    "Prophecy": ["Revelation"],
  };

  for (const [group, books] of Object.entries(groups)) {
    if (books.includes(book)) return group;
  }

  return "Other Books";
}