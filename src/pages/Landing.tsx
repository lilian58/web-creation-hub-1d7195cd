import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Mic, MessageCircle, NotebookPen, Sparkles } from "lucide-react";
import logo from "@/assets/spiritlink-logo.png";
import verseBg from "@/assets/verse-bg.jpg";

const features = [
  { icon: BookOpen, title: "Bible interactive", desc: "Lis, médite et marque tes versets préférés." },
  { icon: Mic, title: "Prédications", desc: "Audios et vidéos de pasteurs inspirants." },
  { icon: NotebookPen, title: "Journal spirituel", desc: "Note tes prières et réflexions au quotidien." },
  { icon: MessageCircle, title: "Communauté", desc: "Échange avec d'autres croyants par chat et appels." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SpiritLink" className="w-10 h-10" width={40} height={40} />
          <span className="font-display text-2xl font-bold text-primary">SpiritLink</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition">Fonctionnalités</a>
          <a href="#about" className="hover:text-primary transition">À propos</a>
          <Link to="/auth" className="hover:text-primary transition">Se connecter</Link>
        </nav>
        <Button asChild className="gradient-primary text-primary-foreground shadow-glow rounded-full px-6">
          <Link to="/app">Commencer</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-soft text-primary-deep text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Édification chrétienne
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.05]">
            Connectés en esprit,<br />
            <span className="text-gold">unis dans la Parole</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            SpiritLink rassemble la Bible, les prédications, ton journal spirituel et une communauté bienveillante dans une seule application pensée pour ta croissance dans la foi.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow rounded-full px-8 h-14 text-base">
              <Link to="/app">Découvrir l'app</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-primary/30 text-primary hover:bg-primary/5">
              <Link to="/auth">Se connecter</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 gradient-primary opacity-20 rounded-[3rem] blur-3xl" />
          <div className="relative rounded-[2rem] overflow-hidden shadow-card aspect-[4/5]">
            <img src={verseBg} alt="Bible ouverte au lever du soleil" className="w-full h-full object-cover" width={1024} height={640} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-0 p-8 text-primary-foreground">
              <span className="inline-block px-3 py-1 bg-gold rounded-full text-xs font-semibold text-primary-deep mb-3">Verset du jour</span>
              <p className="font-display text-2xl md:text-3xl leading-snug">"Confie-toi en l'Éternel de tout ton cœur..."</p>
              <p className="mt-2 text-sm opacity-90">Proverbes 3:5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/40 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">Tout pour grandir dans la foi</h2>
            <p className="text-muted-foreground text-lg">Une expérience complète, pensée pour ta vie spirituelle quotidienne.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="gradient-hero rounded-[2rem] p-10 md:p-16 text-center shadow-card">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Rejoins la communauté SpiritLink</h2>
          <p className="text-primary-foreground/85 max-w-xl mx-auto mb-8">Que Dieu bénisse ton chemin. Commence dès aujourd'hui à nourrir ton âme.</p>
          <Button asChild size="lg" className="bg-gold text-primary-deep hover:bg-gold/90 rounded-full px-10 h-14 text-base font-semibold">
            <Link to="/app">Entrer dans l'app</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 SpiritLink — Connectés en esprit, unis dans la Parole
      </footer>
    </div>
  );
}
