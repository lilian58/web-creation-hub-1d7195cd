import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import logo from "@/assets/spiritlink-logo.png";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex gradient-hero p-12 flex-col justify-between text-primary-foreground">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="w-12 h-12" width={48} height={48} />
          <span className="font-display text-3xl font-bold text-gold">SpiritLink</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl leading-tight mb-4">"Je puis toutes choses par celui qui me fortifie."</h2>
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
            {mode === "signin" ? "Connecte-toi pour continuer ton parcours." : "Rejoins une communauté qui édifie."}
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Ton nom" className="mt-1.5 h-12 rounded-xl" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="toi@email.com" className="mt-1.5 h-12 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1.5 h-12 rounded-xl" />
            </div>
            <Button asChild className="w-full h-12 gradient-primary text-primary-foreground rounded-xl shadow-glow font-semibold">
              <Link to="/app">{mode === "signin" ? "Se connecter" : "Créer mon compte"}</Link>
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OU <div className="flex-1 h-px bg-border" />
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl">
            Continuer avec Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-semibold hover:underline">
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
