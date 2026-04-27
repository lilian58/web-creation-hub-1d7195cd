import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCcw, MessageCircle, Maximize } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import preachingBg from "@/assets/preaching-1.jpg";

export default function CallVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden">
      {/* Flux distant */}
      <div className="absolute inset-0">
        <img
          src={preachingBg}
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium">{fmt(seconds)}</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Nom du contact */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
        <h2 className="font-display text-2xl font-bold drop-shadow-lg">Sarah Mboula</h2>
        <p className="text-xs text-white/80 drop-shadow">Contact #{id}</p>
      </div>

      {/* Vignette caméra locale */}
      <div className="absolute top-20 right-4 md:top-24 md:right-6 w-28 h-40 md:w-36 md:h-52 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center">
        {camOff ? (
          <div className="text-center">
            <VideoOff className="w-6 h-6 mx-auto opacity-70" />
            <p className="text-[10px] mt-1 opacity-70">Caméra coupée</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold">M</div>
        )}
      </div>

      {/* Contrôles */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-8">
        <div className="max-w-md mx-auto bg-black/40 backdrop-blur-xl rounded-full px-3 py-3 flex items-center justify-around">
          <button
            onClick={() => setMuted((m) => !m)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition",
              muted ? "bg-gold text-primary-deep" : "bg-white/15"
            )}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setCamOff((c) => !c)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition",
              camOff ? "bg-gold text-primary-deep" : "bg-white/15"
            )}
          >
            {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/app/messages")}
            className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center shadow-glow"
            aria-label="Raccrocher"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
