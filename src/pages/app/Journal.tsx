import { Plus, Calendar, Bookmark, MoreVertical } from "lucide-react";

const entries = [
  { day: "18", month: "Mai", title: "Gratitude", excerpt: "Seigneur, merci pour cette nouvelle journée. Tu es fidèle..." },
  { day: "17", month: "Mai", title: "Prière du matin", excerpt: "Je remets cette journée entre tes mains. Guide mes pas..." },
  { day: "15", month: "Mai", title: "Réflexion", excerpt: "J'ai appris à me reposer en Toi et à avoir confiance..." },
  { day: "12", month: "Mai", title: "Reconnaissance", excerpt: "Merci pour tes bienfaits et ta protection..." },
  { day: "08", month: "Mai", title: "Méditation", excerpt: "Psaumes 23 — L'Éternel est mon berger..." },
];

export default function Journal() {
  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-end">
        <button className="p-2.5 rounded-full hover:bg-muted" aria-label="Calendrier">
          <Calendar className="w-5 h-5 text-primary" />
        </button>
      </div>

      <button className="w-full gradient-primary text-primary-foreground rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold shadow-glow hover:shadow-card transition">
        <Plus className="w-5 h-5" /> Nouvelle entrée
      </button>

      <div>
        <h3 className="font-display text-lg font-semibold text-primary mb-3">Mes entrées</h3>
        <div className="space-y-3">
          {entries.map((e, i) => (
            <div key={i} className="flex gap-4 bg-card rounded-2xl p-4 shadow-soft hover:shadow-card transition cursor-pointer">
              <div className="shrink-0 w-14 text-center">
                <div className="font-display text-2xl font-bold text-primary leading-none">{e.day}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{e.month}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{e.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{e.excerpt}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Bookmark className="w-4 h-4 text-gold" />
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
