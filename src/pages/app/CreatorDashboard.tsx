import { Upload, Mic, BookOpen, Eye, Heart, Users as UsersIcon, DollarSign, Plus, MoreVertical, Image as ImageIcon, FileAudio, FileVideo, FileText, X, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const myContent = [
  { id: 1, title: "La grâce qui transforme", type: "Audio", views: 1247, likes: 89, status: "publié" },
  { id: 2, title: "Vivre par la foi — Tome 1", type: "Livre", views: 532, likes: 42, status: "publié" },
  { id: 3, title: "Méditation matinale #12", type: "Vidéo", views: 0, likes: 0, status: "brouillon" },
  { id: 4, title: "Le pouvoir de la prière", type: "Audio", views: 2841, likes: 213, status: "publié" },
];

const subscribers = [
  { id: 1, name: "Sarah M.", since: "Il y a 2 mois" },
  { id: 2, name: "Daniel A.", since: "Il y a 1 mois" },
  { id: 3, name: "Esther N.", since: "Il y a 3 sem." },
  { id: 4, name: "Samuel N.", since: "Il y a 1 sem." },
  { id: 5, name: "Marie L.", since: "Il y a 4 jours" },
];

const stats = [
  { label: "Vues totales", value: "14 632", icon: Eye, color: "from-primary to-primary-glow" },
  { label: "Abonnés", value: "847", icon: UsersIcon, color: "from-amber-500 to-orange-500" },
  { label: "J'aime", value: "1 209", icon: Heart, color: "from-rose-500 to-pink-500" },
  { label: "Revenus", value: "320 €", icon: DollarSign, color: "from-emerald-500 to-teal-500" },
];

export default function CreatorDashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [type, setType] = useState<"audio" | "video" | "book">("audio");

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
                <TrendingUp className="w-3 h-3" /> +8%
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
        <div className="divide-y">
          {myContent.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {c.type === "Livre" ? <BookOpen className="w-5 h-5" /> : c.type === "Vidéo" ? <FileVideo className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{c.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span>{c.type}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {c.views}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {c.likes}</span>
                </div>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                c.status === "publié" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
              )}>
                {c.status}
              </span>
              <button className="p-2 rounded-full hover:bg-muted">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
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
          onClick={() => setShowUpload(false)}
        >
          <div
            className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-card max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-primary">Nouvelle publication</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
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
                  onClick={() => setType(t.id)}
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
              <p className="text-sm font-semibold text-foreground">Glisser le fichier ici</p>
              <p className="text-xs text-muted-foreground mt-1">ou clique pour parcourir</p>
              <input type="file" className="hidden" />
            </label>

            <div className="space-y-3">
              <input placeholder="Titre" className="w-full h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none" />
              <textarea placeholder="Description / verset associé..." rows={3} className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none resize-none" />
              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold hover:bg-muted">
                  <ImageIcon className="w-4 h-4" /> Couverture
                </button>
                <select className="flex-1 h-11 px-3 bg-muted rounded-xl text-sm focus:outline-none">
                  <option>Catégorie : Foi</option>
                  <option>Prière</option>
                  <option>Évangélisation</option>
                  <option>Famille</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setShowUpload(false)} className="h-12 rounded-full border font-semibold">
                Brouillon
              </button>
              <button onClick={() => setShowUpload(false)} className="h-12 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow">
                Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
