import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import logo from "@/assets/spiritlink-logo.png";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Sparkles, User as UserIcon } from "lucide-react";

type Mode = "signin" | "signup";
type SignupRole = "user" | "creator";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<SignupRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/app";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await login({ email, password });
      } else {
        await register({ name, email, password, role });
      }
      toast({ title: mode === "signin" ? "Bon retour !" : "Bienvenue 🎉" });
      navigate(from, { replace: true });
    } catch (err) {
      toast({
        title: "Connexion impossible",
        description: err instanceof Error ? err.message : "Réessaie dans un instant.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex gradient-hero p-12 flex-col justify-between text-primary-foreground">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="w-12 h-12" width={48} height={48} />
          <span className="font-display text-3xl font-bold text-gold">SpiritLink</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl leading-tight mb-4">
            "Je puis toutes choses par celui qui me fortifie."
          </h2>
          <p className="text-gold font-medium">Philippiens 4:13</p>
        </div>
        <p className="text-sm opacity-75">© 2026 SpiritLink</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <img src={logo} alt="" className="w-10 h-10" width={40} height={40} />
            <span className="font-display text-2xl font-bold text-primary">SpiritLink</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-primary mb-2">
            {mode === "signin" ? "Bon retour parmi nous" : "Créer un compte"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "signin"
              ? "Connecte-toi pour continuer ton parcours."
              : "Rejoins une communauté qui édifie."}
          </p>

          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === "signup" && (
              <>
                <div>
                  <Label>Type de compte</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <RoleCard
                      active={role === "user"}
                      onClick={() => setRole("user")}
                      icon={<UserIcon className="w-5 h-5" />}
                      title="Membre"
                      desc="Lis, écoute, échange"
                    />
                    <RoleCard
                      active={role === "creator"}
                      onClick={() => setRole("creator")}
                      icon={<Sparkles className="w-5 h-5" />}
                      title="Créateur"
                      desc="Publie ta chaîne"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Les comptes administrateurs sont créés uniquement par un admin existant.
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    placeholder="Ton nom"
                    className="mt-1.5 h-12 rounded-xl"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="toi@email.com"
                className="mt-1.5 h-12 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="mt-1.5 h-12 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 gradient-primary text-primary-foreground rounded-xl shadow-glow font-semibold"
            >
              {submitting
                ? "Patiente…"
                : mode === "signin"
                ? "Se connecter"
                : "Créer mon compte"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OU <div className="flex-1 h-px bg-border" />
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl">
            Continuer avec Google
          </Button>

          <div className="mt-6">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-10 text-xs text-muted-foreground hover:text-primary"
              onClick={async () => {
                setSubmitting(true);
                try {
                  await login({ email: "superuser@test.com", password: "password" });
                  toast({ title: "Super user connecté 🚀" });
                  navigate(from, { replace: true });
                } catch {
                  toast({ title: "Erreur", variant: "destructive" });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              🧪 Connexion Super User (test)
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-3 text-left transition",
        active
          ? "border-primary bg-primary/5 shadow-soft"
          : "border-border hover:border-primary/50"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center mb-2",
          active ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
        )}
      >
        {icon}
      </div>
      <div className="font-semibold text-sm text-foreground">{title}</div>
      <div className="text-[11px] text-muted-foreground">{desc}</div>
    </button>
  );
}
