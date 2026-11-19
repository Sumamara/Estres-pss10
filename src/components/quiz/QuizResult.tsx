"use client";

import { useState, useEffect, useRef, useId } from "react";
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

const QuizResult = ({ answers, onRetake, userName, timeSpentSeconds }: QuizResultProps) => {
    const profile = getStressProfile(answers);
    const { totalScore, band } = profile;
    const style = BAND_STYLES[band.key];

    const [ledeOpen, setLedeOpen] = useState(false);
    const [skillOpen, setSkillOpen] = useState(false);

    /* Unique mask id — useId emits punctuation (":r0:") that can break url(#…) refs */
    const maskId = `ring-cut-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

    /* ── animated counter ──────────────────────────────── */
    const [displayedScore, setDisplayedScore] = useState(0);
    const [ringProgress, setRingProgress] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Animate the number counting up
        const duration = 1200;
        const start = performance.now();
        const animate = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 4); // ease-out quart
            setDisplayedScore(Math.round(ease * totalScore));
            setRingProgress(ease * (totalScore / 40));
            if (t < 1) requestAnimationFrame(animate);
        };
        // Small delay so the page fades in first
        setTimeout(() => requestAnimationFrame(animate), 300);
    }, [totalScore]);

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

    /* ── SVG ring maths ────────────────────────────────── */
    const SIZE = 280;
    const STROKE = 20;
    const RADIUS = (SIZE - STROKE) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const CX = (SIZE + 80) / 2;
    const CY = (SIZE + 80) / 2;

    const SEGMENTS = [
        { start: 0, end: 13, color: "#10b981", label: "Con margen", range: "0 – 13" },
        { start: 13, end: 26, color: "#f59e0b", label: "En tensión", range: "14 – 26" },
        { start: 26, end: 40, color: "#f43f5e", label: "Al límite", range: "27 – 40" },
    ];

    /* Zone boundaries, each in the colour of the zone it opens:
       green at 0, amber at 13, rose at 26. */
    const BOUNDARIES = SEGMENTS.map((seg) => ({
        score: seg.start,
        color: seg.color,
    }));
    const CUT_WIDTH = 10;

    /* Radial line across the ring at a given score. `pad` extends it past both edges. */
    const boundaryLine = (score: number, pad: number) => {
        const angle = (score / 40) * 2 * Math.PI - Math.PI / 2;
        const r1 = RADIUS - STROKE / 2 - pad;
        const r2 = RADIUS + STROKE / 2 + pad;
        return {
            x1: CX + r1 * Math.cos(angle),
            y1: CY + r1 * Math.sin(angle),
            x2: CX + r2 * Math.cos(angle),
            y2: CY + r2 * Math.sin(angle),
        };
    };

    /* WhatsApp deep link — abre la app (o WhatsApp Web) con el mensaje ya escrito */
    const whatsappMessage = userName
        ? `Hola, soy ${userName} y me gustaría más información del taller de control de estrés.`
        : "Hola, me gustaría más información del taller de control de estrés.";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    const activeIdx = band.key === "con-margen" ? 0 : band.key === "en-tension" ? 1 : 2;


    return (
        <div className="w-full max-w-3xl mx-auto space-y-14 pb-24 px-4">

            {/* ═══════════════ HERO SCORE CARD ═══════════════ */}
            <div
                className="relative pt-4 pb-14 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
                {/* Free-floating glow — fades naturally in all directions */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 blur-3xl"
                    style={{ background: style.ringStroke }}
                />

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

                    {/* Ring with labels */}
                    <div className="relative mt-2" style={{ width: SIZE + 80, height: SIZE + 80 }}>
                        <svg
                            width={SIZE + 80}
                            height={SIZE + 80}
                            viewBox={`0 0 ${SIZE + 80} ${SIZE + 80}`}
                            className="drop-shadow-lg"
                        >
                            {/* Mask that carves a REAL gap at each boundary. Painting a white
                                slit looked wrong because the glow behind tints the backdrop —
                                removing the pixels lets whatever is behind show through instead. */}
                            <defs>
                                <mask
                                    id={maskId}
                                    maskUnits="userSpaceOnUse"
                                    x="0" y="0"
                                    width={SIZE + 80} height={SIZE + 80}
                                >
                                    {/* white = keep, black = cut away */}
                                    <rect x="0" y="0" width={SIZE + 80} height={SIZE + 80} fill="white" />
                                    {BOUNDARIES.map((b) => {
                                        const l = boundaryLine(b.score, 3);
                                        return (
                                            <line
                                                key={`cut-${b.score}`}
                                                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                                                stroke="black"
                                                strokeWidth={CUT_WIDTH}
                                            />
                                        );
                                    })}
                                </mask>
                            </defs>

                            <g mask={`url(#${maskId})`}>
                                {/* Neutral track */}
                                <circle
                                    cx={CX} cy={CY} r={RADIUS}
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-muted"
                                    strokeWidth={STROKE}
                                    opacity={0.3}
                                />

                                {/* Progress arc — one single colour: the current band.
                                    Butt cap on purpose: a round cap overhangs the start by
                                    STROKE/2, and the cut at 0 would slice it, leaving an
                                    orphaned blob just before the divider. The rounded look at
                                    the leading edge is provided by the indicator dot below. */}
                                <circle
                                    cx={CX} cy={CY} r={RADIUS}
                                    fill="none"
                                    stroke={style.ringStroke}
                                    strokeWidth={STROKE}
                                    strokeLinecap="butt"
                                    strokeDasharray={`${ringProgress * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                                    transform={`rotate(-90 ${CX} ${CY})`}
                                    style={{ filter: `drop-shadow(0 0 6px ${style.ringStroke}55)` }}
                                />
                            </g>

                            {/* Coloured divider sitting inside each carved gap */}
                            {BOUNDARIES.map((b) => {
                                const l = boundaryLine(b.score, 0);
                                return (
                                    <line
                                        key={`div-${b.score}`}
                                        x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                                        stroke={b.color}
                                        strokeWidth={3}
                                        strokeLinecap="round"
                                    />
                                );
                            })}

                            {/* Indicator dot at score position */}
                            {ringProgress > 0.01 && (() => {
                                const angle = ringProgress * 2 * Math.PI - Math.PI / 2;
                                const dotX = CX + RADIUS * Math.cos(angle);
                                const dotY = CY + RADIUS * Math.sin(angle);
                                return (
                                    <g>
                                        {/* Outer glow */}
                                        <circle
                                            cx={dotX} cy={dotY} r={STROKE / 2 + 6}
                                            fill={style.ringStroke}
                                            opacity={0.25}
                                        />
                                        {/* White ring */}
                                        <circle
                                            cx={dotX} cy={dotY} r={STROKE / 2 + 2}
                                            fill="white"
                                            stroke={style.ringStroke}
                                            strokeWidth={3}
                                            style={{ filter: `drop-shadow(0 2px 6px ${style.ringStroke}80)` }}
                                        />
                                        {/* Inner dot */}
                                        <circle
                                            cx={dotX} cy={dotY} r={4}
                                            fill={style.ringStroke}
                                        />
                                    </g>
                                );
                            })()}

                            {/* Range labels outside the ring */}
                            {SEGMENTS.map((seg, i) => {
                                const midFraction = ((seg.start + seg.end) / 2) / 40;
                                const labelAngle = midFraction * 2 * Math.PI - Math.PI / 2;
                                const labelR = RADIUS + 32;
                                const lx = CX + labelR * Math.cos(labelAngle);
                                const ly = CY + labelR * Math.sin(labelAngle);
                                const isActive = i === activeIdx;
                                return (
                                    <g key={`label-${i}`}>
                                        <text
                                            x={lx} y={ly - 6}
                                            textAnchor="middle"
                                            className="fill-muted-foreground"
                                            fontSize="10"
                                            fontWeight="600"
                                            opacity={isActive ? 0.9 : 0.4}
                                        >
                                            {seg.label}
                                        </text>
                                        <text
                                            x={lx} y={ly + 7}
                                            textAnchor="middle"
                                            fontSize="9"
                                            fontWeight="500"
                                            fill={seg.color}
                                            opacity={isActive ? 0.8 : 0.35}
                                        >
                                            {seg.range}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Centre content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className={cn(
                                    "text-7xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b",
                                    style.gradient
                                )}
                            >
                                {displayedScore}
                            </span>
                            <span className="text-sm font-semibold text-muted-foreground/60 tracking-widest mt-1">
                                de 40
                            </span>
                        </div>
                    </div>

                    {/* Collapsible lede */}
                    <div className="mt-6 max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 fill-mode-both">
                        <div>
                            {/* Trigger: question + subtle rotating chevron */}
                            <button
                                type="button"
                                onClick={() => setLedeOpen((o) => !o)}
                                aria-expanded={ledeOpen}
                                className="group inline-flex items-center gap-2 py-1"
                            >
                                <span className="relative text-base md:text-lg font-bold tracking-tight text-foreground/85 group-hover:text-foreground transition-colors">
                                    ¿Qué significa estar {band.name.toLowerCase()}?
                                    <span
                                        className="absolute left-0 -bottom-0.5 h-[1.5px] w-full rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-300"
                                        style={{ background: style.ringStroke }}
                                    />
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 shrink-0 transition-transform duration-300",
                                        ledeOpen ? "rotate-180" : "group-hover:translate-y-0.5"
                                    )}
                                    strokeWidth={2.5}
                                    style={{ color: style.ringStroke }}
                                />
                            </button>

                            {/* Expandable lede */}
                            <div
                                className="grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                style={{ gridTemplateRows: ledeOpen ? "1fr" : "0fr" }}
                            >
                                <div className="overflow-hidden">
                                    <div className="pt-5 space-y-5 text-left">
                                        {band.ledePoints.map((point, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <p
                                                    className="text-[11px] font-bold uppercase tracking-widest"
                                                    style={{ color: style.ringStroke }}
                                                >
                                                    {point.label}
                                                </p>
                                                <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-medium">
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

                        {!skillOpen && (
                            <p className="text-sm font-semibold text-muted-foreground animate-in fade-in duration-300">
                                Toca para descubrir cómo aplicarla →
                            </p>
                        )}
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
