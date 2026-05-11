import { Upload, Mic, BookOpen, Eye, Heart, Users as UsersIcon, DollarSign, Plus, MoreVertical, Image as ImageIcon, FileAudio, FileVideo, FileText, X, TrendingUp, Trash2, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  addBook,
  addPredication,
  deleteUploadedBook,
  deleteUploadedPredication,
  useUploadedBooks,
  useUploadedPredications,
} from "@/lib/content-store";

const subscribers = [
  { id: 1, name: "Sarah M.", since: "Il y a 2 mois" },
  { id: 2, name: "Daniel A.", since: "Il y a 1 mois" },
  { id: 3, name: "Esther N.", since: "Il y a 3 sem." },
  { id: 4, name: "Samuel N.", since: "Il y a 1 sem." },
  { id: 5, name: "Marie L.", since: "Il y a 4 jours" },
];

type UploadType = "audio" | "video" | "book";

const acceptForType: Record<UploadType, string> = {
  audio: "audio/*",
  video: "video/*",
  book: ".pdf,.epub,application/pdf,application/epub+zip",
};

export default function CreatorDashboard() {
  const { user } = useAuth();
  const books = useUploadedBooks();
  const predications = useUploadedPredications();

  const [showUpload, setShowUpload] = useState(false);
  const [type, setType] = useState<UploadType>("audio");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Foi");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const myContent = useMemo(() => {
    const b = books.map((it) => ({
      id: it.id,
      title: it.title,
      type: "Livre" as const,
      kind: "book" as const,
    }));
    const p = predications.map((it) => ({
      id: it.id,
      title: it.title,
      type: it.type === "video" ? ("Vidéo" as const) : ("Audio" as const),
      kind: it.type,
    }));
    return [...p, ...b];
  }, [books, predications]);

  const stats = [
    { label: "Publications", value: String(myContent.length), icon: Eye, color: "from-primary to-primary-glow" },
    { label: "Abonnés", value: "—", icon: UsersIcon, color: "from-amber-500 to-orange-500" },
    { label: "J'aime", value: "—", icon: Heart, color: "from-rose-500 to-pink-500" },
    { label: "Revenus", value: "—", icon: DollarSign, color: "from-emerald-500 to-teal-500" },
  ];

  const reset = () => {
    setTitle(""); setDescription(""); setCategory("Foi");
    setFile(null); setCover(null); setType("audio");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast({ title: "Titre requis", variant: "destructive" });
    if (!file) return toast({ title: "Fichier requis", description: "Sélectionne un fichier à publier.", variant: "destructive" });

    setSubmitting(true);
    try {
      if (type === "book") {
        await addBook({
          title, author: user?.name ?? "Anonyme",
          description, category, file, cover, authorId: user?.id,
        });
      } else {
        await addPredication({
          title, type, description, category,
          file, cover, author: user?.name ?? "Anonyme", authorId: user?.id,
        });
      }
      toast({ title: "Publication réussie", description: title });
      reset();
      setShowUpload(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Échec de la publication";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (kind: "book" | "audio" | "video", id: string) => {
    if (kind === "book") deleteUploadedBook(id);
    else deleteUploadedPredication(id);
    toast({ title: "Publication supprimée" });
  };

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Espace Créateur</h2>
          <p className="text-sm text-muted-foreground mt-1">Partage le message qui transforme des vies</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" /> Publier
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
                <TrendingUp className="w-3 h-3" /> +0%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mes contenus */}
      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        <div className="p-5 md:p-6 border-b flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-primary">Mes publications</h3>
          <span className="text-xs text-muted-foreground">{myContent.length} contenus</span>
        </div>
        {myContent.length === 0 ? (
          <div className="p-10 text-center">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Aucune publication pour le moment.</p>
            <button onClick={() => setShowUpload(true)} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow">
              <Plus className="w-4 h-4" /> Publier ma première création
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {myContent.map((c) => {
              const href = c.kind === "book" ? `/app/bibliotheque/${c.id}` : `/app/predications/${c.id}`;
              return (
                <div key={`${c.kind}-${c.id}`} className="flex items-center gap-3 p-4">
                  <Link to={href} className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {c.kind === "book" ? <BookOpen className="w-5 h-5" /> : c.kind === "video" ? <FileVideo className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Link>
                  <Link to={href} className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{c.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.type}</p>
                  </Link>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-600 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> publié
                  </span>
                  <button onClick={() => handleDelete(c.kind, c.id)} className="p-2 rounded-full hover:bg-destructive/10 text-destructive" aria-label="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-muted">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Abonnés */}
      <div className="bg-card rounded-3xl shadow-soft p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-primary">Mes abonnés récents</h3>
          <button className="text-xs text-primary font-semibold">Voir tout →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {subscribers.map((s) => (
            <div key={s.id} className="flex flex-col items-center text-center p-3 rounded-2xl bg-muted/40">
              <div className="w-12 h-12 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-semibold mb-2">
                {s.name[0]}
              </div>
              <p className="text-sm font-semibold truncate w-full">{s.name}</p>
              <p className="text-[10px] text-muted-foreground">{s.since}</p>
            </div>
          ))}
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

      {/* Sheet d'upload */}
      {showUpload && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => !submitting && setShowUpload(false)}
        >
          <div
            className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-card max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-primary">Nouvelle publication</h3>
              <button onClick={() => setShowUpload(false)} disabled={submitting} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {([
                { id: "audio", label: "Audio", icon: FileAudio },
                { id: "video", label: "Vidéo", icon: FileVideo },
                { id: "book", label: "Livre", icon: FileText },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setType(t.id); setFile(null); }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition",
                    type === t.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/40"
                  )}
                >
                  <t.icon className={cn("w-6 h-6", type === t.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-primary/5 transition mb-4">
              <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                {file ? file.name : "Glisser le fichier ici"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {file ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo` : "ou clique pour parcourir"}
              </p>
              <input
                type="file"
                accept={acceptForType[type]}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
                className="w-full h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description / verset associé..."
                rows={3}
                className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold hover:bg-muted cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span className="truncate">{cover ? cover.name : "Couverture"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setCover(e.target.files?.[0] ?? null)}
                  />
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 h-11 px-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option>Foi</option>
                  <option>Prière</option>
                  <option>Évangélisation</option>
                  <option>Famille</option>
                  <option>Adoration</option>
                  <option>Enseignement</option>
                  <option>Témoignage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setShowUpload(false)}
                disabled={submitting}
                className="h-12 rounded-full border font-semibold hover:bg-muted disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="h-12 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60"
              >
                {submitting ? "Publication..." : "Publier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
