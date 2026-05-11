/**
 * Store de contenus créés par les utilisateurs (livres + prédications audio/vidéo).
 *
 * - Mode mock (par défaut) : persistance dans localStorage, fichiers stockés
 *   en base64 (data URL) — adapté à la démo, pas à la production.
 * - Mode backend : si VITE_API_URL est défini, on POST en multipart/form-data
 *   sur /api/books et /api/predications.
 */
import { useEffect, useState } from "react";
import { API_URL, hasBackend } from "@/lib/api";

export type MediaKind = "audio" | "video";

export interface UploadedBook {
  id: string;
  title: string;
  author: string;
  description?: string;
  category?: string;
  coverUrl?: string;
  fileUrl: string; // pdf/epub data URL en mock
  format: "pdf" | "epub";
  createdAt: number;
  authorId?: string;
}

export interface UploadedPredication {
  id: string;
  title: string;
  description?: string;
  category?: string;
  type: MediaKind;
  mediaUrl: string; // audio/video data URL en mock
  coverUrl?: string;
  author: string;
  authorId?: string;
  createdAt: number;
}

const BOOKS_KEY = "spiritlink:uploads:books";
const PREDS_KEY = "spiritlink:uploads:predications";
const CHANGE_EVT = "spiritlink:uploads:changed";

const read = <T,>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const write = <T,>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CHANGE_EVT));
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

// ---- Reads ----------------------------------------------------------------
export const getUploadedBooks = () => read<UploadedBook>(BOOKS_KEY);
export const getUploadedPredications = () => read<UploadedPredication>(PREDS_KEY);

export const findUploadedBook = (id: string) =>
  getUploadedBooks().find((b) => b.id === id);
export const findUploadedPredication = (id: string) =>
  getUploadedPredications().find((p) => p.id === id);

// ---- Writes ---------------------------------------------------------------
export interface AddBookInput {
  title: string;
  author: string;
  description?: string;
  category?: string;
  file: File;
  cover?: File | null;
  authorId?: string;
}

export async function addBook(input: AddBookInput): Promise<UploadedBook> {
  const format: "pdf" | "epub" = /\.epub$/i.test(input.file.name) ? "epub" : "pdf";

  if (hasBackend()) {
    const fd = new FormData();
    fd.append("title", input.title);
    fd.append("authorName", input.author);
    if (input.description) fd.append("description", input.description);
    if (input.category) fd.append("category", input.category);
    fd.append("format", format);
    fd.append("file", input.file);
    if (input.cover) fd.append("cover", input.cover);

    const res = await fetch(`${API_URL}/api/books`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? `Erreur ${res.status}`);
    return data.item as UploadedBook;
  }

  const fileUrl = await fileToDataUrl(input.file);
  const coverUrl = input.cover ? await fileToDataUrl(input.cover) : undefined;
  const item: UploadedBook = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    author: input.author.trim(),
    description: input.description?.trim(),
    category: input.category,
    coverUrl,
    fileUrl,
    format,
    createdAt: Date.now(),
    authorId: input.authorId,
  };
  write(BOOKS_KEY, [item, ...getUploadedBooks()]);
  return item;
}

export interface AddPredicationInput {
  title: string;
  description?: string;
  category?: string;
  type: MediaKind;
  file: File;
  cover?: File | null;
  author: string;
  authorId?: string;
}

export async function addPredication(input: AddPredicationInput): Promise<UploadedPredication> {
  if (hasBackend()) {
    const fd = new FormData();
    fd.append("title", input.title);
    fd.append("type", input.type);
    if (input.description) fd.append("description", input.description);
    if (input.category) fd.append("category", input.category);
    fd.append("media", input.file);
    if (input.cover) fd.append("cover", input.cover);

    const res = await fetch(`${API_URL}/api/predications`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? `Erreur ${res.status}`);
    return data.item as UploadedPredication;
  }

  const mediaUrl = await fileToDataUrl(input.file);
  const coverUrl = input.cover ? await fileToDataUrl(input.cover) : undefined;
  const item: UploadedPredication = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description?.trim(),
    category: input.category,
    type: input.type,
    mediaUrl,
    coverUrl,
    author: input.author,
    authorId: input.authorId,
    createdAt: Date.now(),
  };
  write(PREDS_KEY, [item, ...getUploadedPredications()]);
  return item;
}

export function deleteUploadedBook(id: string) {
  write(BOOKS_KEY, getUploadedBooks().filter((b) => b.id !== id));
}
export function deleteUploadedPredication(id: string) {
  write(PREDS_KEY, getUploadedPredications().filter((p) => p.id !== id));
}

// ---- Hooks ----------------------------------------------------------------
function useStore<T>(reader: () => T[]): T[] {
  const [items, setItems] = useState<T[]>(reader);
  useEffect(() => {
    const refresh = () => setItems(reader());
    window.addEventListener(CHANGE_EVT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [reader]);
  return items;
}

export const useUploadedBooks = () => useStore<UploadedBook>(getUploadedBooks);
export const useUploadedPredications = () =>
  useStore<UploadedPredication>(getUploadedPredications);
