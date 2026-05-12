import { Search, Languages, ChevronDown, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getBibleVerses, useBibleVersions } from "@/lib/bible-store";

const tabs = ["Tous", "Favoris", "Récents"];
const defaultBooks = ["Genèse", "Exode", "Lévitique", "Nombres", "Psaumes", "Proverbes", "Matthieu", "Marc", "Luc", "Jean", "Actes", "Romains"];

export default function Bible() {
  const [tab, setTab] = useState("Tous");
  const versions = useBibleVersions();
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");

  const [versionId, setVersionId] = useState<string>("");
  const [versionMenu, setVersionMenu] = useState(false);

  const activeVersion = useMemo(() => {
    if (versionId) return versions.find((v) => v.id === versionId) ?? null;
    return versions[0] ?? null;
  }, [versions, versionId]);

  const books = useMemo(() => {
    if (!activeVersion) return defaultBooks;
    const verses = getBibleVerses(activeVersion.id);
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const v of verses) {
      if (!seen.has(v.book)) {
        seen.add(v.book);
        ordered.push(v.book);
      }
    }
    return ordered.length ? ordered : defaultBooks;
  }, [activeVersion]);

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">
      {/* Sélecteur de version */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={() => setVersionMenu((s) => !s)}
            className="w-full sm:w-auto flex items-center gap-2 px-4 h-11 rounded-full bg-card shadow-soft text-sm font-semibold text-primary hover:bg-muted/50"
          >
            <Languages className="w-4 h-4" />
            <span className="truncate">
              {activeVersion ? `${activeVersion.code} · ${activeVersion.name}` : "Aucune version"}
            </span>
            <ChevronDown className={cn("w-4 h-4 transition", versionMenu && "rotate-180")} />
          </button>

          {versionMenu && (
            <div className="absolute z-30 mt-2 left-0 right-0 sm:right-auto sm:min-w-[280px] bg-card rounded-2xl shadow-card border overflow-hidden">
              {versions.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Aucune version disponible.
                  {isAdmin && (
                    <Link to="/app/admin" className="block mt-2 text-primary font-semibold">
                      → Ajouter une version
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {versions.map((v) => (
                    <li key={v.id}>
                      <button
                        onClick={() => { setVersionId(v.id); setVersionMenu(false); }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-muted/50 transition",
                          activeVersion?.id === v.id && "bg-primary/5"
                        )}
                      >
                        <div className="font-semibold text-sm text-foreground">{v.code} · {v.name}</div>
                        <div className="text-[11px] text-muted-foreground">{v.language.toUpperCase()} · {v.versesCount.toLocaleString()} versets</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {isAdmin && (
          <Link
            to="/app/admin"
            className="hidden sm:inline-flex items-center gap-2 px-4 h-11 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15"
          >
            <ShieldAlert className="w-4 h-4" /> Gérer les versions
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Rechercher un livre, chapitre, verset"
          className="w-full h-12 pl-12 pr-4 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
