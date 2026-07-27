export type Testament = "Old Testament" | "New Testament";

export type Video = {
  title: string;
  image: string;
  link: string;
  embed: string;
  description: string;
  lesson: string;
  age: string;
  testament: Testament;
  book: string;
  chapter: number;
  passage: string;
  passageReading: string;
};

export type BibleBookSection = {
  testament: Testament;
  books: {
    name: string;
    chapterCount: number;
  }[];
};

export type BibleVerse = {
  verse: number;
  text: string;
};

export type BibleChapter = {
  reference: string;
  verses: BibleVerse[];
};

export type ChapterTeaching = {
  summary: string;
  lesson: string;
  memoryVerse: string;
  prayer: string;
};
export type BibleStory = {
  id: string;
  title: string;
  image: string;
  link: string;
  embed: string;
  description: string;
  lesson: string;
  memoryVerse: string;
  prayer: string;
  age: string;
  testament: "Old Testament" | "New Testament";
  book: string;
  passage: string;
  passageReading: string;
};