import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, Type, Settings2, List } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const chapters = [
  { num: 1, title: "Le commencement", text: `Au commencement de notre marche spirituelle, il convient de poser des fondations solides. La foi n'est pas une émotion passagère, mais une décision quotidienne de placer notre confiance en Celui qui nous a aimés le premier.\n\nQuand nous regardons en arrière, nous voyons combien Dieu a été fidèle. Chaque épreuve traversée porte la marque de Sa grâce. Chaque larme versée a été recueillie dans Sa coupe.\n\n« L'Éternel est mon berger, je ne manquerai de rien. »\n\nCette parole, gravée dans nos cœurs depuis l'enfance pour certains, prend tout son sens lorsque nous traversons la vallée. Le berger ne quitte jamais ses brebis. Il les conduit, les protège, les nourrit.` },
  { num: 2, title: "La grâce qui sauve", text: `La grâce ne se mérite pas. Elle se reçoit. C'est là toute la beauté de l'évangile.\n\nNous avons tous, à un moment ou à un autre, tenté de gagner l'amour de Dieu par nos œuvres. Mais Dieu nous aime non à cause de ce que nous faisons, mais à cause de ce que Christ a fait.\n\nReposons-nous dans cette vérité aujourd'hui.` },
  { num: 3, title: "Marcher par l'Esprit", text: `L'Esprit Saint est notre guide quotidien. Apprendre à reconnaître Sa voix demande du temps, du silence, de l'écoute.\n\nDans le tumulte du monde, prenons un moment chaque jour pour nous arrêter et prêter l'oreille.` },
];

export default function BookReader() {
  const { id } = useParams();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [fontSize, setFontSize] = useState(17);
  const [showTOC, setShowTOC] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const chapter = chapters[chapterIdx];
  const progress = ((chapterIdx + 1) / chapters.length) * 100;

  return (
    <div className="min-h-[calc(100dvh-7.5rem)] md:min-h-[calc(100dvh-5rem)] bg-[hsl(40_30%_98%)]">
      {/* Reader header */}
      <div className="sticky top-14 md:top-[73px] z-20 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link to="/app/bibliotheque" className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-primary truncate">La grâce qui transforme</h2>
            <p className="text-xs text-muted-foreground">Chapitre {chapter.num} · {chapter.title}</p>
          </div>
          <button onClick={() => setShowTOC(!showTOC)} className="p-2 rounded-full hover:bg-muted" aria-label="Sommaire">
            <List className="w-5 h-5 text-primary" />
          </button>
          <button onClick={() => setBookmarked(!bookmarked)} className="p-2 rounded-full hover:bg-muted" aria-label="Marquer">
            <Bookmark className={cn("w-5 h-5", bookmarked ? "fill-gold text-gold" : "text-primary")} />
          </button>
        </div>
        <div className="h-1 bg-muted">
          <div className="h-full gradient-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* TOC drawer */}
      {showTOC && (
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 border-b bg-card">
          <h3 className="font-display font-semibold text-primary mb-3">Sommaire</h3>
          <div className="space-y-1">
            {chapters.map((c, i) => (
              <button
                key={c.num}
                onClick={() => { setChapterIdx(i); setShowTOC(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-3",
                  i === chapterIdx ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                )}
              >
                <span className="font-display text-lg w-8 text-center text-gold">{c.num}</span>
                <span>{c.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reading area */}
      <article className="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">Chapitre {chapter.num}</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary mb-8">{chapter.title}</h1>
        <div
          className="font-display text-foreground leading-relaxed whitespace-pre-line"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}
        >
          {chapter.text}
        </div>
      </article>

      {/* Footer controls */}
      <div className="sticky bottom-20 md:bottom-4 z-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 flex justify-between items-center gap-3">
          <button
            onClick={() => setChapterIdx(Math.max(0, chapterIdx - 1))}
            disabled={chapterIdx === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border rounded-full text-sm font-medium disabled:opacity-40 hover:bg-muted shadow-soft"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <div className="flex items-center gap-2 bg-card border rounded-full px-2 py-1 shadow-soft">
            <button onClick={() => setFontSize(Math.max(13, fontSize - 1))} className="w-8 h-8 rounded-full hover:bg-muted text-sm font-bold">A-</button>
            <Type className="w-4 h-4 text-muted-foreground" />
            <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="w-8 h-8 rounded-full hover:bg-muted text-sm font-bold">A+</button>
          </div>
          <button
            onClick={() => setChapterIdx(Math.min(chapters.length - 1, chapterIdx + 1))}
            disabled={chapterIdx === chapters.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-primary-foreground rounded-full text-sm font-medium disabled:opacity-40 shadow-glow"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
