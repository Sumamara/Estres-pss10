"use client";

import { useState, useEffect, useRef } from "react";
import { getStressProfile, WEAR_GAP_ZONES } from "./quizData";
import { saveQuizResult } from "@/lib/saveQuizResult";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    BookOpen,
    ChevronDown,
    Copy,
    Check,
    Printer,
    AlertTriangle,
    Flame,
    BatteryCharging,
    Activity,
    Target,
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
}

const QuizResult = ({ answers, onRetake, userName, timeSpentSeconds }: QuizResultProps) => {
    const profile = getStressProfile(answers);
    const {
        loadIndex,
        regIndex,
        netDiff,
        wearGap,
        gapZone,
        loadLevelLabel,
        regLevelLabel,
        dominantChannel,
        activeQuadrant,
        savedQuadrant,
        band,
        dimScores,
        dimensionsDetail,
        dailyMirror,
        futureCost,
        activeMirrorAlerts,
        workshopSessions,
        topWorkshopSession,
    } = profile;

    const [ledeOpen, setLedeOpen] = useState(false);
    const [skillOpen, setSkillOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    /* ── Valores sincronizados ── */
    const [displayedLoad, setDisplayedLoad] = useState(loadIndex);
    const [displayedReg, setDisplayedReg] = useState(regIndex);
    const [displayedGap, setDisplayedGap] = useState(wearGap);

    useEffect(() => {
        setDisplayedLoad(loadIndex);
        setDisplayedReg(regIndex);
        setDisplayedGap(wearGap);
    }, [loadIndex, regIndex, wearGap]);

    /* â”€â”€ Guardar en Supabase (una sola vez) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const hasSaved = useRef(false);

    useEffect(() => {
        if (hasSaved.current) return;
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
    ]);


    /* â”€â”€ GeometrÃ­a del VelocÃ­metro Editorial PSS (Escala Positiva 0 a 100) â”€â”€ */
    // 0 = MÃ¡xima Calma y Reserva (extremo izquierdo)
    // 50 = Equilibrio Neutro (cÃºspide vertical a 90Â°)
    // 100 = Sobrecarga CrÃ­tica (extremo derecho)
    const gapToArcProgress = (val: number): number => {
        const clamped = Math.max(0, Math.min(100, val));
        return clamped / 100;
    };

    const polarOnSemicircle = (cx: number, cy: number, r: number, u: number) => {
        const theta = Math.PI * (1 - Math.max(0, Math.min(1, u)));
        return {
            x: cx + r * Math.cos(theta),
            y: cy - r * Math.sin(theta),
        };
    };

    const CX = 150;
    const CY = 138;
    const R = 108;
    const STROKE = 22;

    const arcProgressU = gapToArcProgress(displayedGap);
    const arcEnd = polarOnSemicircle(CX, CY, R, arcProgressU);
    const activePathD = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${arcEnd.x.toFixed(2)} ${arcEnd.y.toFixed(2)}`;
    // El radio interior del arco es R - STROKE/2 = 97px. Con radio 94px la punta apunta con mÃ¡xima precisiÃ³n.
    const needleTip = polarOnSemicircle(CX, CY, 94, arcProgressU);

    const dividerPositions = [0.25, 0.5, 0.75].map((divU) => ({
        u: divU,
        inner: polarOnSemicircle(CX, CY, R - STROKE / 2 - 2.5, divU),
        outer: polarOnSemicircle(CX, CY, R + STROKE / 2 + 2.5, divU),
    }));

    const formattedGap = `${displayedGap}`;

    const ZONE_RANGE_LABELS: Record<string, string> = {
        "resiliente": "0 a 25 pts",
        "fragil": "26 a 50 pts",
        "bajo-presion": "51 a 75 pts",
        "riesgo-burnout": "76 a 100 pts",
    };

    const loadDimensions = dimensionsDetail.filter((d) => d.part === "A");
    const regDimensions = dimensionsDetail.filter((d) => d.part === "B");

    /* â”€â”€ Copiar Resumen al Portapapeles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const handleCopySummary = () => {
        const participant = userName?.trim() || "Participante";
        let summary = `DIAGNÃ“STICO PERSONALIZADO DE ESTRÃ‰S Y RECUPERACIÃ“N\n`;
        summary += `Participante: ${participant}\n`;
        summary += `Estado actual: ${gapZone.title}\n`;
        summary += `â€¢ Carga hoy: ${loadIndex}% (${loadLevelLabel})\n`;
        summary += `â€¢ RecuperaciÃ³n: ${regIndex}% (${regLevelLabel})\n`;
        summary += `â€¢ Nivel (Carga âˆ’ RecuperaciÃ³n): ${wearGap > 0 ? `+${wearGap}%` : `${wearGap}%`}\n`;
        summary += `â€¢ Tu prioridad #1 en el taller: ${topWorkshopSession.title} (${topWorkshopSession.subtitle})\n\n`;
        summary += `CÃ³mo se ve en tu dÃ­a a dÃ­a:\n"${dailyMirror.narrative}"\n`;

        navigator.clipboard?.writeText(summary).catch(() => {
            const temp = document.createElement("textarea");
            temp.value = summary;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);
        });

        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    /* â”€â”€ WhatsApp deep link â”€â”€ */
    const whatsappMessage = userName
        ? `Hola, soy ${userName}. Hice el test de estrÃ©s, me saliÃ³ "${gapZone.title}" y vi que mi prioridad #1 es la ${topWorkshopSession.title}. Me gustarÃ­a recibir informaciÃ³n del taller.`
        : `Hola, hice el test de estrÃ©s, me saliÃ³ "${gapZone.title}" y vi que mi prioridad #1 es la ${topWorkshopSession.title}. Me gustarÃ­a recibir informaciÃ³n del taller.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="w-full max-w-3xl mx-auto space-y-14 pb-24 px-4">

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• 1. HERO HÃBRIDO EDITORIAL PSS (1Âº GRÃFICO + 3 PÃLDORAS -> 2Âº RESULTADO) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="relative pt-4 pb-6 px-1 sm:px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Halo de luz suave flotando libre en el fondo */}
                <div
                    className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[300px] rounded-full pointer-events-none opacity-20 blur-3xl"
                    style={{ background: gapZone.colorHex }}
                />

                <div className="relative z-10 flex flex-col items-center">
                    <div
                        className="w-full max-w-xl rounded-[2.25rem] bg-card text-card-foreground p-6 sm:p-10 shadow-sm border border-border/80 relative overflow-hidden"
                        role="meter"
                        aria-valuenow={displayedGap}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`${gapZone.title}. Carga ${displayedLoad}%, RecuperaciÃ³n ${displayedReg}%, Ãndice ${displayedGap}/100`}
                        aria-label="TermÃ³metro de EstrÃ©s y RecuperaciÃ³n"
                    >
                        {/* Resplandor ambiental suave superior */}
                        <div
                            className="absolute left-1/2 top-28 -translate-x-1/2 -translate-y-1/2 w-72 h-52 rounded-full pointer-events-none opacity-[0.10] blur-3xl"
                            style={{ backgroundColor: gapZone.colorHex }}
                            aria-hidden="true"
                        />

                        <div className="relative z-10 space-y-7">
                            {/* Encabezado discreto estilo Imagen 1 ("âœ“ EVALUACIÃ“N COMPLETADA") */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <Check className="w-3.5 h-3.5 text-primary stroke-[2.75]" />
                                    EvaluaciÃ³n completada
                                </span>
                                {userName && (
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Hola, <strong className="text-foreground font-bold">{userName}</strong>
                                    </span>
                                )}
                            </div>

                            {/* â”€â”€ 1Âº PRIMERO EL GRÃFICO: VELOCÃMETRO EDITORIAL PSS â”€â”€ */}
                            <div className="pt-1">
                                <div className="relative w-full max-w-[310px] mx-auto">
                                    <svg
                                        viewBox="0 0 300 162"
                                        className="w-full h-auto overflow-visible select-none"
                                        aria-hidden="true"
                                    >
                                        {/* Pista base adaptativa a modo claro y oscuro */}
                                        <path
                                            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                                            fill="none"
                                            stroke="currentColor"
                                            className="text-muted/60"
                                            strokeWidth={STROKE}
                                            strokeLinecap="butt"
                                        />

                                        {/* Arco activo coloreado hasta la posiciÃ³n exacta de la aguja */}
                                        {arcProgressU > 0.005 && (
                                            <path
                                                d={activePathD}
                                                fill="none"
                                                stroke={gapZone.colorHex}
                                                strokeWidth={STROKE}
                                                strokeLinecap="butt"
                                            />
                                        )}

                                        {/* 3 Divisores de zona radiales adaptativos a dark mode */}
                                        {dividerPositions.map((div) => (
                                            <line
                                                key={div.u}
                                                x1={div.inner.x}
                                                y1={div.inner.y}
                                                x2={div.outer.x}
                                                y2={div.outer.y}
                                                stroke="currentColor"
                                                className="text-foreground/80"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                            />
                                        ))}

                                        {/* Extremos de la escala con escala 100% positiva (0 a 100) */}
                                        <text
                                            x={CX - R}
                                            y={CY + 18}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="700"
                                            fill="currentColor"
                                            className="text-muted-foreground"
                                        >
                                            0
                                        </text>
                                        <text
                                            x={CX}
                                            y={CY - R - 6}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fontWeight="700"
                                            fill="currentColor"
                                            className="text-muted-foreground/80 uppercase tracking-wider"
                                        >
                                            Equilibrio 50
                                        </text>
                                        <text
                                            x={CX + R}
                                            y={CY + 18}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="700"
                                            fill="currentColor"
                                            className="text-muted-foreground"
                                        >
                                            100
                                        </text>

                                        {/* Aguja de reloj de precisiÃ³n con tokens contrastados */}
                                        <g>
                                            <line
                                                x1={CX}
                                                y1={CY}
                                                x2={needleTip.x}
                                                y2={needleTip.y}
                                                stroke="currentColor"
                                                className="text-foreground"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                            />
                                            <circle cx={CX} cy={CY} r="8.5" fill="currentColor" className="text-foreground" />
                                            <circle cx={CX} cy={CY} r="3" fill="hsl(var(--card))" />
                                        </g>
                                    </svg>

                                    {/* Lectura numÃ©rica central debajo del pivote */}
                                    <div className="mt-2 text-center">
                                        <div className="inline-flex items-baseline justify-center gap-1">
                                            <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground tabular-nums">
                                                {displayedGap}
                                            </span>
                                            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                                / 100
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <span
                                                className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase border"
                                                style={{
                                                    backgroundColor: `${gapZone.colorHex}15`,
                                                    color: gapZone.colorHex,
                                                    borderColor: `${gapZone.colorHex}35`,
                                                }}
                                            >
                                                {gapZone.title}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* â”€â”€ LAS 4 PESTAÃ‘AS DE ZONA (ESTILO EDITORIAL PSS ADAPTADAS A DARK MODE) â”€â”€ */}
                                <div className="grid grid-cols-4 gap-2 mt-6">
                                    {WEAR_GAP_ZONES.map((z) => {
                                        const isCurrent = z.key === gapZone.key;
                                        return (
                                            <div
                                                key={z.key}
                                                className={cn(
                                                    "relative pt-2.5 pb-2 px-1.5 text-center rounded-b-xl transition-all",
                                                    isCurrent
                                                        ? "bg-secondary text-foreground font-extrabold shadow-sm ring-1 ring-border"
                                                        : "text-muted-foreground/75 font-semibold"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "absolute top-0 inset-x-0 h-[3.5px] rounded-full transition-all",
                                                        isCurrent ? "" : "bg-border/60"
                                                    )}
                                                    style={{ backgroundColor: isCurrent ? z.colorHex : undefined }}
                                                />
                                                <p className="text-xs font-bold truncate leading-tight mt-0.5">
                                                    {z.shortLabel}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                                                    {ZONE_RANGE_LABELS[z.key]}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* â”€â”€ LAS 3 PÃLDORAS CON OPERADORES MATEMÃTICOS: CARGA âˆ’ RECUPERACIÃ“N = NIVEL â”€â”€ */}
                                <div className="flex items-center justify-between gap-1 sm:gap-2 mt-5 pt-5 border-t border-border/60">
                                    {/* PÃ­ldora 1: Carga */}
                                    <div className="flex-1 flex items-center gap-1.5 sm:gap-2 bg-rose-500/[0.06] border border-rose-500/20 rounded-full py-2 pl-2 pr-2.5 sm:pr-3 min-w-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                            <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold truncate leading-tight">
                                                Carga
                                            </p>
                                            <p className="text-xs sm:text-base font-black text-foreground tabular-nums leading-tight">
                                                {displayedLoad}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Operador Menos (âˆ’) */}
                                    <span className="text-base sm:text-lg font-black text-muted-foreground/80 px-0.5 select-none" aria-hidden="true">
                                        âˆ’
                                    </span>

                                    {/* PÃ­ldora 2: RecuperaciÃ³n */}
                                    <div className="flex-1 flex items-center gap-1.5 sm:gap-2 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-full py-2 pl-2 pr-2.5 sm:pr-3 min-w-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <BatteryCharging className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold truncate leading-tight">
                                                RecuperaciÃ³n
                                            </p>
                                            <p className="text-xs sm:text-base font-black text-foreground tabular-nums leading-tight">
                                                {displayedReg}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Operador Igual (=) */}
                                    <span className="text-base sm:text-lg font-black text-muted-foreground/80 px-0.5 select-none" aria-hidden="true">
                                        =
                                    </span>

                                    {/* PÃ­ldora 3: Ãndice de TensiÃ³n (0 a 100) */}
                                    <div
                                        className="flex-1 flex items-center gap-1.5 sm:gap-2 rounded-full py-2 pl-2 pr-2.5 sm:pr-3 border transition-colors min-w-0"
                                        style={{
                                            backgroundColor: `${gapZone.colorHex}10`,
                                            borderColor: `${gapZone.colorHex}35`,
                                        }}
                                    >
                                        <div
                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0"
                                            style={{
                                                backgroundColor: `${gapZone.colorHex}20`,
                                                color: gapZone.colorHex,
                                            }}
                                        >
                                            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold truncate leading-tight">
                                                Ãndice
                                            </p>
                                            <p
                                                className="text-xs sm:text-base font-black tabular-nums leading-tight"
                                                style={{ color: gapZone.colorHex }}
                                            >
                                                {displayedGap} / 100
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* â”€â”€ 2Âº LUEGO EL RESULTADO (ORDEN Y ESTRUCTURA DE LA IMAGEN 1) â”€â”€ */}
                            <div className="pt-6 border-t border-border/80 text-left space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Tu resultado orientativo
                                </p>

                                <h2
                                    className="text-3xl sm:text-4xl font-black tracking-tight [text-wrap:balance]"
                                    style={{ color: gapZone.colorHex }}
                                >
                                    {gapZone.title}
                                </h2>

                                <p className="text-base sm:text-lg text-foreground/85 leading-relaxed font-medium [text-wrap:pretty]">
                                    {gapZone.description}
                                </p>

                                {/* Nota orientativa inferior estilo Imagen 1 */}
                                <div className="pt-2">
                                    <div
                                        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium w-full"
                                        style={{
                                            backgroundColor: `${gapZone.colorHex}0D`,
                                            borderColor: `${gapZone.colorHex}28`,
                                        }}
                                    >
                                        <Target
                                            className="w-4 h-4 shrink-0"
                                            style={{ color: gapZone.colorHex }}
                                        />
                                        <span className="text-foreground/90">
                                            Una seÃ±al para observar tu balance hoy, no una etiqueta fija que te define.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desplegable limpio estilo Base-PSS (Touch target >= 44px) */}
                    <div className="mt-7 max-w-lg w-full text-center">
                        <button
                            type="button"
                            onClick={() => setLedeOpen((o) => !o)}
                            aria-expanded={ledeOpen}
                            aria-controls="accordion-lede-content"
                            className="group inline-flex items-center gap-2 min-h-[44px] py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <span className="relative text-base md:text-lg font-bold tracking-tight text-foreground/85 group-hover:text-foreground transition-colors">
                                Â¿Por quÃ© me pasa esto?
                                <span
                                    className="absolute left-0 -bottom-0.5 h-[1.5px] w-full rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-300"
                                    style={{ background: gapZone.colorHex }}
                                />
                            </span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-transform duration-300",
                                    ledeOpen ? "rotate-180" : "group-hover:translate-y-0.5"
                                )}
                                strokeWidth={2.5}
                                style={{ color: gapZone.colorHex }}
                            />
                        </button>

                        <div
                            id="accordion-lede-content"
                            className="grid transition-all duration-500 ease-in-out"
                            style={{ gridTemplateRows: ledeOpen ? "1fr" : "0fr" }}
                        >
                            <div className="overflow-hidden">
                                <div className="pt-5 space-y-5 text-left">
                                    {band.ledePoints.map((point, i) => (
                                        <div key={i} className="space-y-1">
                                            <p
                                                className="text-[11px] font-bold uppercase tracking-widest"
                                                style={{ color: gapZone.colorHex }}
                                            >
                                                {point.label}
                                            </p>
                                            <p className="text-muted-foreground text-base leading-relaxed font-medium">
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

            {/* Conector 1 (Sutil y elegante) */}
            <div className="flex flex-col items-center py-1" aria-hidden="true">
                <div
                    className="w-[2px] h-10 rounded-full"
                    style={{ background: `linear-gradient(to bottom, transparent, ${gapZone.colorHex}35)` }}
                />
                <ChevronDown
                    className="h-5 w-5 mt-1 opacity-50"
                    strokeWidth={2.5}
                    style={{ color: gapZone.colorHex }}
                />
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• 2. TU RETRATO PERSONAL (1 SOLA TARJETA EDITORIAL LIMPIA) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="bg-card border rounded-[2rem] p-8 md:p-10 shadow-sm space-y-10 text-left">
                {/* Narrativa Espejo + Costo Invisible sin cajas chillonas */}
                <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        CÃ³mo se ve esto en tu dÃ­a a dÃ­a
                    </p>
                    <p className="text-lg sm:text-xl text-foreground leading-relaxed font-medium">
                        {dailyMirror.narrative}
                    </p>

                    {activeMirrorAlerts.length > 0 && (
                        <p className="text-sm sm:text-base text-amber-900 dark:text-amber-200 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 leading-relaxed">
                            <strong>âš¡ Ojo con este punto ciego:</strong> {activeMirrorAlerts[0].activeDesc}
                        </p>
                    )}

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
                        <strong className="text-foreground">Â¿QuÃ© pasa si lo dejas pasar?</strong>{" "}
                        {futureCost.description}
                    </p>
                </div>

                {/* Tus 6 Ãreas en 2 grupos limpios (sin grÃ¡fico de telaraÃ±a) */}
                <div className="pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Grupo 1: DÃ³nde pierdes energÃ­a */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-rose-600">
                            DÃ³nde estÃ¡s perdiendo energÃ­a
                        </p>
                        <div className="space-y-4">
                            {loadDimensions.map((dim) => (
                                <div key={dim.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-foreground">{dim.title}</span>
                                        <span className="font-bold text-muted-foreground tabular-nums">
                                            {dim.score}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full h-2 bg-muted rounded-full overflow-hidden"
                                        role="progressbar"
                                        aria-valuenow={dim.score}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={dim.title}
                                    >
                                        <div
                                            className="h-full bg-rose-500/85 rounded-full transition-all duration-700"
                                            style={{ width: `${dim.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grupo 2: DÃ³nde la recuperas */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                            Tus recursos para recuperarte
                        </p>
                        <div className="space-y-4">
                            {regDimensions.map((dim) => (
                                <div key={dim.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-foreground">{dim.title}</span>
                                        <span className="font-bold text-emerald-600 tabular-nums">
                                            {dim.score}%
                                        </span>
                                    </div>
                                    <div
                                        className="w-full h-2 bg-muted rounded-full overflow-hidden"
                                        role="progressbar"
                                        aria-valuenow={dim.score}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={dim.title}
                                    >
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                            style={{ width: `${dim.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
                            Meta ideal: mantener tus recursos de recuperaciÃ³n en <strong>60% o mÃ¡s</strong> para que el estrÃ©s no se acumule.
                        </p>
                    </div>
                </div>
            </div>

            {/* Conector 2 (Elegante y sin ruido de rebote continuo) */}
            <div className="flex flex-col items-center py-1" aria-hidden="true">
                <div
                    className="w-[2px] h-10 rounded-full"
                    style={{ background: `linear-gradient(to bottom, transparent, ${gapZone.colorHex}35)` }}
                />
                <ChevronDown
                    className="h-5 w-5 mt-1 opacity-40"
                    strokeWidth={2.5}
                    style={{ color: gapZone.colorHex }}
                />
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• 3. PUENTE + HABILIDAD PRÃCTICA (COMO EN BASE-PSS) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    Â¿QuÃ© puedes hacer al respecto?
                </h3>
                <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                    Tomar acciÃ³n ahora que lo notas es lo mejor que puedes hacer. Te dejo una recomendaciÃ³n para hoy.
                </p>
            </div>

            {/* Collapsible Skill Card */}
            <div className="bg-card border rounded-[2rem] shadow-md text-left relative overflow-hidden">
                <div
                    className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-[0.06] pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${gapZone.colorHex}, transparent 70%)` }}
                />

                <button
                    type="button"
                    onClick={() => setSkillOpen((o) => !o)}
                    aria-expanded={skillOpen}
                    aria-controls="accordion-skill-content"
                    className="relative z-10 w-full flex items-center gap-4 p-8 md:p-10 text-left cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none rounded-[2rem]"
                >
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                            <BookOpen className="h-4 w-4" aria-hidden="true" />
                            Algo que puedes hacer hoy
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground [text-wrap:balance]">
                            {band.skill}
                        </h3>

                        {!skillOpen && (
                            <p className="text-sm font-semibold text-muted-foreground [text-wrap:pretty]">
                                Toca para descubrir cÃ³mo aplicarla
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
                            style={{ color: gapZone.colorHex }}
                        />
                    </div>
                </button>

                <div
                    id="accordion-skill-content"
                    className="relative z-10 grid transition-all duration-500 ease-in-out"
                    style={{ gridTemplateRows: skillOpen ? "1fr" : "0fr" }}
                >
                    <div className="overflow-hidden">
                        <div className="px-8 md:px-10 pb-8 md:pb-10 space-y-6">
                            <p className="text-base sm:text-lg text-foreground/85 leading-relaxed [text-wrap:pretty]">{band.how}</p>

                            <div className="bg-muted/40 p-6 rounded-2xl">
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed [text-wrap:pretty]">
                                    <strong className="text-foreground/80">Por quÃ© funciona:</strong> {band.why}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• 4. EL TALLER DE 5 SESIONES (LISTA VERTICAL LIMPIA) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="bg-card border rounded-[2rem] p-8 md:p-10 shadow-sm space-y-6 text-left">
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        Tu camino de entrenamiento
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        Las 5 sesiones del taller aplicadas a tu caso
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Marcamos cuÃ¡l de las 5 sesiones es la mÃ¡s importante para ti segÃºn tus respuestas de hoy:
                    </p>
                </div>

                <div className="divide-y border-t border-b">
                    {workshopSessions.map((s) => {
                        const isTop = s.num === topWorkshopSession.num;
                        return (
                            <div
                                key={s.num}
                                className={cn(
                                    "py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors",
                                    isTop && "bg-primary/[0.05] dark:bg-primary/10 -mx-4 px-5 rounded-2xl ring-1 ring-primary/20 my-1.5"
                                )}
                            >
                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-base text-foreground">
                                            {s.title}: <span className="text-primary">{s.subtitle}</span>
                                        </span>
                                        {isTop && (
                                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                                                â˜… Tu mayor prioridad hoy
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {s.why}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Conector 3 (LÃ­nea sutil sin rebote constante) */}
            <div className="flex flex-col items-center py-1" aria-hidden="true">
                <div
                    className="w-[2px] h-10 rounded-full"
                    style={{ background: `linear-gradient(to bottom, transparent, ${gapZone.colorHex}35)` }}
                />
                <ChevronDown
                    className="h-5 w-5 mt-1 opacity-40"
                    strokeWidth={2.5}
                    style={{ color: gapZone.colorHex }}
                />
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• 5. WHATSAPP CTA (ESTILO BASE-PSS) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="bg-foreground text-background rounded-[2rem] p-8 md:p-10 shadow-xl text-left relative overflow-hidden">
                <div
                    className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20 pointer-events-none blur-2xl"
                    style={{ background: gapZone.colorHex }}
                />

                <div className="relative z-10 space-y-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-background/70 mb-3 font-semibold">
                            El siguiente paso
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black leading-tight">
                            Â¿Te gustarÃ­a sentirte en paz y aprender, de una vez por todas, a controlar el estrÃ©s?
                        </h3>
                        <p className="text-background/80 mt-3 text-base md:text-lg leading-relaxed">
                            En el taller prÃ¡ctico de 5 sesiones empezaremos fortaleciendo tu prioridad #1 (<strong>{topWorkshopSession.title}</strong>) para que recuperes tu energÃ­a y tu tranquilidad.
                        </p>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 h-14 px-8 text-lg font-bold rounded-xl text-black shadow-lg bg-[#25D366] hover:bg-[#20b858] transition-all hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-emerald-400/80 focus-visible:outline-none"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        InformaciÃ³n del taller
                    </a>

                    <p className="text-xs text-background/70 font-medium">
                        Te respondemos por WhatsApp. Sin compromiso.
                    </p>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• WARNING (Riesgo de Burnout / Desbalance) â•â•â•â•â• */}
            {gapZone.key === "riesgo-burnout" && (
                <div className="border border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 rounded-2xl p-6 text-sm text-rose-800 dark:text-rose-300/90 leading-relaxed flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <strong>Un apunte importante.</strong> Este test no es un diagnÃ³stico clÃ­nico. Si el malestar te afecta a diario, si llevas semanas durmiendo mal o si has dejado de disfrutar cosas que antes disfrutabas, hablar con un profesional de salud mental es la mejor decisiÃ³n que puedes tomar.
                    </div>
                </div>
            )}

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• ACCIONES SECUNDARIAS Y RETAKE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySummary}
                    className="min-h-[44px] px-4 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-4 w-4 text-emerald-600" />
                            Â¡Resumen copiado!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar resumen
                        </>
                    )}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.print()}
                    className="min-h-[44px] px-4 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetake}
                    className="min-h-[44px] px-4 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a hacer el test
                </Button>
            </div>
        </div>
    );
};

export const QuizResultV1 = QuizResult;
export default QuizResult;
