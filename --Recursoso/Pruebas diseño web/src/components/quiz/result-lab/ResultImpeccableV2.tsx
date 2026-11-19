"use client";

/* Variante 1b · Impeccable v2 (código pegado por el usuario, resultado guiado en 5 pasos)
   Adaptaciones mínimas para que corra con los datos actuales:
   - dominantChannelShort y dominantChannelId ya no existen en getStressProfile: se calculan acá.
   - El termómetro usaba la escala vieja (−100 a 100); ahora mapea 0–100 por cuartos.
   - La zona "sobrecarga-cronica" ya no existe: el aviso de apoyo usa "riesgo-burnout".
   - En el laboratorio NO se guarda en Supabase. */

import { useState, useEffect, useRef, useCallback } from "react";
import { getStressProfile, WEAR_GAP_ZONES, type DimensionId } from "../quizData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, Copy, Check, Printer, AlertTriangle, Target, Flame, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSIONES, WHATSAPP_NUMBER } from "@/content/taller";


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

const STEPS = ["Tu resultado", "Tu día a día", "Tus 6 áreas", "Hacé esto hoy", "Tu siguiente paso"] as const;

const stripNumber = (title: string) => title.replace(/^\d+\.\s*/, "");

/** Adaptado a la escala actual 0–100: cada zona ocupa un cuarto visual de la barra */
const thermometerPercent = (gap: number) => {
    const map = (value: number, min: number, max: number, from: number, to: number) => {
        const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return from + t * (to - from);
    };
    if (gap <= 25) return map(gap, 0, 25, 4, 23);
    if (gap <= 50) return map(gap, 26, 50, 27, 48);
    if (gap <= 75) return map(gap, 51, 75, 52, 73);
    return map(gap, 76, 100, 77, 96);
};

/* El nombre corto de cada canal de estrés: "Tu Mente", "Tus Emociones"… */
const CHANNEL_SHORT = Object.fromEntries(
    DIMENSIONES.filter((d) => d.channel).map((d) => [d.id, d.channel!.name.replace(" y Límites", "")])
) as Record<string, string>;

const QuizResultV2 = ({ answers, onRetake, userName }: QuizResultProps) => {
    const profile = getStressProfile(answers);
    const {
        loadIndex,
        wearGap,
        gapZone,
        loadLevelLabel,
        regLevelLabel,
        band,
        dimScores,
        dimensionsDetail,
        dailyMirror,
        futureCost,
        activeMirrorAlerts,
        workshopSessions,
        topWorkshopSession,
    } = profile;

    // Canal dominante (antes venía de getStressProfile)
    const dominantChannelId = (["dim1", "dim2", "dim3", "dim4"] as DimensionId[]).sort(
        (a, b) => dimScores[b] - dimScores[a]
    )[0];
    const dominantChannelShort = CHANNEL_SHORT[dominantChannelId];

    const [step, setStep] = useState(0);
    const [copied, setCopied] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);
    const isLastStep = step === STEPS.length - 1;

    const goTo = useCallback((next: number) => {
        const clamped = Math.max(0, Math.min(STEPS.length - 1, next));
        setStep(clamped);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (e.key === "ArrowRight") goTo(step + 1);
            else if (e.key === "ArrowLeft") goTo(step - 1);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [step, goTo]);

    const [displayedGap, setDisplayedGap] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1100;
        const start = performance.now();
        const animate = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 4);
            setDisplayedGap(Math.round(ease * wearGap));
            if (t < 1) requestAnimationFrame(animate);
        };
        setTimeout(() => requestAnimationFrame(animate), 200);
    }, [wearGap]);

    /* (En el laboratorio no se guarda en Supabase) */

    const markerPercent = thermometerPercent(displayedGap);
    const dominantDim = dimensionsDetail.find((d) => d.id === dominantChannelId);
    const loadDimensions = dimensionsDetail.filter((d) => d.part === "A");
    const regDimensions = dimensionsDetail.filter((d) => d.part === "B");
    const otherSessions = workshopSessions.filter((s) => s.num !== topWorkshopSession.num);
    const showSupportNote = gapZone.key === "riesgo-burnout";

    const handleCopySummary = () => {
        const participant = userName?.trim() || "Participante";
        let summary = `MI RESULTADO DEL TEST DE ESTRÉS\n`;
        summary += `Participante: ${participant}\n\n`;
        summary += `Tu resultado: ${band.name}\n`;
        summary += `${band.message}\n\n`;
        summary += `• Tu nivel de desgaste: ${gapZone.title}\n`;
        summary += `• Lo que te desgasta: ${loadLevelLabel}\n`;
        summary += `• Tu capacidad de recuperarte: ${regLevelLabel}\n`;
        summary += `• Dónde más se nota: ${dominantChannelShort}\n`;
        summary += `• Tu primer paso hoy: ${band.skill}\n`;
        summary += `• Tu sesión clave en el taller: ${topWorkshopSession.title} (${topWorkshopSession.subtitle})\n\n`;
        summary += `Cómo se ve en tu día a día:\n"${dailyMirror.narrative}"\n`;

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

    const whatsappMessage = userName
        ? `Hola, soy ${userName}. Hice el test de estrés, me salió "${band.name}" y mi sesión clave es la ${topWorkshopSession.title}. Me gustaría recibir información del taller.`
        : `Hola, hice el test de estrés, me salió "${band.name}" y mi sesión clave es la ${topWorkshopSession.title}. Me gustaría recibir información del taller.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    const stepClass = (i: number) =>
        cn(step === i ? "block animate-in fade-in slide-in-from-bottom-2 duration-500" : "hidden", "print:block print:mb-10");

    return (
        <div ref={topRef} className="w-full max-w-2xl mx-auto px-4 pb-8 scroll-mt-6">
            <nav aria-label="Pasos del resultado" className="mb-8 print:hidden">
                <div className="flex gap-1.5">
                    {STEPS.map((label, i) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Paso ${i + 1}: ${label}`}
                            aria-current={step === i ? "step" : undefined}
                            className="flex-1 py-2 group"
                        >
                            <span
                                className={cn(
                                    "block h-1.5 rounded-full transition-colors duration-300",
                                    i <= step ? "" : "bg-muted group-hover:bg-muted-foreground/30"
                                )}
                                style={i <= step ? { backgroundColor: gapZone.colorHex } : undefined}
                            />
                        </button>
                    ))}
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                    Paso {step + 1} de {STEPS.length} · {STEPS[step]}
                </p>
            </nav>

            {/* PASO 1 · TU RESULTADO */}
            <section className={stepClass(0)}>
                <div className="relative text-center">
                    <div
                        className="absolute left-1/2 top-16 -translate-x-1/2 w-[320px] h-[320px] rounded-full pointer-events-none opacity-20 blur-3xl print:hidden"
                        style={{ background: gapZone.colorHex }}
                    />
                    <div className="relative z-10 flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {userName ? (
                                <>
                                    <span className="text-foreground">{userName}</span>, tu resultado es
                                </>
                            ) : (
                                "Tu resultado es"
                            )}
                        </p>
                        <h1
                            className={cn(
                                "mt-3 text-4xl sm:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r",
                                gapZone.gradient
                            )}
                        >
                            {band.name}
                        </h1>
                        <p className="mt-4 text-lg sm:text-xl text-foreground/85 leading-relaxed font-medium">
                            {band.message}
                        </p>

                        <div className="w-full mt-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Tu nivel de desgaste hoy
                            </p>
                            <div className="relative pt-10 pb-1">
                                <div
                                    className="absolute top-0 -translate-x-1/2 z-30 flex flex-col items-center transition-all duration-500 ease-out"
                                    style={{ left: `${markerPercent}%` }}
                                >
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm whitespace-nowrap"
                                        style={{ backgroundColor: gapZone.colorHex }}
                                    >
                                        Estás aquí
                                    </span>
                                    <span
                                        className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent"
                                        style={{ borderTopColor: gapZone.colorHex }}
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-1.5 h-3.5 w-full">
                                    {WEAR_GAP_ZONES.map((z, i) => (
                                        <div
                                            key={z.key}
                                            className={cn(
                                                "h-full",
                                                i === 0 && "rounded-l-full",
                                                i === WEAR_GAP_ZONES.length - 1 && "rounded-r-full"
                                            )}
                                            style={{ backgroundColor: z.colorHex, opacity: z.key === gapZone.key ? 1 : 0.35 }}
                                        />
                                    ))}
                                </div>
                                <div
                                    className="absolute top-[33px] -translate-x-1/2 z-20 w-6 h-6 rounded-full bg-white border-[3.5px] shadow-md transition-all duration-500 ease-out"
                                    style={{ left: `${markerPercent}%`, borderColor: gapZone.colorHex }}
                                />
                                <div className="grid grid-cols-4 gap-1.5 mt-3.5 text-center">
                                    {WEAR_GAP_ZONES.map((z) => (
                                        <span
                                            key={z.key}
                                            className={cn(
                                                "text-xs leading-tight",
                                                z.key === gapZone.key ? "font-extrabold text-foreground" : "font-medium text-muted-foreground/70"
                                            )}
                                        >
                                            {z.shortLabel}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 w-full text-left bg-card border rounded-2xl p-5 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                {loadIndex >= 30 ? "Dónde más se nota" : "Lo que más conviene vigilar"}
                            </p>
                            <p className="mt-1 text-lg font-bold text-foreground">
                                En {dominantChannelShort.toLowerCase()}
                            </p>
                            {dominantDim && (
                                <p className="text-sm text-muted-foreground">{dominantDim.subtitle}</p>
                            )}
                        </div>

                        {showSupportNote && (
                            <div className="mt-4 w-full text-left border border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 rounded-2xl p-4 text-sm text-rose-900 dark:text-rose-200 leading-relaxed flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                                <p>
                                    <strong>Importante:</strong> este test no es un diagnóstico clínico. Si el malestar te afecta a diario, si llevás semanas durmiendo mal o si dejaste de disfrutar cosas que antes disfrutabas, hablar con un profesional de salud mental es la mejor decisión que podés tomar.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* PASO 2 · TU DÍA A DÍA */}
            <section className={stepClass(1)}>
                <StepHeading kicker="Tu día a día" title="Así se ve esto en tu rutina" />
                <p className="text-xl text-foreground leading-relaxed font-medium">{dailyMirror.narrative}</p>

                {dailyMirror.topSymptoms.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">Lo que más marcaste:</p>
                        <ul className="space-y-2">
                            {dailyMirror.topSymptoms.map((symptom) => (
                                <li key={symptom} className="flex items-start gap-3 text-base bg-card border rounded-xl px-4 py-3">
                                    <span className="mt-2 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: gapZone.colorHex }} />
                                    {symptom}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeMirrorAlerts.length > 0 && (
                    <div className="mt-6 text-base text-amber-950 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 leading-relaxed space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                            Algo que quizá no estás notando
                        </p>
                        {activeMirrorAlerts.map((alert) => (
                            <p key={alert.id}>
                                <strong>{alert.title}.</strong> {alert.activeDesc}
                            </p>
                        ))}
                    </div>
                )}

                <div className="mt-8 grid gap-5 sm:grid-cols-2 border-t pt-6">
                    {band.ledePoints.slice(1).map((point) => (
                        <div key={point.label} className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: gapZone.colorHex }}>
                                {point.label}
                            </p>
                            <p className="text-base text-muted-foreground leading-relaxed">{point.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PASO 3 · TUS 6 ÁREAS */}
            <section className={stepClass(2)}>
                <StepHeading
                    kicker="Tus 6 áreas"
                    title="Lo que te desgasta y lo que te recupera"
                    lead="Así quedó cada área según tus respuestas."
                />
                <div className="space-y-10">
                    <AreaGroup
                        title="Lo que te desgasta"
                        hint="Menos es mejor"
                        tone="load"
                        items={loadDimensions.map((d) => ({
                            id: d.id,
                            title: stripNumber(d.title),
                            subtitle: d.subtitle,
                            score: d.score,
                            label: d.interpretation,
                        }))}
                    />
                    <AreaGroup
                        title="Lo que te recupera"
                        hint="Más es mejor"
                        tone="recovery"
                        items={regDimensions.map((d) => ({
                            id: d.id,
                            title: stripNumber(d.title),
                            subtitle: d.subtitle,
                            score: d.score,
                            label: d.interpretation,
                        }))}
                    />
                </div>
            </section>

            {/* PASO 4 · HACÉ ESTO HOY */}
            <section className={stepClass(3)}>
                <StepHeading kicker="Hacé esto hoy" title={band.skill} gradient={gapZone.gradient} />
                <div
                    className="bg-card border-2 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5"
                    style={{ borderColor: `${gapZone.colorHex}55` }}
                >
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                        <BookOpen className="h-4 w-4" /> Cómo hacerlo
                    </p>
                    <p className="text-lg text-foreground/90 leading-relaxed">{band.how}</p>
                    <p className="text-base text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-4">
                        <strong className="text-foreground/80">Por qué funciona:</strong> {band.why}
                    </p>
                </div>

                <div className="mt-6 rounded-2xl border p-5 space-y-1.5">
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600">
                        <Flame className="h-4 w-4" /> ¿Qué pasa si lo dejás pasar?
                    </p>
                    <p className="text-base font-bold text-foreground">{futureCost.title}</p>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{futureCost.description}</p>
                </div>
            </section>

            {/* PASO 5 · TU SIGUIENTE PASO */}
            <section className={stepClass(4)}>
                <StepHeading
                    kicker="Tu siguiente paso"
                    title={`${userName ? `${userName}, ¿querés` : "¿Querés"} aprender a manejar el estrés de una vez por todas?`}
                />

                <div className="p-5 sm:p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 space-y-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                        <Target className="h-3.5 w-3.5" /> Tu sesión clave en el taller
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-foreground pt-1">
                        {topWorkshopSession.title}: <span className="text-primary">{topWorkshopSession.subtitle}</span>
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">{topWorkshopSession.why}</p>
                </div>

                <div className="mt-5 space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">El taller completo son 5 sesiones prácticas:</p>
                    <ul className="divide-y border-y">
                        {otherSessions.map((s) => (
                            <li key={s.num} className="py-2.5 text-base">
                                <span className="font-bold text-foreground">{s.title}:</span>{" "}
                                <span className="text-muted-foreground">{s.subtitle}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 space-y-3 print:hidden">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-3 h-14 px-8 text-lg font-bold rounded-xl text-black shadow-lg bg-[#25D366] hover:bg-[#20b858] transition-all hover:scale-[1.01]"
                    >
                        <WhatsAppIcon className="h-6 w-6" />
                        Quiero información del taller
                    </a>
                    <p className="text-sm text-muted-foreground text-center">
                        El mensaje ya lleva tu resultado. Sin compromiso.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 print:hidden">
                    <Button variant="ghost" size="sm" onClick={handleCopySummary} className="text-muted-foreground hover:text-foreground">
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4 text-emerald-600" /> ¡Resumen copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" /> Copiar resumen
                            </>
                        )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.print()} className="text-muted-foreground hover:text-foreground">
                        <Printer className="mr-2 h-4 w-4" /> Imprimir o guardar PDF
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onRetake} className="text-muted-foreground hover:text-foreground">
                        <RotateCcw className="mr-2 h-4 w-4" /> Volver a hacer el test
                    </Button>
                </div>
            </section>

            {!isLastStep && (
                <div className="sticky bottom-0 z-40 -mx-4 mt-10 px-4 py-3 bg-background/95 backdrop-blur border-t sm:static sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-0 sm:border-0 print:hidden">
                    <div className="flex items-center gap-3">
                        {step > 0 && (
                            <Button variant="outline" size="lg" onClick={() => goTo(step - 1)} className="h-12 rounded-xl" aria-label="Paso anterior">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <Button
                            size="lg"
                            onClick={() => goTo(step + 1)}
                            className="flex-1 h-12 rounded-xl text-base font-bold"
                        >
                            Siguiente: {STEPS[step + 1]}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
            {isLastStep && (
                <div className="mt-6 flex justify-center print:hidden">
                    <Button variant="ghost" size="sm" onClick={() => goTo(step - 1)} className="text-muted-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Paso anterior
                    </Button>
                </div>
            )}
        </div>
    );
};

const StepHeading = ({ kicker, title, lead, gradient }: { kicker: string; title: string; lead?: string; gradient?: string }) => (
    <div className="mb-6 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{kicker}</p>
        <h2
            className={cn(
                "text-3xl sm:text-4xl font-black tracking-tight leading-tight",
                gradient ? cn("bg-clip-text text-transparent bg-gradient-to-r", gradient) : "text-foreground"
            )}
        >
            {title}
        </h2>
        {lead && <p className="text-base text-muted-foreground">{lead}</p>}
    </div>
);

interface AreaGroupProps {
    title: string;
    hint: string;
    tone: "load" | "recovery";
    items: { id: string; title: string; subtitle: string; score: number; label: string }[];
}

const AreaGroup = ({ title, hint, tone, items }: AreaGroupProps) => {
    const isLoad = tone === "load";
    return (
        <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-2 border-b pb-2">
                <p className={cn("text-sm font-bold uppercase tracking-wider", isLoad ? "text-rose-600" : "text-emerald-700")}>
                    {title}
                </p>
                <p className="text-xs font-medium text-muted-foreground">{hint}</p>
            </div>
            <ul className="space-y-5">
                {items.map((item) => (
                    <li key={item.id} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="font-semibold text-foreground">{item.title}</span>
                            <span className={cn("text-sm font-bold shrink-0", isLoad ? "text-rose-700" : "text-emerald-700")}>
                                {item.label}
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden" title={`${item.score}%`}>
                            <div
                                className={cn("h-full rounded-full transition-all duration-700", isLoad ? "bg-rose-500" : "bg-emerald-500")}
                                style={{ width: `${Math.max(item.score, 3)}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">{item.subtitle}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizResultV2;
