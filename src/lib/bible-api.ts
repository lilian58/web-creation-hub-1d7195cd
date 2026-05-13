/**
 * Import de la Bible via APIs publiques gratuites.
 *
 * Sources supportées :
 *  - bible-api.com  : pas de clé, traductions limitées (LSG fr, KJV/WEB en, etc.)
 *  - api.getbible.net (v2) : pas de clé, ~200 traductions, JSON complet par version
 */
import type { BibleVerse } from "@/lib/bible-store";

export type BibleApiSource = "bible-api" | "getbible";

export interface BibleApiTranslation {
  id: string;        // identifiant à passer dans l'URL
  name: string;      // nom lisible
  language: string;  // ex: "fr", "en"
  code: string;      // code court suggéré (ex: "LSG")
}

export interface FetchBibleParams {
  source: BibleApiSource;
  translation: string;
  onProgress?: (pct: number, label?: string) => void;
  signal?: AbortSignal;
}

export interface FetchedBible {
  code: string;
  name: string;
  language: string;
  verses: BibleVerse[];
}

// ---------- bible-api.com --------------------------------------------------

// Liste des traductions stables et gratuites de bible-api.com
const BIBLE_API_TRANSLATIONS: BibleApiTranslation[] = [
  { id: "lsg1910",   name: "Louis Segond 1910 (FR)",         language: "fr", code: "LSG" },
  { id: "kjv",       name: "King James Version (EN)",        language: "en", code: "KJV" },
  { id: "web",       name: "World English Bible (EN)",       language: "en", code: "WEB" },
  { id: "bbe",       name: "Bible in Basic English (EN)",    language: "en", code: "BBE" },
  { id: "almeida",   name: "João Ferreira de Almeida (PT)",  language: "pt", code: "ALM" },
  { id: "rccv",      name: "Cornilescu (RO)",                language: "ro", code: "RCC" },
];

// Liste canonique des 66 livres avec nombre de chapitres
// (noms anglais — bible-api.com accepte ces identifiants pour toutes les traductions)
const CANONICAL_BOOKS: Array<{ slug: string; name: string; chapters: number }> = [
  { slug: "genesis", name: "Genèse", chapters: 50 },
  { slug: "exodus", name: "Exode", chapters: 40 },
  { slug: "leviticus", name: "Lévitique", chapters: 27 },
  { slug: "numbers", name: "Nombres", chapters: 36 },
  { slug: "deuteronomy", name: "Deutéronome", chapters: 34 },
  { slug: "joshua", name: "Josué", chapters: 24 },
  { slug: "judges", name: "Juges", chapters: 21 },
  { slug: "ruth", name: "Ruth", chapters: 4 },
  { slug: "1 samuel", name: "1 Samuel", chapters: 31 },
  { slug: "2 samuel", name: "2 Samuel", chapters: 24 },
  { slug: "1 kings", name: "1 Rois", chapters: 22 },
  { slug: "2 kings", name: "2 Rois", chapters: 25 },
  { slug: "1 chronicles", name: "1 Chroniques", chapters: 29 },
  { slug: "2 chronicles", name: "2 Chroniques", chapters: 36 },
  { slug: "ezra", name: "Esdras", chapters: 10 },
  { slug: "nehemiah", name: "Néhémie", chapters: 13 },
  { slug: "esther", name: "Esther", chapters: 10 },
  { slug: "job", name: "Job", chapters: 42 },
  { slug: "psalms", name: "Psaumes", chapters: 150 },
  { slug: "proverbs", name: "Proverbes", chapters: 31 },
  { slug: "ecclesiastes", name: "Ecclésiaste", chapters: 12 },
  { slug: "song of solomon", name: "Cantique des Cantiques", chapters: 8 },
  { slug: "isaiah", name: "Ésaïe", chapters: 66 },
  { slug: "jeremiah", name: "Jérémie", chapters: 52 },
  { slug: "lamentations", name: "Lamentations", chapters: 5 },
  { slug: "ezekiel", name: "Ézéchiel", chapters: 48 },
  { slug: "daniel", name: "Daniel", chapters: 12 },
  { slug: "hosea", name: "Osée", chapters: 14 },
  { slug: "joel", name: "Joël", chapters: 3 },
  { slug: "amos", name: "Amos", chapters: 9 },
  { slug: "obadiah", name: "Abdias", chapters: 1 },
  { slug: "jonah", name: "Jonas", chapters: 4 },
  { slug: "micah", name: "Michée", chapters: 7 },
  { slug: "nahum", name: "Nahum", chapters: 3 },
  { slug: "habakkuk", name: "Habacuc", chapters: 3 },
  { slug: "zephaniah", name: "Sophonie", chapters: 3 },
  { slug: "haggai", name: "Aggée", chapters: 2 },
  { slug: "zechariah", name: "Zacharie", chapters: 14 },
  { slug: "malachi", name: "Malachie", chapters: 4 },
  { slug: "matthew", name: "Matthieu", chapters: 28 },
  { slug: "mark", name: "Marc", chapters: 16 },
  { slug: "luke", name: "Luc", chapters: 24 },
  { slug: "john", name: "Jean", chapters: 21 },
  { slug: "acts", name: "Actes", chapters: 28 },
  { slug: "romans", name: "Romains", chapters: 16 },
  { slug: "1 corinthians", name: "1 Corinthiens", chapters: 16 },
  { slug: "2 corinthians", name: "2 Corinthiens", chapters: 13 },
  { slug: "galatians", name: "Galates", chapters: 6 },
  { slug: "ephesians", name: "Éphésiens", chapters: 6 },
  { slug: "philippians", name: "Philippiens", chapters: 4 },
  { slug: "colossians", name: "Colossiens", chapters: 4 },
  { slug: "1 thessalonians", name: "1 Thessaloniciens", chapters: 5 },
  { slug: "2 thessalonians", name: "2 Thessaloniciens", chapters: 3 },
  { slug: "1 timothy", name: "1 Timothée", chapters: 6 },
  { slug: "2 timothy", name: "2 Timothée", chapters: 4 },
  { slug: "titus", name: "Tite", chapters: 3 },
  { slug: "philemon", name: "Philémon", chapters: 1 },
  { slug: "hebrews", name: "Hébreux", chapters: 13 },
  { slug: "james", name: "Jacques", chapters: 5 },
  { slug: "1 peter", name: "1 Pierre", chapters: 5 },
  { slug: "2 peter", name: "2 Pierre", chapters: 3 },
  { slug: "1 john", name: "1 Jean", chapters: 5 },
  { slug: "2 john", name: "2 Jean", chapters: 1 },
  { slug: "3 john", name: "3 Jean", chapters: 1 },
  { slug: "jude", name: "Jude", chapters: 1 },
  { slug: "revelation", name: "Apocalypse", chapters: 22 },
];

export function listBibleApiTranslations(): BibleApiTranslation[] {
  return BIBLE_API_TRANSLATIONS;
}

interface BibleApiVerse { book_name?: string; chapter: number; verse: number; text: string }
interface BibleApiResponse { verses?: BibleApiVerse[]; error?: string }

async function fetchFromBibleApi(
  translation: string,
  onProgress?: FetchBibleParams["onProgress"],
  signal?: AbortSignal,
): Promise<FetchedBible> {
  const meta = BIBLE_API_TRANSLATIONS.find((t) => t.id === translation) ?? {
    id: translation, name: translation, language: "fr", code: translation.toUpperCase().slice(0, 6),
  };
  const verses: BibleVerse[] = [];
  const totalChapters = CANONICAL_BOOKS.reduce((s, b) => s + b.chapters, 0);
  let done = 0;

  for (const book of CANONICAL_BOOKS) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      if (signal?.aborted) throw new Error("Import annulé");
      const url = `https://bible-api.com/${encodeURIComponent(book.slug)}+${ch}?translation=${translation}`;
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`bible-api.com ${book.slug} ${ch} → ${res.status}`);
      const data = (await res.json()) as BibleApiResponse;
      if (data.error) throw new Error(data.error);
      for (const v of data.verses ?? []) {
        verses.push({ book: book.name, chapter: Number(v.chapter), verse: Number(v.verse), text: String(v.text).trim() });
      }
      done++;
      onProgress?.((done / totalChapters) * 100, `${book.name} ${ch}`);
    }
  }
  return { code: meta.code, name: meta.name, language: meta.language, verses };
}

// ---------- getbible.net v2 ------------------------------------------------

interface GetBibleTranslationsResp {
  [abbr: string]: {
    abbreviation: string;
    translation: string;
    language: string;
    lang: string;
    direction?: string;
  };
}

interface GetBibleVerse { chapter: number; verse: number; text: string; name?: string }
interface GetBibleChapter { book_name?: string; book_nr?: number; chapter: number; ref?: string; verses: GetBibleVerse[] }
interface GetBibleBook { name?: string; nr?: number; chapters?: GetBibleChapter[] }
interface GetBibleFull { translation?: string; abbreviation?: string; lang?: string; books?: GetBibleBook[] | Record<string, GetBibleBook> }

export async function listGetBibleTranslations(): Promise<BibleApiTranslation[]> {
  const res = await fetch("https://api.getbible.net/v2/translations.json");
  if (!res.ok) throw new Error(`getbible.net translations → ${res.status}`);
  const data = (await res.json()) as GetBibleTranslationsResp;
  return Object.values(data).map((t) => ({
    id: t.abbreviation,
    name: `${t.translation} (${t.language})`,
    language: (t.lang || "").toLowerCase().slice(0, 2) || "xx",
    code: t.abbreviation.toUpperCase().slice(0, 8),
  }));
}

async function fetchFromGetBible(
  translation: string,
  onProgress?: FetchBibleParams["onProgress"],
  signal?: AbortSignal,
): Promise<FetchedBible> {
  // L'endpoint /v2/{abbr}.json renvoie toute la traduction (rapide, 1 requête).
  onProgress?.(5, "Téléchargement…");
  const res = await fetch(`https://api.getbible.net/v2/${encodeURIComponent(translation)}.json`, { signal });
  if (!res.ok) throw new Error(`getbible.net ${translation} → ${res.status}`);
  const data = (await res.json()) as GetBibleFull;

  const booksArr: GetBibleBook[] = Array.isArray(data.books)
    ? data.books
    : Object.values(data.books ?? {});

  const verses: BibleVerse[] = [];
  const total = booksArr.length || 1;
  booksArr.forEach((book, i) => {
    const bookName = book.name ?? `Livre ${book.nr ?? i + 1}`;
    const chapters: GetBibleChapter[] = Array.isArray(book.chapters)
      ? (book.chapters as GetBibleChapter[])
      : (Object.values(book.chapters ?? {}) as GetBibleChapter[]);
    for (const ch of chapters) {
      const chNum = Number(ch.chapter);
      const list: GetBibleVerse[] = Array.isArray(ch.verses)
        ? ch.verses
        : (Object.values(ch.verses ?? {}) as GetBibleVerse[]);
      for (const v of list) {
        verses.push({
          book: bookName,
          chapter: chNum,
          verse: Number(v.verse),
          text: String(v.text ?? "").trim(),
        });
      }
    }
    onProgress?.(10 + (i / total) * 90, bookName);
  });

  return {
    code: (data.abbreviation ?? translation).toUpperCase().slice(0, 8),
    name: data.translation ?? translation,
    language: (data.lang ?? "xx").toLowerCase().slice(0, 2),
    verses,
  };
}

// ---------- Public façade --------------------------------------------------

export async function fetchBibleFromApi(params: FetchBibleParams): Promise<FetchedBible> {
  if (params.source === "getbible") {
    return fetchFromGetBible(params.translation, params.onProgress, params.signal);
  }
  return fetchFromBibleApi(params.translation, params.onProgress, params.signal);
}
