"use client";

import { useState, useEffect, useRef } from "react";
import { getStressProfile } from "./quizData";
import { saveQuizResult } from "@/lib/saveQuizResult";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ⚠️ CAMBIAR: número de WhatsApp en formato internacional, solo dígitos —
   código de país + número, sin "+", espacios ni guiones.
   Ej. México: 5215512345678 · España: 34612345678 */
const WHATSAPP_NUMBER = "50670588196";

/* Glifo de WhatsApp: lucide eliminó los iconos de marca, así que va embebido */
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
);

interface QuizResultProps {
    answers: number[];
    onRetake: () => void;
    userName?: string;
    timeSpentSeconds?: number;
}

/* ── colour config per band ─────────────────────────── */
const BAND_STYLES: Record<string, {
    gradient: string;
    glowColor: string;
    ringStroke: string;
    bgSegments: [string, string, string];
    badgeBg: string;
    badgeText: string;
}> = {
    "con-margen": {
        gradient: "from-emerald-500 to-teal-400",
        glowColor: "rgba(16,185,129,0.25)",
        ringStroke: "#10b981",
        bgSegments: ["#10b981", "#f59e0b", "#f43f5e"],
        badgeBg: "bg-emerald-500/10",
        badgeText: "text-emerald-600",
    },
    "en-tension": {
        gradient: "from-amber-500 to-orange-400",
        glowColor: "rgba(245,158,11,0.25)",
        ringStroke: "#f59e0b",
        bgSegments: ["#10b981", "#f59e0b", "#f43f5e"],
        badgeBg: "bg-amber-500/10",
        badgeText: "text-amber-600",
    },
    "al-limite": {
        gradient: "from-rose-500 to-pink-500",
        glowColor: "rgba(244,63,94,0.25)",
        ringStroke: "#f43f5e",
        bgSegments: ["#10b981", "#f59e0b", "#f43f5e"],
        badgeBg: "bg-rose-500/10",
        badgeText: "text-rose-600",
    },
};

const prefersReduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Punto sobre un semicírculo (u = 0 izquierda, 1 derecha) */
const polar = (cx: number, cy: number, r: number, u: number) => {
    const th = Math.PI * (1 - Math.max(0, Math.min(1, u)));
    return { x: cx + r * Math.cos(th), y: cy - r * Math.sin(th) };
};

const arcPath = (cx: number, cy: number, r: number, u0: number, u1: number) => {
    const a = polar(cx, cy, r, u0);
    const b = polar(cx, cy, r, u1);
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

const QuizResult = ({ answers, onRetake, userName, timeSpentSeconds }: QuizResultProps) => {
    const profile = getStressProfile(answers);
    const { totalScore, band } = profile;
    const style = BAND_STYLES[band.key];

    const [ledeOpen, setLedeOpen] = useState(false);
    const [skillOpen, setSkillOpen] = useState(false);

    /* ── animated counter & gauge needle (estilo "En preparación") ── */
    const [exactScore, setExactScore] = useState(0);
    const [needleAngle, setNeedleAngle] = useState(-180);

    useEffect(() => {
        const targetAngle = -180 + 180 * (totalScore / 40);
        if (prefersReduced()) {
            setExactScore(totalScore);
            setNeedleAngle(targetAngle);
            return;
        }

        setExactScore(0);
        setNeedleAngle(-180);

        let raf = 0;
        const duration = 1200;
        const t = setTimeout(() => {
            setNeedleAngle(targetAngle);
            const start = performance.now();
            const step = (now: number) => {
                const p = Math.min(1, (now - start) / duration);
                const ease = 1 - Math.pow(1 - p, 4);
                setExactScore(ease * totalScore);
                if (p < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        }, 250);

        return () => {
            clearTimeout(t);
            cancelAnimationFrame(raf);
        };
    }, [totalScore]);

    const displayedScore = Math.round(exactScore);

    /* ── guardar la respuesta en Supabase ───────────────
       El ref evita insertar dos veces: en desarrollo, reactStrictMode
       ejecuta los efectos por duplicado. */
    const hasSaved = useRef(false);

    useEffect(() => {
        if (hasSaved.current) return;
        hasSaved.current = true;

        // No se hace await: si Supabase tarda o falla, la pantalla de
        // resultados se muestra igual. saveQuizResult nunca lanza.
        saveQuizResult({
            userName,
            answers,
            totalScore,
            bandKey: band.key,
            bandName: band.name,
            timeSpentSeconds,
        });
    }, [answers, totalScore, band.key, band.name, userName, timeSpentSeconds]);

    /* ── Gauge semicircle maths (0 – 40) ───────────────── */
    const CX = 150, CY = 150, R = 110, S = 26, DIV = 26;
    const u = exactScore / 40;
    const ink = "hsl(var(--foreground))";
    const len = R - S / 2 - 10;

    const SEGMENTS = [
        { key: "con-margen", start: 0, end: 13, color: "#10b981", label: "Estrés bajo", range: "0 – 13" },
        { key: "en-tension", start: 13, end: 26, color: "#f59e0b", label: "Estrés moderado", range: "14 – 26" },
        { key: "al-limite", start: 26, end: 40, color: "#f43f5e", label: "Estrés alto/severo", range: "27 – 40" },
    ];

    /* WhatsApp deep link — abre la app (o WhatsApp Web) con el mensaje ya escrito */
    const whatsappMessage = userName
        ? `Hola, soy ${userName} y me gustaría más información del taller de control de estrés.`
        : "Hola, me gustaría más información del taller de control de estrés.";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="w-full max-w-3xl mx-auto space-y-14 pb-24 px-4">

            {/* ═══════════════ HERO SCORE CARD ═══════════════ */}
            <div
                className="relative pt-4 pb-8 px-2 sm:px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                <div className="relative z-10 flex flex-col items-center">
                    {/* Greeting label */}
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {userName ? (
                            <>Hola <span className="text-foreground">{userName}</span>, este es tu resultado</>
                        ) : (
                            "Tu resultado"
                        )}
                    </p>

                    {/* Band name */}
                    <h2
                        className={cn(
                            "mt-3 text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r",
                            style.gradient
                        )}
                    >
                        {band.name}
                    </h2>

                    {/* Medidor semicircular ("En preparación") + regla de zonas */}
                    <div className="mt-5 w-full">
                        <div className="relative w-full mx-auto max-w-[236px]">
                            <div
                                className="pointer-events-none absolute -inset-x-16 -top-12 -bottom-8"
                                style={{
                                    background: `radial-gradient(ellipse 50% 55% at 50% 58%, ${style.ringStroke}22 0%, ${style.ringStroke}0d 45%, transparent 100%)`,
                                }}
                                aria-hidden="true"
                            />
                            <svg
                                viewBox="22 20 256 194"
                                className="relative w-full h-auto overflow-visible"
                                role="img"
                                aria-label={`Tu nivel de estrés: ${totalScore} de 40, ${band.name}`}
                            >
                                <path d={arcPath(CX, CY, R, 0, 1)} fill="none" stroke="#efece6" strokeWidth={S} />
                                {u > 0.005 && (
                                    <path d={arcPath(CX, CY, R, 0, u)} fill="none" stroke={style.ringStroke} strokeWidth={S} />
                                )}
                                {[13 / 40, 26 / 40].map((d) => {
                                    const a = polar(CX, CY, R - DIV / 2, d);
                                    const b = polar(CX, CY, R + DIV / 2, d);
                                    return (
                                        <line
                                            key={d}
                                            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                            stroke={ink}
                                            strokeWidth={3.5}
                                            strokeLinecap="round"
                                        />
                                    );
                                })}

                                {/* Aguja afinada con rebote */}
                                <g
                                    style={{
                                        transform: `rotate(${needleAngle}deg)`,
                                        transformOrigin: `${CX}px ${CY}px`,
                                        transition: "transform 1600ms cubic-bezier(0.34, 1.35, 0.64, 1)",
                                    }}
                                >
                                    <path
                                        d={`M ${CX - 9} ${CY - 3.2} L ${CX + len} ${CY - 0.8} L ${CX + len} ${CY + 0.8} L ${CX - 9} ${CY + 3.2} Z`}
                                        fill={style.ringStroke}
                                    />
                                </g>
                                <circle cx={CX} cy={CY} r="11" fill={ink} />
                                <circle cx={CX} cy={CY} r="4" fill={style.ringStroke} />

                                {/* Número y escala debajo del eje */}
                                <text x={CX} y={CY + 58} textAnchor="middle">
                                    <tspan
                                        className="fill-foreground"
                                        style={{ fontFamily: "Outfit, sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}
                                    >
                                        {displayedScore}
                                    </tspan>
                                    <tspan dx="6" className="fill-muted-foreground" style={{ fontSize: 15, fontWeight: 500 }}>
                                        de 40
                                    </tspan>
                                </text>
                            </svg>
                        </div>

                        {/* Regla de las 3 zonas */}
                        <ol className="mx-auto w-full max-w-[320px] pt-2 grid grid-cols-3 gap-2" aria-label="Niveles posibles">
                            {SEGMENTS.map((seg) => {
                                const isActive = seg.key === band.key;
                                return (
                                    <li
                                        key={seg.key}
                                        aria-current={isActive ? "true" : undefined}
                                        className="flex flex-col items-center gap-1.5 text-center"
                                    >
                                        <span className="flex h-2 w-full items-end">
                                            <span
                                                className="w-full rounded-full"
                                                style={{
                                                    height: 4,
                                                    backgroundColor: seg.color,
                                                    opacity: isActive ? 1 : 0.28,
                                                }}
                                            />
                                        </span>
                                        <span className={cn(
                                            "block text-[12px] leading-[1.2] [text-wrap:balance]",
                                            isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                                        )}>
                                            {seg.label}
                                        </span>
                                        <span className="text-[11px] font-medium tabular-nums text-muted-foreground/75">
                                            {seg.range}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    {/* Collapsible lede — tarjeta compacta estilo "cierre de jornada" */}
                    <div className="mt-8 w-full max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 fill-mode-both">
                        <div className="bg-card border rounded-2xl shadow-sm text-left relative overflow-hidden">
                            <div
                                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
                                style={{ background: `radial-gradient(circle, ${style.ringStroke}, transparent 70%)` }}
                            />

                            <button
                                type="button"
                                onClick={() => setLedeOpen((o) => !o)}
                                aria-expanded={ledeOpen}
                                className="relative z-10 w-full flex items-center gap-3 p-5 md:p-6 text-left"
                            >
                                <div className="flex-1">
                                    <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground">
                                        ¿Qué significa tener {band.name.toLowerCase()}?
                                    </h3>
                                </div>

                                <div
                                    className={cn(
                                        "shrink-0 h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105",
                                        ledeOpen ? "bg-primary/10 border-primary/30" : "bg-muted/50"
                                    )}
                                >
                                    <ChevronDown
                                        className={cn("h-4 w-4 transition-transform duration-300", ledeOpen && "rotate-180")}
                                        style={{ color: style.ringStroke }}
                                    />
                                </div>
                            </button>

                            <div
                                className="relative z-10 grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                style={{ gridTemplateRows: ledeOpen ? "1fr" : "0fr" }}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
                                        {band.ledePoints.map((point, i) => (
                                            <div key={i} className="space-y-1">
                                                <p
                                                    className="text-[11px] font-bold uppercase tracking-widest"
                                                    style={{ color: style.ringStroke }}
                                                >
                                                    {point.label}
                                                </p>
                                                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                                                    {point.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Arrow 1: Score → Bridge */}
            <div className="flex flex-col items-center py-2 animate-in fade-in duration-500 delay-300 fill-mode-both">
                <div className="w-[2px] h-10 rounded-full" style={{ background: `linear-gradient(to bottom, transparent, ${style.ringStroke}30)` }} />
                <div className="relative mt-1">
                    <ChevronDown className="h-6 w-6 animate-bounce" strokeWidth={2.5} style={{ color: `${style.ringStroke}50`, animationDuration: '2.5s' }} />
                </div>
            </div>

            {/* ═══════════════ BRIDGE MESSAGE ═════════════════ */}
            <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
                <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    ¿Qué puedes hacer al respecto?
                </h3>
                <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                    Tomar acción ahora que lo notas es lo mejor que puedes hacer. Te dejo una recomendación.
                </p>
            </div>

            {/* Arrow 2: Bridge → Skill */}
            <div className="flex flex-col items-center py-2 animate-in fade-in duration-500 delay-400 fill-mode-both">
                <div className="w-[2px] h-10 rounded-full" style={{ background: `linear-gradient(to bottom, transparent, ${style.ringStroke}30)` }} />
                <div className="relative mt-1">
                    <ChevronDown className="h-6 w-6 animate-bounce" strokeWidth={2.5} style={{ color: `${style.ringStroke}50`, animationDuration: '2.5s', animationDelay: '0.4s' }} />
                </div>
            </div>

            {/* ═══════════════ SKILL CARD (collapsible) ═════ */}
            <div className="bg-card border rounded-[2rem] shadow-md text-left relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-600 delay-300 fill-mode-both">
                {/* Decorative gradient corner */}
                <div
                    className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-[0.06] pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${style.ringStroke}, transparent 70%)` }}
                />

                <button
                    type="button"
                    onClick={() => setSkillOpen((o) => !o)}
                    className="relative z-10 w-full flex items-center gap-4 p-8 md:p-10 text-left"
                >
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                            <BookOpen className="h-4 w-4" />
                            Algo que puedes hacer hoy
                        </div>

                        <h3 className={cn("text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r", style.gradient)}>
                            {band.skill}
                        </h3>
                    </div>

                    <div
                        className={cn(
                            "shrink-0 h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105",
                            skillOpen ? "bg-primary/10 border-primary/30" : "bg-muted/50"
                        )}
                    >
                        <ChevronDown
                            className={cn("h-5 w-5 transition-transform duration-300", skillOpen && "rotate-180")}
                            style={{ color: style.ringStroke }}
                        />
                    </div>
                </button>

                <div
                    className="relative z-10 grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ gridTemplateRows: skillOpen ? "1fr" : "0fr" }}
                >
                    <div className="overflow-hidden">
                        <div className="px-8 md:px-10 pb-8 md:pb-10 space-y-6">
                            <p className="text-lg text-foreground/85 leading-relaxed">
                                {band.how}
                            </p>

                            <div className="bg-muted/40 backdrop-blur-sm p-6 rounded-2xl border">
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    <strong className="text-foreground/80">Por qué funciona:</strong>{" "}
                                    {band.why}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Arrow 3: Skill → CTA */}
            <div className="flex flex-col items-center py-2 animate-in fade-in duration-500 delay-600 fill-mode-both">
                <div className="w-[2px] h-10 rounded-full" style={{ background: `linear-gradient(to bottom, transparent, ${style.ringStroke}30)` }} />
                <div className="relative mt-1">
                    <ChevronDown className="h-6 w-6 animate-bounce" strokeWidth={2.5} style={{ color: `${style.ringStroke}50`, animationDuration: '2.5s', animationDelay: '0.8s' }} />
                </div>
            </div>

            {/* ═══════════════ WHATSAPP CTA ═════════════════
                Sustituye al paso anterior de captura de email, que queda
                preservado al final de este archivo por si queremos volver. */}
            <div className="bg-foreground text-background rounded-[2rem] p-8 md:p-10 shadow-xl text-left relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-600 delay-500 fill-mode-both">
                {/* Decorative glow */}
                <div
                    className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20 pointer-events-none blur-2xl"
                    style={{ background: style.ringStroke }}
                />

                <div className="relative z-10 space-y-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-background/40 mb-3">
                            El siguiente paso
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black leading-tight">
                            ¿Te gustaría sentirte en paz y aprender, de una vez por todas, a controlar el estrés?
                        </h3>
                        <p className="text-background/70 mt-3 text-base md:text-lg">
                            En el taller de control de estrés te enseñamos exactamente cómo lograrlo.
                        </p>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "inline-flex items-center justify-center gap-3 h-14 px-8 text-lg font-bold rounded-xl text-black shadow-lg bg-[#25D366] hover:bg-[#20b858] transition-all hover:scale-[1.02]"
                        )}
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        Información del taller
                    </a>

                    <p className="text-xs text-background/40 font-medium">
                        Te respondemos por WhatsApp. Sin compromiso.
                    </p>
                </div>
            </div>

            {/* ═══════════════ WARNING (al-limite only) ═════ */}
            {band.key === "al-limite" && (
                <div className="border border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 rounded-2xl p-6 text-sm text-rose-800 dark:text-rose-300/90 leading-relaxed animate-in fade-in duration-500 delay-700 fill-mode-both">
                    <strong>Un apunte importante.</strong> Este test no es un diagnóstico.
                    Si el malestar te afecta a diario, si llevas semanas durmiendo mal o si
                    has dejado de disfrutar cosas que antes disfrutabas, hablar con un
                    profesional de salud mental es la mejor decisión que puedes tomar. No es
                    el paso siguiente: es el primero.
                </div>
            )}

            {/* ═══════════════ RETAKE ══════════════════════ */}
            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={onRetake}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a hacer el test
                </Button>
            </div>
        </div>
    );
};

export default QuizResult;

// ═══════════════════════════════════════════════════════════════════════════
// PASO ANTERIOR — CAPTURA DE EMAIL
// Sustituido por el CTA de WhatsApp. Se conserva aquí por si queremos volver.
//
// Va comentado con "//" y no con /* */ a propósito: el bloque contiene
// comentarios JSX {/* ... */} y el primer "*/" cerraría el comentario antes
// de tiempo, rompiendo el archivo.
//
// PARA RESTAURARLO:
//   1. Volver a añadir los imports:
//        import { Input } from "@/components/ui/input";
//        import { Send, CheckCircle2 } from "lucide-react";
//   2. Volver a añadir el estado y el handler dentro del componente (al final).
//   3. Pegar el JSX donde está ahora el CTA de WhatsApp.
//
// ── JSX ────────────────────────────────────────────────────────────────────
// <div className="bg-foreground text-background rounded-[2rem] p-8 md:p-10 shadow-xl text-left relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-600 delay-500 fill-mode-both">
//     {/* Decorative glow */}
//     <div
//         className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20 pointer-events-none blur-2xl"
//         style={{ background: style.ringStroke }}
//     />
//
//     {!isSubmitted ? (
//         <div className="relative z-10 space-y-6">
//             <div>
//                 <p className="text-xs font-bold uppercase tracking-widest text-background/40 mb-3">
//                     Siguiente paso
//                 </p>
//                 <h3 className="text-2xl md:text-3xl font-black leading-tight">
//                     ¿Quieres saber qué hacer esta semana?
//                 </h3>
//                 <p className="text-background/70 mt-2 text-base md:text-lg">
//                     Te mando el plan completo: la habilidad paso a paso y qué esperar los primeros días.
//                 </p>
//             </div>
//
//             <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
//                 <Input
//                     type="email"
//                     placeholder="tu@correo.com"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="h-14 bg-background/10 border-background/15 text-background placeholder:text-background/35 text-lg rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
//                 />
//                 <Button
//                     type="submit"
//                     size="lg"
//                     disabled={isSubmitting}
//                     className={cn(
//                         "h-14 px-8 text-lg font-bold rounded-xl transition-all bg-gradient-to-r hover:opacity-90 text-white border-0 shadow-lg",
//                         style.gradient
//                     )}
//                 >
//                     {isSubmitting ? "Enviando..." : "Enviármela"}
//                     {!isSubmitting && <Send className="ml-2 h-5 w-5" />}
//                 </Button>
//             </form>
//             <p className="text-xs text-background/40 font-medium">
//                 Un correo. Sin listas compartidas. Te das de baja cuando quieras.
//             </p>
//         </div>
//     ) : (
//         <div className="relative z-10 py-8 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
//             <div className={cn("h-16 w-16 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br", style.gradient)}>
//                 <CheckCircle2 className="h-9 w-9 text-white" />
//             </div>
//             <h3 className="text-3xl font-black">¡Listo!</h3>
//             <p className="text-lg text-background/70">
//                 Revisa tu correo en los próximos minutos.
//             </p>
//         </div>
//     )}
// </div>
//
// ── Estado y handler que necesita ──────────────────────────────────────────
// const [email, setEmail] = useState("");
// const [isSubmitting, setIsSubmitting] = useState(false);
// const [isSubmitted, setIsSubmitted] = useState(false);
//
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return;
//     setIsSubmitting(true);
//     setTimeout(() => {
//         setIsSubmitting(false);
//         setIsSubmitted(true);
//     }, 1200);
// };
// ═══════════════════════════════════════════════════════════════════════════
