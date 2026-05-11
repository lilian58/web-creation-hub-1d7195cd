import { Search, Filter, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import preaching from "@/assets/preaching-1.jpg";
import { useUploadedPredications } from "@/lib/content-store";

const categories = ["Toutes", "Foi", "Prière", "Adoration", "Enseignement", "Témoignage"];
const baseSermons = [
  { id: "s-1", title: "Marcher par la foi et non par la vue", author: "Pasteur Daniel", duration: "28 min", date: "Mai", cover: preaching },
  { id: "s-2", title: "Dieu a un plan pour ta vie", author: "Prophète Samuel", duration: "32 min", date: "3 j", cover: preaching },
  { id: "s-3", title: "Le pouvoir de la prière", author: "Pasteure Esther", duration: "21 min", date: "Hier", cover: preaching },
  { id: "s-4", title: "Vivre dans la présence de Dieu", author: "Pasteur Daniel", duration: "26 min", date: "Mer", cover: preaching },
  { id: "s-5", title: "L'amour comme fondement", author: "Pasteur Jean", duration: "35 min", date: "Lun", cover: preaching },
  { id: "s-6", title: "La grâce qui transforme", author: "Pasteure Marie", duration: "29 min", date: "Dim", cover: preaching },
];

export default function Predications() {
  const [cat, setCat] = useState("Toutes");
  const uploaded = useUploadedPredications();
  const sermons = useMemo(
    () => [
      ...uploaded.map((p) => ({
        id: p.id,
        title: p.title,
        author: p.author,
        duration: p.type === "video" ? "Vidéo" : "Audio",
        date: "Nouveau",
        cover: p.coverUrl || preaching,
      })),
      ...baseSermons,
    ],
    [uploaded]
  );
  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-end">
        <button className="p-2.5 rounded-full hover:bg-muted" aria-label="Filtrer">
          <Filter className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          placeholder="Rechercher une prédication..."
          className="w-full h-12 pl-12 pr-4 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 px-5 py-2 rounded-full text-sm font-medium transition",
              cat === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {sermons.map((s) => (
          <Link to={`/app/predications/${s.id}`} key={s.id} className="flex items-center gap-4 bg-card rounded-2xl p-3 shadow-soft hover:shadow-card transition group cursor-pointer">
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden shrink-0">
              <img src={s.cover} alt="" loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary-deep/30 group-hover:bg-primary-deep/50 transition flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/95 flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground line-clamp-2">{s.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{s.author}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{s.duration}</span><span>•</span><span>{s.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
