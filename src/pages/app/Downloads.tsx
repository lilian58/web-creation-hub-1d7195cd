import { Download, BookOpen, Mic, Video, Trash2, Wifi, WifiOff, HardDrive, Play, Pause } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const downloads = [
  { id: 1, title: "La grâce qui transforme", type: "Audio", size: "24 Mo", duration: "32 min", progress: 100 },
  { id: 2, title: "Vivre par la foi — Tome 1", type: "Livre", size: "8 Mo", chapters: "12 ch.", progress: 100 },
  { id: 3, title: "Méditation du matin", type: "Vidéo", size: "142 Mo", duration: "18 min", progress: 100 },
  { id: 4, title: "Psaumes — Lecture audio", type: "Audio", size: "186 Mo", duration: "2h45", progress: 67 },
  { id: 5, title: "Le pouvoir de la prière", type: "Audio", size: "45 Mo", duration: "58 min", progress: 100 },
];

const used = 405;
const total = 2048;

export default function Downloads() {
  const [online, setOnline] = useState(true);

  const iconFor = (t: string) =>
    t === "Livre" ? BookOpen : t === "Vidéo" ? Video : Mic;

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Téléchargements</h2>
          <p className="text-sm text-muted-foreground mt-1">Édifie-toi même hors ligne</p>
        </div>
        <button
          onClick={() => setOnline((o) => !o)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition",
            online ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
          )}
        >
          {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {online ? "En ligne" : "Mode hors ligne"}
        </button>
      </div>

      {/* Stockage */}
      <div className="bg-card rounded-3xl shadow-soft p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Stockage utilisé</p>
            <p className="text-xs text-muted-foreground">{used} Mo sur {total} Mo</p>
          </div>
          <span className="text-sm font-bold text-primary">{Math.round((used / total) * 100)} %</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all"
            style={{ width: `${(used / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-4 text-xs">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Audio (255 Mo)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold" /> Vidéo (142 Mo)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Livres (8 Mo)</span>
          </div>
          <button className="text-rose-500 font-semibold hover:underline">Tout effacer</button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        <div className="p-5 md:p-6 border-b flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-primary">Mes contenus offline</h3>
          <span className="text-xs text-muted-foreground">{downloads.length} éléments</span>
        </div>
        <div className="divide-y">
          {downloads.map((d) => {
            const Icon = iconFor(d.type);
            const downloading = d.progress < 100;
            return (
              <div key={d.id} className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{d.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{d.type}</span>
                    <span>{d.size}</span>
                    <span>{d.duration ?? d.chapters}</span>
                  </div>
                  {downloading && (
                    <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: `${d.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {downloading ? (
                    <button className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center" aria-label="Pause">
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : d.type !== "Livre" ? (
                    <button className="w-10 h-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-glow" aria-label="Lecture">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  ) : (
                    <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center" aria-label="Ouvrir">
                      <BookOpen className="w-4 h-4" />
                    </button>
                  )}
                  <button className="w-10 h-10 rounded-full hover:bg-rose-500/10 text-rose-500 flex items-center justify-center" aria-label="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gold-soft border border-gold/30 rounded-2xl p-4 flex items-start gap-3">
        <Download className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-primary">Astuce</p>
          <p className="text-muted-foreground text-xs mt-0.5">
            Télécharge tes prédications préférées en Wi-Fi pour les écouter pendant tes trajets, sans connexion.
          </p>
        </div>
      </div>
    </div>
  );
}
