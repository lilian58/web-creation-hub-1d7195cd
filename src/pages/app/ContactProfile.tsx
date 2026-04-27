import { ArrowLeft, Phone, Video, MessageCircle, Share2, Bell, Shield, BookOpen, Mic } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ContactProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = {
    id,
    name: "Sarah Mboula",
    role: "Soeur en Christ",
    church: "Église Bethel · Douala",
    bio: "« Que la grâce du Seigneur soit avec vous tous. » — Passionnée par l'enseignement biblique et le partage avec mes frères et sœurs.",
    verse: "Philippiens 4:13",
    online: true,
  };

  return (
    <div className="min-h-full">
      <div className="relative h-44 md:h-56 gradient-primary">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/20 backdrop-blur text-primary-foreground flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/20 backdrop-blur text-primary-foreground flex items-center justify-center">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 md:px-6 lg:px-10 max-w-3xl mx-auto -mt-16">
        <div className="bg-card rounded-3xl shadow-card p-6 md:p-8">
          <div className="flex flex-col items-center text-center -mt-16 md:-mt-20">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full gradient-primary border-4 border-card flex items-center justify-center text-primary-foreground text-4xl font-bold">
                {contact.name[0]}
              </div>
              {contact.online && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mt-4">{contact.name}</h2>
            <p className="text-sm text-muted-foreground">{contact.role}</p>
            <p className="text-xs text-muted-foreground mt-1">{contact.church}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Link
              to={`/app/messages`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium">Message</span>
            </Link>
            <Link
              to={`/app/call/audio/${id}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition"
            >
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium">Appel</span>
            </Link>
            <Link
              to={`/app/call/video/${id}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition"
            >
              <Video className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium">Vidéo</span>
            </Link>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm italic text-foreground">{contact.bio}</p>
            <p className="text-xs text-primary font-semibold mt-2">📖 Verset préféré : {contact.verse}</p>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-sm text-primary mb-2">Contenu partagé récent</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">La grâce qui transforme</p>
                <p className="text-xs text-muted-foreground">Prédication · Partagée hier</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Vivre par la foi</p>
                <p className="text-xs text-muted-foreground">Livre · Partagé la semaine dernière</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm hover:bg-muted">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm text-destructive hover:bg-destructive/10">
              <Shield className="w-4 h-4" /> Bloquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
