import { Link } from "react-router-dom";
import { BookOpen, Mic, Library, MessageCircle, Play, ChevronRight } from "lucide-react";
import verseBg from "@/assets/verse-bg.jpg";
import preaching from "@/assets/preaching-1.jpg";

const quickAccess = [
  { icon: BookOpen, label: "Bible", to: "/app/bible", color: "bg-primary text-primary-foreground" },
  { icon: Library, label: "Livres", to: "/app/bibliotheque", color: "bg-gold-soft text-primary-deep" },
  { icon: Mic, label: "Prédications", to: "/app/predications", color: "bg-primary/90 text-primary-foreground" },
  { icon: MessageCircle, label: "Messages", to: "/app/messages", color: "bg-gold-soft text-primary-deep" },
];

const sermons = [
  { title: "Marcher par la foi", author: "Ps. Daniel K.", duration: "32:15" },
  { title: "La paix de Dieu", author: "Pasteure Esther", duration: "28:42" },
  { title: "Le pouvoir de la prière", author: "Prophète Samuel", duration: "21:08" },
];

export default function Home() {
  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 lg:py-8 max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
          Bonjour, Sarah ✨
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Que Dieu bénisse ta journée.
        </p>
      </div>

      {/* Verse of the day */}
      <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[16/9] lg:aspect-[21/9]">
        <img src={verseBg} alt="Verset du jour" className="absolute inset-0 w-full h-full object-cover" width={1024} height={640} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/85 via-primary/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-6 lg:p-10 text-primary-foreground">
          <span className="inline-flex w-fit px-3 py-1 bg-gold rounded-full text-xs font-semibold text-primary-deep">Verset du jour</span>
          <div>
            <p className="font-display text-2xl lg:text-4xl leading-snug max-w-2xl">"Confie-toi en l'Éternel de tout ton cœur..."</p>
            <p className="mt-2 opacity-90">Proverbes 3:5</p>
            <button className="mt-4 px-5 py-2.5 bg-primary-foreground/15 backdrop-blur hover:bg-primary-foreground/25 rounded-full text-sm font-medium transition">
              Méditer
            </button>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h3 className="font-display text-xl font-semibold text-primary mb-4">Accès rapide</h3>
        <div className="grid grid-cols-4 gap-3 lg:gap-5">
          {quickAccess.map((q) => (
            <Link key={q.label} to={q.to} className="group flex flex-col items-center gap-2">
              <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl ${q.color} flex items-center justify-center shadow-soft group-hover:scale-105 group-hover:shadow-glow transition-all`}>
                <q.icon className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
              <span className="text-xs lg:text-sm font-medium text-foreground">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sermon of the day */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold text-primary">Prédication du jour</h3>
          <Link to="/app/predications" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {sermons.map((s, i) => (
            <div key={i} className="flex items-center gap-4 bg-card rounded-2xl p-3 shadow-soft hover:shadow-card transition group">
              <div className="relative w-20 h-20 lg:w-28 lg:h-24 rounded-xl overflow-hidden shrink-0">
                <img src={preaching} alt="" className="w-full h-full object-cover" loading="lazy" width={800} height={600} />
                <div className="absolute inset-0 bg-primary-deep/30 flex items-center justify-center group-hover:bg-primary-deep/50 transition">
                  <div className="w-9 h-9 rounded-full bg-primary-foreground/95 flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.author}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
