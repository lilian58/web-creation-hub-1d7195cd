export type Role = "user" | "creator" | "admin";

export type Plan = "free" | "plus" | "family";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  plan?: Plan;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  /** Seuls "user" et "creator" sont autorisés à l'inscription publique. */
  role: Exclude<Role, "admin">;
}
