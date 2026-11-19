"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, Lightbulb, RotateCcw, X } from "lucide-react";
import { DISCLAIMER, type ResultModel } from "./model";
import { TiltBalance, WhatsAppIcon, useRetake } from "./parts";

/* Variante 4 · impeccable en formato historias
   4 pantallas que se pasan tocando a la derecha (o deslizando), como las historias de Instagram:
   tu resultado → tu día a día → una cosa para hoy → tu sesión + WhatsApp.
   Sin avance automático: cada quien lee a su ritmo. */

/* Variante 4b (v2): igual que 4, pero la historia 1 cierra con "Nivel de desgaste 80/100"
   y se suma una historia 2, "Tu balance", con energía y nivel al estilo de ★ Mix 2. */
const LEVELS = ["Baja", "Media", "Alta"];
const levelOf = (v: number) => (v < 34 ? 0 : v < 67 ? 1 : 2);
/* Posición en la barra de 4 zonas iguales (cada zona ocupa un cuarto) */
const zonePinPercent = (gap: number) => {
    const map = (v: number, a: number, b: number, from: number, to: number) => from + Math.max(0, Math.min(1, (v - a) / (b - a))) * (to - from);
    if (gap <= 25) return map(gap, 0, 25, 4, 23);
    if (gap <= 50) return map(gap, 26, 50, 27, 48);
    if (gap <= 75) return map(gap, 51, 75, 52, 73);
    return map(gap, 76, 100, 77, 96);
};

export default function ResultStories({ m, onRetake, v2 = false }: { m: ResultModel; onRetake: () => void; v2?: boolean }) {
    const TOTAL = v2 ? 5 : 4;
    const retake = useRetake(onRetake);
    const [idx, setIdx] = useState(0);
    const [infoOpen, setInfoOpen] = useState(false);
    useEffect(() => setInfoOpen(false), [idx]);
    const startX = useRef<number | null>(null);
    const swiped = useRef(false);

    const go = useCallback((n: number) => setIdx(Math.max(0, Math.min(TOTAL - 1, n))), [TOTAL]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") go(idx + 1);
            if (e.key === "ArrowLeft") go(idx - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [idx, go]);

    const isInteractive = (el: EventTarget | null) =>
        el instanceof Element && !!el.closest("a, button, summary, [data-no-tap]");

    const onPointerDown = (e: React.PointerEvent) => {
        startX.current = e.clientX;
        swiped.current = false;
    };
    const onPointerUp = (e: React.PointerEvent) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 45) {
            swiped.current = true;
            go(dx < 0 ? idx + 1 : idx - 1);
        }
    };
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (swiped.current || isInteractive(e.target)) return;
        // Con la nota del cálculo abierta, tocar afuera solo la cierra
        if (infoOpen) {
            setInfoOpen(false);
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        go(x < 0.3 ? idx - 1 : idx + 1);
    };

    const slideClass = "absolute inset-0 flex flex-col px-6 pt-14 pb-20 overflow-y-auto";

    const pinPct = zonePinPercent(m.score);
    const diff = m.load - m.recovery;
    const meaning = Math.abs(diff) < 5 ? "gastás casi lo mismo que recuperás." : diff > 0 ? "gastás más de lo que recuperás." : "recuperás más de lo que gastás.";
    const lbl = "block whitespace-nowrap text-[12.5px] min-[375px]:text-[13px] font-semibold leading-tight tracking-[-0.01em] text-foreground/75";
    const balanceSlide = (
        <div key="b" className={slideClass} style={{ backgroundColor: "hsl(var(--card))" }}>
            <div className="flex-1 flex flex-col justify-center">
                <h2 className="font-[Outfit] text-[1.75rem] font-bold leading-tight tracking-tight">Tu balance</h2>
                <p className="mt-2 text-base leading-relaxed text-foreground/80 [text-wrap:pretty]">
                    Lo que gastás y lo que recuperás deciden tu nivel de desgaste.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-x-5">
                    {[
                        { label: "Energía que gastás", value: m.load, color: "#e11d48" },
                        { label: "Energía que recuperás", value: m.recovery, color: "#059669" },
                    ].map((b) => (
                        <div
                            key={b.label}
                            className="text-center"
                            role="meter"
                            aria-label={b.label}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={b.value}
                            aria-valuetext={`${b.value} %, nivel ${["bajo", "medio", "alto"][levelOf(b.value)]}`}
                        >
                            <span className={lbl}>{b.label}</span>
                            <span className="mt-1 flex items-baseline justify-center gap-1">
                                <span className="text-[1.625rem] font-[Outfit] font-bold leading-none tabular-nums text-foreground">{b.value}</span>
                                <span className="text-[13px] text-muted-foreground whitespace-nowrap">%&nbsp;·&nbsp;{LEVELS[levelOf(b.value)]}</span>
                            </span>
                            <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]" aria-hidden="true">
                                <span className="block h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative mt-7" data-no-tap>
                    <p className={`${lbl} text-center`}>Tu nivel de desgaste</p>
                    <div className="relative mt-1.5 pt-8">
                        <button
                            type="button"
                            onClick={() => setInfoOpen((o) => !o)}
                            aria-expanded={infoOpen}
                            aria-controls="historia-nivel-calculo"
                            aria-label={`Tu nivel de desgaste: ${m.score} de 100. ¿Cómo se calcula?`}
                            className="absolute top-0 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full py-1 pl-2.5 pr-2 text-xs font-bold tabular-nums text-white shadow-sm transition-transform after:absolute after:-inset-2.5 after:content-[''] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            style={{ left: `clamp(3.25rem, ${pinPct}%, calc(100% - 3.25rem))`, backgroundColor: m.zoneInk }}
                        >
                            {m.score} de 100
                            <Info className="h-3.5 w-3.5 opacity-90" aria-hidden="true" />
                        </button>
                        <span className="absolute top-[24px] -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent" style={{ left: `${pinPct}%`, borderTopColor: m.zoneInk }} aria-hidden="true" />
                        <div
                            className="relative"
                            role="meter"
                            aria-label="Nivel de desgaste"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={m.score}
                            aria-valuetext={`${m.score} de 100, zona ${m.zoneTitle}`}
                        >
                            <div className="grid h-3 grid-cols-4 gap-1" aria-hidden="true">
                                {m.zones.map((z, i) => (
                                    <span
                                        key={z.key}
                                        className={`${i === 0 ? "rounded-l-full" : ""} ${i === m.zones.length - 1 ? "rounded-r-full" : ""}`}
                                        style={{ backgroundColor: z.hex, opacity: z.key === m.zoneKey ? 1 : 0.35 }}
                                    />
                                ))}
                            </div>
                            <span
                                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5px] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.25)]"
                                style={{ left: `${pinPct}%`, borderColor: m.zoneHex }}
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <ol className="mt-1.5 grid grid-cols-4 gap-1 text-center text-[12px] leading-[1.2]" aria-label="Zonas posibles">
                        {m.zones.map((z) => (
                            <li key={z.key} aria-current={z.key === m.zoneKey ? "true" : undefined} className={z.key === m.zoneKey ? "font-semibold text-foreground" : "text-muted-foreground"}>
                                {z.title}
                            </li>
                        ))}
                    </ol>
                    {/* La nota se abre debajo de las zonas, sin tapar la barra; se anuncia y tiene botón para cerrar */}
                    <div aria-live="polite">
                        {infoOpen && (
                            <div
                                id="historia-nivel-calculo"
                                role="note"
                                className="relative mt-3 rounded-xl border bg-card p-3.5 pr-10 text-left text-sm leading-snug text-foreground/85 shadow-[0_6px_20px_-10px_rgba(15,23,42,0.25)] animate-in fade-in slide-in-from-top-1 duration-200 motion-reduce:animate-none"
                            >
                                <span className="block">
                                    <strong className="font-semibold text-foreground">50 es el equilibrio:</strong> gastás lo mismo que recuperás.
                                </span>
                                <span className="mt-1.5 block">
                                    Vos gastás <strong className="font-semibold tabular-nums text-foreground">{m.load}</strong> y recuperás{" "}
                                    <strong className="font-semibold tabular-nums text-foreground">{m.recovery}</strong>. Significa que {meaning}
                                </span>
                                <span className="mt-1.5 block text-[13px] italic tabular-nums text-muted-foreground">
                                    Fórmula: 50 + ({m.load} − {m.recovery}) ÷ 2 = {m.score}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setInfoOpen(false)}
                                    aria-label="Cerrar la explicación"
                                    className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-6 text-center text-[15px] leading-snug text-foreground/85 [text-wrap:balance]">
                    <Lightbulb className="mr-1.5 inline-block h-4 w-4 -translate-y-px align-middle" style={{ color: m.zoneInk }} aria-hidden="true" />
                    {m.action}
                </p>
            </div>
        </div>
    );

    const slides = [
        /* ── 1 · TU RESULTADO ── */
        <div key="r" className={slideClass} style={{ background: `linear-gradient(180deg, ${m.zoneHex}1f 0%, hsl(var(--card)) 55%)` }}>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <TiltBalance load={m.load} recovery={m.recovery} className="h-24 w-auto self-start text-foreground" />
                <h1 className="text-[2.1rem] leading-[1.1] font-bold tracking-tight [text-wrap:balance]">
                    {m.firstName ? `${m.firstName}, estás en zona ` : "Estás en zona "}
                    <span style={{ color: m.zoneInk }}>{m.zoneTitle}</span>
                </h1>
                <p className="text-lg leading-relaxed text-foreground/85 [text-wrap:pretty]">{m.validation}</p>
                {v2 ? (
                    <p className="text-base text-foreground/80">
                        Nivel de desgaste{" "}
                        <strong className="tabular-nums" style={{ color: m.zoneInk }}>
                            {m.score}/100
                        </strong>
                    </p>
                ) : (
                    <p className="text-base text-foreground/80">
                        Carga <strong className="tabular-nums">{m.load} %</strong> · Recuperación{" "}
                        <strong className="tabular-nums">{m.recovery} %</strong> · Balance{" "}
                        <strong className="tabular-nums" style={{ color: m.zoneInk }}>{m.score} de 100</strong>
                    </p>
                )}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground pt-4">{DISCLAIMER}</p>
        </div>,

        /* ── 2 (solo v2) · TU BALANCE: energía y nivel de desgaste, como en ★ Mix 2 ── */
        ...(v2 ? [balanceSlide] : []),

        /* ── 2 · TU DÍA A DÍA ── */
        <div key="d" className={slideClass} style={{ backgroundColor: "#1d2433", color: "#f4f1ea" }}>
            <div className="flex-1 flex flex-col justify-center gap-5">
                <h2 className="text-[1.75rem] font-bold tracking-tight">Así se ve tu día a día</h2>
                <p className="text-lg leading-snug [text-wrap:pretty]">{m.mirror}</p>
                {m.signals.length > 0 ? (
                    <ul className="space-y-2.5 border-t border-white/20 pt-4">
                        {m.signals.map((s) => (
                            <li key={s.text}>
                                <p className="text-[15px] font-semibold leading-snug">{s.text}</p>
                                <p className="text-sm" style={{ color: "#b9c0cf" }}>{s.frequency}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-base" style={{ color: "#b9c0cf" }}>
                        Ninguna señal de desgaste aparece con frecuencia en tus respuestas.
                    </p>
                )}
            </div>
        </div>,

        /* ── 3 · UNA COSA PARA HOY ── */
        <div key="h" className={slideClass} style={{ backgroundColor: "hsl(215 70% 96%)" }}>
            <div className="flex-1 flex flex-col justify-center gap-6">
                <h2 className="text-lg font-semibold text-primary">Una cosa para hoy</h2>
                <p className="text-[2.1rem] leading-[1.1] font-bold tracking-tight text-foreground [text-wrap:balance] font-[Outfit]">
                    {m.today.title}
                </p>
                <p className="text-lg leading-relaxed text-foreground/85">{m.today.how}</p>
            </div>
        </div>,

        /* ── 4 · TU SESIÓN + WHATSAPP ── */
        <div key="s" className={`${slideClass} !pb-6`} style={{ backgroundColor: "hsl(var(--primary))", color: "#fff" }}>
            <div className="flex-1 flex flex-col justify-center gap-5">
                <h2 className="text-lg font-semibold text-white/85">Tu sesión clave del taller</h2>
                <p className="text-[2.6rem] leading-none font-bold tracking-tight font-[Outfit]">{m.session.title}</p>
                <p className="text-xl font-semibold">{m.session.subtitle}</p>
                <p className="text-base leading-relaxed text-white/90">{m.session.why}</p>
            </div>
            <div className="space-y-3 pt-4">
                <a
                    href={m.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white text-primary text-lg font-bold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                    <WhatsAppIcon className="h-5 w-5" />
                    Escribinos por WhatsApp
                </a>
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => go(0)}
                        className="min-h-[44px] px-2 text-sm font-semibold text-white/90 hover:text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        Ver de nuevo
                    </button>
                    <button
                        type="button"
                        onClick={retake}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm font-semibold text-white/90 hover:text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Hacer el test de nuevo
                    </button>
                </div>
            </div>
        </div>,
    ];

    const onDark = ["d", "s"].includes(String(slides[idx]?.key));

    return (
        <div className="w-full h-full flex justify-center sm:py-6">
            <div
                className="relative w-full h-full sm:max-w-md sm:rounded-3xl overflow-hidden bg-card text-left select-none touch-pan-y sm:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
                role="region"
                aria-roledescription="historias"
                aria-label={`Tu resultado en ${TOTAL} partes`}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onClick={onClick}
            >
                {/* Barras de progreso */}
                <div className="absolute top-0 inset-x-0 z-20 flex gap-1.5 px-4 pt-4" aria-hidden="true">
                    {Array.from({ length: TOTAL }, (_, i) => (
                        <span key={i} className={`h-1 flex-1 rounded-full overflow-hidden ${onDark ? "bg-white/30" : "bg-foreground/15"}`}>
                            <span
                                className={`block h-full rounded-full transition-[width] duration-300 ease-out ${onDark ? "bg-white" : "bg-foreground"}`}
                                style={{ width: i <= idx ? "100%" : "0%" }}
                            />
                        </span>
                    ))}
                </div>

                {/* Pantallas */}
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        role="group"
                        aria-roledescription="historia"
                        aria-label={`${i + 1} de ${TOTAL}`}
                        aria-hidden={i !== idx}
                        {...({ inert: i !== idx ? "" : undefined } as Record<string, unknown>)}
                        className="absolute inset-0 transition-[opacity,transform] [transition-duration:450ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                        style={{
                            opacity: i === idx ? 1 : 0,
                            transform: `translateX(${i === idx ? 0 : i < idx ? -24 : 24}px)`,
                            pointerEvents: i === idx ? "auto" : "none",
                        }}
                    >
                        {slide}
                    </div>
                ))}

                {/* Flechas visibles: pista para quien no conoce el gesto (en la última, mandan sus botones) */}
                <div className={`absolute bottom-0 inset-x-0 z-20 flex justify-between px-3 pb-3 pointer-events-none ${idx === TOTAL - 1 ? "hidden" : ""}`}>
                    <button
                        type="button"
                        onClick={() => go(idx - 1)}
                        aria-label="Historia anterior"
                        className={`pointer-events-auto h-11 w-11 grid place-items-center rounded-full transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${idx === 0 ? "opacity-0 pointer-events-none" : ""} ${onDark ? "text-white/80" : "text-foreground/60"}`}
                    >
                        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {idx < TOTAL - 1 && (
                        <button
                            type="button"
                            onClick={() => go(idx + 1)}
                            className={`pointer-events-auto inline-flex h-11 items-center gap-1 rounded-full px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${onDark ? "bg-white/15 text-white" : "bg-foreground/[0.07] text-foreground"}`}
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    )}
                </div>

                <p className="sr-only" aria-live="polite">{`Parte ${idx + 1} de ${TOTAL}`}</p>
            </div>
        </div>
    );
}
