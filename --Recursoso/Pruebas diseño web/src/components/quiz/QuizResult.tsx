"use client";

import { useState, useEffect, useRef } from "react";
import { getStressProfile, WEAR_GAP_ZONES } from "./quizData";
import { saveQuizResult } from "@/lib/saveQuizResult";
import { Button } from "@/components/ui/button";
import {
    Check,
    Flame,
    BatteryCharging,
    RotateCcw,
    Sparkles,
    BookOpen,
    Compass,
    GraduationCap,
    Copy,
    Share2,
    AlertCircle,
    ChevronDown,
    ArrowRight,
    ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/content/taller";


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
    /** false = no guarda en Supabase (lo usa la página de pruebas) */
    persist?: boolean;
}

/* ── Geometría polar del semicírculo (0 a 100) ── */
function polarOnSemicircle(cx: number, cy: number, r: number, u: number) {
    const theta = Math.PI * (1 - Math.max(0, Math.min(1, u)));
    return {
        x: cx + r * Math.cos(theta),
        y: cy - r * Math.sin(theta),
    };
}

export default function QuizResult({
    answers,
    onRetake,
    userName,
    timeSpentSeconds,
    persist = true,
}: QuizResultProps) {
    const profile = getStressProfile(answers);
    const {
        loadIndex,
        regIndex,
        netDiff,
        wearGap,
        gapZone,
        dominantChannel,
        activeQuadrant,
        band,
        savedQuadrant,
        dimScores,
        dailyMirror,
        futureCost,
        activeMirrorAlerts,
        workshopSessions,
        topWorkshopSession,
    } = profile;

    const [copied, setCopied] = useState(false);
    const [skillOpen, setSkillOpen] = useState(true);

    /* ── Señales que destacan: síntomas del día a día ("Texto (60%)") separados en texto + porcentaje ── */
        const topSignals = (dailyMirror?.topSymptoms ?? []).map((raw, idx) => {
            const match = raw.match(/^(.*?)\s*\((\d+)%\)\s*$/);
            return {
                id: idx + 1,
                text: match ? match[1] : raw,
                pct: match ? Number(match[2]) : null,
            };
        });

        /* ── Valores numéricos sincronizados ── */
        const [displayedLoad, setDisplayedLoad] = useState(loadIndex);
        const [displayedReg, setDisplayedReg] = useState(regIndex);
        const [displayedGap, setDisplayedGap] = useState(wearGap);

        useEffect(() => {
            setDisplayedLoad(loadIndex);
            setDisplayedReg(regIndex);
            setDisplayedGap(wearGap);
        }, [loadIndex, regIndex, wearGap]);

        /* ── Guardar en Supabase (una sola vez) ── */
        const hasSaved = useRef(false);
        useEffect(() => {
            if (hasSaved.current || !persist) return;
            hasSaved.current = true;

            saveQuizResult({
                userName,
                answers,
                loadIndex,
                regIndex,
                netDiff,
                dominantChannel,
                dimScores,
                quadrantNumber: activeQuadrant,
                bandKey: savedQuadrant.key,
                bandName: savedQuadrant.name,
                timeSpentSeconds,
            });
        }, [
            answers,
            loadIndex,
            regIndex,
            netDiff,
            dominantChannel,
            dimScores,
            activeQuadrant,
            savedQuadrant.key,
            savedQuadrant.name,
            userName,
            timeSpentSeconds,
            persist,
        ]);

        /* ── Categorías para las columnas verticales (Punto 3) ── */
        const categoryColumns = [
            {
                key: "mente",
                label: "Tu Mente",
                subtitle: "Saturación",
                score: dimScores.dim1,
                colorClass: "bg-rose-500",
                textColor: "text-rose-600",
            },
            {
                key: "emociones",
                label: "Tus Emociones",
                subtitle: "Prisa interna",
                score: dimScores.dim2,
                colorClass: "bg-orange-500",
                textColor: "text-orange-600",
            },
            {
                key: "cuerpo",
                label: "Tu Cuerpo",
                subtitle: "Tensión física",
                score: dimScores.dim3,
                colorClass: "bg-amber-500",
                textColor: "text-amber-600",
            },
            {
                key: "habitos",
                label: "Tus Hábitos",
                subtitle: "Límites",
                score: dimScores.dim4,
                colorClass: "bg-purple-500",
                textColor: "text-purple-600",
            },
            {
                key: "recuperacion",
                label: "Recuperación",
                subtitle: "Freno y calma",
                score: regIndex,
                colorClass: "bg-emerald-500",
                textColor: "text-emerald-600",
            },
        ];

        /* ── Geometría del Tacómetro (Sin Equilibrio 50 - Punto 8) ── */
        const CX = 150;
        const CY = 138;
        const R = 112;
        const STROKE = 28;

        const u = Math.max(0, Math.min(100, displayedGap)) / 100;
        const arcEnd = polarOnSemicircle(CX, CY, R, u);
        const activePathD = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${arcEnd.x.toFixed(2)} ${arcEnd.y.toFixed(2)}`;
        const needleTip = polarOnSemicircle(CX, CY, 84, u);

        const dividerPositions = [0.25, 0.5, 0.75].map((divU) => ({
            inner: polarOnSemicircle(CX, CY, R - STROKE / 2 - 6, divU),
            outer: polarOnSemicircle(CX, CY, R + STROKE / 2 + 6, divU),
        }));

        /* ── Consejos accionables para "Algo que podés hacer hoy" ── */
        const ZONE_TIPS: Record<string, string[]> = {
            resiliente: [
                "Mantené tus rutinas de descanso y recuperación diaria para conservar este nivel de energía.",
                "Seguí reservando tiempo para actividades creativas y de desconexión sin culpa.",
                "Consolidá tus hábitos de higiene del sueño y límites con las pantallas.",
            ],
            fragil: [
                "Establecé una pausa de desconexión de 10 minutos a mitad de tu jornada laboral.",
                "Protegé tus horas de sueño apagando pantallas al menos 45 minutos antes de dormir.",
                "Aprendé a decir 'no' a compromisos adicionales que hoy saturan tu agenda.",
            ],
            "bajo-presion": [
                "Aplicá la respiración diafragmática 4-7-8 dos veces al día para desacelerar el sistema nervioso.",
                "Reducí y delegá tareas urgentes pero no esenciales durante las próximas dos semanas.",
                "Programá caminatas de 20 minutos sin auriculares para liberar tensión somática acumulada.",
            ],
            "riesgo-burnout": [
                "Considerá consultar con un profesional de la salud mental para un acompañamiento guiado.",
                "Detené el sobreesfuerzo: bloqueá tiempo de descanso no negociable este fin de semana.",
                "Hablá hoy con una persona de tu máxima confianza sobre el nivel de saturación que llevas.",
            ],
        };
        const currentTips = ZONE_TIPS[gapZone.key] || ZONE_TIPS["bajo-presion"];

        /* ── Mensaje de WhatsApp personalizado ── */
        const whatsappMessage = userName
            ? `Hola, soy ${userName}. Hice el test de estrés y mi resultado fue "${gapZone.title}" (${displayedGap}/100). Vi que mi prioridad #1 en el taller es "${topWorkshopSession.title}: ${topWorkshopSession.subtitle}". Me gustaría recibir información del taller.`
            : `Hola, hice el test de estrés y mi resultado fue "${gapZone.title}" (${displayedGap}/100). Vi que mi prioridad #1 en el taller es "${topWorkshopSession.title}: ${topWorkshopSession.subtitle}". Me gustaría recibir información del taller.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

        /* ── Copiar Resumen ── */
        const handleCopy = () => {
            const participant = userName?.trim() || "Participante";
            const text = `DIAGNÓSTICO DE ESTRÉS Y RECUPERACIÓN\nParticipante: ${participant}\nEstado: ${gapZone.title} (${displayedGap}/100)\n• Carga: ${loadIndex}%\n• Recuperación: ${regIndex}%\n• Prioridad en el taller: ${topWorkshopSession.title} (${topWorkshopSession.subtitle})\nEvaluación completada.`;
            navigator.clipboard?.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <div className="w-full max-w-4xl mx-auto space-y-8 pb-24 px-3 sm:px-6 animate-in fade-in duration-500">
                {/* ═══════════════ 1-2. HERO CARD VERTICAL (estilo PSS) ═══════════════ */}
                <div
                    className="w-full rounded-[1.5rem] bg-card text-card-foreground p-6 sm:p-8 shadow-sm border relative overflow-hidden mt-2"
                    role="region"
                    aria-label="Diagnóstico principal"
                >
                    {/* Número gigante de fondo (marca de agua) */}
                    <span
                        className="absolute -bottom-10 right-2 text-[9rem] sm:text-[11rem] font-black leading-none text-foreground/[0.04] select-none pointer-events-none tabular-nums"
                        aria-hidden="true"
                    >
                        {displayedGap}
                    </span>

                    {/* Etiqueta arriba de todo */}
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                            Evaluación completada
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col gap-6 mt-6">
                        {/* ── MEDIDOR CENTRADO + PUNTUACIÓN ABAJO ── */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-full max-w-[300px] mx-auto">
                                <svg
                                    viewBox="0 0 300 165"
                                    className="w-full h-auto overflow-visible select-none"
                                    role="img"
                                    aria-label={`Medidor de estrés: ${displayedGap} sobre 100, zona ${gapZone.title}`}
                                >
                                    {/* Pista base */}
                                    <path
                                        d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                                        fill="none"
                                        stroke="#efece6"
                                        strokeWidth={STROKE}
                                        strokeLinecap="butt"
                                    />

                                    {/* Arco activo en el color sólido de la zona */}
                                    {u > 0.005 && (
                                        <path
                                            d={activePathD}
                                            fill="none"
                                            stroke={gapZone.colorHex}
                                            strokeWidth={STROKE}
                                            strokeLinecap="butt"
                                            className="transition-[stroke] duration-500"
                                        />
                                    )}

                                    {/* Marcas de cambio de zona (25 / 50 / 75), cruzan el arco */}
                                    {dividerPositions.map((pos, idx) => (
                                        <line
                                            key={idx}
                                            x1={pos.inner.x}
                                            y1={pos.inner.y}
                                            x2={pos.outer.x}
                                            y2={pos.outer.y}
                                            stroke="#3f3f46"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    ))}

                                    {/* Aguja indicadora */}
                                    <line
                                        x1={CX}
                                        y1={CY}
                                        x2={needleTip.x}
                                        y2={needleTip.y}
                                        stroke="#1f2937"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    <circle cx={CX} cy={CY} r="8" fill="#ffffff" stroke="#1f2937" strokeWidth="4.5" />

                                    {/* Extremos 0 y 100 */}
                                    <text
                                        x={CX - R}
                                        y={CY + 26}
                                        textAnchor="middle"
                                        className="text-[12px] font-bold fill-muted-foreground"
                                    >
                                        0
                                    </text>
                                    <text
                                        x={CX + R}
                                        y={CY + 26}
                                        textAnchor="middle"
                                        className="text-[12px] font-bold fill-muted-foreground"
                                    >
                                        100
                                    </text>
                                </svg>

                                {/* Puntuación abajo del medidor */}
                                <div className="text-center mt-2">
                                    <span className="text-5xl font-black text-foreground tracking-tight tabular-nums">
                                        {displayedGap}
                                    </span>
                                    <span className="text-xl font-bold text-muted-foreground ml-1.5 select-none">
                                        / 100
                                    </span>
                                </div>
                            </div>

                            {/* Escala de las 4 zonas, la activa resaltada */}
                            <ol className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full max-w-xl mx-auto mt-6" aria-label="Zonas de estrés">
                                {WEAR_GAP_ZONES.map((zone) => {
                                    const isActive = zone.key === gapZone.key;
                                    return (
                                        <li
                                            key={zone.key}
                                            aria-current={isActive ? "true" : undefined}
                                            className={cn(
                                                "rounded-xl overflow-hidden text-center transition-colors",
                                                isActive ? "bg-muted/70" : "bg-transparent"
                                            )}
                                        >
                                            <div
                                                className={cn("h-1 rounded-full", !isActive && "bg-border")}
                                                style={isActive ? { backgroundColor: zone.colorHex } : undefined}
                                            />
                                            <div className="px-1 py-2.5 space-y-0.5">
                                                <p
                                                    className={cn(
                                                        "text-[11px] sm:text-sm font-bold leading-tight truncate",
                                                        isActive ? "text-foreground" : "text-muted-foreground"
                                                    )}
                                                    title={zone.title}
                                                >
                                                    {zone.title}
                                                </p>
                                                <p
                                                    className={cn(
                                                        "text-[10px] sm:text-xs font-semibold tabular-nums",
                                                        isActive ? "text-foreground/70" : "text-muted-foreground/80"
                                                    )}
                                                >
                                                    {zone.rangeLabel}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>

                        {/* ── DIAGNÓSTICO (SIN EMOJI) + 2 PÍLDORAS ── */}
                        <div className="flex flex-col space-y-3 text-left">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                                {userName?.trim() ? `${userName.trim()}, este es tu resultado` : "Tu resultado"}
                            </span>
                            <h1
                                className="text-4xl sm:text-5xl font-black tracking-tight leading-none"
                                style={{ color: gapZone.colorHex }}
                            >
                                {gapZone.title}
                            </h1>

                            {/* Descripción */}
                            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
                                {gapZone.description}
                            </p>

                            {/* ── 2 PÍLDORAS: CARGA Y RECUPERACIÓN (en lugar de "una señal") ── */}
                            <div className="flex items-center gap-3 pt-3 flex-wrap">
                                {/* Píldora 1: Carga */}
                                <div className="flex items-center gap-2.5 bg-rose-500/[0.08] border border-rose-500/25 rounded-full py-2 px-4 min-w-[130px]">
                                    <div className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                                        <Flame className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-muted-foreground font-semibold leading-tight">Carga</p>
                                        <p className="text-sm sm:text-base font-black text-foreground tabular-nums leading-tight">
                                            {displayedLoad}%
                                        </p>
                                    </div>
                                </div>

                                {/* Píldora 2: Recuperación */}
                                <div className="flex items-center gap-2.5 bg-emerald-500/[0.08] border border-emerald-500/25 rounded-full py-2 px-4 min-w-[145px]">
                                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                                        <BatteryCharging className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-muted-foreground font-semibold leading-tight">
                                            Recuperación
                                        </p>
                                        <p className="text-sm sm:text-base font-black text-foreground tabular-nums leading-tight">
                                            {displayedReg}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ 3. TUS RESPUESTAS: COLUMNAS DE CATEGORÍAS (Punto 3) ═══════════════ */}
                <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
                    <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-foreground">
                                Tus respuestas por categoría
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Nivel de carga y recuperación registrado en cada dimensión evaluada
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border">
                            18 preguntas evaluadas
                        </span>
                    </div>

                    {/* Gráfica de columnas: área fija con guías, pista y relleno proporcional */}
                    <div className="flex">
                        <div className="flex-1 min-w-0">
                            {/* Área de trazado */}
                            <div className="relative h-48 sm:h-56">
                                {/* Líneas guía */}
                                {[100, 75, 50, 25, 0].map((tick) => (
                                    <div
                                        key={tick}
                                        className={cn(
                                            "absolute inset-x-0 border-t",
                                            tick === 0 ? "border-border" : "border-dashed border-border/60"
                                        )}
                                        style={{ top: `${100 - tick}%` }}
                                        aria-hidden="true"
                                    />
                                ))}

                                {/* Columnas */}
                                <div className="absolute inset-0 grid grid-cols-5 gap-2 sm:gap-4 px-1 sm:px-3">
                                    {categoryColumns.map((col, idx) => (
                                        <div
                                            key={col.key}
                                            className={cn(
                                                "relative h-full flex justify-center",
                                                idx === categoryColumns.length - 1 &&
                                                "before:absolute before:-left-1 sm:before:-left-2 before:top-0 before:bottom-0 before:border-l before:border-dashed before:border-border"
                                            )}
                                        >
                                            {/* Pista de fondo */}
                                            <div className="relative h-full w-full max-w-[56px] rounded-t-xl bg-muted/50">
                                                {/* Relleno */}
                                                <div
                                                    className={cn(
                                                        "absolute bottom-0 inset-x-0 rounded-t-xl transition-[height] duration-700 ease-out",
                                                        col.colorClass
                                                    )}
                                                    style={{ height: `${Math.max(3, col.score)}%` }}
                                                    role="img"
                                                    aria-label={`${col.label}: ${col.score}%`}
                                                >
                                                    {/* Valor sobre la columna */}
                                                    <span
                                                        className={cn(
                                                            "absolute -top-6 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-black tabular-nums whitespace-nowrap",
                                                            col.textColor
                                                        )}
                                                    >
                                                        {col.score}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Etiquetas del eje X */}
                            <div className="grid grid-cols-5 gap-2 sm:gap-4 px-1 sm:px-3 mt-3">
                                {categoryColumns.map((col) => (
                                    <div key={col.key} className="text-center space-y-0.5 min-w-0">
                                        <p className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
                                            {col.label}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                                            {col.subtitle}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leyenda */}
                    <div className="flex items-center justify-center gap-5 text-[11px] font-semibold text-muted-foreground pt-1">
                        <span className="inline-flex items-center gap-1.5">
                            <Flame className="h-3.5 w-3.5 text-rose-500" />
                            Carga (más alto = más desgaste)
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <BatteryCharging className="h-3.5 w-3.5 text-emerald-500" />
                            Recuperación (más alto = mejor)
                        </span>
                    </div>
                </div>

                {/* ═══════════════ 4. SEÑALES QUE DESTACAN (BULLET POINTS + ¿QUÉ PASA SI LO DEJÁS?) (Punto 3) ═══════════════ */}
                <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Señales que destacan
                    </h2>

                    {/* Señales del día a día + puntos ciegos, en tarjetas */}
                    <div className="space-y-3">
                        {topSignals.map((sig) => (
                            <div
                                key={sig.id}
                                className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1.5"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs sm:text-sm font-bold text-primary">
                                        Señal #{sig.id}
                                    </span>
                                    {sig.pct !== null && (
                                        <span className="text-xs sm:text-sm font-bold text-rose-500 tabular-nums">
                                            {sig.pct}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                                    {sig.text}
                                </p>
                            </div>
                        ))}

                        {activeMirrorAlerts.map((alert, idx) => (
                            <div
                                key={`alert-${idx}`}
                                className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1.5"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs sm:text-sm font-bold text-amber-600">
                                        Punto ciego
                                    </span>
                                </div>
                                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                                    {alert.activeDesc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ¿Qué pasa si lo dejás pasar? */}
                    <div className="p-5 rounded-xl border bg-muted/20 space-y-2 border-l-4 border-l-rose-500">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Flame className="w-4 h-4 text-rose-500" />
                            ¿Qué pasa si lo dejás pasar?
                        </h3>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {futureCost.description}
                        </p>
                        <p className="text-xs text-muted-foreground font-semibold pt-1">
                            Costo invisible a mediano plazo: {futureCost.takeaway}
                        </p>
                    </div>
                </div>

                {/* ═══════════════ 5. ALGO QUE PODÉS HACER HOY (estilo "Tu siguiente paso") ═══════════════ */}
                <section className="space-y-4 text-left" aria-labelledby="hoy-title">
                    <div className="space-y-1">
                        <h2 id="hoy-title" className="flex items-center gap-3 text-xl sm:text-2xl font-black tracking-tight text-foreground">
                            <ArrowDownRight className="h-5 w-5 text-primary stroke-[2.5] shrink-0" />
                            Algo que podés hacer hoy
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground pl-8">{band.skill}</p>
                    </div>

                    {/* 3 pautas apiladas */}
                    <div className="space-y-4">
                        {currentTips.map((tip, idx) => (
                            <div key={idx} className="p-6 rounded-2xl border bg-card space-y-3">
                                <span className="block font-mono text-sm font-bold text-primary">
                                    0{idx + 1}
                                </span>
                                <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>

                    {/* Ver guía práctica (debajo de las 3 pautas) */}
                    <button
                        type="button"
                        onClick={() => setSkillOpen((o) => !o)}
                        aria-expanded={skillOpen}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 pl-1"
                    >
                        {skillOpen ? "Ocultar guía" : "Ver guía práctica"}
                        <ChevronDown className={cn("w-4 h-4 transition-transform", skillOpen && "rotate-180")} />
                    </button>

                    {skillOpen && (
                        <div className="p-6 rounded-2xl border bg-card space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Cómo aplicarla:
                                </p>
                                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                                    {band.how}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Por qué funciona:</strong> {band.why}
                            </div>
                        </div>
                    )}
                </section>

                {/* ═══════════════ 6. NUESTRO TALLER (PRIORIDAD + APRENDIZAJE INTEGRAL) (Punto 5) ═══════════════ */}
                <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                            <GraduationCap className="w-4 h-4" />
                            Nuestro taller
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            Un aprendizaje integral para tu vida
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Un programa práctico diseñado para que aprendás a regular tu sistema nervioso y gestionar tus demandas.
                        </p>
                    </div>

                    {/* Bloque: Tu mayor prioridad */}
                    <div className="p-5 rounded-2xl bg-primary/[0.06] border border-primary/25 space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                                ★ Tu mayor prioridad: en qué te ayuda
                            </span>
                            <span className="text-xs font-bold text-primary">
                                Sesión #{topWorkshopSession.num}
                            </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-foreground pt-1">
                            {topWorkshopSession.title}: <span className="text-primary">{topWorkshopSession.subtitle}</span>
                        </h3>

                        <p className="text-sm text-foreground/85 leading-relaxed">
                            {topWorkshopSession.why}
                        </p>
                    </div>

                    {/* Desglose de las 5 sesiones del taller */}
                    <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Estructura completa del programa:
                        </p>
                        <div className="divide-y border rounded-2xl overflow-hidden bg-card">
                            {workshopSessions.map((s) => {
                                const isTop = s.num === topWorkshopSession.num;
                                return (
                                    <div
                                        key={s.num}
                                        className={cn(
                                            "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors",
                                            isTop ? "bg-primary/[0.04]" : "hover:bg-muted/20"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-bold font-mono text-muted-foreground">
                                                    0{s.num}.
                                                </span>
                                                <span className="font-bold text-sm sm:text-base text-foreground">
                                                    {s.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    — {s.subtitle}
                                                </span>
                                                {isTop && (
                                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                                                        Tu sesión clave
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                                {s.why}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ═══════════════ 7. SECCIÓN WHATSAPP Y ACCIONES (Punto 6) ═══════════════ */}
                <div className="p-6 sm:p-8 rounded-2xl border bg-gradient-to-br from-emerald-500/[0.07] via-card to-card shadow-sm space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto">
                        <WhatsAppIcon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1 max-w-md mx-auto">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            ¿Querés profundizar en tus resultados?
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Escribinos directamente por WhatsApp con tu diagnóstico para darte información detallada sobre el taller y resolver tus dudas.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            Consultar por WhatsApp
                        </a>

                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="w-full sm:w-auto gap-2 rounded-full px-5 text-xs font-semibold"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "¡Resumen copiado!" : "Copiar resumen"}
                        </Button>
                    </div>
                </div>

                {/* Botón final para reiniciar */}
                <div className="flex justify-center pt-2">
                    <Button
                        variant="ghost"
                        onClick={onRetake}
                        className="gap-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Volver a hacer el test desde el inicio
                    </Button>
                </div>
            </div>
        );
    }
