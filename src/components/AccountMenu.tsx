import { Menu, User, Crown, BookmarkCheck, Download, Bell, Shield, HelpCircle, LogOut, ChevronRight, ShieldAlert, Sparkles, Settings, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useRole } from "@/hooks/use-role";
import { cn } from "@/lib/utils";

const accountItems = [
  { icon: User, label: "Mon profil", desc: "Informations personnelles", to: "/app/profil" },
  { icon: CreditCard, label: "Abonnement", desc: "Plan, facturation, reçus", to: "/app/abonnement" },
  { icon: Settings, label: "Paramètres du compte", desc: "Email, mot de passe, langue", to: "/app/profil" },
];

const contentItems = [
  { icon: BookmarkCheck, label: "Mes favoris", desc: "Versets et prédications", to: "/app/journal" },
  { icon: Download, label: "Téléchargements", desc: "Contenu hors ligne", to: "/app/downloads" },
  { icon: Bell, label: "Notifications", desc: "Verset du jour, rappels", to: "#" },
];

const supportItems = [
  { icon: Shield, label: "Confidentialité & sécurité", desc: "Données et permissions", to: "#" },
  { icon: HelpCircle, label: "Aide & support", desc: "FAQ et contact", to: "#" },
];

export default function AccountMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [role] = useRole();

  const close = () => setOpen(false);

  const Section = ({ title, items }: { title: string; items: typeof accountItems }) => (
    <div>
      <p className="px-4 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
        {title}
      </p>
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        {items.map((s, i) => (
          <Link
            key={s.label}
            to={s.to}
            onClick={close}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition text-left",
              i > 0 && "border-t"
            )}
          >
            <div className="w-9 h-9 rounded-xl bg-gold-soft text-primary flex items-center justify-center shrink-0">
              <s.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground">{s.label}</div>
              <div className="text-[11px] text-muted-foreground truncate">{s.desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn("p-2 rounded-full hover:bg-muted transition", className)}
          aria-label="Menu compte"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] sm:w-[400px] p-0 overflow-y-auto bg-background">
        {/* Carte profil */}
        <div className="gradient-hero text-primary-foreground p-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center font-display text-xl font-bold border-2 border-gold">
              S
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-bold truncate">Sarah Mendès</h3>
              <p className="text-xs text-primary-foreground/80 truncate">sarah@spiritlink.app</p>
            </div>
            <span className="px-2.5 py-1 bg-gold text-primary-deep rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
              <Crown className="w-3 h-3" /> {role}
            </span>
          </div>

          {/* Espace selon rôle */}
          {role !== "user" && (
            <Link
              to={role === "admin" ? "/app/admin" : "/app/creator"}
              onClick={close}
              className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-card/15 backdrop-blur hover:bg-card/25 transition"
            >
              <div className="flex items-center gap-2.5">
                {role === "admin" ? <ShieldAlert className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span className="text-sm font-semibold">
                  Espace {role === "admin" ? "Admin" : "Créateur"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="p-4 space-y-5">
          <Section title="Compte" items={accountItems} />
          <Section title="Contenu" items={contentItems} />
          <Section title="Support" items={supportItems} />

          <Link
            to="/"
            onClick={close}
            className="w-full bg-card border border-destructive/30 text-destructive rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold hover:bg-destructive/5 transition"
          >
            <LogOut className="w-4 h-4" /> Se déconnecter
          </Link>

          <p className="text-center text-[10px] text-muted-foreground pb-4">
            SpiritLink · v1.0.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
