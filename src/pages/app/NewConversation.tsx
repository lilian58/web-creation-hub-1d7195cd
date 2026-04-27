import { ArrowLeft, Search, Users, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const contacts = [
  { id: 1, name: "Sarah Mboula", online: true },
  { id: 2, name: "Daniel Akin", online: true },
  { id: 3, name: "Esther N.", online: false },
  { id: 4, name: "Samuel Ndi", online: true },
  { id: 5, name: "Marie Loko", online: false },
  { id: 6, name: "Jean Kameni", online: false },
  { id: 7, name: "Aïcha B.", online: true },
];

export default function NewConversation() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();

  const filtered = useMemo(
    () => contacts.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const isGroup = selected.length > 1;

  return (
    <div className="px-4 md:px-6 lg:px-10 py-4 md:py-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-primary">Nouvelle conversation</h2>
          <p className="text-xs text-muted-foreground">
            {selected.length === 0
              ? "Choisis un ou plusieurs contacts"
              : `${selected.length} sélectionné${selected.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un contact..."
          className="w-full h-12 pl-11 pr-4 bg-card rounded-full text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card shadow-soft mb-4 hover:bg-muted/40 transition">
        <div className="w-11 h-11 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-foreground">Créer un groupe de prière</p>
          <p className="text-xs text-muted-foreground">Ajoute plusieurs frères et sœurs</p>
        </div>
      </button>

      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        {filtered.map((c) => {
          const checked = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 hover:bg-muted/40 transition text-left border-b last:border-b-0",
                checked && "bg-primary/5"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {c.name[0]}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.online ? "En ligne" : "Hors ligne"}</p>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition",
                  checked ? "bg-primary border-primary" : "border-muted-foreground/30"
                )}
              >
                {checked && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-40">
          <button
            onClick={() => navigate("/app/messages")}
            className="w-full h-13 py-3.5 gradient-primary text-primary-foreground rounded-full font-semibold shadow-glow"
          >
            {isGroup ? `Créer le groupe (${selected.length})` : "Démarrer la conversation"}
          </button>
        </div>
      )}
    </div>
  );
}
