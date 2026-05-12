/**
 * Store des versions de la Bible (traductions) ajoutées par l'admin.
 *
 * - Mode mock (par défaut) : persistance localStorage. Les versets sont
 *   parsés depuis un fichier .json/.txt fourni par l'admin.
 * - Mode backend : POST /api/bible/versions (multipart) si VITE_API_URL.
 *
 * Format attendu pour le fichier :
 *   - JSON  : [{ "book": "Genèse", "chapter": 1, "verse": 1, "text": "..." }, ...]
 *   - TXT   : une ligne par verset au format  "Genèse 1:1 Au commencement..."
 */
import { useEffect, useState } from "react";
import { API_URL, hasBackend } from "@/lib/api";

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleVersion {
  id: string;
  code: string; // ex: LSG, NEG, BDS
  name: string; // ex: Louis Segond 1910
  language: string; // ex: fr
  description?: string;
  versesCount: number;
  createdAt: number;
}

const VERSIONS_KEY = "spiritlink:bible:versions";
const VERSES_KEY = (id: string) => `spiritlink:bible:verses:${id}`;
const CHANGE_EVT = "spiritlink:bible:changed";

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(CHANGE_EVT));
};

// ---- Reads ----------------------------------------------------------------
export const getBibleVersions = (): BibleVersion[] => read(VERSIONS_KEY, []);
export const getBibleVerses = (versionId: string): BibleVerse[] =>
  read(VERSES_KEY(versionId), []);

// ---- Parsing --------------------------------------------------------------
const TXT_LINE = /^([\p{L}\p{M}\d'’\-\s]+?)\s+(\d+):(\d+)\s+(.+)$/u;

export function parseVersesFromText(content: string): BibleVerse[] {
  const trimmed = content.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const data = JSON.parse(trimmed);
      const arr = Array.isArray(data) ? data : data?.verses ?? [];
      return arr
        .map((v: Partial<BibleVerse>) => ({
          book: String(v.book ?? "").trim(),
          chapter: Number(v.chapter),
          verse: Number(v.verse),
          text: String(v.text ?? "").trim(),
        }))
        .filter((v: BibleVerse) => v.book && v.chapter && v.verse && v.text);
    } catch {
      return [];
    }
  }

  const out: BibleVerse[] = [];
  for (const line of trimmed.split(/\r?\n/)) {
    const m = line.match(TXT_LINE);
    if (!m) continue;
    out.push({
      book: m[1].trim(),
      chapter: Number(m[2]),
      verse: Number(m[3]),
      text: m[4].trim(),
    });
  }
  return out;
}

// ---- Writes ---------------------------------------------------------------
export interface AddBibleVersionInput {
  code: string;
  name: string;
  language?: string;
  description?: string;
  file: File;
}

export async function addBibleVersion(input: AddBibleVersionInput): Promise<BibleVersion> {
  if (hasBackend()) {
    const fd = new FormData();
    fd.append("code", input.code);
    fd.append("name", input.name);
    fd.append("language", input.language ?? "fr");
    if (input.description) fd.append("description", input.description);
    fd.append("file", input.file);

    const res = await fetch(`${API_URL}/api/bible/versions`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? `Erreur ${res.status}`);
    return data.version as BibleVersion;
  }

  const text = await input.file.text();
  const verses = parseVersesFromText(text);
  if (verses.length === 0) {
    throw new Error("Aucun verset détecté dans le fichier.");
  }
  const version: BibleVersion = {
    id: crypto.randomUUID(),
    code: input.code.trim().toUpperCase(),
    name: input.name.trim(),
    language: (input.language ?? "fr").trim().toLowerCase(),
    description: input.description?.trim(),
    versesCount: verses.length,
    createdAt: Date.now(),
  };
  write(VERSIONS_KEY, [version, ...getBibleVersions()]);
  write(VERSES_KEY(version.id), verses);
  return version;
}

export function deleteBibleVersion(id: string) {
  write(VERSIONS_KEY, getBibleVersions().filter((v) => v.id !== id));
  localStorage.removeItem(VERSES_KEY(id));
  window.dispatchEvent(new CustomEvent(CHANGE_EVT));
}

// ---- Hook -----------------------------------------------------------------
export function useBibleVersions(): BibleVersion[] {
  const [items, setItems] = useState<BibleVersion[]>(getBibleVersions);
  useEffect(() => {
    const refresh = () => setItems(getBibleVersions());
    window.addEventListener(CHANGE_EVT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
