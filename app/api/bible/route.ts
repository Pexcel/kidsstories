type BibleApiVerse = {
  book_id?: string;
  book_name?: string;
  chapter: number;
  verse: number;
  text: string;
};

type BibleApiResponse = {
  reference?: string;
  verses?: BibleApiVerse[];
  text?: string;
  translation_id?: string;
  translation_name?: string;
  translation_note?: string;
  error?: string;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const book = requestUrl.searchParams.get("book")?.trim();
  const chapter = requestUrl.searchParams.get("chapter")?.trim();

  if (!book || !chapter) {
    return Response.json(
      {
        success: false,
        message: "The book and chapter parameters are required.",
      },
      { status: 400 }
    );
  }

  const chapterNumber = Number(chapter);

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    return Response.json(
      {
        success: false,
        message: "The chapter must be a valid positive number.",
      },
      { status: 400 }
    );
  }

  const reference = `${book} ${chapterNumber}`;

  try {
    const bibleResponse = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=web`,
      {
        cache: "no-store",
      }
    );

    const bibleData =
      (await bibleResponse.json()) as BibleApiResponse;

    if (!bibleResponse.ok || bibleData.error) {
      return Response.json(
        {
          success: false,
          message:
            bibleData.error ||
            `Unable to find ${reference}.`,
        },
        { status: bibleResponse.status || 404 }
      );
    }

    const verses = (bibleData.verses || []).map((verse) => ({
      verse: verse.verse,
      text: verse.text.trim(),
    }));

    return Response.json({
      success: true,
      reference: bibleData.reference || reference,
      translation: bibleData.translation_name || "World English Bible",
      translationId: bibleData.translation_id || "web",
      verses,
    });
  } catch (error) {
    console.error("Bible API error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to load the Bible passage at this time.",
      },
      { status: 500 }
    );
  }
}