export type OfflineBibleVerse = {
  verse: number;
  text: string;
};

export type OfflineBibleChapter = {
  reference: string;
  translation: string;
  translationId: string;
  verses: OfflineBibleVerse[];
};

const BOOK_NAMES = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation"
];

type BibleIndex = Record<
  string,
  Record<number, OfflineBibleVerse[]>
>;

let memoryBible: BibleIndex | null = null;

const DB_NAME = "animated-bible-tv";
const DB_VERSION = 1;
const STORE_NAME = "offline-assets";
const BIBLE_KEY = "kjv-full-bible";

function normalizeBookName(book: string) {
  return book
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (
    typeof window === "undefined" ||
    !("indexedDB" in window)
  ) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (
        !db.objectStoreNames.contains(STORE_NAME)
      ) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () =>
      resolve(request.result);

    request.onerror = () =>
      reject(request.error);
  });
}

async function loadStoredBible():
  Promise<BibleIndex | null> {
  try {
    const db = await openDatabase();

    if (!db) return null;

    return await new Promise((resolve) => {
      const transaction = db.transaction(
        STORE_NAME,
        "readonly"
      );

      const store =
        transaction.objectStore(STORE_NAME);

      const request = store.get(BIBLE_KEY);

      request.onsuccess = () => {
        resolve(
          (request.result as BibleIndex) || null
        );
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveBible(
  bible: BibleIndex
): Promise<void> {
  try {
    const db = await openDatabase();

    if (!db) return;

    await new Promise<void>((resolve) => {
      const transaction = db.transaction(
        STORE_NAME,
        "readwrite"
      );

      transaction
        .objectStore(STORE_NAME)
        .put(bible, BIBLE_KEY);

      transaction.oncomplete = () =>
        resolve();

      transaction.onerror = () =>
        resolve();
    });
  } catch {
    // Bible still remains available in memory.
  }
}

function createBibleIndex(
  json: unknown
): BibleIndex {
  const result: BibleIndex = {};

  const root = json as {
    resultset?: {
      row?: Array<{
        field?: unknown[];
      }>;
    };
  };

  const rows = root?.resultset?.row;

  if (!Array.isArray(rows)) {
    throw new Error(
      "The KJV Bible file has an unsupported format."
    );
  }

  for (const row of rows) {
    const field = row?.field;

    if (
      !Array.isArray(field) ||
      field.length < 5
    ) {
      continue;
    }

    const bookNumber = Number(field[1]);
    const chapter = Number(field[2]);
    const verse = Number(field[3]);
    const text = String(field[4] || "").trim();

    if (
      bookNumber < 1 ||
      bookNumber > 66 ||
      chapter < 1 ||
      verse < 1 ||
      !text
    ) {
      continue;
    }

    const book =
      BOOK_NAMES[bookNumber - 1];

    const bookKey =
      normalizeBookName(book);

    if (!result[bookKey]) {
      result[bookKey] = {};
    }

    if (!result[bookKey][chapter]) {
      result[bookKey][chapter] = [];
    }

    result[bookKey][chapter].push({
      verse,
      text
    });
  }

  for (const book of Object.values(result)) {
    for (
      const verses of Object.values(book)
    ) {
      verses.sort(
        (a, b) => a.verse - b.verse
      );
    }
  }

  return result;
}

async function loadBible():
  Promise<BibleIndex> {
  if (memoryBible) {
    return memoryBible;
  }

  const storedBible =
    await loadStoredBible();

  if (storedBible) {
    memoryBible = storedBible;
    return storedBible;
  }

  const response = await fetch(
    "/bible/kjv.json",
    {
      cache: "force-cache"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Offline Bible could not be loaded."
    );
  }

  const json = await response.json();

  const bible =
    createBibleIndex(json);

  memoryBible = bible;

  await saveBible(bible);

  return bible;
}

export async function getBibleChapter(
  book: string,
  chapter: number
): Promise<OfflineBibleChapter> {
  const bible = await loadBible();

  const bookKey =
    normalizeBookName(book);

  const verses =
    bible[bookKey]?.[chapter];

  if (!verses || verses.length === 0) {
    throw new Error(
      `${book} ${chapter} was not found in the offline Bible.`
    );
  }

  return {
    reference: `${book} ${chapter}`,
    translation: "King James Version",
    translationId: "KJV",
    verses
  };
}