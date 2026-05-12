import { Users, Flag, BarChart3, BookOpen, Mic, Search, MoreHorizontal, ShieldAlert, Check, X, TrendingUp, Plus, Upload, Languages, Trash2, FileText, FileVideo } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import UploadContentSheet from "@/components/UploadContentSheet";
import {
  addBibleVersion,
  deleteBibleVersion,
  useBibleVersions,
} from "@/lib/bible-store";
import {
  deleteUploadedBook,
  deleteUploadedPredication,
  useUploadedBooks,
  useUploadedPredications,
} from "@/lib/content-store";

const reportedUsers = [
  { id: 1, name: "User_X392", reason: "Contenu inapproprié", count: 4, status: "pending" as const },
  { id: 2, name: "FaithSeeker", reason: "Spam dans le chat", count: 2, status: "pending" as const },
  { id: 3, name: "JM_2024", reason: "Propos déplacés", count: 7, status: "review" as const },
];

const reportedContent = [
  { id: 1, title: "Méditation #421", author: "anonyme", type: "Audio", reason: "Doctrine douteuse", reports: 5 },
  { id: 2, title: "Livre — Vérités cachées", author: "P. Demba", type: "Livre", reason: "Contenu non approprié", reports: 3 },
  { id: 3, title: "Sermon Live #88", author: "Frère K.", type: "Vidéo", reason: "Qualité audio", reports: 2 },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<"users" | "content">("users");
  const [showUpload, setShowUpload] = useState(false);
  const [showBibleForm, setShowBibleForm] = useState(false);

  const versions = useBibleVersions();
  const books = useUploadedBooks();
  const predications = useUploadedPredications();

  const stats = useMemo(
    () => [
      { label: "Utilisateurs", value: "12 384", delta: "+5.2%", icon: Users, color: "from-primary to-primary-glow" },
      { label: "Prédications", value: String(predications.length), delta: `+${predications.length}`, icon: Mic, color: "from-amber-500 to-orange-500" },
      { label: "Livres", value: String(books.length), delta: `+${books.length}`, icon: BookOpen, color: "from-emerald-500 to-teal-500" },
      { label: "Versions Bible", value: String(versions.length), delta: `+${versions.length}`, icon: Languages, color: "from-indigo-500 to-violet-500" },
    ],
    [predications.length, books.length, versions.length]
  );

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Dashboard Admin</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Modération, contenus et versions de la Bible</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" /> Publier un contenu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-4 md:p-5 shadow-soft">
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br text-white flex items-center justify-center mb-3", s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <span className="font-display text-xl md:text-2xl font-bold text-foreground">{s.value}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Versions de la Bible */}
      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        <div className="p-5 md:p-6 border-b flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-primary">Versions de la Bible</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Charge une traduction (JSON ou TXT) — réservé aux administrateurs.
            </p>
          </div>
          <button
            onClick={() => setShowBibleForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>

        {versions.length === 0 ? (
          <div className="p-10 text-center">
            <Languages className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucune version de Bible chargée.</p>
          </div>
        ) : (
          <div className="divide-y">
            {versions.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                  {v.code.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{v.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {v.code} · {v.language.toUpperCase()} · {v.versesCount.toLocaleString()} versets
                  </p>
                </div>
                <button
                  onClick={() => { deleteBibleVersion(v.id); toast({ title: "Version supprimée" }); }}
                  className="p-2 rounded-full hover:bg-destructive/10 text-destructive"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contenus publiés par l'admin */}
      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        <div className="p-5 md:p-6 border-b flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-primary">Contenus publiés</h3>
            <p className="text-xs text-muted-foreground mt-1">Livres, prédications audio et vidéos</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15"
          >
            <Upload className="w-4 h-4" /> Publier
          </button>
        </div>
        {books.length + predications.length === 0 ? (
          <div className="p-10 text-center">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucun contenu pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y">
            {predications.map((p) => (
              <div key={`p-${p.id}`} className="flex items-center gap-3 p-4">
                <Link to={`/app/predications/${p.id}`} className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {p.type === "video" ? <FileVideo className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Link>
                <Link to={`/app/predications/${p.id}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.type === "video" ? "Vidéo" : "Audio"} · {p.author}</p>
                </Link>
                <button onClick={() => { deleteUploadedPredication(p.id); toast({ title: "Supprimé" }); }} className="p-2 rounded-full hover:bg-destructive/10 text-destructive" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {books.map((b) => (
              <div key={`b-${b.id}`} className="flex items-center gap-3 p-4">
                <Link to={`/app/bibliotheque/${b.id}`} className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </Link>
                <Link to={`/app/bibliotheque/${b.id}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{b.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Livre · {b.author}</p>
                </Link>
                <button onClick={() => { deleteUploadedBook(b.id); toast({ title: "Supprimé" }); }} className="p-2 rounded-full hover:bg-destructive/10 text-destructive" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Engagement */}
      <div className="bg-card rounded-3xl shadow-soft p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-primary">Engagement (7 jours)</h3>
            <p className="text-xs text-muted-foreground">Sessions quotidiennes</p>
          </div>
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex items-end gap-2 md:gap-3 h-40">
          {[42, 58, 65, 51, 73, 88, 71].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-xl bg-gradient-to-t from-primary to-primary-glow" style={{ height: `${v}%` }} />
              <span className="text-[10px] text-muted-foreground">{["L", "M", "M", "J", "V", "S", "D"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modération */}
      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        <div className="p-5 md:p-6 border-b">
          <h3 className="font-display text-lg font-bold text-primary mb-3">Modération</h3>
          <div className="flex gap-2">
            {(["users", "content"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition",
                  tab === t ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {t === "users" ? "Utilisateurs signalés" : "Contenus signalés"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 md:p-4">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder={tab === "users" ? "Rechercher un utilisateur..." : "Rechercher un contenu..."}
              className="w-full h-11 pl-11 pr-4 bg-muted rounded-full text-sm focus:outline-none"
            />
          </div>

          {tab === "users" ? (
            <div className="divide-y">
              {reportedUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-3">
                  <div className="w-11 h-11 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center font-semibold">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.reason} · {u.count} signalement{u.count > 1 ? "s" : ""}</p>
                  </div>
                  <span className={cn(
                    "hidden sm:inline px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                    u.status === "pending" ? "bg-amber-500/15 text-amber-600" : "bg-blue-500/15 text-blue-600"
                  )}>
                    {u.status === "pending" ? "En attente" : "À revoir"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 flex items-center justify-center" aria-label="Approuver">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 flex items-center justify-center" aria-label="Bloquer">
                      <X className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center" aria-label="Plus">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {reportedContent.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {c.type === "Livre" ? <BookOpen className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground truncate">par {c.author} · {c.reason}</p>
                  </div>
                  <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 text-[10px] font-bold">
                    {c.reports} signalement{c.reports > 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="px-3 py-1.5 rounded-full text-xs bg-emerald-500/15 text-emerald-600 font-semibold">Garder</button>
                    <button className="px-3 py-1.5 rounded-full text-xs bg-rose-500/15 text-rose-600 font-semibold">Retirer</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB upload mobile */}
      <button
        onClick={() => setShowUpload(true)}
        className="md:hidden fixed bottom-36 right-4 z-40 w-14 h-14 rounded-full bg-gold text-primary-deep flex items-center justify-center shadow-glow active:scale-95"
        aria-label="Publier"
      >
        <Upload className="w-6 h-6" />
      </button>

      <UploadContentSheet open={showUpload} onClose={() => setShowUpload(false)} />
      <AddBibleVersionDialog open={showBibleForm} onClose={() => setShowBibleForm(false)} />
    </div>
  );
}

// ---- Dialog d'ajout de version Bible -------------------------------------
function AddBibleVersionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("fr");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const reset = () => {
    setCode(""); setName(""); setLanguage("fr"); setDescription(""); setFile(null);
  };
  const close = () => { if (!submitting) { reset(); onClose(); } };

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim()) {
      return toast({ title: "Code et nom requis", variant: "destructive" });
    }
    if (!file) {
      return toast({ title: "Fichier requis", description: "Sélectionne un .json ou .txt.", variant: "destructive" });
    }
    setSubmitting(true);
    try {
      const v = await addBibleVersion({ code, name, language, description, file });
      toast({ title: "Version ajoutée", description: `${v.name} · ${v.versesCount} versets` });
      reset();
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Échec de l'import";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={close}
    >
      <div
        className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-card max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary" />
            <h3 className="font-display text-xl font-bold text-primary">Nouvelle version de la Bible</h3>
          </div>
          <button onClick={close} disabled={submitting} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code (ex: LSG)"
              className="h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
            />
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Langue (fr, en...)"
              className="h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom complet (ex: Louis Segond 1910)"
            className="w-full h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            rows={2}
            className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />

          <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-primary/5 transition">
            <Upload className="w-7 h-7 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">{file ? file.name : "Fichier .json ou .txt"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {file
                ? `${(file.size / 1024).toFixed(1)} Ko`
                : "Format JSON [{book,chapter,verse,text}] ou TXT \"Genèse 1:1 ...\""}
            </p>
            <input
              type="file"
              accept=".json,.txt,application/json,text/plain"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button onClick={close} disabled={submitting} className="h-12 rounded-full border font-semibold hover:bg-muted disabled:opacity-50">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="h-12 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60">
            {submitting ? "Import..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
