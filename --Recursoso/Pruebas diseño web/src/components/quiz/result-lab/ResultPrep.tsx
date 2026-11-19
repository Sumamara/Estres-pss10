"use client";

/* ── EN PREPARACIÓN · versión de trabajo, con Historias como base ──
   Cambios respecto a "4 · Historias":
   - Historia 1: primero la frase que valida, después el medidor (se lee de un vistazo)
     y abajo carga y recuperación como dos barras simples.
   - Aviso de salud en 14 px y sin nada encima.
   - Historia 4: el taller como invitación ("de una vez por todas"), con la señal
     que más te resonó en el centro, un testimonio, las 5 sesiones en "Ver más"
     y el botón "Conversemos por WhatsApp".
   - Se avanza solo tocando los bordes (o con el botón / deslizando). */

import { useCallback, useEffect, useRef, useState } from "react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    Lightbulb,
    RotateCcw,
    X,
} from "lucide-react";
import { WHATSAPP_NUMBER, type ResultModel } from "./model";
import { TiltBalance, TiltBalanceSolid, WhatsAppIcon, useRetake } from "./parts";
import { GaugeNeedle } from "./ChartLab";
import { ZRuler } from "./ZoneLab";

const TOTAL = 4;

const EDGE = 0.22; // ancho de cada borde que avanza o retrocede

export type BalanceMode = "full" | "summary" | "summary-card" | "button";



const BALANCE_EXPLANATION =
    "Tu nivel de desgaste compara tu carga con tu recuperación. En 50 están parejas; cuanto más arriba, más pesa la carga.";

export default function ResultPrep({
    m,
    onRetake,
    balanceMode = "button",
    proposal = false,
    mix,
}: {
    m: ResultModel;
    onRetake: () => void;
    balanceMode?: BalanceMode;
    /** Propuesta de la crítica: aguja calma, cuenta del balance con tus números, cuidado en zonas altas, etc. */
    proposal?: boolean;
    /** 6 = ★ Mix 2 · pro (la historia 1 pasada por distill). ★ Mix 2.1 ya es el resultado principal (components/quiz/result). */
    mix?: 6;
}) {
    const retake = useRetake(onRetake);
    const [idx, setIdx] = useState(0);
    const [infoOpen, setInfoOpen] = useState(false);

    const [balanceOpen, setBalanceOpen] = useState(false);
    const detailRef = useRef<HTMLDivElement>(null);

    // Propuesta: el degradado de "hay más" solo aparece si de verdad queda contenido debajo
    const s1Ref = useRef<HTMLDivElement>(null);
    const [moreBelow, setMoreBelow] = useState(false);
    const checkMore = useCallback(() => {
        const el = s1Ref.current;
        if (el) setMoreBelow(el.scrollHeight - el.clientHeight - el.scrollTop > 4);
    }, []);
    useEffect(() => {
        const el = s1Ref.current;
        if (!el) return;
        checkMore();
        const ro = new ResizeObserver(checkMore);
        ro.observe(el);
        if (el.firstElementChild) ro.observe(el.firstElementChild);
        const t = setTimeout(checkMore, 350); // después de abrir/cerrar el detalle
        return () => {
            ro.disconnect();
            clearTimeout(t);
        };
    }, [checkMore, balanceOpen, idx]);

    // Propuesta: la cuenta del balance dicha con los números de la persona
    const diff = m.load - m.recovery;
    const relLong = diff > 25 ? "pesa mucho más que" : diff > 5 ? "pesa más que" : diff >= -5 ? "está pareja con" : diff >= -25 ? "pesa menos que" : "pesa mucho menos que";
    const balanceShort = diff > 5 ? "Tu carga pesa más que tu recuperación" : diff >= -5 ? "Tu carga y tu recuperación están parejas" : "Tu recuperación pesa más que tu carga";
    const balanceLong = `Tu carga (${m.load}\u00a0%) ${relLong} tu recuperación (${m.recovery}\u00a0%). Por eso tu nivel de desgaste da ${m.score}\u00a0de\u00a0100: en 50 están parejas, y cuanto más pesa la carga, más sube.`;
    const highZone = m.zoneKey === "riesgo-burnout" || m.zoneKey === "bajo-presion";

    // Propuesta: al abrir el detalle, llevarlo a la vista (no queda escondido bajo la barra)
    useEffect(() => {
        if (!proposal || !balanceOpen) return;
        const t = setTimeout(() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            detailRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
        }, 320);
        return () => clearTimeout(t);
    }, [balanceOpen, proposal]);

    // Mix 1: la nota del cálculo se abre dentro del flujo; si queda bajo el borde, se lleva a la vista
    useEffect(() => {
        if (mix !== 6 || !infoOpen) return;
        const t = setTimeout(() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById("nivel-calculo")?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
        }, 60);
        return () => clearTimeout(t);
    }, [infoOpen, mix]);

    useEffect(() => {
        setInfoOpen(false);
        setBalanceOpen(false);
    }, [idx]);
    useEffect(() => {
        if (!infoOpen) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setInfoOpen(false);
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [infoOpen]);
    const startX = useRef<number | null>(null);
    const swiped = useRef(false);

    const total = TOTAL;
    const go = useCallback((n: number) => setIdx(Math.max(0, Math.min(total - 1, n))), [total]);

    // Flechas: cambian de historia, salvo mientras se escribe en un campo
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
        const heading = regionRef.current?.querySelector<HTMLElement>(`[aria-label="${idx + 1} de ${total}"] :is(h1, h2)`);
        if (!heading) return;
        heading.setAttribute("tabindex", "-1");
        heading.style.outline = "none";
        heading.focus({ preventScroll: true });
    }, [idx]);

    const isInteractive = (el: EventTarget | null) =>
        el instanceof Element && !!el.closest("a, button, summary, details, [data-no-tap]");

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
    // Solo los bordes avanzan: el centro queda libre para leer y desplazarse
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (swiped.current || isInteractive(e.target)) return;
        // Con el (i) abierto, tocar afuera solo lo cierra
        if (infoOpen) {
            setInfoOpen(false);
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        if (x < EDGE) go(idx - 1);
        else if (x > 1 - EDGE) go(idx + 1);
    };

    const topSignal = m.signals[0];
    const conversemosUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, soy ${m.firstName || "una persona que hizo el test"}. Hice el test de estrés y salí en "${m.zoneTitle}". Tengo algunas preguntas sobre el taller, ¿conversamos?`
    )}`;

    const slideClass = "absolute inset-0 flex flex-col px-5 min-[375px]:px-6 pt-8 min-[375px]:pt-9 pb-[4.5rem] overflow-y-auto";

    /* Barras de carga y recuperación (se usan en los tres modos) */
    const balanceBars = (
        <div className="grid grid-cols-2 gap-x-4 min-[375px]:gap-x-5">
            {[
                { label: "Carga", short: "Carga", value: m.load, color: "#e11d48", ink: "#be123c" },
                { label: "Recuperación", short: "Recuperación", value: m.recovery, color: "#059669", ink: "#047857" },
            ].map((b) => (
                <div key={b.label} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-semibold whitespace-nowrap" style={{ color: b.ink }}>
                            <span className="max-[359px]:hidden">{b.label}</span>
                            <span className="hidden max-[359px]:inline">{b.short}</span>
                        </span>
                        <span className="font-bold tabular-nums whitespace-nowrap">{b.value}&nbsp;%</span>
                    </div>
                    <div
                        className="h-2 rounded-full bg-foreground/[0.08] overflow-hidden"
                        role="meter"
                        aria-label={b.label}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={b.value}
                        aria-valuetext={`${b.value} %`}
                    >
                        <div className="h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                    </div>
                </div>
            ))}
        </div>
    );

    /* Detalle desplegable: barras + explicación (crece suave con grid-rows) */
    const balanceDetail = (
        <div
            id="balance-detalle"
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${balanceOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            {...({ inert: balanceOpen ? undefined : "" } as Record<string, unknown>)}
        >
            <div className="overflow-hidden">
                <div ref={detailRef} className="space-y-2.5 pt-3 scroll-mb-20">
                    {balanceBars}
                    <p className="text-sm leading-snug text-muted-foreground">{proposal ? balanceLong : BALANCE_EXPLANATION}</p>
                </div>
            </div>
        </div>
    );

    /* Solo la explicación: las cifras ya están a la vista en v2/v3 */
    const balanceExplain = (
        <div
            id="balance-detalle"
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${balanceOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            {...({ inert: balanceOpen ? undefined : "" } as Record<string, unknown>)}
        >
            <div className="overflow-hidden">
                <p className="pt-2.5 text-sm leading-snug text-muted-foreground">{BALANCE_EXPLANATION}</p>
            </div>
        </div>
    );

    /* ── Mix: historia 1 con balanza, zona, frase, barras de 3 niveles y estado ── */
    const zonePinPercent = (gap: number) => {
        const map = (v: number, a: number, b: number, from: number, to: number) => from + Math.max(0, Math.min(1, (v - a) / (b - a))) * (to - from);
        if (gap <= 25) return map(gap, 0, 25, 4, 23);
        if (gap <= 50) return map(gap, 26, 50, 27, 48);
        if (gap <= 75) return map(gap, 51, 75, 52, 73);
        return map(gap, 76, 100, 77, 96);
    };
    const LEVELS = ["Baja", "Media", "Alta"];
    const levelOf = (v: number) => (v < 34 ? 0 : v < 67 ? 1 : 2);
    const mixZoneLabels = (
        <ol className="mt-1.5 grid grid-cols-4 gap-1 text-center text-[12px] leading-[1.2]" aria-label="Zonas posibles">
            {m.zones.map((z) => (
                <li key={z.key} aria-current={z.key === m.zoneKey ? "true" : undefined} className={z.key === m.zoneKey ? "font-semibold text-foreground" : "text-muted-foreground"}>
                    {z.title}
                </li>
            ))}
        </ol>
    );
    const mixPin = (
        <span
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5px] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.25)]"
            style={{ left: `${zonePinPercent(m.score)}%`, borderColor: m.zoneHex }}
        />
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
    const nivelCalculo = (() => {
        const d = m.load - m.recovery;
        const meaning =
            Math.abs(d) < 5
                ? `están parejas, así que tu nivel queda cerca de 50 (${m.score}).`
                : d > 0
                  ? `gastás más de lo que reponés, y por eso sube de 50 a ${m.score}.`
                  : `reponés más de lo que gastás, y por eso baja de 50 a ${m.score}.`;
        return (
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
    })();

    const pinPct = zonePinPercent(m.score);

    /* ★ Mix 2 · pro (mix = 6): Mix 2 pasado por distill. Un solo color con significado (el de tu zona):
       sin caja en el párrafo (el resplandor ya trae el tinte), energía en tinta neutra,
       y en la barra de zonas solo se pinta tu tramo. */
    const mix2Pro = () => {
        const label = "block whitespace-nowrap text-[12.5px] min-[375px]:text-[13px] font-semibold leading-tight tracking-[-0.01em] text-foreground/75";
        const neutral = "hsl(var(--foreground) / 0.62)";
        return (
            <div className="flex flex-col selection:bg-[var(--sel)]" style={{ ["--sel" as string]: `${m.zoneHex}33` }}>
                <span aria-hidden="true" className="self-start">
                    <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-12 [@media(min-height:800px)]:h-14 w-auto" />
                </span>
                <h1 className="mt-3 [@media(min-height:800px)]:mt-4">
                    <span className="text-[15px] block font-medium text-muted-foreground">Estás en zona</span>
                    <span className="text-[1.875rem] [@media(min-height:800px)]:text-[2.25rem] block font-[Outfit] font-bold leading-[1.05] tracking-[-0.02em] [text-wrap:balance]" style={{ color: m.zoneInk }}>
                        {m.zoneTitle}
                    </span>
                </h1>
                {/* Sin caja: el mensaje se sostiene con contraste completo, tamaño y aire */}
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

                <div className="mt-7 w-full [@media(min-height:800px)]:mt-10">
                    <div className="grid grid-cols-2 gap-x-5">
                        {[
                            { label: "Energía que gastás", value: m.load },
                            { label: "Energía que recuperás", value: m.recovery },
                        ].map((b) => (
                            <div key={b.label} className="text-center" {...meterProps(b.label, b.value)}>
                                <span className={label}>{b.label}</span>
                                <span className="mt-1 flex items-baseline justify-center gap-1">
                                    <span className="text-[1.625rem] font-[Outfit] font-bold leading-none tabular-nums text-foreground">{b.value}</span>
                                    <span className="text-[13px] text-muted-foreground whitespace-nowrap">%&nbsp;·&nbsp;{LEVELS[levelOf(b.value)]}</span>
                                </span>
                                <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]" aria-hidden="true">
                                    <span className="block h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: neutral }} />
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="relative mt-5 [@media(min-height:800px)]:mt-7" data-no-tap>
                        <p className={`${label} text-center`}>Tu nivel de desgaste</p>
                        <div className="relative mt-1.5 pt-8">
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
                                <div className="grid h-2.5 grid-cols-4 gap-1" aria-hidden="true">
                                    {m.zones.map((z, i) => (
                                        <span
                                            key={z.key}
                                            className={`${i === 0 ? "rounded-l-full" : ""} ${i === m.zones.length - 1 ? "rounded-r-full" : ""} ${z.key === m.zoneKey ? "" : "bg-foreground/[0.09]"}`}
                                            style={z.key === m.zoneKey ? { backgroundColor: z.hex } : undefined}
                                        />
                                    ))}
                                </div>
                                {mixPin}
                            </div>
                        </div>
                        {mixZoneLabels}
                        <div aria-live="polite">
                            {infoOpen && (
                                <div
                                    id="nivel-calculo"
                                    role="note"
                                    className="relative mt-3 scroll-mb-24 rounded-xl border bg-card p-3.5 pr-10 text-left text-sm leading-snug text-foreground/85 shadow-[0_6px_20px_-10px_rgba(15,23,42,0.25)] animate-in fade-in slide-in-from-top-1 duration-200 motion-reduce:animate-none"
                                >
                                    {nivelCalculo}
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
                <p className="mt-4 [@media(min-height:800px)]:mt-6 text-center text-[14px] leading-snug text-foreground/85 [text-wrap:balance]">
                    <Lightbulb className="mr-1.5 inline-block h-4 w-4 -translate-y-px align-middle" style={{ color: m.zoneInk }} aria-hidden="true" />
                    {m.action}
                </p>
            </div>
        );
    };

    const mixSlide1 = (
        <div key="r" ref={mix === 6 ? s1Ref : undefined} onScroll={mix === 6 ? checkMore : undefined} className={slideClass}
            style={{ background: `linear-gradient(180deg, ${m.zoneHex}14 0%, hsl(var(--card)) 45%)` }}
        >
            <div className="flex-1 flex flex-col justify-center">{mix2Pro()}</div>

            <p className="pt-3 text-center text-[13px] italic leading-snug text-muted-foreground [text-wrap:balance]">
                Una señal para observar tu balance hoy, <span className="not-italic font-medium text-foreground/70">no una etiqueta fija.</span>
            </p>
        </div>
    );

    const slides = [
        /* ── 1 · TU RESULTADO: medidor S → zonas → titular → carga y recuperación → frase que valida ── */
        mix ? mixSlide1 : <div key="r" ref={s1Ref} onScroll={checkMore} className={slideClass} style={{ backgroundColor: "hsl(var(--card))" }}>
            <div className="flex-1 flex flex-col justify-center">
                {/* Grupo 1 · Resultado: etiqueta, medidor, zonas y titular (una sola idea, juntos) */}
                {/* El medidor manda: más grande, y las zonas como leyenda compacta pegada a él */}
                <div className="space-y-1">
                    {/* Título real: dice qué se está leyendo y amarra la pantalla (la frase sigue en el titular) */}
                    <p className="font-[Outfit] text-xl font-bold leading-tight tracking-tight text-foreground" aria-hidden="true">
                        Tu nivel de desgaste
                    </p>

                    <div className={`relative w-full mx-auto ${proposal ? "max-w-[200px] min-[360px]:max-w-[220px]" : "max-w-[210px] min-[360px]:max-w-[236px]"}`}>
                        {/* Resplandor suave del color de la zona, detrás del medidor */}
                        <div
                            className="pointer-events-none absolute -inset-x-16 -top-12 -bottom-8"
                            style={{
                                background: proposal
                                    ? `radial-gradient(ellipse 50% 55% at 50% 58%, ${m.zoneHex}16 0%, ${m.zoneHex}08 45%, transparent 100%)`
                                    : `radial-gradient(ellipse 50% 55% at 50% 58%, ${m.zoneHex}22 0%, ${m.zoneHex}0d 45%, transparent 100%)`,
                            }}
                            aria-hidden="true"
                        />
                        <div className="relative">
                            <GaugeNeedle m={m} needle="H" compact calm={proposal} />
                        </div>
                    </div>

                    {/* Zonas como regla: tramos finos del mismo grosor; el tuyo a color pleno, los demás tenues */}
                    <div className="mx-auto w-full max-w-[272px] pt-1.5">
                        <ZRuler m={m} sameWeight />
                    </div>
                </div>

                <h1 className="mt-2.5">
                    <span className="sr-only">{`Tu nivel de desgaste: ${m.score} de 100. Estás en zona `}</span>
                    {!proposal && <span className="block text-base font-medium text-muted-foreground">está en zona</span>}
                    <span className="block text-[1.75rem] min-[360px]:text-[2rem] leading-[1.1] font-bold tracking-tight" style={{ color: m.zoneInk }}>
                        {m.zoneTitle}
                    </span>
                </h1>

                {/* Grupo 2 · Por qué: Tu balance (completo, punto medio o botón) */}
                {balanceMode === "full" && (
                <div className="mt-4 space-y-2">
                    <div className="relative">
                        <p className="relative inline-block text-sm font-semibold text-muted-foreground">
                            Tu balance
                            <button
                                type="button"
                                onClick={() => setInfoOpen((o) => !o)}
                                aria-expanded={infoOpen}
                                aria-controls="desgaste-info"
                                aria-label="¿Cómo se calcula tu nivel de desgaste?"
                                className="absolute left-full top-1/2 -translate-y-1/2 -ml-2.5 grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <Info className="h-[15px] w-[15px]" aria-hidden="true" />
                            </button>
                        </p>
                        {infoOpen && (
                            <div data-no-tap className="absolute left-0 top-full z-30 mt-1 w-[17.5rem] max-w-full">
                                <div
                                    id="desgaste-info"
                                    role="note"
                                    className="rounded-xl border bg-card p-3.5 text-left text-sm leading-snug text-foreground/85 shadow-[0_10px_28px_-10px_rgba(15,23,42,0.3)] animate-in fade-in slide-in-from-top-1 duration-150 motion-reduce:animate-none"
                                >
                                    {BALANCE_EXPLANATION}
                                </div>
                            </div>
                        )}
                    </div>
                    {balanceBars}
                </div>
                )}

                {/* Punto medio v2 / v3: cifras a la vista con jerarquía; toda la fila se toca para ver el porqué */}
                {(balanceMode === "summary" || balanceMode === "summary-card") && (
                    <div className="mt-4" data-no-tap>
                        <button
                            type="button"
                            onClick={() => setBalanceOpen((o) => !o)}
                            aria-expanded={balanceOpen}
                            aria-controls="balance-detalle"
                            className={`group flex w-full items-center gap-4 text-left transition-[background-color,transform] duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                balanceMode === "summary-card"
                                    ? "rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 hover:bg-foreground/[0.07]"
                                    : "-mx-1.5 rounded-lg px-1.5 py-1 hover:bg-foreground/[0.03]"
                            }`}
                        >
                            {[
                                { label: "Carga", value: m.load, color: "#e11d48", ink: "#be123c" },
                                { label: "Recuperación", value: m.recovery, color: "#059669", ink: "#047857" },
                            ].map((b) => (
                                <span key={b.label} className="block min-w-0">
                                    <span className="block text-xs font-medium text-muted-foreground">{b.label}</span>
                                    <span className="block font-[Outfit] text-xl font-bold leading-tight tabular-nums" style={{ color: b.ink }}>
                                        {b.value}&nbsp;%
                                    </span>
                                    <span className="mt-1 block h-1 w-14 overflow-hidden rounded-full bg-foreground/[0.08]" aria-hidden="true">
                                        <span className="block h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                                    </span>
                                </span>
                            ))}
                            <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
                                {balanceMode === "summary" && "Ver por qué"}
                                <ChevronDown
                                    className={`h-5 w-5 transition-transform duration-300 ${balanceMode === "summary-card" ? "text-muted-foreground group-hover:text-foreground" : ""} ${balanceOpen ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                />
                                {balanceMode === "summary-card" && <span className="sr-only">Ver por qué</span>}
                            </span>
                        </button>
                        {balanceExplain}
                    </div>
                )}

                {/* Botón: "Comprendé tu balance", con la balanza de la marca inclinada según tus datos */}
                {balanceMode === "button" && (
                    <div className="mt-4" data-no-tap>
                        <button
                            type="button"
                            onClick={() => setBalanceOpen((o) => !o)}
                            aria-expanded={balanceOpen}
                            aria-controls="balance-detalle"
                            className="group flex w-full items-center gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 text-left transition-[background-color,transform] duration-200 hover:bg-foreground/[0.07] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <span aria-hidden="true" className="shrink-0">
                                <TiltBalance load={m.load} recovery={m.recovery} className={`${proposal ? "h-9" : "h-7"} w-auto text-foreground`} />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-foreground">Comprendé tu balance</span>
                                <span className="block text-xs text-muted-foreground">{proposal ? balanceShort : "Por qué estás en esta zona"}</span>
                            </span>
                            <ChevronDown
                                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-foreground ${balanceOpen ? "rotate-180" : ""}`}
                                aria-hidden="true"
                            />
                        </button>
                        {balanceDetail}
                    </div>
                )}

                {/* La frase que valida cierra la historia, separada de los datos */}
                <p className={`border-t border-border/60 pt-3 text-[17px] leading-relaxed text-foreground/85 [text-wrap:pretty] ${proposal ? "mt-3.5" : "mt-4"}`}>
                    {m.firstName
                        ? `${m.firstName}, ${m.validation.charAt(0).toLowerCase()}${m.validation.slice(1)}`
                        : m.validation}
                </p>
            </div>

            {/* Al pie: recordatorio suave de que es orientativo */}
            {proposal && highZone ? (
                <p className="pt-2 text-center text-[13px] italic leading-snug text-muted-foreground [text-wrap:balance]">
                    Una señal, no un diagnóstico.{" "}
                    <span className="not-italic font-medium text-foreground/75">Si sentís que te sobrepasa, hablá con un profesional de salud.</span>
                </p>
            ) : (
                <p className="pt-2 text-center text-[13px] italic leading-snug text-muted-foreground [text-wrap:balance]">
                    Una señal para observar tu balance hoy, <span className="not-italic font-medium text-foreground/70">no una etiqueta fija.</span>
                </p>
            )}
        </div>,

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

        /* ── 4 · EL TALLER + CONVERSEMOS ── */
        <div key="s" className="absolute inset-0 flex flex-col" style={{ backgroundColor: "hsl(var(--primary))", color: "#fff" }}>
            {/* Contenido que se desplaza; el botón queda siempre visible abajo */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-12 pb-2 flex flex-col gap-4 [&>:first-child]:mt-auto [&>:last-child]:mb-auto">
                <h2 className="text-[1.75rem] leading-[1.15] font-bold tracking-tight [text-wrap:balance]">
                    ¿Querés aprender a regular tu estrés de una vez por todas? Tenemos un taller para vos.
                </h2>

                {/* La señal que más resonó, al centro */}
                <div className="rounded-2xl bg-white/[0.12] p-4 space-y-2">
                    {topSignal ? (
                        <p className="text-base leading-relaxed">
                            Marcaste que te pasa <strong>{topSignal.frequency.toLowerCase()}</strong>: «{topSignal.text}».
                        </p>
                    ) : (
                        <p className="text-base leading-relaxed">Tu balance hoy es bueno. El taller te ayuda a sostenerlo cuando la carga suba.</p>
                    )}
                    <p className="text-base leading-relaxed text-white/90">
                        Tu sesión clave es <strong>{m.session.title}</strong>: {m.session.why.charAt(0).toLowerCase() + m.session.why.slice(1)}
                    </p>
                </div>

                {/* Testimonio: espacio para uno real */}
                <figure className="space-y-1">
                    <blockquote className="text-base italic leading-relaxed text-white/90 border border-dashed border-white/40 rounded-xl p-3">
                        «Acá va un testimonio real de alguien que hizo el taller.»
                    </blockquote>
                    <figcaption className="text-sm text-white/75 pl-1">Nombre, ocupación (pendiente)</figcaption>
                </figure>

                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between min-h-[44px] text-base font-semibold [&::-webkit-details-marker]:hidden">
                        Ver las 5 sesiones
                        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ol className="mt-1 space-y-1.5">
                        {m.sessions.map((s) => (
                            <li key={s.num} className="flex gap-3 text-[15px]">
                                <span className="w-4 shrink-0 tabular-nums text-white/70">{s.num}</span>
                                <span>
                                    <strong>{s.name}</strong>
                                    <span className="text-white/80"> · {s.subtitle}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </details>
            </div>

            <div className="space-y-2 px-6 pt-3 pb-4 border-t border-white/15">
                <p className="text-center text-base font-semibold">¿Tenés más preguntas?</p>
                <a
                    href={conversemosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white text-primary text-lg font-bold transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                    <WhatsAppIcon className="h-5 w-5" />
                    Conversemos por WhatsApp
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

    const onDark = idx === 1 || idx === 3;

    return (
        <div className="w-full h-full flex justify-center sm:py-6">
            <div
                className="relative w-full h-full sm:max-w-md sm:rounded-3xl overflow-hidden bg-card text-left select-none touch-pan-y sm:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]"
                ref={regionRef}
                role="region"
                aria-roledescription="historias"
                aria-label={`Tu resultado en ${total} partes`}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onClick={onClick}
            >
                <div className={`absolute top-0 inset-x-0 z-20 flex gap-1.5 px-4 pt-4 ${proposal && idx === 0 ? "bg-card pb-2.5" : ""}`} aria-hidden="true">
                    {Array.from({ length: total }, (_, i) => (
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
                        aria-label={`${i + 1} de ${total}`}
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

                {/* Barra inferior con fondo propio: no tapa contenido */}
                {idx < total - 1 && (
                    <div
                        className={`absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-3 py-3 ${idx === 1 ? "bg-[#1d2433]" : idx === 2 ? "bg-[hsl(215_70%_96%)]" : "bg-card"
                            }`}
                    >
                        {(proposal || mix === 6) && idx === 0 && moreBelow && (
                            <span className="pointer-events-none absolute -top-6 inset-x-0 h-6 bg-gradient-to-t from-card to-transparent" aria-hidden="true" />
                        )}
                        <button
                            type="button"
                            onClick={() => go(idx - 1)}
                            aria-label="Historia anterior"
                            className={`h-11 w-11 grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${idx === 0 ? "invisible" : ""} ${onDark ? "text-white/80" : "text-foreground/60"}`}
                        >
                            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(idx + 1)}
                            className={`inline-flex h-11 items-center gap-1 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${(proposal || mix === 6) && idx === 0 ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-[background-color,transform]" : onDark ? "bg-white/15 text-white" : "bg-foreground/[0.07] text-foreground"}`}
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                )}

                <p className="sr-only" aria-live="polite">{`Parte ${idx + 1} de ${total}`}</p>
            </div>
        </div>
    );
}
