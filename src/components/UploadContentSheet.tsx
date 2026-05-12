import { Upload, FileAudio, FileVideo, FileText, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { addBook, addPredication } from "@/lib/content-store";

export type UploadType = "audio" | "video" | "book";

const acceptForType: Record<UploadType, string> = {
  audio: "audio/*",
  video: "video/*",
  book: ".pdf,.epub,application/pdf,application/epub+zip",
};

interface Props {
  open: boolean;
  onClose: () => void;
  /** Filtrer les types proposés (par défaut tous). */
  allowedTypes?: UploadType[];
  onSuccess?: () => void;
}

export default function UploadContentSheet({
  open,
  onClose,
  allowedTypes = ["audio", "video", "book"],
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const [type, setType] = useState<UploadType>(allowedTypes[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Foi");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const reset = () => {
    setTitle(""); setDescription(""); setCategory("Foi");
    setFile(null); setCover(null); setType(allowedTypes[0]);
  };

  const close = () => { if (!submitting) { onClose(); } };

  const handleSubmit = async () => {
    if (!title.trim()) return toast({ title: "Titre requis", variant: "destructive" });
    if (!file) return toast({ title: "Fichier requis", variant: "destructive" });

    setSubmitting(true);
    try {
      if (type === "book") {
        await addBook({
          title, author: user?.name ?? "Anonyme",
          description, category, file, cover, authorId: user?.id,
        });
      } else {
        await addPredication({
          title, type, description, category,
          file, cover, author: user?.name ?? "Anonyme", authorId: user?.id,
        });
      }
      toast({ title: "Publication réussie", description: title });
      reset();
      onSuccess?.();
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Échec de la publication";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const typeMeta = [
    { id: "audio" as const, label: "Audio", icon: FileAudio },
    { id: "video" as const, label: "Vidéo", icon: FileVideo },
    { id: "book" as const, label: "Livre", icon: FileText },
  ].filter((t) => allowedTypes.includes(t.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={close}
    >
      <div
        className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-card max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-bold text-primary">Nouvelle publication</h3>
          <button onClick={close} disabled={submitting} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={cn("grid gap-2 mb-5", typeMeta.length === 1 ? "grid-cols-1" : typeMeta.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {typeMeta.map((t) => (
            <button
              key={t.id}
              onClick={() => { setType(t.id); setFile(null); }}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition",
                type === t.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/40"
              )}
            >
              <t.icon className={cn("w-6 h-6", type === t.id ? "text-primary" : "text-muted-foreground")} />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>

        <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-primary/5 transition mb-4">
          <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">
            {file ? file.name : "Glisser le fichier ici"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {file ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo` : "ou clique pour parcourir"}
          </p>
          <input
            type="file"
            accept={acceptForType[type]}
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre"
            className="w-full h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description / verset associé..."
            rows={3}
            className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold hover:bg-muted cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              <span className="truncate">{cover ? cover.name : "Couverture"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 h-11 px-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>Foi</option>
              <option>Prière</option>
              <option>Évangélisation</option>
              <option>Famille</option>
              <option>Adoration</option>
              <option>Enseignement</option>
              <option>Témoignage</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button onClick={close} disabled={submitting} className="h-12 rounded-full border font-semibold hover:bg-muted disabled:opacity-50">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="h-12 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60">
            {submitting ? "Publication..." : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
}
