import { ArrowLeft, Save, BookOpen, Image as ImageIcon, Smile, Share2, X, Search, Check } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const moods = [
  { emoji: "🙏", label: "Reconnaissant" },
  { emoji: "✨", label: "Inspiré" },
  { emoji: "💛", label: "Aimé" },
  { emoji: "😌", label: "En paix" },
  { emoji: "😢", label: "Touché" },
  { emoji: "🔥", label: "Brûlant" },
];

const contacts = [
  { id: 1, name: "Sarah", role: "ordinaire" },
  { id: 2, name: "Daniel", role: "createur" },
  { id: 3, name: "Esther", role: "createur" },
  { id: 4, name: "Samuel", role: "ordinaire" },
  { id: 5, name: "Jean", role: "ordinaire" },
  { id: 6, name: "Marie", role: "ordinaire" },
];

export default function NoteEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [verse, setVerse] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleContact = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="min-h-[calc(100dvh-7.5rem)] md:min-h-[calc(100dvh-5rem)] bg-background">
      {/* Toolbar */}
      <div className="sticky top-14 md:top-[73px] z-20 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link to="/app/journal" className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <span className="flex-1 font-display font-semibold text-primary">Nouvelle entrée</span>
          <button
            onClick={() => setShareOpen(true)}
            className="px-4 py-2 bg-card border rounded-full text-sm font-medium text-primary hover:bg-muted flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
          <button
            onClick={() => navigate("/app/journal")}
            className="px-4 py-2 gradient-primary text-primary-foreground rounded-full text-sm font-semibold shadow-glow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de ta note…"
          className="w-full bg-transparent font-display text-3xl md:text-4xl font-bold text-primary placeholder:text-primary/30 focus:outline-none"
        />

        {/* Verse reference */}
        <div className="flex items-center gap-3 bg-gold-soft rounded-2xl p-3">
          <BookOpen className="w-5 h-5 text-primary shrink-0 ml-2" />
          <input
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            placeholder="Verset de référence (ex : Jean 3:16)"
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-primary/50 focus:outline-none"
          />
        </div>

        {/* Mood */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Mon humeur spirituelle</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-sm border transition",
                  mood === m.label
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:bg-muted"
                )}
              >
                <span className="text-base">{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écris ici tes pensées, prières, réflexions, gratitudes…"
          rows={14}
          className="w-full bg-card border border-border rounded-2xl p-5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
        />

        {/* Attach */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border rounded-full text-sm hover:bg-muted">
            <ImageIcon className="w-4 h-4 text-primary" /> Photo
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border rounded-full text-sm hover:bg-muted">
            <Smile className="w-4 h-4 text-primary" /> Emoji
          </button>
        </div>
      </div>

      {/* Share sheet */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-primary-deep/40 backdrop-blur-sm" onClick={() => setShareOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-md bg-card rounded-t-3xl md:rounded-3xl shadow-card max-h-[80vh] flex flex-col">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-primary">Partager la note</h3>
                <p className="text-xs text-muted-foreground">Choisis les personnes avec qui partager</p>
              </div>
              <button onClick={() => setShareOpen(false)} className="p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Rechercher un contact..." className="w-full h-10 pl-10 pr-4 bg-muted rounded-full text-sm focus:outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {contacts.map((c) => {
                const isSel = selected.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleContact(c.id)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/60 transition text-left"
                  >
                    <div className="w-11 h-11 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{c.role}</div>
                    </div>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition",
                        isSel ? "bg-primary border-primary" : "border-border"
                      )}
                    >
                      {isSel && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-5 border-t">
              <button
                onClick={() => { setShareOpen(false); navigate("/app/messages"); }}
                disabled={selected.length === 0}
                className="w-full h-12 gradient-primary text-primary-foreground rounded-xl font-semibold shadow-glow disabled:opacity-50"
              >
                Envoyer à {selected.length} {selected.length > 1 ? "personnes" : "personne"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
