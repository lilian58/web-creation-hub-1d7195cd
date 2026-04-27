import { Search, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = ["Tous", "Favoris", "Récents"];
const books = ["Genèse", "Exode", "Lévitique", "Nombres", "Psaumes", "Proverbes", "Matthieu", "Marc", "Luc", "Jean", "Actes", "Romains"];

export default function Bible() {
  const [tab, setTab] = useState("Tous");
  return (
    <div className="px-4 lg:px-10 py-6 lg:py-10 max-w-6xl mx-auto space-y-6">
      <div className="hidden lg:flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-primary">Bible</h1>
        <button className="p-3 rounded-full hover:bg-muted">
          <Heart className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Rechercher un livre, chapitre, verset"
          className="w-full h-13 pl-12 pr-4 py-3.5 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 lg:gap-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 lg:flex-none lg:px-8 py-2.5 rounded-full text-sm font-semibold transition",
              tab === t ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {books.map((book) => (
          <button
            key={book}
            className="aspect-[4/3] lg:aspect-square bg-card rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex items-center justify-center font-medium text-foreground p-2 text-center text-sm lg:text-base"
          >
            {book}
          </button>
        ))}
      </div>

      {/* Reading plan */}
      <div className="gradient-hero rounded-3xl p-6 lg:p-8 text-primary-foreground shadow-card relative overflow-hidden">
        <div className="absolute right-4 bottom-0 text-7xl opacity-20">📖</div>
        <h3 className="font-display text-2xl lg:text-3xl font-semibold mb-1">Plan de lecture</h3>
        <p className="text-primary-foreground/85 mb-4">Grandis chaque jour</p>
        <button className="px-6 py-2.5 bg-gold text-primary-deep rounded-full text-sm font-semibold hover:bg-gold/90 transition">
          Commencer
        </button>
      </div>

      {/* Inspiring verse */}
      <div>
        <h3 className="font-display text-xl font-semibold text-primary mb-3">Verset inspirant</h3>
        <div className="bg-muted/60 rounded-2xl p-6 relative">
          <span className="absolute top-3 left-4 text-4xl text-gold leading-none">"</span>
          <p className="px-6 text-foreground italic">Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.</p>
          <p className="px-6 mt-2 text-sm text-muted-foreground">Psaumes 119:105</p>
          <span className="absolute bottom-1 right-4 text-4xl text-gold leading-none">"</span>
        </div>
      </div>
    </div>
  );
}
