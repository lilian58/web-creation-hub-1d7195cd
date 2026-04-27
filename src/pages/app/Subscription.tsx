import { Check, Crown, Sparkles, Download, Users, BookOpen, Shield, CreditCard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    price: "0 €",
    period: "/mois",
    color: "from-muted to-muted",
    badge: null,
    perks: [
      "Bible & Plan de lecture",
      "5 prédications offertes/mois",
      "Chat avec 10 contacts",
      "Notes personnelles limitées",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: "4,99 €",
    period: "/mois",
    color: "from-primary to-primary-glow",
    badge: "Populaire",
    perks: [
      "Bibliothèque complète",
      "Téléchargements illimités",
      "Appels audio & vidéo HD",
      "Notes & partage avancés",
      "Sans publicité",
    ],
  },
  {
    id: "family",
    name: "Famille",
    price: "9,99 €",
    period: "/mois",
    color: "from-amber-500 to-orange-500",
    badge: "Jusqu'à 5 membres",
    perks: [
      "Tout Plus inclus",
      "5 comptes liés",
      "Groupes de prière privés",
      "Contrôle parental",
      "Support prioritaire",
    ],
  },
];

export default function Subscription() {
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [current] = useState("free");

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
          <Sparkles className="w-3 h-3" /> Édifie-toi sans limite
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">Choisis ton plan</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Soutiens la mission et débloque toutes les ressources spirituelles de SpiritLink.
        </p>
      </div>

      {/* Toggle période */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-muted rounded-full">
          {(["month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition",
                period === p ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
              )}
            >
              {p === "month" ? "Mensuel" : "Annuel"}
              {p === "year" && (
                <span className="ml-2 text-[10px] text-emerald-600 font-bold">−20%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isCurrent = p.id === current;
          const isHighlight = p.id === "plus";
          return (
            <div
              key={p.id}
              className={cn(
                "relative rounded-3xl p-6 shadow-soft flex flex-col bg-card",
                isHighlight && "ring-2 ring-primary shadow-card md:scale-105"
              )}
            >
              {p.badge && (
                <span className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                  isHighlight ? "gradient-primary text-primary-foreground shadow-glow" : "bg-gold text-primary-deep"
                )}>
                  {p.badge}
                </span>
              )}

              <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center mb-4", p.color)}>
                {p.id === "free" ? <BookOpen className="w-5 h-5" /> : p.id === "plus" ? <Crown className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>

              <h3 className="font-display text-xl font-bold text-primary">{p.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-display text-3xl font-bold text-foreground">
                  {period === "year" && p.id !== "free" ? `${(parseFloat(p.price) * 12 * 0.8).toFixed(2)} €` : p.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.id === "free" ? p.period : period === "year" ? "/an" : p.period}
                </span>
              </div>

              <ul className="mt-5 space-y-2.5 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <Check className={cn("w-4 h-4 mt-0.5 shrink-0", isHighlight ? "text-primary" : "text-emerald-600")} />
                    <span className="text-foreground">{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                className={cn(
                  "mt-6 w-full h-11 rounded-full font-semibold text-sm transition",
                  isCurrent
                    ? "bg-muted text-muted-foreground cursor-default"
                    : isHighlight
                    ? "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                    : "border-2 border-primary text-primary hover:bg-primary/5"
                )}
              >
                {isCurrent ? "Plan actuel" : `Passer à ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Méthode de paiement */}
      <div className="bg-card rounded-3xl shadow-soft p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-primary">Moyen de paiement</h3>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Aucune carte enregistrée</p>
          </div>
          <button className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Ajouter
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-gold-soft border border-gold/30">
        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Paiement sécurisé.</span> Annulation possible à tout moment depuis cet écran. Tes dons soutiennent la diffusion de l'Évangile.
        </div>
      </div>
    </div>
  );
}
