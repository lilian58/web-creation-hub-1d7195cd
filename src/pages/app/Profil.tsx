import { ChevronRight, Bell, BookmarkCheck, Download, Shield, HelpCircle, LogOut, Crown, ShieldAlert, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { useRole, type Role } from "@/hooks/use-role";
import { cn } from "@/lib/utils";

const sections = [
  { icon: BookmarkCheck, label: "Mes favoris", desc: "Versets et prédications sauvegardés", to: "/app/journal" },
  { icon: Download, label: "Téléchargements", desc: "Contenu disponible hors ligne", to: "/app/downloads" },
  { icon: Bell, label: "Notifications", desc: "Verset du jour, messages, rappels", to: "#" },
  { icon: Shield, label: "Confidentialité", desc: "Sécurité et données", to: "#" },
  { icon: HelpCircle, label: "Aide & support", desc: "Foire aux questions", to: "#" },
];

const roles: { id: Role; label: string; desc: string }[] = [
  { id: "user", label: "Membre", desc: "Consommer du contenu" },
  { id: "creator", label: "Créateur", desc: "Publier sermons & livres" },
  { id: "admin", label: "Admin", desc: "Modération plateforme" },
];

export default function Profil() {
  const [role, setRole] = useRole();

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-3xl mx-auto space-y-6">

      {/* Profile card */}
      <div className="gradient-hero rounded-3xl p-6 lg:p-8 text-primary-foreground shadow-card relative overflow-hidden">
        <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-primary-deep rounded-full text-xs font-semibold flex items-center gap-1">
          <Crown className="w-3 h-3" /> {roles.find((r) => r.id === role)?.label}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center font-display text-3xl font-bold border-2 border-gold">
            S
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Sarah Mendès</h2>
            <p className="text-primary-foreground/80 text-sm">sarah@spiritlink.app</p>
            <p className="text-gold text-xs font-medium mt-1">Membre depuis Mars 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary-foreground/15 text-center">
          <div><div className="font-display text-2xl font-bold text-gold">42</div><div className="text-xs opacity-80">Notes</div></div>
          <div><div className="font-display text-2xl font-bold text-gold">128</div><div className="text-xs opacity-80">Versets</div></div>
          <div><div className="font-display text-2xl font-bold text-gold">17</div><div className="text-xs opacity-80">Amis</div></div>
        </div>
      </div>

      {/* Sélecteur de rôle (démo) */}
      <div className="bg-card rounded-3xl shadow-soft p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Mode démo · Rôle</p>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={cn(
                "p-3 rounded-2xl text-left transition border-2",
                role === r.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/40 hover:bg-muted"
              )}
            >
              <p className={cn("font-semibold text-sm", role === r.id ? "text-primary" : "text-foreground")}>{r.label}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{r.desc}</p>
            </button>
          ))}
        </div>

        {role !== "user" && (
          <Link
            to={role === "admin" ? "/app/admin" : "/app/creator"}
            className="mt-4 flex items-center justify-between p-4 rounded-2xl gradient-primary text-primary-foreground shadow-glow"
          >
            <div className="flex items-center gap-3">
              {role === "admin" ? <ShieldAlert className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <div>
                <p className="font-semibold text-sm">Ouvrir l'espace {role === "admin" ? "Admin" : "Créateur"}</p>
                <p className="text-xs opacity-80">Accéder au tableau de bord</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Settings */}
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        {sections.map((s, i) => (
          <Link
            key={s.label}
            to={s.to}
            className={cn("w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/60 transition text-left", i > 0 && "border-t")}
          >
            <div className="w-10 h-10 rounded-xl bg-gold-soft text-primary flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <Link to="/" className="w-full bg-card border border-destructive/30 text-destructive rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold hover:bg-destructive/5 transition">
        <LogOut className="w-5 h-5" /> Se déconnecter
      </Link>
    </div>
  );
}
