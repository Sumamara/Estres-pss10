"use client";

/* ── Laboratorio de la pantalla de resultados (ruta temporal de pruebas) ──
   Variantes de diseño con el mismo contenido, para comparar en el celular.
   No guarda nada en Supabase. */

import { useEffect, useMemo, useRef, useState } from "react";
import { buildResultModel, LAB_PROFILES } from "@/components/quiz/result-lab/model";
import ResultImpeccable from "@/components/quiz/result-lab/ResultImpeccable";
import ChartLab from "@/components/quiz/result-lab/ChartLab";
import ResultImpeccableV2 from "@/components/quiz/result-lab/ResultImpeccableV2";
import ResultTaste from "@/components/quiz/result-lab/ResultTaste";
import ResultProMax from "@/components/quiz/result-lab/ResultProMax";
import ResultStories from "@/components/quiz/result-lab/ResultStories";
import ResultPrep from "@/components/quiz/result-lab/ResultPrep";
import QuizResult from "@/components/quiz/QuizResult";
import QuizResultV1 from "@/components/quiz/QuizResultV1";
import PreviewPss from "@/components/quiz/result-lab/PreviewPss";
import { cn } from "@/lib/utils";

const VARIANTS = [
    { id: "0", label: "En preparación" },
    { id: "mix2p", label: "Mix 2 · pro" },
    { id: "pss", label: "Preview PSS" },
    { id: "nuevo-pss", label: "Nuevo PSS" },
    { id: "v1", label: "v1 Anterior" },
    { id: "orig", label: "Original" },
    { id: "1", label: "1 · Impeccable" },
    { id: "1b", label: "1b · Impeccable v2" },
    { id: "2", label: "2 · Taste" },
    { id: "3", label: "3 · Pro Max" },
    { id: "4", label: "4 · Historias" },
    { id: "4b", label: "4b · Historias v2" },
    { id: "5", label: "5 · Gráficos" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

export default function PruebaResultados() {
    const [variant, setVariant] = useState<VariantId>("0");
    const [profileId, setProfileId] = useState(LAB_PROFILES[0].id);
    const [name, setName] = useState("Ana");
    const [runKey, setRunKey] = useState(0);
    const barRef = useRef<HTMLDivElement>(null);
    const [barH, setBarH] = useState(0);

    // La pestaña vive en la URL (#pss a #0) para poder mandar el enlace directo
    useEffect(() => {
        const fromHash = window.location.hash.replace("#", "");
        if (VARIANTS.some((v) => v.id === fromHash)) setVariant(fromHash as VariantId);
    }, []);

    useEffect(() => {
        const el = barRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setBarH(el.offsetHeight));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const choose = (id: VariantId) => {
        setVariant(id);
        window.history.replaceState(null, "", `#${id}`);
        window.scrollTo({ top: 0 });
    };

    const profile = LAB_PROFILES.find((p) => p.id === profileId) ?? LAB_PROFILES[0];
    const model = useMemo(() => buildResultModel(profile.answers, name), [profile, name]);
    const restart = () => {
        window.scrollTo({ top: 0 });
        setRunKey((k) => k + 1);
    };

    return (
        <div className="min-h-screen bg-background">
            <meta name="robots" content="noindex" />

            {/* ── BARRA DEL LABORATORIO ── */}
            <div ref={barRef} className="sticky top-0 z-50 bg-zinc-900 text-white">
                <div className="max-w-5xl mx-auto px-3 py-2 space-y-2">
                    <div role="tablist" aria-label="Variantes de diseño" className="flex gap-1 overflow-x-auto">
                        {VARIANTS.map((v) => (
                            <button
                                key={v.id}
                                role="tab"
                                aria-selected={variant === v.id}
                                onClick={() => choose(v.id)}
                                className={cn(
                                    "shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                                    variant === v.id ? "bg-white text-zinc-900" : "text-zinc-300 hover:bg-white/10"
                                )}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                    {variant !== "pss" && (
                        <div className="flex gap-2 text-sm">
                            <label className="sr-only" htmlFor="lab-profile">Perfil de prueba</label>
                            <select
                                id="lab-profile"
                                value={profileId}
                                onChange={(e) => {
                                    setProfileId(e.target.value);
                                    setRunKey((k) => k + 1);
                                }}
                                className="flex-1 min-w-0 rounded-lg bg-zinc-800 px-2 py-1.5 text-white"
                            >
                                {LAB_PROFILES.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        Perfil: {p.label}
                                    </option>
                                ))}
                            </select>
                            <label className="sr-only" htmlFor="lab-name">Nombre</label>
                            <input
                                id="lab-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre"
                                className="w-28 rounded-lg bg-zinc-800 px-2 py-1.5 text-white placeholder:text-zinc-400"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* ── VARIANTE ── */}
            <div key={`${variant}-${runKey}`}>
                {variant === "pss" && <PreviewPss />}
                {variant === "nuevo-pss" && (
                    <div className="py-6 sm:py-12">
                        <QuizResult answers={profile.answers} userName={name} onRetake={restart} persist={false} />
                    </div>
                )}
                {variant === "v1" && (
                    <div className="py-6 sm:py-12">
                        <QuizResultV1 answers={profile.answers} userName={name} onRetake={restart} />
                    </div>
                )}
                {variant === "1" && (
                    <div className="py-6 sm:py-12">
                        <ResultImpeccable m={model} onRetake={restart} />
                    </div>
                )}
                {variant === "1b" && (
                    <div className="py-6 sm:py-12">
                        <ResultImpeccableV2 answers={profile.answers} userName={name} onRetake={restart} />
                    </div>
                )}
                {variant === "2" && <ResultTaste m={model} onRetake={restart} />}
                {variant === "3" && <ResultProMax m={model} onRetake={restart} />}
                {variant === "5" && <ChartLab m={model} />}
                {variant === "orig" && (
                    <div className="py-6 sm:py-12">
                        <QuizResult answers={profile.answers} userName={name} onRetake={restart} persist={false} />
                    </div>
                )}
                {variant === "mix2p" && (
                    <div style={{ height: `calc(100svh - ${barH}px)` }}>
                        <ResultPrep m={model} onRetake={restart} mix={6} />
                    </div>
                )}
                {variant === "0" && (
                    <div style={{ height: `calc(100svh - ${barH}px)` }}>
                        <ResultPrep m={model} onRetake={restart} />
                    </div>
                )}
                {variant === "4" && (
                    <div style={{ height: `calc(100svh - ${barH}px)` }}>
                        <ResultStories m={model} onRetake={restart} />
                    </div>
                )}
                {variant === "4b" && (
                    <div style={{ height: `calc(100svh - ${barH}px)` }}>
                        <ResultStories m={model} onRetake={restart} v2 />
                    </div>
                )}
            </div>
        </div>
    );
}
