import { Search, UserPlus, Phone, Video, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const contacts = [
  { id: 1, name: "Sarah Mboula", role: "Soeur en Christ", online: true, church: "Église Bethel" },
  { id: 2, name: "Daniel Akin", role: "Pasteur", online: true, church: "Christ Embassy" },
  { id: 3, name: "Esther N.", role: "Soeur en Christ", online: false, church: "EEC" },
  { id: 4, name: "Samuel Ndi", role: "Frère en Christ", online: true, church: "Bethel" },
  { id: 5, name: "Marie Loko", role: "Servante", online: false, church: "Eden" },
  { id: 6, name: "Jean Kameni", role: "Frère en Christ", online: false, church: "Bethel" },
  { id: 7, name: "Aïcha B.", role: "Soeur en Christ", online: true, church: "EPC" },
  { id: 8, name: "Pierre Tchoua", role: "Diacre", online: false, church: "EEC" },
];

export default function Contacts() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const filtered = contacts.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase())
    );
    return filtered.reduce<Record<string, typeof contacts>>((acc, c) => {
      const letter = c.name[0].toUpperCase();
      acc[letter] = acc[letter] ?? [];
      acc[letter].push(c);
      return acc;
    }, {});
  }, [q]);

  return (
    <div className="px-4 md:px-6 lg:px-10 py-4 md:py-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Mes contacts</h2>
          <p className="text-sm text-muted-foreground mt-1">Frères et sœurs connectés</p>
        </div>
        <button className="w-11 h-11 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un contact..."
          className="w-full h-12 pl-11 pr-4 bg-card rounded-full text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
        {Object.keys(grouped).sort().map((letter) => (
          <div key={letter}>
            <div className="px-5 py-2 text-xs font-bold text-primary bg-muted/50 sticky top-0">
              {letter}
            </div>
            {grouped[letter].map((c) => (
              <Link
                key={c.id}
                to={`/app/contacts/${c.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition border-b last:border-b-0"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {c.name[0]}
                  </div>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.role} · {c.church}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => { e.preventDefault(); navigate(`/app/call/audio/${c.id}`); }}
                    className="p-2 rounded-full hover:bg-primary/10 text-primary"
                    aria-label="Appel audio"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); navigate(`/app/call/video/${c.id}`); }}
                    className="p-2 rounded-full hover:bg-primary/10 text-primary"
                    aria-label="Appel vidéo"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); navigate(`/app/messages`); }}
                    className="p-2 rounded-full hover:bg-primary/10 text-primary"
                    aria-label="Message"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Aucun contact trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
