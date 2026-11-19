"use client";

import { useEffect, useRef, useState } from "react";
import { HeartHandshake, Pause, Play, RotateCcw } from "lucide-react";
import { DISCLAIMER, type ResultModel } from "./model";
import { WhatsAppIcon, useRetake } from "./parts";

/* Variante 3 · ui-ux-pro-max
   Perfil «Mental Health App» de su base: Soft UI accesible y ético, pasteles calmos
   (lavanda + verde bienestar), tipografía «Wellness Calm» (Lora + Raleway),
   presión suave de 150 ms y animación de respiración. Contenido por pestañas
   (revelación progresiva) y botón de WhatsApp fijo abajo, a un toque siempre. */

const P = {
    bg: "#faf5ff",
    card: "#ffffff",
    ink: "#3b1a78",
    text: "#334155",
    muted: "#475569",
    primary: "#6d28d9",
    soft: "#ede9fe",
    green: "#047857",
    greenSoft: "#d1fae5",
};

const softShadow = "0 1px 2px rgba(76,29,149,0.06), 0 8px 24px -12px rgba(76,29,149,0.18)";

type Tab = "dia" | "hoy" | "taller";
const TABS: { id: Tab; label: string }[] = [
    { id: "dia", label: "Tu día" },
    { id: "hoy", label: "Para hoy" },
    { id: "taller", label: "Tu taller" },
];

export default function ResultProMax({ m, onRetake }: { m: ResultModel; onRetake: () => void }) {
    const retake = useRetake(onRetake);
    const [tab, setTab] = useState<Tab>("dia");
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const onTabKey = (e: React.KeyboardEvent, i: number) => {
        const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const next = (i + dir + TABS.length) % TABS.length;
        setTab(TABS[next].id);
        tabRefs.current[next]?.focus();
    };

    return (
        <div
            className="w-full min-h-[100svh] text-left [&_:is(h1,h2,h3)]:[font-family:'Lora',serif]"
            style={{
                backgroundColor: P.bg,
                color: P.text,
                fontFamily: "'Raleway', system-ui, sans-serif",
                fontVariantNumeric: "lining-nums",
            }}
        >
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Raleway:wght@400;500;600;700&display=swap"
            />

            <div className="max-w-lg mx-auto px-4 pt-6 pb-36 space-y-5">
                {/* ── RESUMEN ── */}
                <section className="rounded-3xl p-6 space-y-5" style={{ backgroundColor: P.card, boxShadow: softShadow }}>
                    <div className="space-y-2">
                        <p className="text-base font-semibold" style={{ color: P.muted }}>
                            {m.firstName ? `Hola, ${m.firstName}` : "Hola"}
                        </p>
                        <h1 className="text-[2rem] leading-tight font-semibold" style={{ color: m.zoneInk }}>
                            {m.zoneTitle}
                        </h1>
                        <p className="text-base leading-relaxed">{m.validation}</p>
                    </div>

                    {/* Medidor suave */}
                    <div className="space-y-2">
                        <div className="relative h-3 rounded-full overflow-hidden flex" aria-hidden="true">
                            {m.zones.map((z) => (
                                <span key={z.key} className="flex-1" style={{ backgroundColor: z.hex, opacity: z.key === m.zoneKey ? 0.9 : 0.25 }} />
                            ))}
                        </div>
                        <div className="relative h-0" aria-hidden="true">
                            <span
                                className="absolute -top-[1.05rem] h-5 w-5 -translate-x-1/2 rounded-full border-4 bg-white"
                                style={{ left: `${m.score}%`, borderColor: m.zoneInk, boxShadow: softShadow }}
                            />
                        </div>
                        <div className="flex justify-between text-sm pt-1" style={{ color: P.muted }}>
                            <span>Recuperado</span>
                            <span className="font-bold [font-variant-numeric:lining-nums_tabular-nums]" style={{ color: m.zoneInk }}>{m.score} de 100</span>
                            <span>Desgastado</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Stat label="Tu carga" value={m.load} tint="#fff1f2" ink="#be123c" />
                        <Stat label="Tu recuperación" value={m.recovery} tint={P.greenSoft} ink={P.green} />
                    </div>
                </section>

                {/* ── PESTAÑAS ── */}
                <div
                    role="tablist"
                    aria-label="Tu resultado por partes"
                    className="grid grid-cols-3 gap-1 p-1 rounded-2xl"
                    style={{ backgroundColor: P.soft }}
                >
                    {TABS.map((t, i) => {
                        const active = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                ref={(el) => {
                                    tabRefs.current[i] = el;
                                }}
                                role="tab"
                                id={`pm-tab-${t.id}`}
                                aria-selected={active}
                                aria-controls={`pm-panel-${t.id}`}
                                tabIndex={active ? 0 : -1}
                                onClick={() => setTab(t.id)}
                                onKeyDown={(e) => onTabKey(e, i)}
                                className="min-h-[44px] rounded-xl text-base font-semibold transition-[background-color,color,transform] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
                                style={active ? { backgroundColor: P.card, color: P.ink, boxShadow: softShadow } : { color: P.muted }}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <div
                    role="tabpanel"
                    id={`pm-panel-${tab}`}
                    aria-labelledby={`pm-tab-${tab}`}
                    key={tab}
                    className="rounded-3xl p-6 space-y-4 animate-in fade-in duration-200 motion-reduce:animate-none"
                    style={{ backgroundColor: P.card, boxShadow: softShadow }}
                >
                    {tab === "dia" && (
                        <>
                            <h2 className="text-2xl font-semibold" style={{ color: P.ink }}>Cómo se ve en tu día a día</h2>
                            <p className="text-lg leading-relaxed">{m.mirror}</p>
                            {m.signals.length > 0 ? (
                                <ul className="space-y-2">
                                    {m.signals.map((s) => (
                                        <li key={s.text} className="rounded-2xl p-4" style={{ backgroundColor: P.bg }}>
                                            <p className="text-base font-medium" style={{ color: P.ink }}>{s.text}</p>
                                            <p className="text-sm" style={{ color: P.muted }}>{s.frequency}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-base" style={{ color: P.muted }}>
                                    Ninguna señal de desgaste aparece con frecuencia en tus respuestas.
                                </p>
                            )}
                        </>
                    )}

                    {tab === "hoy" && (
                        <>
                            <h2 className="text-2xl font-semibold" style={{ color: P.ink }}>Una cosa para hoy</h2>
                            <div className="rounded-2xl p-5 space-y-1.5" style={{ backgroundColor: P.greenSoft }}>
                                <p className="text-lg font-bold" style={{ color: "#064e3b" }}>{m.today.title}</p>
                                <p className="text-base leading-relaxed" style={{ color: "#065f46" }}>{m.today.how}</p>
                            </div>
                            <Breathing />
                        </>
                    )}

                    {tab === "taller" && (
                        <>
                            <h2 className="text-2xl font-semibold" style={{ color: P.ink }}>Tu sesión clave: {m.session.title}</h2>
                            <p className="text-base leading-relaxed">
                                <strong style={{ color: P.ink }}>{m.session.subtitle}.</strong> {m.session.why}
                            </p>
                            <ol className="space-y-2">
                                {m.sessions.map((s) => (
                                    <li
                                        key={s.num}
                                        className="flex items-start gap-3 rounded-2xl p-3.5"
                                        style={{ backgroundColor: s.isTop ? P.soft : P.bg }}
                                    >
                                        <span
                                            className="h-7 w-7 shrink-0 rounded-full grid place-items-center text-sm font-bold"
                                            style={{ backgroundColor: s.isTop ? P.primary : P.card, color: s.isTop ? "#fff" : P.muted }}
                                        >
                                            {s.num}
                                        </span>
                                        <div>
                                            <p className="font-semibold" style={{ color: P.ink }}>{s.name}</p>
                                            <p className="text-sm" style={{ color: P.muted }}>{s.subtitle}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </div>

                {/* ── AVISO DE SALUD ── */}
                <div className="flex gap-3 rounded-2xl p-4" style={{ backgroundColor: P.soft }}>
                    <HeartHandshake className="h-5 w-5 shrink-0 mt-0.5" style={{ color: P.primary }} aria-hidden="true" />
                    <p className="text-sm leading-relaxed" style={{ color: P.ink }}>{DISCLAIMER}</p>
                </div>

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={retake}
                        className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-semibold transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
                        style={{ color: P.muted }}
                    >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Volver a hacer el test
                    </button>
                </div>
            </div>

            {/* ── BARRA FIJA: WHATSAPP SIEMPRE A UN TOQUE ── */}
            <div
                className="sticky bottom-0 z-20 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t"
                style={{ backgroundColor: "rgba(250,245,255,0.94)", borderColor: P.soft, backdropFilter: "blur(8px)" }}
            >
                <a
                    href={m.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-lg mx-auto flex h-14 items-center justify-center gap-2 rounded-2xl text-white text-lg font-bold transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6d28d9]"
                    style={{ backgroundColor: P.primary, boxShadow: "0 8px 20px -10px rgba(109,40,217,0.7)" }}
                >
                    <WhatsAppIcon className="h-5 w-5" />
                    Hablar del taller por WhatsApp
                </a>
            </div>
        </div>
    );
}

function Stat({ label, value, tint, ink }: { label: string; value: number; tint: string; ink: string }) {
    return (
        <div className="rounded-2xl p-4" style={{ backgroundColor: tint }}>
            <p className="text-sm font-semibold" style={{ color: ink }}>{label}</p>
            <p className="text-3xl font-bold [font-variant-numeric:lining-nums]" style={{ color: ink, fontFamily: "'Lora', serif" }}>
                {value} %
            </p>
        </div>
    );
}

/* Respiración guiada: 4 s inhalar, 6 s exhalar, durante 1 minuto */
function Breathing() {
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState<"in" | "out">("in");
    const [left, setLeft] = useState(60);

    useEffect(() => {
        if (!running) return;
        let elapsed = 0;
        setPhase("in");
        setLeft(60);
        const id = setInterval(() => {
            elapsed += 1;
            const inCycle = elapsed % 10;
            setPhase(inCycle < 4 ? "in" : "out");
            setLeft(60 - elapsed);
            if (elapsed >= 60) {
                setRunning(false);
            }
        }, 1000);
        return () => clearInterval(id);
    }, [running]);

    const scale = !running ? 0.7 : phase === "in" ? 1 : 0.6;

    return (
        <div className="rounded-2xl p-5 flex items-center gap-5" style={{ backgroundColor: P.bg }}>
            <div className="relative h-24 w-24 shrink-0 grid place-items-center" aria-hidden="true">
                <span
                    className="absolute inset-0 rounded-full motion-reduce:!transform-none"
                    style={{
                        backgroundColor: "#c4b5fd",
                        opacity: 0.55,
                        transform: `scale(${scale})`,
                        transition: `transform ${phase === "in" ? 4000 : 6000}ms ease-in-out`,
                    }}
                />
                <span className="relative h-8 w-8 rounded-full" style={{ backgroundColor: P.primary }} />
            </div>
            <div className="space-y-2">
                <p className="text-base font-semibold" style={{ color: P.ink }} aria-live="polite">
                    {running ? (phase === "in" ? "Inhalá…" : "Exhalá despacio…") : "Respirá un minuto conmigo"}
                </p>
                <p className="text-sm" style={{ color: P.muted }}>
                    {running ? `Quedan ${left} s` : "4 segundos para inhalar, 6 para exhalar."}
                </p>
                <button
                    type="button"
                    onClick={() => setRunning((r) => !r)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl text-sm font-bold text-white transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6d28d9]"
                    style={{ backgroundColor: P.primary }}
                >
                    {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                    {running ? "Pausar" : "Empezar"}
                </button>
            </div>
        </div>
    );
}
