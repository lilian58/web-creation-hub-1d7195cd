import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, LoginPayload, RegisterPayload, Role } from "@/types/auth";
import { apiFetch, hasBackend } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Démo locale : permet de basculer le rôle sans backend. */
  setRole: (role: Role) => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "spiritlink:auth";
const LEGACY_ROLE_KEY = "spiritlink:role"; // compat avec useRole()

const readStored = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const writeStored = (user: AuthUser | null) => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(LEGACY_ROLE_KEY, user.role);
    window.dispatchEvent(
      new StorageEvent("storage", { key: LEGACY_ROLE_KEY, newValue: user.role })
    );
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// --- Mode mock (tant qu'aucun backend n'est branché) ------------------------
const mockUser = (payload: { name?: string; email?: string; role?: Role }): AuthUser => ({
  id: crypto.randomUUID(),
  name: payload.name ?? "Sarah Mendès",
  email: payload.email ?? "sarah@spiritlink.app",
  role: (payload.role as Role) ?? "user",
  plan: "free",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStored());
  const [loading, setLoading] = useState<boolean>(hasBackend());

  // Hydrate depuis /api/auth/me si un backend est branché
  useEffect(() => {
    if (!hasBackend()) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await apiFetch<{ user: AuthUser }>("/api/auth/me");
        setUser(data.user);
        writeStored(data.user);
      } catch {
        setUser(null);
        writeStored(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    if (hasBackend()) {
      const data = await apiFetch<{ user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setUser(data.user);
      writeStored(data.user);
      return data.user;
    }
    // Mock : on déduit un rôle depuis l'email pour faciliter les tests.
    const role: Role = payload.email.includes("superuser")
      ? "superuser"
      : payload.email.includes("admin")
      ? "admin"
      : payload.email.includes("creator")
      ? "creator"
      : "user";
    const u = mockUser({ email: payload.email, role });
    setUser(u);
    writeStored(u);
    return u;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    if (hasBackend()) {
      const data = await apiFetch<{ user: AuthUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setUser(data.user);
      writeStored(data.user);
      return data.user;
    }
    const u = mockUser(payload);
    setUser(u);
    writeStored(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    if (hasBackend()) {
      try {
        await apiFetch("/api/auth/logout", { method: "POST" });
      } catch {
        /* noop */
      }
    }
    setUser(null);
    writeStored(null);
  }, []);

  const setRole = useCallback((role: Role) => {
    setUser((prev) => {
      const next = prev ? { ...prev, role } : mockUser({ role });
      writeStored(next);
      return next;
    });
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => Boolean(user && (user.role === "superuser" || roles.includes(user.role))),
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setRole,
      hasRole,
    }),
    [user, loading, login, register, logout, setRole, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}
