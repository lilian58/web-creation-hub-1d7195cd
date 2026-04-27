import { Users, Flag, BarChart3, BookOpen, Mic, Search, MoreHorizontal, ShieldAlert, Check, X, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Utilisateurs", value: "12 384", delta: "+5.2%", icon: Users, color: "from-primary to-primary-glow" },
  { label: "Prédications", value: "1 247", delta: "+12", icon: Mic, color: "from-amber-500 to-orange-500" },
  { label: "Livres", value: "342", delta: "+8", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
  { label: "Signalements", value: "23", delta: "-3", icon: Flag, color: "from-rose-500 to-red-500" },
];

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

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Dashboard Admin</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Modération et statistiques de la plateforme</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Tous les services OK
        </div>
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
              <span className={cn("text-xs font-semibold flex items-center gap-0.5", s.delta.startsWith("-") ? "text-rose-500" : "text-emerald-600")}>
                <TrendingUp className="w-3 h-3" /> {s.delta}
              </span>
            </div>
          </div>
        ))}
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
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-primary to-primary-glow"
                style={{ height: `${v}%` }}
              />
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
    </div>
  );
}
