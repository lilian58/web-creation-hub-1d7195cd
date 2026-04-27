import { Mic, MicOff, Volume2, VolumeX, PhoneOff, UserPlus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function CallAudio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-primary via-primary-deep to-primary-deep text-primary-foreground">
      {/* Décor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative pt-12 md:pt-16 text-center">
        <p className="text-xs uppercase tracking-widest text-primary-foreground/70">Appel sécurisé</p>
        <p className="mt-1 text-sm text-primary-foreground/80">{fmt(seconds)}</p>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-gold/20 animate-pulse" />
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-card/10 backdrop-blur border-4 border-card/20 flex items-center justify-center text-6xl font-bold">
            S
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Sarah Mboula</h2>
          <p className="text-sm text-primary-foreground/70 mt-1">Contact #{id} · Appel en cours</p>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {Array.from({ length: 24 }).map((_, k) => (
            <span
              key={k}
              className="w-1 rounded-full bg-gold/70"
              style={{
                height: `${10 + Math.abs(Math.sin(k + seconds)) * 24}px`,
                animation: `pulse 1.${k % 9}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative px-6 pb-8 md:pb-12">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
          <button
            onClick={() => setMuted((m) => !m)}
            className={cn(
              "flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card/10 backdrop-blur transition",
              muted && "bg-gold text-primary-deep"
            )}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-xs">Muet</span>
          </button>
          <button
            onClick={() => setSpeaker((s) => !s)}
            className={cn(
              "flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card/10 backdrop-blur transition",
              speaker && "bg-gold text-primary-deep"
            )}
          >
            {speaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-xs">HP</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card/10 backdrop-blur">
            <UserPlus className="w-5 h-5" />
            <span className="text-xs">Ajouter</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => navigate("/app/messages")}
            className="w-14 h-14 rounded-full bg-card/10 backdrop-blur flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-destructive flex items-center justify-center shadow-glow"
            aria-label="Raccrocher"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          <div className="w-14 h-14" />
        </div>
      </div>
    </div>
  );
}
