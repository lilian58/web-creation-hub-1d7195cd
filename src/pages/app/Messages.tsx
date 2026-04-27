import { Search, Edit3, Phone, Video, MoreVertical, Mic, Paperclip, Send, Play, ArrowLeft, Image as ImageIcon, FileText, NotebookPen, MapPin, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const conversations = [
  { id: 1, name: "Sarah", last: "Merci pour ton message 🙏", time: "10:30", unread: 3, online: true },
  { id: 2, name: "Daniel", last: "Que Dieu te bénisse !", time: "09:15", unread: 1, online: true },
  { id: 3, name: "Esther", last: "Merci pour le message 🙏", time: "Hier", unread: 0, online: false },
  { id: 4, name: "Samuel", last: "On se retrouve ce soir", time: "Hier", unread: 0, online: true },
  { id: 5, name: "Jean", last: "Amen, merci Seigneur !", time: "Mer", unread: 0, online: false },
  { id: 6, name: "Marie", last: "Dieu est bon tout le temps !", time: "Lun", unread: 0, online: false },
];

const messages = [
  { from: "them", text: "Salut Sarah ! 🌸", time: "10:15" },
  { from: "me", text: "Hello ! Comment vas-tu ?", time: "10:16" },
  { from: "them", text: "Très bien, gloire à Dieu ! Et toi ?", time: "10:17" },
  { from: "me", type: "audio", duration: "0:18", time: "10:22" },
  { from: "them", type: "audio", duration: "0:23", time: "10:25" },
  { from: "me", text: "Merci pour ton partage 🙏", time: "10:30" },
];

export default function Messages() {
  const [active, setActive] = useState<typeof conversations[number] | null>(null);
  const [showAttach, setShowAttach] = useState(false);
  const navigate = useNavigate();

  const attachOptions = [
    { icon: ImageIcon, label: "Photo / Vidéo", color: "bg-blue-500" },
    { icon: FileText, label: "Document PDF", color: "bg-rose-500" },
    { icon: NotebookPen, label: "Note du Journal", color: "bg-gold" },
    { icon: Mic, label: "Message vocal", color: "bg-primary" },
    { icon: MapPin, label: "Position", color: "bg-emerald-500" },
  ];

  return (
    <div className="h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-5rem)] md:px-6 lg:px-10 md:py-4 lg:py-6 max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)] md:gap-6 h-full min-h-0">
        {/* Conversation list — caché sur mobile quand un chat est ouvert */}
        <div
          className={cn(
            "bg-card md:rounded-3xl md:shadow-soft flex-col overflow-hidden h-full min-h-0",
            active ? "hidden md:flex" : "flex"
          )}
        >
          <div className="p-4 lg:p-6 flex items-center justify-between border-b shrink-0">
            <h2 className="font-display text-xl font-bold text-primary">Conversations</h2>
            <Link
              to="/app/messages/new"
              className="w-9 h-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-glow"
              aria-label="Nouvelle conversation"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-4 py-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Rechercher..."
                className="w-full h-10 pl-10 pr-4 bg-muted rounded-full text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition text-left",
                  active?.id === c.id && "bg-muted/60"
                )}
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
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-foreground truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{c.time}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 mt-0.5">
                    <p className="text-sm text-muted-foreground truncate">{c.last}</p>
                    {c.unread > 0 && (
                      <span className="shrink-0 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div
          className={cn(
            "bg-card md:rounded-3xl md:shadow-soft flex-col overflow-hidden h-full min-h-0",
            active ? "flex" : "hidden md:flex"
          )}
        >
          {active ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActive(null)}
                  className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-muted"
                  aria-label="Retour"
                >
                  <ArrowLeft className="w-5 h-5 text-primary" />
                </button>
                <div className="relative">
                  <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {active.name[0]}
                  </div>
                  {active.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{active.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {active.online ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/app/call/audio/${active.id}`)}
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Appel audio"
                >
                  <Phone className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => navigate(`/app/call/video/${active.id}`)}
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Appel vidéo"
                >
                  <Video className="w-5 h-5 text-primary" />
                </button>
                <Link
                  to={`/app/contacts/${active.id}`}
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Profil"
                >
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 bg-muted/20">
                <div className="text-center text-xs text-muted-foreground my-2">Aujourd'hui</div>
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl",
                        m.from === "me"
                          ? "gradient-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border rounded-bl-sm"
                      )}
                    >
                      {m.type === "audio" ? (
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <button
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              m.from === "me"
                                ? "bg-primary-foreground/20"
                                : "bg-primary text-primary-foreground"
                            )}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <div className="flex-1 flex items-center gap-0.5">
                            {Array.from({ length: 18 }).map((_, k) => (
                              <span
                                key={k}
                                className={cn(
                                  "w-0.5 rounded-full",
                                  m.from === "me" ? "bg-primary-foreground/60" : "bg-primary/40"
                                )}
                                style={{ height: `${6 + Math.abs(Math.sin(k)) * 14}px` }}
                              />
                            ))}
                          </div>
                          <span
                            className={cn(
                              "text-xs",
                              m.from === "me" ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}
                          >
                            {m.duration}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm">{m.text}</p>
                      )}
                      <p
                        className={cn(
                          "text-[10px] mt-1 text-right",
                          m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 lg:p-4 border-t flex items-center gap-2 bg-card shrink-0">
                <button
                  onClick={() => setShowAttach(true)}
                  className="p-2.5 rounded-full hover:bg-muted shrink-0"
                  aria-label="Joindre"
                >
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>
                <input
                  placeholder="Écrire un message..."
                  className="flex-1 min-w-0 h-11 px-4 bg-muted rounded-full text-sm focus:outline-none"
                />
                <button className="w-11 h-11 rounded-full bg-gold text-primary-deep flex items-center justify-center hover:bg-gold/90 shrink-0">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="w-11 h-11 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-glow shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Attachment sheet */}
              {showAttach && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center"
                  onClick={() => setShowAttach(false)}
                >
                  <div
                    className="bg-card w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-5 shadow-card animate-in slide-in-from-bottom"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-bold text-primary">Joindre</h3>
                      <button
                        onClick={() => setShowAttach(false)}
                        className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setShowAttach(false)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-muted/60 transition"
                        >
                          <div className={cn("w-12 h-12 rounded-2xl text-white flex items-center justify-center", opt.color)}>
                            <opt.icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs text-center font-medium leading-tight">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-center p-8">
              <div>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Edit3 className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-2">
                  Sélectionne une conversation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Choisis un contact pour commencer à échanger.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
