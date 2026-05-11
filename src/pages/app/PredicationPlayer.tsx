import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart, Share2, Download, Mic2, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import preaching from "@/assets/preaching-1.jpg";
import { findUploadedPredication } from "@/lib/content-store";

export default function PredicationPlayer() {
  const { id } = useParams();
  const uploaded = useMemo(() => (id ? findUploadedPredication(id) : null), [id]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(uploaded ? 0 : 34);
  const [favorite, setFavorite] = useState(false);
  const [mode, setMode] = useState<"audio" | "video">(uploaded?.type ?? "audio");
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing]);

  const title = uploaded?.title ?? "Marcher par la foi";
  const author = uploaded?.author ?? "Pasteur Daniel K.";
  const cover = uploaded?.coverUrl || preaching;

  return (
    <div className="min-h-[calc(100dvh-7.5rem)] md:min-h-[calc(100dvh-5rem)] gradient-hero text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/app/predications" className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="text-sm font-medium opacity-80">Lecture en cours</span>
          <button onClick={() => setFavorite(!favorite)} className="p-2 rounded-full hover:bg-primary-foreground/10" aria-label="Favori">
            <Heart className={cn("w-5 h-5", favorite && "fill-gold text-gold")} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setMode("audio")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition",
              mode === "audio" ? "bg-gold text-primary-deep" : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
            )}
          >
            <Mic2 className="w-4 h-4" /> Audio
          </button>
          <button
            onClick={() => setMode("video")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition",
              mode === "video" ? "bg-gold text-primary-deep" : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
            )}
          >
            <Video className="w-4 h-4" /> Vidéo
          </button>
        </div>

        {/* Cover / video frame */}
        <div className="relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden shadow-glow mb-8 bg-black/20">
          {uploaded && mode === "video" ? (
            <video
              ref={(el) => { mediaRef.current = el; }}
              src={uploaded.mediaUrl}
              poster={uploaded.coverUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              onEnded={() => setPlaying(false)}
              playsInline
            />
          ) : (
            <img src={cover} alt="" className="w-full h-full object-cover" width={800} height={600} />
          )}
          {uploaded && mode === "audio" && (
            <audio
              ref={(el) => { mediaRef.current = el; }}
              src={uploaded.mediaUrl}
              onTimeUpdate={(e) => {
                const a = e.currentTarget;
                if (a.duration) setProgress((a.currentTime / a.duration) * 100);
              }}
              onEnded={() => setPlaying(false)}
            />
          )}
          {mode === "video" && !uploaded && (
            <div className="absolute inset-0 bg-primary-deep/20 flex items-center justify-center">
              <button onClick={() => setPlaying(!playing)} className="w-20 h-20 rounded-full bg-primary-foreground/95 flex items-center justify-center text-primary shadow-glow">
                {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
            </div>
          )}
        </div>

        {/* Title & author */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-primary-foreground/80">{author}</p>
          {uploaded?.category && (
            <p className="text-gold text-sm font-medium mt-1">Catégorie : {uploaded.category}</p>
          )}
        </div>

        {/* Waveform / progress */}
        <div className="mb-2">
          <div className="flex items-center gap-0.5 h-12">
            {Array.from({ length: 60 }).map((_, k) => (
              <span
                key={k}
                className={cn(
                  "flex-1 rounded-full transition-all",
                  k < (progress / 100) * 60 ? "bg-gold" : "bg-primary-foreground/30"
                )}
                style={{ height: `${20 + Math.abs(Math.sin(k * 0.6)) * 70}%` }}
              />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full -mt-1 accent-gold"
          />
          <div className="flex justify-between text-xs opacity-80">
            <span>10:54</span>
            <span>32:15</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 my-8">
          <button className="p-3 rounded-full hover:bg-primary-foreground/10" aria-label="Précédent">
            <SkipBack className="w-7 h-7 fill-current" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="w-20 h-20 rounded-full bg-gold text-primary-deep flex items-center justify-center shadow-glow hover:scale-105 transition"
            aria-label={playing ? "Pause" : "Lire"}
          >
            {playing ? <Pause className="w-9 h-9 fill-current" /> : <Play className="w-9 h-9 fill-current ml-1" />}
          </button>
          <button className="p-3 rounded-full hover:bg-primary-foreground/10" aria-label="Suivant">
            <SkipForward className="w-7 h-7 fill-current" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 mb-8">
          <button className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-primary-foreground/10 hover:bg-primary-foreground/20 flex-1 max-w-[110px]">
            <Download className="w-5 h-5" />
            <span className="text-xs">Télécharger</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-primary-foreground/10 hover:bg-primary-foreground/20 flex-1 max-w-[110px]">
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Partager</span>
          </button>
          <Link to="/app/journal/new" className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-primary-foreground/10 hover:bg-primary-foreground/20 flex-1 max-w-[110px]">
            <Mic2 className="w-5 h-5" />
            <span className="text-xs">Prendre note</span>
          </Link>
        </div>

        {/* Description */}
        <div className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold mb-2 text-gold">À propos</h3>
          <p className="text-sm text-primary-foreground/85 leading-relaxed">
            Une méditation profonde sur Hébreux 11. Le pasteur Daniel nous invite à examiner ce que signifie réellement marcher par la foi, et non par la vue, dans les épreuves du quotidien.
          </p>
        </div>
      </div>
    </div>
  );
}
