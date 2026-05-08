/**
 * Client API minimal — branche-le sur ton backend Express en définissant
 * VITE_API_URL (par ex. https://api.spiritlink.app).
 * Tant que VITE_API_URL n'est pas défini, on utilise le mode mock côté
 * AuthContext.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? "";

export const hasBackend = () => Boolean(API_URL);

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data as { message?: string; errors?: { msg: string }[] })?.message ??
      (data as { errors?: { msg: string }[] })?.errors?.[0]?.msg ??
      `Erreur ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
