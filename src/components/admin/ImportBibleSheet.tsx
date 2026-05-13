import { useEffect, useMemo, useState } from "react";
import { Languages, Upload, X, Globe, FileUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  addBibleVersion,
  addBibleVersionFromApi,
} from "@/lib/bible-store";
import {
  listBibleApiTranslations,
  listGetBibleTranslations,
  type BibleApiSource,
  type BibleApiTranslation,
} from "@/lib/bible-api";

type Mode = "file" | "api";

export default function ImportBibleSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>("file");

  // file fields
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("fr");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // api fields
  const [source, setSource] = useState<BibleApiSource>("bible-api");
  const [translation, setTranslation] = useState<string>("lsg1910");
  const [apiList, setApiList] = useState<BibleApiTranslation[]>(listBibleApiTranslations());
  const [loadingList, setLoadingList] = useState(false);
  const [progress, setProgress] = useState<{ pct: number; label?: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (source === "bible-api") {
      setApiList(listBibleApiTranslations());
      setTranslation((prev) => prev || "lsg1910");
    } else {
      setLoadingList(true);
      listGetBibleTranslations()
        .then((list) => {
          setApiList(list);
          setTranslation((prev) => (list.find((t) => t.id === prev) ? prev : list[0]?.id ?? ""));
        })
        .catch((e) => toast({ title: "Liste indisponible", description: String(e), variant: "destructive" }))
        .finally(() => setLoadingList(false));
    }
  }, [source, open]);

  const selected = useMemo(() => apiList.find((t) => t.id === translation), [apiList, translation]);

  const reset = () => {
    setCode(""); setName(""); setLanguage("fr"); setDescription(""); setFile(null);
    setProgress(null); setSubmitting(false);
  };
  const close = () => { if (!submitting) { reset(); onClose(); } };

  const submitFile = async () => {
    if (!code.trim() || !name.trim()) return toast({ title: "Code et nom requis", variant: "destructive" });
    if (!file) return toast({ title: "Fichier requis", variant: "destructive" });
    setSubmitting(true);
    try {
      const v = await addBibleVersion({ code, name, language, description, file });
      toast({ title: "Version ajoutée", description: `${v.name} · ${v.versesCount} versets` });
      reset(); onClose();
    } catch (e) {
      toast({ title: "Erreur", description: e instanceof Error ? e.message : "Échec", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const submitApi = async () => {
    if (!translation) return toast({ title: "Sélectionne une traduction", variant: "destructive" });
    setSubmitting(true); setProgress({ pct: 0 });
    try {
      const v = await addBibleVersionFromApi(
        {
          source,
          translation,
          code: code.trim() || selected?.code,
          name: name.trim() || selected?.name,
          language: language.trim() || selected?.language,
          description,
        },
        (pct, label) => setProgress({ pct, label }),
      );
      toast({ title: "Version importée", description: `${v.name} · ${v.versesCount} versets` });
      reset(); onClose();
    } catch (e) {
      toast({ title: "Erreur", description: e instanceof Error ? e.message : "Échec", variant: "destructive" });
    } finally { setSubmitting(false); setProgress(null); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4" onClick={close}>
      <div
        className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-card max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary" />
            <h3 className="font-display text-xl font-bold text-primary">Nouvelle version de la Bible</h3>
          </div>
          <button onClick={close} disabled={submitting} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-2xl mb-5">
          <button
            onClick={() => setMode("file")}
            disabled={submitting}
            className={`h-10 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition ${
              mode === "file" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
            }`}
          >
            <FileUp className="w-4 h-4" /> Fichier
          </button>
          <button
            onClick={() => setMode("api")}
            disabled={submitting}
            className={`h-10 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition ${
              mode === "api" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
            }`}
          >
            <Globe className="w-4 h-4" /> API en ligne
          </button>
        </div>

        {mode === "file" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code (ex: LSG)"
                className="h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase" />
              <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Langue (fr, en...)"
                className="h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet"
              className="w-full h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optionnel)" rows={2}
              className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-primary/5 transition">
              <Upload className="w-7 h-7 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">{file ? file.name : "Fichier .json ou .txt"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} Ko` : 'JSON [{book,chapter,verse,text}] ou TXT "Genèse 1:1 ..."'}
              </p>
              <input type="file" accept=".json,.txt,application/json,text/plain" className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Source</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {(["bible-api", "getbible"] as const).map((s) => (
                  <button key={s} onClick={() => setSource(s)} disabled={submitting}
                    className={`h-10 rounded-xl text-sm font-semibold transition ${
                      source === s ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                    }`}>
                    {s === "bible-api" ? "bible-api.com" : "getbible.net"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Traduction</label>
              <select value={translation} onChange={(e) => setTranslation(e.target.value)} disabled={submitting || loadingList}
                className="mt-1 w-full h-11 px-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {loadingList && <option>Chargement…</option>}
                {!loadingList && apiList.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.id}</option>
                ))}
              </select>
              {selected && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sera enregistrée par défaut comme <strong>{selected.code}</strong> · {selected.language.toUpperCase()}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={`Code (ex: ${selected?.code ?? "LSG"})`}
                className="h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase" />
              <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder={`Langue (${selected?.language ?? "fr"})`}
                className="h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`Nom (${selected?.name ?? "Louis Segond 1910"})`}
              className="w-full h-11 px-4 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />

            {source === "bible-api" && (
              <p className="text-[11px] text-muted-foreground">
                ⚠️ bible-api.com est récupéré chapitre par chapitre (~1189 requêtes). L'import peut prendre quelques minutes.
              </p>
            )}

            {progress && (
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary transition-all" style={{ width: `${Math.min(100, progress.pct)}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {Math.round(progress.pct)}% {progress.label ? `· ${progress.label}` : ""}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button onClick={close} disabled={submitting} className="h-12 rounded-full border font-semibold hover:bg-muted disabled:opacity-50">
            Annuler
          </button>
          <button
            onClick={mode === "file" ? submitFile : submitApi}
            disabled={submitting}
            className="h-12 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60"
          >
            {submitting ? (mode === "api" ? "Import…" : "Envoi…") : mode === "api" ? "Importer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
