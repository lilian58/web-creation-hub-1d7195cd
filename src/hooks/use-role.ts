import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/auth";

export type { Role };

/**
 * Compat avec l'ancien hook : retourne [role, setRole].
 * Branché sur AuthContext pour rester synchronisé avec la session.
 */
export function useRole(): [Role, (r: Role) => void] {
  const { user, setRole } = useAuth();
  return [user?.role ?? "user", setRole];
}
