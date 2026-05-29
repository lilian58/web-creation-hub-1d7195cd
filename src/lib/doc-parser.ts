/**
 * Parse PDF / DOC / DOCX files into a structured set of "chapters"
 * (title + paragraphs) so they can be displayed with the app's
 * native reader (gros titre serif + paragraphes + pagination A-/A+).
 *
 * - PDF: pdfjs-dist (récupère le texte par page, tente de détecter les titres)
 * - DOCX: mammoth (HTML → on extrait headings + paragraphes)
 * - DOC : non lisible côté navigateur — message clair invitant à convertir.
 */
import * as pdfjsLib from "pdfjs-dist";
// @ts-expect-error - vite worker import
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export type DocFormat = "pdf" | "doc" | "docx";

export interface DocChapter {
  num: number;
  title: string;
  paragraphs: string[];
}

export interface ParsedDocument {
  title?: string;
  chapters: DocChapter[];
}

export const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const ACCEPT_ATTR = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function detectFormat(filename: string): DocFormat | null {
  const n = filename.toLowerCase();
  if (n.endsWith(".pdf")) return "pdf";
  if (n.endsWith(".docx")) return "docx";
  if (n.endsWith(".doc")) return "doc";
  return null;
}

export function isAcceptedDocument(file: File): boolean {
  return detectFormat(file.name) !== null;
}

// -------- helpers ----------------------------------------------------------
const CHAPTER_HINT = /^(chapitre|chapter|partie|part|section)\s+[ivxlcdm0-9]+/i;

function looksLikeTitle(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > 80) return false;
  if (CHAPTER_HINT.test(t)) return true;
  // Court + pas de ponctuation finale → probablement un titre
  return t.length < 60 && !/[.!?…]$/.test(t) && /[A-ZÀ-Ý]/.test(t[0]);
}

function buildChapters(blocks: Array<{ kind: "h" | "p"; text: string }>): DocChapter[] {
  const chapters: DocChapter[] = [];
  let current: DocChapter | null = null;
  let n = 0;
  for (const b of blocks) {
    const text = b.text.replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (b.kind === "h") {
      n += 1;
      current = { num: n, title: text, paragraphs: [] };
      chapters.push(current);
    } else {
      if (!current) {
        n += 1;
        current = { num: n, title: "Introduction", paragraphs: [] };
        chapters.push(current);
      }
      current.paragraphs.push(text);
    }
  }
  // Fallback : pas de titre détecté → on découpe le texte en chapitres lisibles
  if (chapters.length === 0 || (chapters.length === 1 && chapters[0].paragraphs.length > 8)) {
    return paginateParagraphs(chapters[0]?.paragraphs ?? blocks.map((b) => b.text));
  }
  return chapters;
}

function paginateParagraphs(paragraphs: string[]): DocChapter[] {
  const TARGET = 1400; // ~ lecture confortable par page
  const pages: DocChapter[] = [];
  let buf: string[] = [];
  let size = 0;
  let n = 0;
  for (const p of paragraphs) {
    buf.push(p);
    size += p.length;
    if (size >= TARGET) {
      n += 1;
      pages.push({ num: n, title: `Page ${n}`, paragraphs: buf });
      buf = [];
      size = 0;
    }
  }
  if (buf.length) {
    n += 1;
    pages.push({ num: n, title: `Page ${n}`, paragraphs: buf });
  }
  return pages.length ? pages : [{ num: 1, title: "Document", paragraphs }];
}

// -------- PDF --------------------------------------------------------------
async function parsePdf(data: ArrayBuffer): Promise<ParsedDocument> {
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const blocks: Array<{ kind: "h" | "p"; text: string }> = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Regroupe les items en lignes via la coordonnée Y
    const lines = new Map<number, string[]>();
    for (const it of content.items as Array<{ str: string; transform: number[] }>) {
      if (!it.str) continue;
      const y = Math.round(it.transform[5]);
      const arr = lines.get(y) ?? [];
      arr.push(it.str);
      lines.set(y, arr);
    }
    const ordered = [...lines.entries()].sort((a, b) => b[0] - a[0]);
    let paraBuf: string[] = [];
    const flush = () => {
      if (!paraBuf.length) return;
      blocks.push({ kind: "p", text: paraBuf.join(" ") });
      paraBuf = [];
    };
    for (const [, parts] of ordered) {
      const line = parts.join(" ").replace(/\s+/g, " ").trim();
      if (!line) { flush(); continue; }
      if (looksLikeTitle(line)) {
        flush();
        blocks.push({ kind: "h", text: line });
      } else {
        paraBuf.push(line);
        if (/[.!?…]$/.test(line)) flush();
      }
    }
    flush();
  }
  return { chapters: buildChapters(blocks) };
}

// -------- DOCX -------------------------------------------------------------
async function parseDocx(data: ArrayBuffer): Promise<ParsedDocument> {
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: data });
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: Array<{ kind: "h" | "p"; text: string }> = [];
  doc.body.querySelectorAll("h1, h2, h3, p, li").forEach((el) => {
    const text = (el.textContent ?? "").trim();
    if (!text) return;
    const tag = el.tagName.toLowerCase();
    blocks.push({ kind: tag.startsWith("h") ? "h" : "p", text });
  });
  return { chapters: buildChapters(blocks) };
}

// -------- entrée principale ------------------------------------------------
export async function parseDocument(input: {
  url: string;
  format: DocFormat;
}): Promise<ParsedDocument> {
  if (input.format === "doc") {
    throw new Error(
      "Le format .doc (Word 97-2003) n'est pas pris en charge dans l'aperçu. Convertis le fichier en .docx ou .pdf pour le lire dans l'application."
    );
  }
  const res = await fetch(input.url);
  const buf = await res.arrayBuffer();
  return input.format === "pdf" ? parsePdf(buf) : parseDocx(buf);
}
