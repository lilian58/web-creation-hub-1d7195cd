import { useEffect, useState } from "react";

export type Role = "user" | "creator" | "admin";
const KEY = "spiritlink:role";

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === "undefined") return "user";
    return ((localStorage.getItem(KEY) as Role) ?? "user");
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) setRoleState(e.newValue as Role);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setRole = (r: Role) => {
    localStorage.setItem(KEY, r);
    setRoleState(r);
    // Dispatch un event manuel pour les autres composants de l'onglet
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: r }));
  };

  return [role, setRole];
}
