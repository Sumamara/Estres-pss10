"use client";

import { Info, Lightbulb, X } from "lucide-react";
import type { ResultModel } from "./model";
import { TiltBalanceSolid } from "./parts";

export type QuadrantVariant =
    | "default"
    | "unificar"
    | "unificar-solo-activo"
    | "unificar-opcion-a-horiz"
    | "unificar-texto-color"
    | "aire"
    | "impeccable"
    | "bolder"
    | "uiux"
    | "taste"
    | "taste-impeccable";

const LEVELS = ["Baja", "Media", "Alta"];
const levelOf = (v: number) => (v < 34 ? 0 : v < 67 ? 1 : 2);

const QUAD_CELLS = [
    { key: "resiliente" as const, title: "Óptimo", hex: "#10b981", ink: "#047857", row: "top" as const, col: "left" as const },
    { key: "bajo-presion" as const, title: "Sobrecarga", hex: "#f97316", ink: "#c2410c", row: "top" as const, col: "right" as const },
    { key: "fragil" as const, title: "Vulnerable", hex: "#f59e0b", ink: "#b45309", row: "bottom" as const, col: "left" as const },
    { key: "riesgo-burnout" as const, title: "Riesgo de Burnout", hex: "#f43f5e", ink: "#be123c", row: "bottom" as const, col: "right" as const },
];

export default function QuadrantStory1({
    m,
    variant = "unificar-solo-activo",
    infoOpen,
    setInfoOpen,
}: {
    m: ResultModel;
    variant?: QuadrantVariant;
    infoOpen: boolean;
    setInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    /* Coordenadas del punto dentro del área segura de ploteo (centro en Carga=50% y Recuperación=60%).
       El área de ploteo está separada de las franjas de texto superior e inferior para que ni el punto
       ni las líneas punteadas pasen jamás por encima de los nombres de los 4 estados. */
    const quadX = m.load < 50 ? 16 + (m.load / 50) * 28 : 56 + ((m.load - 50) / 50) * 28;
    const quadY = m.recovery >= 60 ? 42 - ((m.recovery - 60) / 40) * 24 : 58 + ((60 - m.recovery) / 60) * 24;

    const slideClass =
        "absolute inset-0 flex flex-col px-5 min-[375px]:px-6 pt-6 min-[375px]:pt-7 pb-[4.25rem] overflow-y-auto";

    const infoPopover = (
        <div aria-live="polite">
            {infoOpen && (
                <div
                    id="nivel-calculo"
                    role="note"
                    className="absolute inset-x-0 bottom-full mb-2 z-30 rounded-xl border bg-card p-3.5 pr-10 text-left text-[13.5px] leading-snug text-foreground/85 shadow-[0_10px_28px_-10px_rgba(15,23,42,0.3)] animate-in fade-in slide-in-from-bottom-1 duration-150 motion-reduce:animate-none"
                >
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
                    <button
                        type="button"
                        onClick={() => setInfoOpen(false)}
                        aria-label="Cerrar la explicación"
                        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );

    const infoButton = (
        <button
            type="button"
            onClick={() => setInfoOpen((o) => !o)}
            aria-expanded={infoOpen}
            aria-controls="nivel-calculo"
            aria-label="¿Cómo se divide la cuadrícula?"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-foreground/[0.07] text-foreground/75 transition-colors hover:bg-foreground/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
    );

    /* Texto de validación con jerarquía protagonista para que se lea primero */
    const heroValidation = (
        <p className="mt-3 [@media(min-height:800px)]:mt-4 text-[16.5px] min-[390px]:text-[17.5px] [@media(min-height:800px)]:text-[19px] leading-[1.55] text-foreground [text-wrap:pretty]">
            {m.firstName ? (
                <>
                    <span className="font-bold">{m.firstName},</span> {m.validation.charAt(0).toLowerCase()}
                    {m.validation.slice(1)}
                </>
            ) : (
                m.validation
            )}
        </p>
    );

    const footerBlock = (
        <>
            <p className="mt-3 [@media(min-height:800px)]:mt-4 text-center text-[13.5px] leading-snug text-foreground/85 [text-wrap:balance]">
                <Lightbulb className="mr-1 inline-block h-3.5 w-3.5 -translate-y-px align-middle" style={{ color: m.zoneInk }} aria-hidden="true" />
                {m.action}
            </p>
            <p className="pt-2 text-center text-[12px] italic leading-snug text-muted-foreground [text-wrap:balance]">
                Una señal para observar tu balance hoy, <span className="not-italic font-medium text-foreground/70">no una etiqueta fija.</span>
            </p>
        </>
    );

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 1 · DEFAULT ("★ Copia 3": Nuestra versión base compacta)
       ═══════════════════════════════════════════════════════════════════════════ */
    if (variant === "default") {
        const levelLabel = "block whitespace-nowrap text-[12px] min-[375px]:text-[12.5px] font-semibold leading-tight tracking-[-0.01em] text-foreground/75";
        return (
            <div key="r-default" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1f 0%, hsl(var(--card)) 35%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        <span aria-hidden="true" className="self-start">
                            <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-9 [@media(min-height:800px)]:h-12 w-auto" />
                        </span>
                        <h1 className="mt-1.5 [@media(min-height:800px)]:mt-3">
                            <span className="text-[14px] block font-medium text-muted-foreground">Estás en estado</span>
                            <span
                                className="text-[1.75rem] [@media(min-height:800px)]:text-[2.15rem] block font-[Outfit] font-bold leading-[1.04] tracking-[-0.02em] [text-wrap:balance]"
                                style={{ color: m.zoneInk }}
                            >
                                {m.zoneTitle}
                            </span>
                        </h1>
                        <p className="mt-2 text-[15.5px] [@media(min-height:800px)]:text-[17.5px] leading-[1.48] text-foreground [text-wrap:pretty]">
                            {m.firstName ? (
                                <>
                                    <span className="font-bold">{m.firstName},</span> {m.validation.charAt(0).toLowerCase()}
                                    {m.validation.slice(1)}
                                </>
                            ) : (
                                m.validation
                            )}
                        </p>

                        <div className="mt-3.5 [@media(min-height:800px)]:mt-6">
                            <div className="grid grid-cols-2 gap-x-5">
                                {[
                                    { label: "Energía que gastás", value: m.load, color: "#e11d48" },
                                    { label: "Energía que recuperás", value: m.recovery, color: "#059669" },
                                ].map((b) => (
                                    <div key={b.label} className="text-center" role="meter" aria-label={b.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={b.value}>
                                        <span className={levelLabel}>{b.label}</span>
                                        <span className="mt-0.5 flex items-baseline justify-center gap-1">
                                            <span className="text-[1.4rem] [@media(min-height:800px)]:text-[1.6rem] font-[Outfit] font-bold leading-none tabular-nums text-foreground">
                                                {b.value}
                                            </span>
                                            <span className="text-[12px] text-muted-foreground whitespace-nowrap">%&nbsp;·&nbsp;{LEVELS[levelOf(b.value)]}</span>
                                        </span>
                                        <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]" aria-hidden="true">
                                            <span className="block h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="relative mt-3 [@media(min-height:800px)]:mt-5" data-no-tap>
                                <div className="flex items-center justify-between">
                                    <p className={levelLabel}>Tu estado según tus 2 ejes</p>
                                    {infoButton}
                                </div>
                                <div className="relative mt-1.5 pl-8 pb-4">
                                    <div className="relative rounded-2xl border border-foreground/10 bg-card/85 p-1.5 shadow-sm">
                                        <div className="relative grid grid-cols-2 gap-1.5" role="group" aria-label="Cuadrícula de estados">
                                            {QUAD_CELLS.map((cell) => {
                                                const active = cell.key === m.zoneKey;
                                                return (
                                                    <div
                                                        key={cell.key}
                                                        aria-current={active ? "true" : undefined}
                                                        className={`relative flex min-h-[46px] [@media(min-height:800px)]:min-h-[54px] justify-center rounded-xl border px-2 text-center transition-all ${
                                                            cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                        } ${active ? "ring-2 shadow-sm" : "opacity-85"}`}
                                                        style={{
                                                            backgroundColor: active ? `${cell.hex}20` : `${cell.hex}0c`,
                                                            borderColor: active ? cell.hex : `${cell.hex}28`,
                                                            boxShadow: active ? `0 0 0 1.5px ${cell.hex}` : undefined,
                                                        }}
                                                    >
                                                        <span
                                                            className={`relative z-10 block rounded px-1 font-[Outfit] text-[12.5px] font-bold leading-tight ${
                                                                active ? "" : "opacity-75"
                                                            }`}
                                                            style={{ color: cell.ink }}
                                                        >
                                                            {cell.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-foreground/15" />
                                            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-foreground/15" />
                                            {/* Área segura central para líneas y punto (top-5 bottom-5 evita pisar los nombres, pero las líneas llegan hasta el eje) */}
                                            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-5 bottom-5 z-[5]">
                                                {/* Línea punteada horizontal de Recuperación hasta el borde izquierdo del gráfico */}
                                                <span
                                                    className="absolute -left-[6px] -translate-y-1/2 border-t-[1.5px] border-dashed border-[#059669]/85"
                                                    style={{ top: `${quadY}%`, width: `calc(${quadX}% + 6px)` }}
                                                />
                                                {/* Pequeña línea (tick) en el eje izquierdo indicando de dónde sale el valor */}
                                                <span
                                                    className="absolute -left-[11px] h-[2px] w-[6px] -translate-y-1/2 rounded-full bg-[#059669]"
                                                    style={{ top: `${quadY}%` }}
                                                />
                                                {/* Línea punteada vertical de Carga que llega hasta el borde inferior del gráfico */}
                                                <span
                                                    className="absolute -bottom-[26px] -translate-x-1/2 border-l-[1.5px] border-dashed border-[#e11d48]/85"
                                                    style={{ left: `${quadX}%`, top: `${quadY}%` }}
                                                />
                                                {/* Pequeña línea (tick) en el eje inferior indicando de dónde sale el valor */}
                                                <span
                                                    className="absolute -bottom-[31px] h-[6px] w-[2px] -translate-x-1/2 rounded-full bg-[#e11d48]"
                                                    style={{ left: `${quadX}%` }}
                                                />
                                                <span
                                                    className="absolute -left-3.5 -translate-x-full -translate-y-1/2 rounded bg-[#059669]/12 px-1 py-0.5 text-[10.5px] font-bold tabular-nums leading-none text-[#047857]"
                                                    style={{ top: `${quadY}%` }}
                                                >
                                                    {m.recovery}%
                                                </span>
                                                <span
                                                    className="absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.35)]"
                                                    style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneHex }}
                                                />
                                            </div>
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute -bottom-3 -translate-x-1/2 translate-y-full rounded bg-[#e11d48]/12 px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums leading-none text-[#be123c]"
                                                style={{ left: `${quadX}%` }}
                                            >
                                                {m.load}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {infoPopover}
                            </div>
                        </div>
                    </div>
                </div>
                {footerBlock}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 2 · UNIFICAR ("C3 · Unificar" · con Impeccable Layout)
       Estructura espacial (Impeccable Layout):
       1. Grupo Primario (Protagonista): Balanza + Estado + Texto "Ana, ..." con máximo
          protagonismo tipográfico y sin las barras superiores de energía.
       2. Pausa espacial deliberada (separa el mensaje humano de la evidencia).
       3. Grupo Secundario (Gráfico compacto tamaño Copia 3):
          - Cabecera "Tu estado según tus 2 ejes" + ícono (i) a la derecha.
          - Cuadrícula del mismo tamaño compacto que Copia 3.
          - Los números (20% y 80%) ubicados afuera sobre los bordes de los ejes igual que en Copia 3.
          - Títulos de ejes limpios ("Energía que recuperás" y "Energía que gastás", sin flechas)
            con su propio carril para no chocar nunca con los porcentajes.
       ═══════════════════════════════════════════════════════════════════════════ */
    if (
        variant === "unificar" ||
        variant === "unificar-solo-activo" ||
        variant === "unificar-opcion-a-horiz" ||
        variant === "unificar-texto-color"
    ) {
        const levelLabel = "block whitespace-nowrap text-[12px] min-[375px]:text-[12.5px] font-semibold leading-tight tracking-[-0.01em] text-foreground/75";
        const inactiveHasBg = variant === "unificar";
        const inactiveHasColoredText = variant === "unificar" || variant === "unificar-texto-color";
        const hasCurvedUnderline = variant === "unificar-solo-activo" || variant === "unificar-opcion-a-horiz";
        const useOptionA = variant === "unificar-solo-activo" || variant === "unificar-opcion-a-horiz";
        const useHorizontalRecovery = variant === "unificar-opcion-a-horiz";
        return (
            <div key={`r-${variant}`} className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1f 0%, hsl(var(--card)) 38%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        {/* GRUPO 1 · FOCO PRINCIPAL: El mensaje personal (sin barras arriba) */}
                        <div>
                            <span aria-hidden="true" className="inline-block">
                                <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-10 [@media(min-height:800px)]:h-13 w-auto" />
                            </span>
                            <h1 className="mt-2.5 [@media(min-height:800px)]:mt-4">
                                <span className="text-[14.5px] block font-medium text-muted-foreground">Estás en estado</span>
                                <span
                                    className="text-[2rem] [@media(min-height:800px)]:text-[2.4rem] block font-[Outfit] font-bold leading-[1.03] tracking-[-0.025em] [text-wrap:balance]"
                                    style={{ color: m.zoneInk }}
                                >
                                    {m.zoneTitle}
                                </span>
                            </h1>

                            <p className="mt-3.5 [@media(min-height:800px)]:mt-5 text-[17px] min-[390px]:text-[18px] [@media(min-height:800px)]:text-[19.5px] leading-[1.56] text-foreground [text-wrap:pretty]">
                                {m.firstName ? (
                                    <>
                                        <span className="font-bold">{m.firstName},</span> {m.validation.charAt(0).toLowerCase()}
                                        {m.validation.slice(1)}
                                    </>
                                ) : (
                                    m.validation
                                )}
                            </p>
                        </div>

                        {/* GRUPO 2 · EVIDENCIA SECUNDARIA: Tamaño y números de Copia 3 + Opción A / ejes */}
                        <div className="relative mt-6 [@media(min-height:800px)]:mt-9" data-no-tap>
                            <div className="flex items-center justify-between">
                                <p className={levelLabel}>Tu estado según tus 2 ejes</p>
                                {infoButton}
                            </div>

                            {/* Contenedor con más aire a la izquierda para que el título/etiqueta de recuperación quede bien separado */}
                            <div className={`relative mt-2 ${useHorizontalRecovery ? "pl-4 pb-6" : useOptionA ? "pl-9 pb-6" : "pl-14"}`}>
                                {/* Cuadrícula exacta al tamaño de Copia 3 */}
                                <div className="relative rounded-2xl border border-foreground/10 bg-card/85 p-1.5 shadow-sm">
                                    {!useOptionA && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -left-12 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[10.5px] font-semibold tracking-[-0.01em] text-muted-foreground"
                                        >
                                            Energía que recuperás
                                        </span>
                                    )}

                                    <div className="relative grid grid-cols-2 gap-1.5" role="group" aria-label="Cuadrícula de estados">
                                        {QUAD_CELLS.map((cell) => {
                                            const active = cell.key === m.zoneKey;
                                            return (
                                                <div
                                                    key={cell.key}
                                                    aria-current={active ? "true" : undefined}
                                                    className={`relative flex min-h-[48px] [@media(min-height:800px)]:min-h-[56px] justify-center rounded-xl border px-2 text-center transition-all ${
                                                        cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                    } ${
                                                        active
                                                            ? "ring-2 shadow-sm"
                                                            : inactiveHasBg
                                                              ? "opacity-85"
                                                              : inactiveHasColoredText || hasCurvedUnderline
                                                                ? "bg-foreground/[0.025]"
                                                                : "bg-foreground/[0.025] opacity-65"
                                                    }`}
                                                    style={{
                                                        backgroundColor: active ? `${cell.hex}20` : inactiveHasBg ? `${cell.hex}0c` : undefined,
                                                        borderColor: active ? cell.hex : inactiveHasBg ? `${cell.hex}28` : "transparent",
                                                        boxShadow: active ? `0 0 0 1.5px ${cell.hex}` : undefined,
                                                    }}
                                                >
                                                    <span
                                                        className={`relative z-10 inline-flex flex-col items-center rounded px-1 font-[Outfit] text-[12.5px] font-bold leading-tight ${
                                                            active ? "" : inactiveHasColoredText ? "opacity-85" : "text-foreground/80"
                                                        }`}
                                                        style={{ color: active || inactiveHasColoredText ? cell.ink : undefined }}
                                                    >
                                                        <span>{cell.title}</span>
                                                        {hasCurvedUnderline && (
                                                            <svg
                                                                viewBox="0 0 100 8"
                                                                fill="none"
                                                                aria-hidden="true"
                                                                className="mt-0.5 h-[5px] w-full overflow-visible"
                                                            >
                                                                <path
                                                                    d="M 4 6 Q 50 1.2 96 6"
                                                                    stroke={cell.hex}
                                                                    strokeWidth={active ? "2.6" : "2.2"}
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-foreground/15" />
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-foreground/15" />

                                        {/* Área segura central (top-6 bottom-6 deja libres los nombres y sus subrayados curvos, mientras las líneas llegan al eje) */}
                                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 bottom-6 z-[5]">
                                            {/* Línea punteada horizontal de Recuperación hasta el borde izquierdo del gráfico */}
                                            <span
                                                className="absolute -left-[6px] -translate-y-1/2 border-t-[1.5px] border-dashed border-[#059669]/85"
                                                style={{ top: `${quadY}%`, width: `calc(${quadX}% + 6px)` }}
                                            />
                                            {/* Pequeña línea (tick) en el eje izquierdo indicando de dónde sale el valor */}
                                            <span
                                                className="absolute -left-[11px] h-[2px] w-[6px] -translate-y-1/2 rounded-full bg-[#059669]"
                                                style={{ top: `${quadY}%` }}
                                            />
                                            {/* Línea punteada vertical de Carga que llega hasta el borde inferior del gráfico */}
                                            <span
                                                className="absolute -bottom-[30px] -translate-x-1/2 border-l-[1.5px] border-dashed border-[#e11d48]/85"
                                                style={{ left: `${quadX}%`, top: `${quadY}%` }}
                                            />
                                            {/* Pequeña línea (tick) en el eje inferior indicando de dónde sale el valor */}
                                            <span
                                                className="absolute -bottom-[35px] h-[6px] w-[2px] -translate-x-1/2 rounded-full bg-[#e11d48]"
                                                style={{ left: `${quadX}%` }}
                                            />

                                            {/* Etiqueta de Recuperación:
                                                - Opción A Horizontal: pastilla horizontal anclada en la franja central libre de texto (no corre el gráfico ni pisa textos).
                                                - Opción A Vertical: "Recuperación 20%" en vertical junto al tick del eje izquierdo.
                                                - Clásico: "20%" horizontal afuera. */}
                                            {useHorizontalRecovery ? (
                                                <span
                                                    className="absolute -left-4 z-20 -translate-y-1/2 whitespace-nowrap rounded-md border border-[#059669]/30 bg-card/95 px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#047857] shadow-sm"
                                                    style={{ top: `${quadY}%` }}
                                                >
                                                    Recuperación {m.recovery}%
                                                </span>
                                            ) : useOptionA ? (
                                                <span
                                                    className="absolute -left-6 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap rounded bg-[#059669]/12 px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#047857]"
                                                    style={{ top: `${quadY}%` }}
                                                >
                                                    Recuperación {m.recovery}%
                                                </span>
                                            ) : (
                                                <span
                                                    className="absolute -left-3.5 -translate-x-full -translate-y-1/2 rounded bg-[#059669]/12 px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums leading-none text-[#047857]"
                                                    style={{ top: `${quadY}%` }}
                                                >
                                                    {m.recovery}%
                                                </span>
                                            )}

                                            {/* Punto de coordenada estático (sin brillo/animación) */}
                                            <span
                                                className="absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.35)]"
                                                style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneHex }}
                                            />
                                        </div>

                                        {/* Etiqueta de Carga afuera abajo: en Opción A dice "Carga 80%" directo en la etiqueta */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -bottom-3 -translate-x-1/2 translate-y-full whitespace-nowrap rounded bg-[#e11d48]/12 px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums leading-none text-[#be123c]"
                                            style={{ left: `${quadX}%` }}
                                        >
                                            {useOptionA ? `Carga ${m.load}%` : `${m.load}%`}
                                        </span>
                                    </div>
                                </div>

                                {!useOptionA && (
                                    <p aria-hidden="true" className="mt-8 text-center text-[10.5px] font-semibold tracking-[-0.01em] text-muted-foreground">
                                        Energía que gastás
                                    </p>
                                )}
                            </div>
                            {infoPopover}
                        </div>
                    </div>
                </div>
                <p className="mt-3 [@media(min-height:800px)]:mt-4 text-center text-[13.5px] leading-snug text-foreground/85 [text-wrap:balance]">
                    <Lightbulb className="mr-1 inline-block h-3.5 w-3.5 -translate-y-px align-middle" style={{ color: m.zoneInk }} aria-hidden="true" />
                    {m.action}
                </p>
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 3 · DARLE AIRE ("C3 · Aire")
       Cambios pedidos:
       - El énfasis del aire es el texto ("Ana, llevás...") para que se vea primero,
         y el gráfico queda en segundo lugar, más sereno y compacto.
       ═══════════════════════════════════════════════════════════════════════════ */
    if (variant === "aire") {
        return (
            <div key="r-aire" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1c 0%, hsl(var(--card)) 42%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        {/* 1. PROTAGONISTA ABSOLUTO: el mensaje humano con máximo aire */}
                        <div className="py-2 [@media(min-height:800px)]:py-4">
                            <span aria-hidden="true" className="inline-block">
                                <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-11 [@media(min-height:800px)]:h-14 w-auto" />
                            </span>
                            <h1 className="mt-3 [@media(min-height:800px)]:mt-4">
                                <span className="text-[14px] block font-medium text-muted-foreground">Estás en estado</span>
                                <span
                                    className="text-[2.1rem] [@media(min-height:800px)]:text-[2.45rem] block font-[Outfit] font-bold leading-[1.03] tracking-[-0.025em] [text-wrap:balance]"
                                    style={{ color: m.zoneInk }}
                                >
                                    {m.zoneTitle}
                                </span>
                            </h1>

                            <p className="mt-3.5 [@media(min-height:800px)]:mt-5 text-[17.5px] min-[390px]:text-[18.5px] [@media(min-height:800px)]:text-[20px] leading-[1.58] text-foreground [text-wrap:pretty]">
                                {m.firstName ? (
                                    <>
                                        <span className="font-bold">{m.firstName},</span> {m.validation.charAt(0).toLowerCase()}
                                        {m.validation.slice(1)}
                                    </>
                                ) : (
                                    m.validation
                                )}
                            </p>
                        </div>

                        {/* 2. GRÁFICO EN SEGUNDO PLANO: compacto, ligero y sin pisar palabras */}
                        <div className="relative mt-5 [@media(min-height:800px)]:mt-8" data-no-tap>
                            <div className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-1.5">
                                <span className="-rotate-90 whitespace-nowrap text-[10px] font-medium text-muted-foreground" aria-hidden="true">
                                    Recuperación
                                </span>

                                <div className="relative grid grid-cols-2 gap-1.5" role="group" aria-label="Cuadrícula de estados">
                                    {QUAD_CELLS.map((cell) => {
                                        const active = cell.key === m.zoneKey;
                                        return (
                                            <div
                                                key={cell.key}
                                                aria-current={active ? "true" : undefined}
                                                className={`relative flex min-h-[44px] [@media(min-height:800px)]:min-h-[52px] justify-center rounded-xl px-2.5 text-center transition-all ${
                                                    cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                }`}
                                                style={{
                                                    backgroundColor: active ? `${cell.hex}18` : "hsl(var(--foreground) / 0.025)",
                                                    boxShadow: active ? `inset 0 0 0 1.5px ${cell.hex}` : undefined,
                                                }}
                                            >
                                                <span
                                                    className={`block font-[Outfit] text-[12px] leading-tight ${active ? "font-bold" : "font-medium text-muted-foreground/70"}`}
                                                    style={{ color: active ? cell.ink : undefined }}
                                                >
                                                    {cell.title}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {/* Corredor seguro central (top-5 a bottom-5) */}
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-5 bottom-5">
                                        <span
                                            className="absolute left-0 -translate-y-1/2 border-t-[1.5px] border-dashed border-[#059669]/75"
                                            style={{ top: `${quadY}%`, width: `${quadX}%` }}
                                        />
                                        <span
                                            className="absolute bottom-0 -translate-x-1/2 border-l-[1.5px] border-dashed border-[#e11d48]/75"
                                            style={{ left: `${quadX}%`, height: `${100 - quadY}%` }}
                                        />
                                        <span
                                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-card/95 px-1 text-[9.5px] font-bold tabular-nums text-[#047857]"
                                            style={{ left: `${Math.max(12, quadX / 2)}%`, top: `${quadY}%` }}
                                        >
                                            {m.recovery}%
                                        </span>
                                        <span
                                            className="absolute z-10 -translate-x-1/2 translate-y-1/2 rounded bg-card/95 px-1 text-[9.5px] font-bold tabular-nums text-[#be123c]"
                                            style={{ left: `${quadX}%`, bottom: `${Math.max(10, (100 - quadY) / 2)}%` }}
                                        >
                                            {m.load}%
                                        </span>
                                        <span
                                            className="absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-white shadow-sm"
                                            style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneHex }}
                                        />
                                    </div>
                                </div>

                                <div className="self-start">{infoButton}</div>

                                <span aria-hidden="true" />
                                <div className="mt-1 text-center" aria-hidden="true">
                                    <span className="text-[10px] font-medium text-muted-foreground">Energía que gastás</span>
                                </div>
                                <span aria-hidden="true" />
                            </div>
                            {infoPopover}
                        </div>
                    </div>
                </div>
                {footerBlock}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 4 · IMPECCABLE LAYOUT ("C3 · Impeccable")
       Cambios pedidos:
       - Aplica Impeccable Layout (squint test, agrupación por significado, ritmo espacial):
         1. Grupo Primario: el texto "Ana, llevás..." lidera con jerarquía clara y aire generoso.
         2. Grupo Secundario: gráfico 2×2 subordinado, limpio, con títulos en los ejes y % en línea.
       ═══════════════════════════════════════════════════════════════════════════ */
    if (variant === "impeccable") {
        return (
            <div key="r-impeccable" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1a 0%, hsl(var(--card)) 38%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        {/* GRUPO 1 (Primario): Identidad del estado + Mensaje empático protagonista */}
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <span className="text-[13.5px] block font-medium text-muted-foreground">Estás en estado</span>
                                    <h1
                                        className="mt-0.5 text-[2rem] [@media(min-height:800px)]:text-[2.35rem] font-[Outfit] font-bold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]"
                                        style={{ color: m.zoneInk }}
                                    >
                                        {m.zoneTitle}
                                    </h1>
                                </div>
                                <span aria-hidden="true" className="shrink-0">
                                    <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-10 [@media(min-height:800px)]:h-12 w-auto" />
                                </span>
                            </div>

                            {heroValidation}
                        </div>

                        {/* Intervalo espacial deliberado (Impeccable Layout: separa lectura empática de evidencia) */}
                        <div className="relative mt-6 [@media(min-height:800px)]:mt-9 pt-4 border-t border-foreground/10" data-no-tap>
                            <div className="grid grid-cols-[1.4rem_1fr] items-center gap-x-1.5">
                                <span className="-rotate-90 whitespace-nowrap text-[10px] font-semibold tracking-tight text-foreground/65" aria-hidden="true">
                                    Energía que recuperás
                                </span>

                                <div className="relative">
                                    <div className="absolute -right-1 -top-7 z-20">{infoButton}</div>
                                    <div className="relative grid grid-cols-2 gap-1.5 rounded-2xl border border-foreground/12 bg-card p-1.5 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.16)]" role="group" aria-label="Cuadrícula de estados">
                                        {QUAD_CELLS.map((cell) => {
                                            const active = cell.key === m.zoneKey;
                                            return (
                                                <div
                                                    key={cell.key}
                                                    aria-current={active ? "true" : undefined}
                                                    className={`relative flex min-h-[48px] [@media(min-height:800px)]:min-h-[56px] justify-center rounded-xl px-2.5 text-center transition-all ${
                                                        cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                    }`}
                                                    style={{
                                                        backgroundColor: active ? `${cell.hex}16` : "hsl(var(--foreground) / 0.02)",
                                                        boxShadow: active ? `inset 0 0 0 1.5px ${cell.hex}` : undefined,
                                                    }}
                                                >
                                                    <span
                                                        className={`block font-[Outfit] text-[12.5px] leading-tight ${active ? "font-bold" : "font-medium opacity-55"}`}
                                                        style={{ color: active ? cell.ink : undefined }}
                                                    >
                                                        {cell.title}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-foreground/12" />
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-foreground/12" />

                                        {/* Corredor seguro central */}
                                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-1.5 top-5 bottom-5">
                                            <span
                                                className="absolute left-0 -translate-y-1/2 border-t-[1.5px] border-dashed border-[#059669]"
                                                style={{ top: `${quadY}%`, width: `${quadX}%` }}
                                            />
                                            <span
                                                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-card px-1 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#047857] shadow-sm"
                                                style={{ left: `${Math.max(12, quadX / 2)}%`, top: `${quadY}%` }}
                                            />
                                            <span
                                                className="absolute bottom-0 -translate-x-1/2 border-l-[1.5px] border-dashed border-[#e11d48]"
                                                style={{ left: `${quadX}%`, height: `${100 - quadY}%` }}
                                            />
                                            <span
                                                className="absolute z-10 -translate-x-1/2 translate-y-1/2 rounded bg-card px-1 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#be123c] shadow-sm"
                                                style={{ left: `${quadX}%`, bottom: `${Math.max(10, (100 - quadY) / 2)}%` }}
                                            />
                                            <span
                                                className="absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.35)]"
                                                style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneInk }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <span aria-hidden="true" />
                                <div className="mt-1.5 text-center" aria-hidden="true">
                                    <span className="text-[10.5px] font-semibold tracking-tight text-foreground/65">Energía que gastás</span>
                                </div>
                            </div>
                            {infoPopover}
                        </div>
                    </div>
                </div>
                {footerBlock}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 5 · IMPECCABLE BOLDER ("C3 · Bolder")
       Cambios pedidos:
       - Quitar la caja gris de arriba ("Gastás / Recuperás").
       - Usar Layout para darle más aire al texto ("Ana, llevás...") como primer foco.
       - Usar Bolder en la gráfica y que se note que es una gráfica (ejes en L con marcas,
         cuadrante activo sólido y proyecciones nítidas sin pisar palabras).
       ═══════════════════════════════════════════════════════════════════════════ */
    if (variant === "bolder") {
        return (
            <div key="r-bolder" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}26 0%, hsl(var(--card)) 42%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        {/* 1. FOCO PRIMARIO CON AIRE: Estado y texto personal */}
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <span className="text-[13.5px] block font-medium text-muted-foreground">Estás en estado</span>
                                <h1
                                    className="mt-0.5 text-[2.1rem] [@media(min-height:800px)]:text-[2.45rem] font-[Outfit] font-extrabold leading-[0.98] tracking-[-0.03em] [text-wrap:balance]"
                                    style={{ color: m.zoneInk }}
                                >
                                    {m.zoneTitle}
                                </h1>
                            </div>
                            <span aria-hidden="true" className="shrink-0">
                                <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-10 [@media(min-height:800px)]:h-12 w-auto" />
                            </span>
                        </div>

                        {heroValidation}

                        {/* 2. GRÁFICA BOLDER CON EJES EN "L" VISIBLES */}
                        <div className="relative mt-6 [@media(min-height:800px)]:mt-8" data-no-tap>
                            <div className="grid grid-cols-[1.5rem_1fr] items-center gap-x-1.5">
                                {/* Eje Y con flecha de gráfica */}
                                <div className="flex items-center justify-center" aria-hidden="true">
                                    <span className="-rotate-90 whitespace-nowrap text-[10.5px] font-bold tracking-tight text-[#047857]">
                                        ↑ Energía que recuperás
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="absolute -right-1 -top-7 z-20">{infoButton}</div>
                                    {/* Marco de ejes cartesianos en L (borde izquierdo y borde inferior marcados como gráfica) */}
                                    <div
                                        className="relative grid grid-cols-2 gap-1.5 border-b-2 border-l-2 border-foreground/35 pb-2 pl-2 pt-1 pr-1"
                                        role="group"
                                        aria-label="Gráfica de cuadrantes"
                                    >
                                        {QUAD_CELLS.map((cell) => {
                                            const active = cell.key === m.zoneKey;
                                            return (
                                                <div
                                                    key={cell.key}
                                                    aria-current={active ? "true" : undefined}
                                                    className={`relative flex min-h-[50px] [@media(min-height:800px)]:min-h-[60px] justify-center rounded-xl px-2 text-center transition-all ${
                                                        cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                    } ${active ? "shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)]" : "border border-foreground/10 bg-card/70 opacity-55"}`}
                                                    style={{
                                                        backgroundColor: active ? cell.ink : undefined,
                                                    }}
                                                >
                                                    <span
                                                        className={`block font-[Outfit] text-[12.5px] leading-tight ${
                                                            active ? "font-extrabold text-white" : "font-semibold text-foreground/75"
                                                        }`}
                                                    >
                                                        {cell.title}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Corredor seguro central: proyecciones de gráfica y valores en línea */}
                                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-5 bottom-6">
                                            <span
                                                className="absolute left-0 z-10 -translate-y-1/2 border-t-2 border-dashed border-[#059669]"
                                                style={{ top: `${quadY}%`, width: `${quadX}%` }}
                                            />
                                            <span
                                                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded bg-[#047857] px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-white shadow-sm"
                                                style={{ left: `${Math.max(12, quadX / 2)}%`, top: `${quadY}%` }}
                                            >
                                                {m.recovery}%
                                            </span>

                                            <span
                                                className="absolute bottom-0 z-10 -translate-x-1/2 border-l-2 border-dashed border-[#e11d48]"
                                                style={{ left: `${quadX}%`, height: `${100 - quadY}%` }}
                                            />
                                            <span
                                                className="absolute z-20 -translate-x-1/2 translate-y-1/2 rounded bg-[#be123c] px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-white shadow-sm"
                                                style={{ left: `${quadX}%`, bottom: `${Math.max(10, (100 - quadY) / 2)}%` }}
                                            >
                                                {m.load}%
                                            </span>

                                            <span
                                                className="absolute z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-foreground shadow-[0_0_0_3px_rgba(255,255,255,0.35)]"
                                                style={{ left: `${quadX}%`, top: `${quadY}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <span aria-hidden="true" />
                                <div className="mt-1.5 flex items-center justify-center" aria-hidden="true">
                                    <span className="text-[10.5px] font-bold tracking-tight text-[#be123c]">
                                        Energía que gastás →
                                    </span>
                                </div>
                            </div>
                            {infoPopover}
                        </div>
                    </div>
                </div>
                {footerBlock}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 6 · UI/UX PRO MAX GRÁFICOS ("C3 · UI/UX Gráficos")
       Cambios pedidos:
       - Quitar la caja/línea externa y la cabecera que decía "Eje X · Gastás".
       - Dejar solo la línea interna, con la cruz del centro más pequeña/fina.
       - Poner los títulos de los ejes sin decir "Eje X" / "Eje Y".
       - Que las líneas no pasen encima de las palabras y quitar el chip "HOY".
       ═══════════════════════════════════════════════════════════════════════════ */
    if (variant === "uiux") {
        return (
            <div key="r-uiux" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1f 0%, hsl(var(--card)) 36%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        {/* 1. ÉNFASIS EN EL TEXTO */}
                        <div className="flex items-center justify-between">
                            <span aria-hidden="true" className="shrink-0">
                                <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-10 [@media(min-height:800px)]:h-12 w-auto" />
                            </span>
                            {infoButton}
                        </div>
                        <h1 className="mt-2.5 [@media(min-height:800px)]:mt-4">
                            <span className="text-[14px] block font-medium text-muted-foreground">Estás en estado</span>
                            <span
                                className="text-[1.9rem] [@media(min-height:800px)]:text-[2.25rem] block font-[Outfit] font-bold leading-[1.03] tracking-[-0.02em]"
                                style={{ color: m.zoneInk }}
                            >
                                {m.zoneTitle}
                            </span>
                        </h1>

                        {heroValidation}

                        {/* 2. GRÁFICO INTERNO LIMPIO (sin tarjeta exterior, sin "Eje X", sin "HOY") */}
                        <div className="relative mt-6 [@media(min-height:800px)]:mt-8" data-no-tap>
                            <div className="grid grid-cols-[1.4rem_1fr] items-center gap-x-1.5">
                                <span className="-rotate-90 whitespace-nowrap text-[10.5px] font-semibold text-[#047857]" aria-hidden="true">
                                    Energía que recuperás
                                </span>

                                <div className="relative grid grid-cols-2 overflow-hidden rounded-2xl border border-foreground/15 bg-card" role="group" aria-label="Cuadrícula de estados">
                                    {QUAD_CELLS.map((cell) => {
                                        const active = cell.key === m.zoneKey;
                                        return (
                                            <div
                                                key={cell.key}
                                                aria-current={active ? "true" : undefined}
                                                className={`relative flex min-h-[52px] [@media(min-height:800px)]:min-h-[60px] justify-center px-2.5 text-center transition-all ${
                                                    cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                }`}
                                                style={{
                                                    backgroundColor: active ? `${cell.hex}1c` : undefined,
                                                }}
                                            >
                                                <span
                                                    className={`font-[Outfit] text-[12.5px] leading-tight ${active ? "font-bold" : "font-medium text-muted-foreground/75"}`}
                                                    style={{ color: active ? cell.ink : undefined }}
                                                >
                                                    {cell.title}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {/* Cruz central más pequeña y sutil */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 border-l border-foreground/10"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-foreground/10"
                                    />

                                    {/* Corredor seguro central (top-6 bottom-6) para que ninguna línea toque las palabras */}
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 bottom-6">
                                        <svg
                                            viewBox="0 0 100 100"
                                            preserveAspectRatio="none"
                                            className="absolute inset-0 h-full w-full"
                                        >
                                            <line
                                                x1="0"
                                                y1={quadY}
                                                x2={quadX}
                                                y2={quadY}
                                                stroke="#059669"
                                                strokeWidth="1.2"
                                                strokeDasharray="2.5 2"
                                            />
                                            <line
                                                x1={quadX}
                                                y1={quadY}
                                                x2={quadX}
                                                y2="100"
                                                stroke="#e11d48"
                                                strokeWidth="1.2"
                                                strokeDasharray="2.5 2"
                                            />
                                        </svg>

                                        {/* Valores sobre cada línea */}
                                        <span
                                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-card/95 px-1 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#047857] shadow-sm"
                                            style={{ left: `${Math.max(12, quadX / 2)}%`, top: `${quadY}%` }}
                                        >
                                            {m.recovery}%
                                        </span>
                                        <span
                                            className="absolute z-10 -translate-x-1/2 translate-y-1/2 rounded bg-card/95 px-1 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#be123c] shadow-sm"
                                            style={{ left: `${quadX}%`, bottom: `${Math.max(10, (100 - quadY) / 2)}%` }}
                                        >
                                            {m.load}%
                                        </span>

                                        {/* Punto radar */}
                                        <span
                                            className="absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
                                            style={{ left: `${quadX}%`, top: `${quadY}%`, backgroundColor: m.zoneHex }}
                                        />
                                        <span
                                            className="absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-white shadow-sm"
                                            style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneInk }}
                                        />
                                    </div>
                                </div>

                                <span aria-hidden="true" />
                                <div className="mt-1.5 text-center" aria-hidden="true">
                                    <span className="text-[10.5px] font-semibold text-[#be123c]">Energía que gastás</span>
                                </div>
                            </div>
                            {infoPopover}
                        </div>
                    </div>
                </div>
                {footerBlock}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 7 · TASTE SKILL LIMPIO ("C3 · Taste")
       Cambios pedidos:
       - Limpiado igual que UI/UX: sin caja externa ni barras superiores, mucho aire
         al texto principal ("Ana, ..."), cruz interna sutil y líneas que nunca pisan texto.
       ═══════════════════════════════════════════════════════════════════════════ */
    if (variant === "taste") {
        return (
            <div key="r-taste" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}18 0%, hsl(var(--card)) 36%)` }}>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[14px] block font-medium text-muted-foreground">Estás en estado</span>
                                <h1
                                    className="text-[1.95rem] [@media(min-height:800px)]:text-[2.3rem] font-[Outfit] font-bold leading-[1.03] tracking-[-0.025em]"
                                    style={{ color: m.zoneInk }}
                                >
                                    {m.zoneTitle}
                                </h1>
                            </div>
                            <span aria-hidden="true">
                                <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-10 [@media(min-height:800px)]:h-12 w-auto" />
                            </span>
                        </div>

                        {heroValidation}

                        {/* Cuadrícula editorial de bordes iguales, limpia sin marco exterior */}
                        <div className="relative mt-6 [@media(min-height:800px)]:mt-8" data-no-tap>
                            <div className="grid grid-cols-[1.4rem_1fr] items-center gap-x-1.5">
                                <span className="-rotate-90 whitespace-nowrap text-[10.5px] font-medium text-muted-foreground" aria-hidden="true">
                                    Energía que recuperás
                                </span>

                                <div className="relative">
                                    <div className="absolute -right-1 -top-7 z-20">{infoButton}</div>
                                    <div className="relative grid grid-cols-2 overflow-hidden rounded-xl border border-foreground/15 bg-card">
                                        {QUAD_CELLS.map((cell) => {
                                            const active = cell.key === m.zoneKey;
                                            return (
                                                <div
                                                    key={cell.key}
                                                    aria-current={active ? "true" : undefined}
                                                    className={`flex min-h-[50px] [@media(min-height:800px)]:min-h-[58px] px-3 ${
                                                        cell.row === "top" ? "items-start pt-1.5" : "items-end pb-1.5"
                                                    } ${cell.col === "right" ? "justify-end text-right" : "justify-start text-left"}`}
                                                    style={{ backgroundColor: active ? `${cell.hex}16` : undefined }}
                                                >
                                                    <span
                                                        className={`font-[Outfit] text-[12.5px] leading-tight ${active ? "font-bold" : "font-medium text-muted-foreground/75"}`}
                                                        style={{ color: active ? cell.ink : undefined }}
                                                    >
                                                        {cell.title}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Cruz interna corta y fina */}
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 border-l border-foreground/12" />
                                        <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-foreground/12" />

                                        {/* Corredor seguro central */}
                                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 bottom-6">
                                            <span
                                                className="absolute left-0 -translate-y-1/2 border-t-[1.5px] border-dashed border-[#059669]/80"
                                                style={{ top: `${quadY}%`, width: `${quadX}%` }}
                                            />
                                            <span
                                                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-card px-1 text-[10px] font-bold tabular-nums text-[#047857]"
                                                style={{ left: `${Math.max(12, quadX / 2)}%`, top: `${quadY}%` }}
                                            />
                                            <span
                                                className="absolute bottom-0 -translate-x-1/2 border-l-[1.5px] border-dashed border-[#e11d48]/80"
                                                style={{ left: `${quadX}%`, height: `${100 - quadY}%` }}
                                            />
                                            <span
                                                className="absolute z-10 -translate-x-1/2 translate-y-1/2 rounded bg-card px-1 text-[10px] font-bold tabular-nums text-[#be123c]"
                                                style={{ left: `${quadX}%`, bottom: `${Math.max(10, (100 - quadY) / 2)}%` }}
                                            />
                                            <span
                                                className="absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-white shadow-sm"
                                                style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneInk }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <span aria-hidden="true" />
                                <div className="mt-1.5 text-center" aria-hidden="true">
                                    <span className="text-[10.5px] font-medium text-muted-foreground">Energía que gastás</span>
                                </div>
                            </div>
                            {infoPopover}
                        </div>
                    </div>
                </div>
                {footerBlock}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       VARIANTE 8 · TASTE + IMPECCABLE BRIEF ("C3 · Taste + Impeccable")
       Fusión de Taste (bordes iguales, sobriedad editorial) con Impeccable Brief
       (craft-floor.md + layout.md: sin eyebrow encima del h1, jerarquía de lectura donde
       el mensaje personal domina y el mapa 2×2 actúa como evidencia de precisión).
       ═══════════════════════════════════════════════════════════════════════════ */
    return (
        <div key="r-taste-imp" className={slideClass} style={{ background: `linear-gradient(170deg, ${m.zoneHex}1a 0%, hsl(var(--card)) 38%)` }}>
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex flex-col">
                    {/* 1. CABECERA SIN EYEBROW (craft-floor.md) + TEXTO PROTAGONISTA */}
                    <div className="flex items-center justify-between gap-3">
                        <h1
                            className="text-[2.15rem] [@media(min-height:800px)]:text-[2.5rem] font-[Outfit] font-bold leading-[1.0] tracking-[-0.03em] [text-wrap:balance]"
                            style={{ color: m.zoneInk }}
                        >
                            {m.zoneTitle}
                        </h1>
                        <span aria-hidden="true" className="shrink-0">
                            <TiltBalanceSolid load={m.load} recovery={m.recovery} className="h-10 [@media(min-height:800px)]:h-12 w-auto" />
                        </span>
                    </div>

                    <p className="mt-3.5 [@media(min-height:800px)]:mt-5 text-[17px] min-[390px]:text-[18px] [@media(min-height:800px)]:text-[19.5px] leading-[1.56] text-foreground [text-wrap:pretty]">
                        {m.firstName ? (
                            <>
                                <span className="font-bold">{m.firstName},</span> {m.validation.charAt(0).toLowerCase()}
                                {m.validation.slice(1)}
                            </>
                        ) : (
                            m.validation
                        )}
                    </p>

                    {/* 2. MAPA EDITORIAL DE PRECISIÓN (Taste equal-edges + Impeccable craft) */}
                    <div className="relative mt-6 [@media(min-height:800px)]:mt-9" data-no-tap>
                        <div className="grid grid-cols-[1.4rem_1fr] items-center gap-x-1.5">
                            <span className="-rotate-90 whitespace-nowrap text-[10.5px] font-semibold tracking-[-0.01em] text-[#047857]" aria-hidden="true">
                                Energía que recuperás
                            </span>

                            <div className="relative">
                                <div className="absolute -right-1 -top-7 z-20">{infoButton}</div>
                                <div
                                    className="relative grid grid-cols-2 overflow-hidden rounded-2xl border border-foreground/14 bg-card shadow-[0_6px_20px_-12px_rgba(15,23,42,0.18)]"
                                    role="group"
                                    aria-label="Cuadrícula de estados"
                                >
                                    {QUAD_CELLS.map((cell) => {
                                        const active = cell.key === m.zoneKey;
                                        return (
                                            <div
                                                key={cell.key}
                                                aria-current={active ? "true" : undefined}
                                                className={`flex min-h-[52px] [@media(min-height:800px)]:min-h-[60px] px-3 transition-colors ${
                                                    cell.row === "top" ? "items-start pt-2" : "items-end pb-2"
                                                } ${cell.col === "right" ? "justify-end text-right" : "justify-start text-left"}`}
                                                style={{
                                                    backgroundColor: active ? `${cell.hex}18` : undefined,
                                                    boxShadow: active ? `inset 0 0 0 1.5px ${cell.hex}` : undefined,
                                                }}
                                            >
                                                <span
                                                    className={`font-[Outfit] text-[12.5px] leading-tight ${active ? "font-bold" : "font-medium opacity-55"}`}
                                                    style={{ color: active ? cell.ink : undefined }}
                                                >
                                                    {cell.title}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {/* Cruz central sutil con respiro en los extremos */}
                                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-3.5 left-1/2 -translate-x-1/2 border-l border-foreground/12" />
                                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-3.5 top-1/2 -translate-y-1/2 border-t border-foreground/12" />

                                    {/* Corredor seguro central: las líneas y sus porcentajes nunca pisan las palabras */}
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 bottom-6">
                                        <span
                                            className="absolute left-0 -translate-y-1/2 border-t-[1.5px] border-dashed border-[#059669]"
                                            style={{ top: `${quadY}%`, width: `${quadX}%` }}
                                        />
                                        <span
                                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#059669]/25 bg-card px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#047857] shadow-sm"
                                            style={{ left: `${Math.max(12, quadX / 2)}%`, top: `${quadY}%` }}
                                        >
                                            {m.recovery}%
                                        </span>

                                        <span
                                            className="absolute bottom-0 -translate-x-1/2 border-l-[1.5px] border-dashed border-[#e11d48]"
                                            style={{ left: `${quadX}%`, height: `${100 - quadY}%` }}
                                        />
                                        <span
                                            className="absolute z-10 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#e11d48]/25 bg-card px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-[#be123c] shadow-sm"
                                            style={{ left: `${quadX}%`, bottom: `${Math.max(10, (100 - quadY) / 2)}%` }}
                                        >
                                            {m.load}%
                                        </span>

                                        <span
                                            className="absolute z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.3)]"
                                            style={{ left: `${quadX}%`, top: `${quadY}%`, borderColor: m.zoneInk }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <span aria-hidden="true" />
                            <div className="mt-1.5 text-center" aria-hidden="true">
                                <span className="text-[10.5px] font-semibold tracking-[-0.01em] text-[#be123c]">
                                    Energía que gastás
                                </span>
                            </div>
                        </div>
                        {infoPopover}
                    </div>
                </div>
            </div>
            {footerBlock}
        </div>
    );
}
