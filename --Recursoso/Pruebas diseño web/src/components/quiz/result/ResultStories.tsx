"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   RESULTADO PRINCIPAL · 4 historias
     1. Tu zona: la balanza, tu mensaje, tu energía y tu nivel de desgaste
     2. ¿Te identificás con esto?: tus tres señales, qué hay detrás y qué puede causar
     3. Algo que podés hacer hoy: el paso, en qué te ayuda, cómo hacerlo y por qué funciona
     4. El taller: en qué te va a ayudar, detalles, sesiones, opiniones y WhatsApp

   Se pasa tocando los bordes, deslizando, con las flechas o con "Siguiente".
   Todo el texto sale de src/content/taller.ts (vía model.ts).
   ═══════════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, Clock, Gift, Info, Lightbulb, RotateCcw, Target, X } from "lucide-react";
import { WHATSAPP_NUMBER, type ResultModel } from "./model";
import { TiltBalanceSolid, WhatsAppIcon, useRetake } from "./parts";
import QuadrantStory1, { type QuadrantVariant } from "./QuadrantStory1";

/** Ancho de cada borde que avanza o retrocede al tocarlo */
const EDGE = 0.22;
/** Celeste de las historias 2 y 4 */
const SKY = "hsl(215 70% 96%)";

/* Posición en la barra de 4 zonas iguales (cada zona ocupa un cuarto) */
const zonePinPercent = (gap: number) => {
    const map = (v: number, a: number, b: number, from: number, to: number) => from + Math.max(0, Math.min(1, (v - a) / (b - a))) * (to - from);
    if (gap <= 25) return map(gap, 0, 25, 4, 23);
    if (gap <= 50) return map(gap, 26, 50, 27, 48);
    if (gap <= 75) return map(gap, 51, 75, 52, 73);
    return map(gap, 76, 100, 77, 96);
};
const LEVELS = ["Baja", "Media", "Alta"];
const levelOf = (v: number) => (v < 34 ? 0 : v < 67 ? 1 : 2);

export default function ResultStories({
    m,
    onRetake,
    finalTone = "light",
    quadrantMode = true,
    quadrantVariant = "unificar-solo-activo",
}: {
    m: ResultModel;
    onRetake: () => void;
    /** Laboratorio ("Pruebas"): "brand" pone la historia del taller en el azul de la marca */
    finalTone?: "light" | "brand";
    /** Copia 3: muestra el mapa de 4 cuadrantes (centro en 50 % carga y 60 % recuperación) */
    quadrantMode?: boolean;
    /** Variante visual de la Historia 1 por cuadrantes */
    quadrantVariant?: QuadrantVariant;
}) {
    const retake = useRetake(onRetake);
    const brand = finalTone === "brand";
    const TOTAL = m.giftSession ? 5 : 4;
    const [idx, setIdx] = useState(0);

    /* Desplegables (se cierran al cambiar de historia; en Óptimo "qué hay detrás" abre por defecto) */
    const [infoOpen, setInfoOpen] = useState(false);
    const [behindOpen, setBehindOpen] = useState(m.zoneKey === "resiliente");
    const [causeOpen, setCauseOpen] = useState(false);
    const [howOpen, setHowOpen] = useState(false);
    const [whyOpen, setWhyOpen] = useState(false);
    const [detOpen, setDetOpen] = useState(false);
    const [sessOpen, setSessOpen] = useState(false);
    const [opinOpen, setOpinOpen] = useState(false);
    const [extraOpen, setExtraOpen] = useState(false);
    const [giftHowOpen, setGiftHowOpen] = useState(false);

    useEffect(() => {
        setInfoOpen(false);
        setBehindOpen(m.zoneKey === "resiliente");
        setCauseOpen(false);
        setHowOpen(false);
        setWhyOpen(false);
        setDetOpen(false);
        setSessOpen(false);
        setOpinOpen(false);
        setExtraOpen(false);
        setGiftHowOpen(false);
    }, [idx, m.zoneKey]);

    // Al abrir un desplegable, se lleva a la vista completo (después de la transición)
    useEffect(() => {
        const id = detOpen
            ? "detalles-taller"
            : sessOpen
              ? "sesiones-taller"
              : opinOpen
                ? "opiniones-taller"
                : extraOpen
                  ? "extra-taller"
                  : giftHowOpen
                    ? "como-funciona-regalo"
                    : causeOpen
                      ? "que-puede-causar"
                      : behindOpen
                        ? "que-hay-detras"
                        : whyOpen
                          ? "por-que-funciona"
                          : howOpen
                            ? "como-hacerlo"
                            : null;
        if (!id) return;
        const t = setTimeout(() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById(id)?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
        }, 320);
        return () => clearTimeout(t);
    }, [detOpen, sessOpen, opinOpen, extraOpen, giftHowOpen, causeOpen, behindOpen, whyOpen, howOpen]);

    // La nota del "80 de 100" se cierra con Esc
    useEffect(() => {
        if (!infoOpen) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setInfoOpen(false);
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [infoOpen]);

    /* ── Navegación entre historias ── */
    const go = useCallback((n: number) => setIdx(Math.max(0, Math.min(TOTAL - 1, n))), []);

    // Flechas del teclado, salvo mientras se escribe en un campo
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null;
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
            if (e.key === "ArrowRight") go(idx + 1);
            if (e.key === "ArrowLeft") go(idx - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [idx, go]);

    // Al cambiar de historia, el foco va a su título (teclado y lector de pantalla no se pierden)
    const regionRef = useRef<HTMLDivElement>(null);
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const heading = regionRef.current?.querySelector<HTMLElement>(`[aria-label="${idx + 1} de ${TOTAL}"] :is(h1, h2)`);
        if (!heading) return;
        heading.setAttribute("tabindex", "-1");
        heading.style.outline = "none";
        heading.focus({ preventScroll: true });
    }, [idx]);

    // Deslizar o tocar los bordes: el centro queda libre para leer y desplazarse
    const startX = useRef<number | null>(null);
    const swiped = useRef(false);
    const isInteractive = (el: EventTarget | null) => el instanceof Element && !!el.closest("a, button, summary, details, [data-no-tap]");
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
        if (x < EDGE) go(idx - 1);
        else if (x > 1 - EDGE) go(idx + 1);
    };

    const conversemosUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, soy ${m.firstName || "una persona que hizo el test"}. Hice el test de estrés y salí en "${m.zoneTitle}". Tengo algunas preguntas sobre el taller, ¿conversamos?`
    )}`;
    const slideClass = "absolute inset-0 flex flex-col px-5 min-[375px]:px-6 pt-8 min-[375px]:pt-9 pb-[4.5rem] overflow-y-auto";

    /* ── Piezas ── */

    /* Desplegable sobrio: título y la flecha en un círculo suave (la señal de "tocame") */
    const accordion = ({
        id,
        open,
        toggle,
        title,
        hint,
        children,
        dark = false,
    }: {
        id: string;
        open: boolean;
        toggle: () => void;
        title: string;
        hint?: string;
        children: React.ReactNode;
        dark?: boolean;
    }) => (
        <div>
            <h3>
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    aria-controls={id}
                    className={`group flex min-h-[54px] w-full items-center gap-3 rounded-md py-2 text-left focus-visible:outline-none focus-visible:ring-2 ${dark ? "focus-visible:ring-white" : "focus-visible:ring-primary focus-visible:ring-offset-2"}`}
                >
                    <span className="flex-1">
                        <span className={`block text-[15.5px] font-semibold leading-tight ${dark ? "text-white" : "text-foreground"}`}>{title}</span>
                        {hint && <span className={`mt-1 block text-[13px] leading-tight ${dark ? "text-white/65" : "text-muted-foreground"}`}>{hint}</span>}
                    </span>
                    <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors ${dark ? "bg-white/10 group-hover:bg-white/20" : "bg-foreground/[0.05] group-hover:bg-foreground/[0.1]"}`}
                        aria-hidden="true"
                    >
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${dark ? "text-white/80" : "text-foreground/60"} ${open ? "rotate-180" : ""}`}
                        />
                    </span>
                </button>
            </h3>
            <div
                id={id}
                className={`grid scroll-mb-24 transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                {...({ inert: open ? undefined : "" } as Record<string, unknown>)}
            >
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    );

    /* Barra de las 4 zonas, el punto en tu nivel y los nombres debajo */
    const pinPct = zonePinPercent(m.score);
    const zoneBar = (
        <div className="grid h-2.5 grid-cols-4 gap-1">
            {m.zones.map((z, i) => (
                <span
                    key={z.key}
                    className={`${i === 0 ? "rounded-l-full" : ""} ${i === m.zones.length - 1 ? "rounded-r-full" : ""}`}
                    style={{ backgroundColor: z.hex, opacity: z.key === m.zoneKey ? 1 : 0.35 }}
                />
            ))}
        </div>
    );
    const zonePin = (
        <span
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5px] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.25)]"
            style={{ left: `${pinPct}%`, borderColor: m.zoneHex }}
        />
    );
    const zoneLabels = (
        <ol className="mt-1.5 grid grid-cols-4 gap-1 text-center text-[12px] leading-[1.2]" aria-label="Estados posibles">
            {m.zones.map((z) => (
                <li key={z.key} aria-current={z.key === m.zoneKey ? "true" : undefined} className={z.key === m.zoneKey ? "font-semibold text-foreground" : "text-muted-foreground"}>
                    {z.title}
                </li>
            ))}
        </ol>
    );
    const meterProps = (label: string, v: number) => ({
        role: "meter" as const,
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": v,
        // "nivel" es masculino: el lector dice "nivel alto", no "nivel alta"
        "aria-valuetext": `${v} %, nivel ${["bajo", "medio", "alto"][levelOf(v)]}`,
    });

    /* Nota del "80 de 100": el equilibrio, tus números y la fórmula */
    const d = m.load - m.recovery;
    const meaning =
        Math.abs(d) < 5
            ? `están parejas, así que tu nivel queda cerca de 50 (${m.score}).`
            : d > 0
              ? `gastás más de lo que reponés, y por eso sube de 50 a ${m.score}.`
              : `reponés más de lo que gastás, y por eso baja de 50 a ${m.score}.`;
    const levelNote = quadrantMode ? (
        <>
            <span className="block">
                <strong className="font-semibold text-foreground">¿Cómo se divide la cuadrícula?</strong> Cruzamos cuánta energía gastás (corte en{" "}
                <strong className="font-semibold text-foreground">50&nbsp;%</strong>) con cuánta recuperás (corte en{" "}
                <strong className="font-semibold text-foreground">60&nbsp;%</strong>).
            </span>
            <span className="mt-1.5 block">
                Hoy gastás <strong className="font-semibold tabular-nums text-foreground">{m.load}&nbsp;%</strong> ({m.load >= 50 ? "50 % o más" : "menos de 50 %"}) y recuperás{" "}
                <strong className="font-semibold tabular-nums text-foreground">{m.recovery}&nbsp;%</strong> ({m.recovery >= 60 ? "60 % o más" : "menos de 60 %"}), lo que te ubica en{" "}
                <strong className="font-semibold" style={{ color: m.zoneInk }}>
                    {m.zoneTitle}
                </strong>
                .
            </span>
        </>
    ) : (
        <>
            <span className="block">
                <strong className="font-semibold text-foreground">50 es el equilibrio:</strong> gastás lo mismo que recuperás.
            </span>
            <span className="mt-1.5 block">
                Hoy gastás <strong className="font-semibold tabular-nums text-foreground">{m.load}&nbsp;%</strong> y recuperás{" "}
                <strong className="font-semibold tabular-nums text-foreground">{m.recovery}&nbsp;%</strong>: {meaning}
            </span>
            <span className="mt-1.5 block text-[13px] italic tabular-nums text-muted-foreground">
                Fórmula: 50 + ({m.load} − {m.recovery}) ÷ 2 = {m.score}
            </span>
        </>
    );

    /* ═══ 1 · TU ESTADO ═══ */
    const levelLabel = "block whitespace-nowrap text-[12.5px] min-[375px]:text-[13px] font-semibold leading-tight tracking-[-0.01em] text-foreground/75";
    const story1 =
        quadrantMode || quadrantVariant ? (
            <QuadrantStory1 m={m} variant={quadrantVariant ?? "default"} infoOpen={infoOpen} setInfoOpen={setInfoOpen} />
        ) : (
            // El resplandor de tu estado, en diagonal suave, que se apaga al 35 %
            <div key="r" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1f 0%, hsl(var(--card)) 35%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        <span aria-hidden="true" className="self-start">
                            <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-12 [@media(min-height:800px)]:h-14 w-auto" />
                        </span>
                        <h1 className="mt-3 [@media(min-height:800px)]:mt-4">
                            <span className="text-[15px] block font-medium text-muted-foreground">Estás en estado</span>
                            <span
                                className="text-[1.875rem] [@media(min-height:800px)]:text-[2.25rem] block font-[Outfit] font-bold leading-[1.05] tracking-[-0.02em] [text-wrap:balance]"
                                style={{ color: m.zoneInk }}
                            >
                                {m.zoneTitle}
                            </span>
                        </h1>
                        {/* Tu mensaje sin caja: el resplandor ya pone el tinte; se sostiene con contraste, tamaño y aire */}
                        <p className="mt-3 [@media(min-height:800px)]:mt-4 text-[17px] [@media(min-height:800px)]:text-[18px] leading-[1.6] text-foreground [text-wrap:pretty]">
                            {m.firstName ? (
                                <>
                                    <span className="font-bold">{m.firstName},</span> {m.validation.charAt(0).toLowerCase()}
                                    {m.validation.slice(1)}
                                </>
                            ) : (
                                m.validation
                            )}
                        </p>

                        {/* Los datos, sin fondo, después de una pausa */}
                        <div className="mt-5 [@media(min-height:800px)]:mt-8">
                            <div className="grid grid-cols-2 gap-x-5">
                                {[
                                    { label: "Energía que gastás", value: m.load, color: "#e11d48", limit: 50 },
                                    { label: "Energía que recuperás", value: m.recovery, color: "#059669", limit: 60 },
                                ].map((b) => (
                                    <div key={b.label} className="text-center" {...meterProps(b.label, b.value)}>
                                        <span className={levelLabel}>{b.label}</span>
                                        <span className="mt-1 flex items-baseline justify-center gap-1">
                                            {/* La cifra va en tinta neutra: el color queda solo en la barrita */}
                                            <span className="text-[1.625rem] font-[Outfit] font-bold leading-none tabular-nums text-foreground">{b.value}</span>
                                            <span className="text-[13px] text-muted-foreground whitespace-nowrap">%&nbsp;·&nbsp;{LEVELS[levelOf(b.value)]}</span>
                                        </span>
                                        <span className="relative mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]" aria-hidden="true">
                                            <span className="block h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="relative mt-4 [@media(min-height:800px)]:mt-6" data-no-tap>
                                <p className={`${levelLabel} text-center`}>Tu nivel de desgaste</p>
                                <div className="relative mt-1.5 pt-8">
                                    {/* "80 de 100" con (i): al tocarlo explica cómo se calcula, con tus números */}
                                    <button
                                        type="button"
                                        onClick={() => setInfoOpen((o) => !o)}
                                        aria-expanded={infoOpen}
                                        aria-controls="nivel-calculo"
                                        aria-label={`Tu nivel de desgaste: ${m.score} de 100. ¿Cómo se calcula?`}
                                        className="absolute top-0 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full py-1 pl-2.5 pr-2 text-xs font-bold tabular-nums text-white shadow-sm transition-transform after:absolute after:-inset-2.5 after:content-[''] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        style={{ left: `clamp(3.25rem, ${pinPct}%, calc(100% - 3.25rem))`, backgroundColor: m.zoneInk }}
                                    >
                                        {m.score} de 100
                                        <Info className="h-3.5 w-3.5 opacity-90" aria-hidden="true" />
                                    </button>
                                    <span
                                        className="absolute top-[24px] -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent"
                                        style={{ left: `${pinPct}%`, borderTopColor: m.zoneInk }}
                                        aria-hidden="true"
                                    />
                                    <div
                                        className="relative"
                                        role="meter"
                                        aria-label="Nivel de desgaste"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={m.score}
                                        aria-valuetext={`${m.score} de 100, estado ${m.zoneTitle}`}
                                    >
                                        {zoneBar}
                                        {zonePin}
                                    </div>
                                </div>
                                {zoneLabels}
                                {/* La nota flota sobre la barra */}
                                <div aria-live="polite">
                                    {infoOpen && (
                                        <div
                                            id="nivel-calculo"
                                            role="note"
                                            className="absolute inset-x-0 top-[3.625rem] z-30 rounded-xl border bg-card p-3.5 pr-10 text-left text-sm leading-snug text-foreground/85 shadow-[0_10px_28px_-10px_rgba(15,23,42,0.3)] animate-in fade-in slide-in-from-top-1 duration-150 motion-reduce:animate-none"
                                        >
                                            {levelNote}
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
                        </div>
                        {/* Nota final centrada: qué implica el estado y por qué conviene actuar */}
                        <p className="mt-4 [@media(min-height:800px)]:mt-6 text-center text-[14px] leading-snug text-foreground/85 [text-wrap:balance]">
                            <Lightbulb className="mr-1.5 inline-block h-4 w-4 -translate-y-px align-middle" style={{ color: m.zoneInk }} aria-hidden="true" />
                            {m.action}
                        </p>
                    </div>
                </div>

                <p className="pt-3 text-center text-[13px] italic leading-snug text-muted-foreground [text-wrap:balance]">
                    Una señal para observar tu balance hoy, <span className="not-italic font-medium text-foreground/70">no una etiqueta fija.</span>
                </p>
            </div>
        );

    /* ═══ 2 · ¿TE IDENTIFICÁS CON ESTO? ═══ */
    const channelSignalTitle =
        m.zoneKey === "resiliente" ? `Qué cuidar primero: ${m.reflect.channel.name}` : `Dónde más se acumula: ${m.reflect.channel.name}`;
    const story2 = (
        <div key="d" className={slideClass} style={{ backgroundColor: SKY }}>
            <div className="flex-1 flex flex-col justify-center">
                {/* La pregunta a escala de titular, en azul; en Óptimo ocultamos los 3 puntos y dejamos abierto qué hay detrás */}
                <h2 className="font-[Outfit] text-[1.875rem] [@media(min-height:800px)]:text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-primary [text-wrap:balance]">
                    {m.labels.reflectTitle}
                </h2>
                {m.zoneKey !== "resiliente" && (
                    <ol className="mt-4 [@media(min-height:800px)]:mt-7 space-y-3 [@media(min-height:800px)]:space-y-5" aria-label="Tus tres señales">
                        {[...m.reflect.signals, { title: channelSignalTitle, body: m.reflect.channel.feel }].map((sg, i) => (
                            <li key={sg.title} className="grid grid-cols-[2rem_1fr] gap-x-3">
                                <span className="font-[Outfit] text-[2rem] font-extrabold leading-[0.95] tabular-nums text-primary" aria-hidden="true">
                                    {i + 1}
                                </span>
                                <span>
                                    <span className="block font-[Outfit] text-[18px] font-semibold leading-snug text-foreground [text-wrap:pretty]">{sg.title}</span>
                                    <span className="mt-0.5 block text-[14.5px] leading-snug text-foreground/70 [text-wrap:pretty]">{sg.body}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                )}

                {/* Lo que explica y lo que advierte queda a un toque (en Óptimo abre por defecto el primero) */}
                <div className="mt-4 [@media(min-height:800px)]:mt-8 divide-y divide-primary/15 border-y border-primary/15" data-no-tap>
                    {accordion({
                        id: "que-hay-detras",
                        open: behindOpen,
                        toggle: () => setBehindOpen((o) => !o),
                        title: m.labels.behindTitle,
                        children: <p className="pb-4 text-[15.5px] leading-[1.6] text-foreground/85 [text-wrap:pretty]">{m.reflect.behind}</p>,
                    })}
                    {accordion({
                        id: "que-puede-causar",
                        open: causeOpen,
                        toggle: () => setCauseOpen((o) => !o),
                        title: m.labels.causeTitle,
                        children: (
                            <div className="pb-4">
                                <p className="text-[15.5px] font-semibold leading-snug text-foreground [text-wrap:pretty]">{m.reflect.cost.title}</p>
                                <p className="mt-1 text-[15px] leading-[1.6] text-foreground/75 [text-wrap:pretty]">{m.reflect.cost.description}</p>
                            </div>
                        ),
                    })}
                </div>
            </div>
        </div>
    );

    /* ═══ 3 · UN REGALO / ALGO QUE PODÉS HACER HOY ═══ */
    const howSteps = m.step.how.split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ¿«])/).filter(Boolean);
    const story3 = (
        <div key="h" className={slideClass} style={{ background: "linear-gradient(170deg, hsl(215 70% 45% / 0.10) 0%, hsl(var(--card)) 38%)" }}>
            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-[15px] font-semibold text-primary">{m.step.kicker ?? "Algo que podés hacer hoy"}</h2>
                <p className="mt-1.5 font-[Outfit] text-[1.875rem] [@media(min-height:800px)]:text-[2.125rem] font-bold leading-[1.1] tracking-[-0.02em] text-foreground [text-wrap:balance]">
                    {m.step.skill}
                </p>
                {/* Cuánto y cuándo: lo que alguien cansado necesita saber antes de decidir si lo intenta */}
                <ul className="mt-3.5 flex flex-wrap gap-2" aria-label="Duración y momento">
                    {[
                        { Icon: Clock, text: m.step.time },
                        { Icon: CalendarClock, text: m.step.when },
                    ].map(({ Icon, text }) => (
                        <li key={text} className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] py-1 pl-2 pr-2.5 text-[13px] font-medium text-foreground/80">
                            <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            {text}
                        </li>
                    ))}
                </ul>

                <h3 className="mt-7 text-[13px] font-semibold tracking-[-0.01em] text-foreground/75">En qué te ayuda</h3>
                <p className="mt-1.5 text-[17px] leading-[1.6] text-foreground [text-wrap:pretty]">{m.step.helps}</p>

                {/* El paso a paso y el fundamento con su fuente */}
                <div className="mt-7 divide-y divide-border/80 border-y border-border/80" data-no-tap>
                    {accordion({
                        id: "como-hacerlo",
                        open: howOpen,
                        toggle: () => setHowOpen((o) => !o),
                        title: "Cómo hacerlo",
                        hint: `${howSteps.length} ${howSteps.length === 1 ? "paso" : "pasos"}`,
                        children: (
                            <ol className="space-y-3 pb-4">
                                {howSteps.map((st, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="mt-[3px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary text-[12px] font-bold tabular-nums text-primary-foreground">
                                            {i + 1}
                                        </span>
                                        <span className="text-[16px] leading-[1.6] text-foreground [text-wrap:pretty]">{st}</span>
                                    </li>
                                ))}
                            </ol>
                        ),
                    })}
                    {accordion({
                        id: "por-que-funciona",
                        open: whyOpen,
                        toggle: () => setWhyOpen((o) => !o),
                        title: "Por qué funciona",
                        hint: "Con respaldo científico",
                        children: (
                            <div className="pb-4">
                                <p className="text-[16px] leading-[1.6] text-foreground/85 [text-wrap:pretty]">{m.step.why}</p>
                                <p className="mt-3 flex gap-2 text-[13px] leading-snug text-muted-foreground">
                                    <BookOpen className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                    <span>Fuente: {m.step.source}</span>
                                </p>
                            </div>
                        ),
                    })}
                </div>
            </div>
        </div>
    );

    /* ═══ 4 · EL TALLER ═══
       Claro (principal): celeste, como la historia 2. Marca (laboratorio "Pruebas"): azul de la marca y todo en blanco. */
    const t = brand
        ? {
              bg: "hsl(var(--primary))",
              title: "text-white",
              lead: "text-white/85",
              band: "bg-white/[0.12] text-white",
              bandLabel: "text-white/75",
              lines: "divide-white/20 border-white/20",
              muted: "text-white/65",
              strong: "text-white",
              body: "text-white/85",
              rule: "divide-white/15",
              chip: "bg-white/15 text-white",
              fade: "from-[hsl(var(--primary))]",
              bar: "border-white/15 bg-[hsl(var(--primary))]",
              question: "text-white",
              cta: "bg-white text-primary shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)] hover:bg-white/95 focus-visible:ring-white focus-visible:ring-offset-primary",
              link: "text-white/80 hover:text-white focus-visible:ring-white",
          }
        : {
              bg: SKY,
              title: "text-foreground",
              lead: "text-primary",
              band: "bg-primary text-primary-foreground",
              bandLabel: "text-white/80",
              lines: "divide-border border-border",
              muted: "text-muted-foreground",
              strong: "text-foreground",
              body: "text-foreground/85",
              rule: "divide-border",
              chip: "bg-primary/[0.09] text-primary",
              fade: "from-[hsl(215_70%_96%)]",
              bar: "border-primary/15 bg-[hsl(215_70%_96%)]",
              question: "text-foreground",
              cta: "bg-[#25D366] text-black shadow-lg hover:scale-[1.01] hover:bg-[#20b858] focus-visible:ring-primary",
              link: "text-muted-foreground hover:text-foreground focus-visible:ring-primary",
          };
    const { quote, name: tName, role: tRole, initials: tInitials } = m.testimonial;
    const question = m.firstName ? `${m.firstName}, ${m.labels.workshopQuestion}` : m.labels.workshopQuestion.charAt(0).toUpperCase() + m.labels.workshopQuestion.slice(1);
    const story4 = (
        <div key="s" className="absolute inset-0 flex flex-col" style={{ background: t.bg }}>
            <div className="relative flex-1 min-h-0 overflow-y-auto px-5 min-[375px]:px-6 pt-9 pb-4 [@media(min-height:800px)]:pt-10 flex flex-col">
                <div className="my-auto">
                    <h2 className={`text-[1.75rem] [@media(min-height:800px)]:text-[2.5rem] font-[Outfit] font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance] ${t.title}`}>
                        {question}
                    </h2>
                    <p className={`mt-2 text-[17px] font-semibold ${t.lead}`}>{m.labels.workshopSubtitle ?? "Tenemos un taller para vos."}</p>

                    {/* En qué te va a ayudar: el pico de la pantalla, una franja de borde a borde */}
                    <div className={`-mx-5 min-[375px]:-mx-6 mt-5 py-4 [@media(min-height:800px)]:mt-6 [@media(min-height:800px)]:py-5 px-5 min-[375px]:px-6 ${t.band}`}>
                        <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t.bandLabel}`}>
                            <Target className="h-4 w-4" aria-hidden="true" /> En qué te va a ayudar
                        </p>
                        <p className="mt-2 font-[Outfit] text-[1.1875rem] [@media(min-height:800px)]:text-[1.375rem] font-bold leading-[1.3] tracking-[-0.01em] [text-wrap:pretty]">
                            {m.workshopHelps}
                        </p>
                    </div>

                    {/* Sesiones, opiniones y detalles, a un toque */}
                    <div className={`mt-4 [@media(min-height:800px)]:mt-6 divide-y border-y ${t.lines}`} data-no-tap>
                        {accordion({
                            id: "sesiones-taller",
                            open: sessOpen,
                            toggle: () => setSessOpen((o) => !o),
                            title: "Detalles de las sesiones",
                            dark: brand,
                            children: (
                                <div className="pb-3">
                                    <p className={`text-sm font-semibold ${t.muted}`}>El taller completo son {m.sessions.length} sesiones prácticas:</p>
                                    <ul className={`mt-1 divide-y ${t.rule}`}>
                                        {m.sessions.map((s) => (
                                            <li key={s.num} className="py-2.5 text-base">
                                                <span className={`font-bold ${t.strong}`}>
                                                    Sesión {s.num} · {s.name}:
                                                </span>{" "}
                                                <span className={t.muted}>{s.subtitle}</span>
                                                <span className={`mt-1 block text-[14.5px] leading-snug ${t.body}`}>{s.why}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        })}
                        {accordion({
                            id: "opiniones-taller",
                            open: opinOpen,
                            toggle: () => setOpinOpen((o) => !o),
                            title: "Opiniones del taller",
                            dark: brand,
                            children: (
                                <figure className="pb-4">
                                    <blockquote className={`text-[15px] leading-[1.6] [text-wrap:pretty] ${t.body}`}>«{quote}»</blockquote>
                                    <figcaption className="mt-2.5 flex items-center gap-2.5 text-[13px]">
                                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${t.chip}`} aria-hidden="true">
                                            {tInitials}
                                        </span>
                                        <span>
                                            <span className={`font-semibold ${t.strong}`}>{tName}</span>
                                            <span className={t.muted}> · {tRole}</span>
                                        </span>
                                    </figcaption>
                                </figure>
                            ),
                        })}
                        {accordion({
                            id: "detalles-taller",
                            open: detOpen,
                            toggle: () => setDetOpen((o) => !o),
                            title: "Detalles",
                            dark: brand,
                            children: (
                                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 pb-4 text-[15px]">
                                    {m.workshopDetails.map((it) => (
                                        <div key={it.label} className="contents">
                                            <dt className={t.muted}>{it.label}</dt>
                                            <dd className={`font-semibold ${t.strong}`}>{it.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            ),
                        })}
                        {m.extraAccordion &&
                            accordion({
                                id: "extra-taller",
                                open: extraOpen,
                                toggle: () => setExtraOpen((o) => !o),
                                title: m.extraAccordion.title,
                                dark: brand,
                                children: (
                                    <div className="pb-4">
                                        <p className={`text-[15px] leading-[1.6] [text-wrap:pretty] ${t.body}`}>
                                            {m.extraAccordion.linkText && m.extraAccordion.linkUrl && m.extraAccordion.body.includes(m.extraAccordion.linkText) ? (
                                                <>
                                                    {m.extraAccordion.body.split(m.extraAccordion.linkText)[0]}
                                                    <a
                                                        href={m.extraAccordion.linkUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`font-semibold underline underline-offset-2 transition-opacity hover:opacity-80 ${brand ? "text-white" : "text-primary"}`}
                                                    >
                                                        {m.extraAccordion.linkText}
                                                    </a>
                                                    {m.extraAccordion.body.split(m.extraAccordion.linkText).slice(1).join(m.extraAccordion.linkText)}
                                                </>
                                            ) : (
                                                m.extraAccordion.body
                                            )}
                                        </p>
                                    </div>
                                ),
                            })}
                    </div>
                </div>
                <span className={`pointer-events-none sticky -bottom-4 -mx-6 -mb-4 block h-6 shrink-0 bg-gradient-to-t to-transparent ${t.fade}`} aria-hidden="true" />
            </div>

            {/* Siempre visible: la pregunta, WhatsApp y volver a empezar */}
            <div className={`space-y-2 border-t px-5 min-[375px]:px-6 pt-3 pb-4 ${t.bar}`}>
                <p className={`text-center text-sm font-semibold ${t.question}`}>{m.labels.workshopCtaPrompt ?? "¿Tenés más preguntas?"}</p>
                <a
                    href={conversemosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-4 text-[17px] min-[375px]:text-lg font-bold transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.cta}`}
                >
                    <WhatsAppIcon className="h-6 w-6" />
                    Conversemos por WhatsApp
                </a>
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => go(0)}
                        className={`min-h-[44px] px-2 text-sm font-medium rounded-md focus-visible:outline-none focus-visible:ring-2 ${t.link}`}
                    >
                        Ver de nuevo
                    </button>
                    <button
                        type="button"
                        onClick={retake}
                        className={`inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm font-medium rounded-md focus-visible:outline-none focus-visible:ring-2 ${t.link}`}
                    >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Volver a hacer el test
                    </button>
                </div>
            </div>
        </div>
    );

    /* ═══ PESTAÑA DE REGALO (2.ª posición en Riesgo de Burnout · 1 sesión sin compromiso) ═══ */
    const giftHeadline = m.giftSession
        ? m.firstName
            ? `${m.firstName}, ${m.giftSession.headline}`
            : m.giftSession.headline.charAt(0).toUpperCase() + m.giftSession.headline.slice(1)
        : "";
    const giftWhatsappUrl = m.giftSession
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hola, soy ${m.firstName || "una persona que hizo el test"}. ${m.giftSession.whatsappText}`
          )}`
        : conversemosUrl;

    const story5 = m.giftSession ? (
        <div key="g" className="absolute inset-0 flex flex-col" style={{ background: t.bg }}>
            <div className="relative flex-1 min-h-0 overflow-y-auto px-5 min-[375px]:px-6 pt-9 pb-4 [@media(min-height:800px)]:pt-10 flex flex-col">
                <div className="my-auto">
                    {/* Kicker sin ícono + subrayado curvo animado que se traza al entrar */}
                    <p className={`relative inline-block text-[15px] font-bold ${t.lead}`}>
                        <span>{m.giftSession.kicker}</span>
                        <svg
                            viewBox="0 0 200 10"
                            fill="none"
                            aria-hidden="true"
                            className="mt-0.5 block h-2.5 w-full overflow-visible"
                        >
                            <path
                                d="M 2 7 Q 100 1.5 198 7"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                pathLength={100}
                                strokeDasharray={100}
                                strokeDashoffset={idx === 1 ? 0 : 100}
                                className="transition-[stroke-dashoffset] duration-700 delay-150 ease-out motion-reduce:transition-none"
                            />
                        </svg>
                    </p>
                    <h2 className={`mt-2 text-[1.75rem] [@media(min-height:800px)]:text-[2.35rem] font-[Outfit] font-extrabold leading-[1.05] tracking-[-0.028em] [text-wrap:balance] ${t.title}`}>
                        {giftHeadline}
                    </h2>

                    {/* Franja destacada de borde a borde (igual que en la Historia 4) con movimiento sutil en el ícono de regalo */}
                    <div className={`-mx-5 min-[375px]:-mx-6 mt-5 py-4 [@media(min-height:800px)]:mt-6 [@media(min-height:800px)]:py-5 px-5 min-[375px]:px-6 ${t.band}`}>
                        <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${t.bandLabel}`}>
                            <Gift className="h-4 w-4 motion-safe:animate-bounce" style={{ animationDuration: "2.2s" }} aria-hidden="true" /> {m.giftSession.giftLabel}
                        </p>
                        <p className="mt-2 font-[Outfit] text-[1.15rem] [@media(min-height:800px)]:text-[1.325rem] font-bold leading-[1.32] tracking-[-0.01em] [text-wrap:pretty]">
                            {m.giftSession.giftBody}
                        </p>
                    </div>

                    {/* Acordeón de cómo funciona */}
                    <div className={`mt-4 [@media(min-height:800px)]:mt-6 divide-y border-y ${t.lines}`} data-no-tap>
                        {accordion({
                            id: "como-funciona-regalo",
                            open: giftHowOpen,
                            toggle: () => setGiftHowOpen((o) => !o),
                            title: m.giftSession.stepsTitle,
                            dark: brand,
                            children: (
                                <ul className="space-y-2.5 pb-4 pt-1">
                                    {m.giftSession.steps.map((st, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[15px] leading-[1.55]">
                                            <span
                                                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold tabular-nums ${t.chip}`}
                                                aria-hidden="true"
                                            >
                                                {i + 1}
                                            </span>
                                            <span className={`[text-wrap:pretty] ${t.body}`}>{st}</span>
                                        </li>
                                    ))}
                                </ul>
                            ),
                        })}
                    </div>
                </div>
                <span className={`pointer-events-none sticky -bottom-4 -mx-6 -mb-4 block h-6 shrink-0 bg-gradient-to-t to-transparent ${t.fade}`} aria-hidden="true" />
            </div>

            {/* Siempre visible al pie: invitación a coordinar por WhatsApp y botones para seguir viendo el resultado */}
            <div className={`space-y-2 border-t px-5 min-[375px]:px-6 pt-3 pb-3.5 ${t.bar}`}>
                <p className={`text-center text-sm font-semibold [text-wrap:balance] ${t.question}`}>{m.giftSession.ctaPrompt}</p>
                <a
                    href={giftWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-4 text-[17px] min-[375px]:text-lg font-bold transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.cta}`}
                >
                    <WhatsAppIcon className="h-6 w-6" />
                    {m.giftSession.ctaLabel}
                </a>
                <div className="flex items-center justify-between pt-0.5">
                    <button
                        type="button"
                        onClick={() => go(idx - 1)}
                        className={`inline-flex items-center gap-1 min-h-[40px] px-2 text-sm font-medium rounded-md focus-visible:outline-none focus-visible:ring-2 ${t.link}`}
                    >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => go(idx + 1)}
                        className={`inline-flex items-center gap-1 min-h-[40px] rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                            brand ? "bg-white/15 text-white hover:bg-white/25" : "bg-foreground/[0.07] text-foreground hover:bg-foreground/[0.12]"
                        }`}
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    const slides = story5 ? [story1, story5, story2, story3, story4] : [story1, story2, story3, story4];
    const hasOwnFooter = idx === TOTAL - 1 || (!!story5 && idx === 1);
    const onDark = brand && hasOwnFooter;
    const isSkySlide = story5 ? idx === 2 : idx === 1;
    const navBg = isSkySlide ? "bg-[hsl(215_70%_96%)]" : "bg-card";

    return (
        <div className="w-full h-full flex justify-center sm:py-6">
            <div
                className="relative w-full h-full sm:max-w-md sm:rounded-3xl overflow-hidden bg-card text-left select-none touch-pan-y sm:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
                ref={regionRef}
                role="region"
                aria-roledescription="historias"
                aria-label={`Tu resultado en ${TOTAL} partes`}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onClick={onClick}
            >
                {/* Progreso */}
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

                {/* Barra inferior con fondo propio (en las pantallas con su propio pie de WhatsApp mandan sus propios botones) */}
                {!hasOwnFooter && (
                    <div className={`absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-3 py-3 ${navBg}`}>
                        <button
                            type="button"
                            onClick={() => go(idx - 1)}
                            aria-label="Historia anterior"
                            className={`h-11 w-11 grid place-items-center rounded-full text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${idx === 0 ? "invisible" : ""}`}
                        >
                            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(idx + 1)}
                            className="inline-flex h-11 items-center gap-1 rounded-full bg-foreground/[0.07] px-5 text-sm font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                )}

                <p className="sr-only" aria-live="polite">{`Parte ${idx + 1} de ${TOTAL}`}</p>
            </div>
        </div>
    );
}
