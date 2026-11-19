"use client";

import { useState, type CSSProperties } from "react";
import {
    Activity,
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    Check,
    Clock3,
    LockKeyhole,
    RotateCcw,
    Target,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Datos de la escala PSS-10
const QUESTIONS = [
    "¿Con qué frecuencia has estado afectado por algo que ocurrió inesperadamente?",
    "¿Con qué frecuencia has sentido que no podías controlar las cosas importantes en tu vida?",
    "¿Con qué frecuencia te has sentido nervioso y con estrés?",
    "¿Con qué frecuencia has manejado con éxito las molestias cotidianas?",
    "¿Con qué frecuencia has sentido que afrontabas eficazmente los cambios importantes?",
    "¿Con qué frecuencia has estado seguro sobre tu capacidad para manejar tus problemas personales?",
    "¿Con qué frecuencia has sentido que las cosas iban como tú querías?",
    "¿Con qué frecuencia has encontrado que no podías afrontar todas las cosas que tenías que hacer?",
    "¿Con qué frecuencia has podido controlar las dificultades de tu vida?",
    "¿Con qué frecuencia has sentido que tenías el control de las cosas?",
];

const OPTIONS = [
    "Nunca",
    "Casi nunca",
    "De vez en cuando",
    "A menudo",
    "Muy a menudo",
];

const ZONE_VAR = [
    "hsl(150, 70%, 40%)", // Estrés bajo (verde)
    "hsl(38, 92%, 50%)",  // Estrés moderado (ámbar)
    "hsl(0, 84%, 60%)",   // Estrés alto (rojo coral)
];

const ZONE_TEXT = [
    "text-emerald-600 dark:text-emerald-400",
    "text-amber-600 dark:text-amber-400",
    "text-rose-600 dark:text-rose-400",
];

function result(score: number) {
    const pct = score / (QUESTIONS.length * 4);
    if (pct < 0.34) {
        return {
            level: "Estrés bajo",
            text: "Manejas bien la presión. Sigue cuidando tus hábitos de descanso, movimiento y conexión social.",
            tips: [
                "Mantén tus rutinas de descanso y recuperación diaria",
                "Sigue haciendo actividades recreativas que disfrutas",
                "Practica la gratitud o reflexión serena a diario",
            ],
        };
    }
    if (pct < 0.67) {
        return {
            level: "Estrés moderado",
            text: "Hay señales de tensión que conviene atender antes de que crezcan.",
            tips: [
                "Respira 4-7-8 durante 3 minutos en pausas laborales",
                "Pon límites a tu jornada de trabajo y pantallas",
                "Muévete o camina al menos 20 minutos diarios",
            ],
        };
    }
    return {
        level: "Estrés alto",
        text: "Tu cuerpo y mente están bajo mucha carga. Prioriza tu bienestar y considera hablar con un profesional.",
        tips: [
            "Busca apoyo de un profesional o terapeuta",
            "Reduce y delega compromisos no esenciales de inmediato",
            "Habla con alguien cercano de confianza hoy mismo",
        ],
    };
}

// Subcomponente: ScoreRing (Tacómetro / Donut circular)
function ScoreRing({ score, max, zone }: { score: number; max: number; zone: number }) {
    const radius = 60;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(score / max, 0.05), 1);
    const strokeDashoffset = circumference - progress * circumference;

    const ringColor =
        zone === 0
            ? "stroke-emerald-500"
            : zone === 1
            ? "stroke-amber-500"
            : "stroke-rose-500";

    return (
        <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/40"
                />
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${ringColor} transition-all duration-700 ease-out`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-4xl font-bold tracking-tight text-foreground tabular-nums">
                    {score}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    de {max} pts
                </span>
            </div>
        </div>
    );
}

// Subcomponente: Distribución de respuestas
function AnswerDistribution({ answers }: { answers: number[] }) {
    const counts = [0, 1, 2, 3, 4].map((val) => answers.filter((a) => a === val).length);
    const maxCount = Math.max(...counts, 1);

    return (
        <div className="space-y-3 pt-2">
            {OPTIONS.map((opt, idx) => {
                const count = counts[idx];
                const pct = (count / (answers.length || 1)) * 100;
                return (
                    <div key={opt} className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{opt}</span>
                            <span className="font-semibold text-foreground tabular-nums">
                                {count} ({Math.round(pct)}%)
                            </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary/80 rounded-full transition-all duration-500"
                                style={{ width: `${(count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Subcomponente: Señales que destacan (preguntas con mayor puntuación)
function StressAreas({ answers }: { answers: number[] }) {
    const indexed = answers.map((val, idx) => ({ idx, val, text: QUESTIONS[idx] }));
    const high = indexed
        .filter((i) => i.val >= 2)
        .sort((a, b) => b.val - a.val)
        .slice(0, 3);

    if (high.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic py-4">
                No se detectaron picos de estrés significativo en las respuestas seleccionadas.
            </p>
        );
    }

    return (
        <div className="space-y-3 pt-2">
            {high.map((item) => (
                <div key={item.idx} className="p-3 bg-muted/30 rounded-lg border border-border/60 text-left">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-primary">Ítem #{item.idx + 1}</span>
                        <span className="text-xs font-bold text-rose-500">
                            Nivel {item.val} / 4
                        </span>
                    </div>
                    <p className="text-sm text-foreground [text-wrap:pretty] leading-snug">
                        {item.text}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function PreviewPss() {
    // Estado de navegación
    const [step, setStep] = useState<number>(-1);
    const [answers, setAnswers] = useState<number[]>([3, 2, 3, 1, 2, 2, 1, 3, 2, 3]); // Respuestas muestra

    const done = step >= QUESTIONS.length;
    const score = answers.reduce((a, b) => a + b, 0);
    const max = QUESTIONS.length * 4;
    const zone = score / max < 0.34 ? 0 : score / max < 0.67 ? 1 : 2;
    const r = result(score);

    const choose = (value: number) => {
        const next = [...answers];
        next[step] = value;
        setAnswers(next);
    };

    const restart = () => {
        setAnswers([]);
        setStep(-1);
    };

    const advance = () => {
        setStep(step + 1);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Atajos de previsualización para saltar entre estados
    const jumpToHero = () => setStep(-1);
    const jumpToQuiz = () => setStep(0);
    const jumpToResults = () => setStep(10);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Barra superior de depuración / navegación de preview */}
            <aside aria-label="Controles de previsualización" className="bg-muted/70 border-b border-border text-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="font-bold flex items-center gap-1.5 text-foreground">
                        <Sparkles size={14} className="text-primary" /> Preview Modelo Base PSS-10
                    </span>
                    <span className="text-muted-foreground hidden sm:inline">| Escala PSS-10 validada</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground mr-1">Saltar a:</span>
                    <Button
                        size="sm"
                        variant={step === -1 ? "default" : "outline"}
                        onClick={jumpToHero}
                        className="h-7 text-xs px-2.5"
                    >
                        1. Portada
                    </Button>
                    <Button
                        size="sm"
                        variant={step >= 0 && !done ? "default" : "outline"}
                        onClick={jumpToQuiz}
                        className="h-7 text-xs px-2.5"
                    >
                        2. Preguntas
                    </Button>
                    <Button
                        size="sm"
                        variant={done ? "default" : "outline"}
                        onClick={jumpToResults}
                        className="h-7 text-xs px-2.5"
                    >
                        3. Resultados
                    </Button>
                </div>
            </aside>

            {/* Header del diseño original */}
            <header className="border-b border-border bg-card/60 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                            <Activity size={21} />
                        </span>
                        <span className="font-display font-semibold text-sm sm:text-base leading-tight">
                            Evaluación de estrés
                            <span className="block text-xs font-sans font-normal text-muted-foreground">
                                Evaluación y autoconocimiento
                            </span>
                        </span>
                    </div>
                    <span className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                        <LockKeyhole size={14} /> Sin registro
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 sm:px-8 pb-16">
                {/* 1. ESTADO DE ENTRADA / PORTADA (step === -1) */}
                {step === -1 && (
                    <section className="entry py-9 sm:py-14 max-w-3xl">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" /> UNA PAUSA PARA ENTENDERTE
                        </div>
                        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-5 tracking-tight text-foreground">
                            Evaluación de estrés<span className="text-primary">.</span>
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground [text-wrap:pretty]">
                            No todo el estrés se nota igual. Pon en perspectiva lo que estás sintiendo y descubre qué merece tu atención.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-5 text-sm text-foreground font-medium">
                            <span className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                                <Clock3 size={16} className="text-primary" /> 2 minutos
                            </span>
                            <span className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                                <Activity size={16} className="text-primary" /> 10 preguntas
                            </span>
                        </div>
                        <Button
                            onClick={() => setStep(0)}
                            className="mt-8 h-14 w-full sm:w-auto sm:min-w-64 justify-between px-6 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            Comenzar evaluación <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="mt-3 text-xs text-muted-foreground">
                            Privado: tus respuestas no se guardan en ningún servidor.
                        </p>

                        {/* Tarjeta Instrument Grid con Gráfico de Onda Osciloscopio */}
                        <div className="mt-10 sm:mt-12 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                            <div className="grid sm:grid-cols-[1fr_1.1fr] items-center gap-6 p-6 sm:p-9">
                                <div>
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                        DE LA SENSACIÓN A LA PERSPECTIVA
                                    </span>
                                    <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3 leading-tight text-white">
                                        Menos ruido.<br />Más claridad.
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-400 max-w-xs leading-relaxed">
                                        Observa tu carga, identifica las señales y encuentra un punto de partida para recuperar tu balance.
                                    </p>
                                </div>
                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                                    <svg
                                        viewBox="0 0 480 150"
                                        className="w-full h-32 sm:h-36"
                                        role="img"
                                        aria-label="Ilustración de una señal irregular que se transforma en un patrón claro"
                                    >
                                        {/* Onda caótica / ruidosa */}
                                        <path
                                            d="M0 85 L12 70 L24 92 L36 36 L48 111 L60 62 L72 83 L84 24 L96 123 L108 54 L120 90 L132 45 L144 113 L156 61 L168 92 L180 47 L192 104 L204 66 L216 86 L228 59 L240 93 L252 71 L264 82"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-slate-600"
                                        />
                                        {/* Onda estabilizada / pulso claro */}
                                        <path
                                            d="M264 82 L280 82 L290 72 L300 82 L316 82 L330 50 L340 104 L350 72 L360 82 L387 82 L400 50 L410 104 L420 72 L430 82 L480 82"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3.5"
                                            className="text-emerald-400"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pasos 01, 02, 03 */}
                        <div className="grid sm:grid-cols-3 mt-10 border-t border-border pt-6 gap-6">
                            {[
                                ["01", "Observa tu último mes", "Responde desde tu experiencia, sin juzgarte."],
                                ["02", "Reconoce tus señales", "Mira tu puntuación y tus respuestas en contexto."],
                                ["03", "Elige tu siguiente paso", "Consulta recomendaciones según tu resultado."],
                            ].map(([n, t, d]) => (
                                <div key={n} className="py-2 sm:pr-4">
                                    <span className="text-xs font-bold text-primary font-mono">{n}</span>
                                    <h3 className="font-semibold text-foreground mt-2 text-base">{t}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{d}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                            Herramienta de autoconocimiento orientativa. No es un test clínico validado ni sustituye una evaluación profesional.
                        </p>
                    </section>
                )}

                {/* 2. ESTADO DE CUESTIONARIO (step >= 0 && !done) */}
                {step >= 0 && !done && (
                    <section className="max-w-2xl mx-auto py-8 sm:py-12">
                        <div className="flex items-center justify-between mb-4">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(step - 1)}
                                className="px-2 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1.5" />
                                {step === 0 ? "Inicio" : "Anterior"}
                            </Button>
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                                {String(step + 1).padStart(2, "0")}{" "}
                                <span className="text-muted-foreground font-normal">/ 10</span>
                            </span>
                        </div>

                        {/* Barra segmentada de progreso */}
                        <div className="flex gap-1.5 mb-8" aria-label={`Pregunta ${step + 1} de 10`}>
                            {QUESTIONS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                        i <= step ? "bg-primary" : "bg-muted"
                                    }`}
                                />
                            ))}
                        </div>

                        <div key={step} className="animate-in fade-in duration-300">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                PIENSA EN EL ÚLTIMO MES
                            </p>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3 mb-7 text-foreground [text-wrap:balance] leading-snug">
                                {QUESTIONS[step]}
                            </h2>

                            {/* Opciones */}
                            <div className="flex flex-col gap-3">
                                {OPTIONS.map((o, i) => {
                                    const selected = answers[step] === i;
                                    return (
                                        <button
                                            key={o}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => choose(i)}
                                            className={`h-16 w-full flex items-center justify-between px-5 text-base rounded-xl border text-left transition-all ${
                                                selected
                                                    ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                                                    : "bg-card border-border hover:bg-muted/40 text-foreground"
                                            }`}
                                        >
                                            <span className="flex gap-4 items-center">
                                                <span className="text-xs text-muted-foreground font-mono w-5">
                                                    0{i + 1}
                                                </span>
                                                <span>{o}</span>
                                            </span>
                                            <span
                                                className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                                    selected
                                                        ? "bg-primary border-primary text-primary-foreground"
                                                        : "border-border/80 bg-background"
                                                }`}
                                            >
                                                {selected && <Check size={14} className="stroke-[3]" />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                onClick={advance}
                                disabled={answers[step] === undefined}
                                className="w-full h-14 mt-7 justify-between px-6 text-base font-semibold shadow-md"
                            >
                                {step === QUESTIONS.length - 1 ? "Ver mis resultados" : "Continuar"}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <p className="mt-5 text-xs text-center text-muted-foreground">
                                No hay respuestas correctas ni incorrectas. Responde con tu primera impresión.
                            </p>
                        </div>
                    </section>
                )}

                {/* 3. ESTADO DE RESULTADOS (done) */}
                {done && (
                    <section className="py-8 sm:py-12 max-w-4xl mx-auto" style={{ "--zone": ZONE_VAR[zone] } as CSSProperties}>
                        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                            Tu estrés, en perspectiva.
                        </h1>
                        <p className="mt-3 text-lg text-muted-foreground">
                            Una lectura de cómo has vivido y gestionado el último mes.
                        </p>

                        {/* Hero Card del Resultado */}
                        <div className="relative mt-8 rounded-2xl bg-card border border-border shadow-md overflow-hidden p-6 sm:p-10">
                            {/* Marca de agua decorativa */}
                            <span
                                className="absolute right-4 bottom-0 text-[140px] font-extrabold text-muted/20 select-none pointer-events-none font-display leading-none"
                                aria-hidden="true"
                            >
                                {score}
                            </span>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
                                    <Check size={14} /> EVALUACIÓN COMPLETADA
                                </div>

                                <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
                                    {/* Donut ScoreRing */}
                                    <div className="w-48 mx-auto md:mx-0">
                                        <ScoreRing score={score} max={max} zone={zone} />
                                    </div>

                                    {/* Diagnóstico */}
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                            TU RESULTADO ORIENTATIVO
                                        </span>
                                        <h2 className={`font-display text-4xl sm:text-5xl font-bold mt-2 leading-none ${ZONE_TEXT[zone]}`}>
                                            {r.level}
                                        </h2>
                                        <p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground/90 max-w-lg">
                                            {r.text}
                                        </p>
                                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full bg-muted/60 text-muted-foreground border border-border/60">
                                            <Target size={15} className="text-primary" /> Una señal para observar, no una etiqueta fija.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gráficos de desglose: Distribución y Picos */}
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display text-xl font-bold text-foreground">Tus respuestas</h2>
                                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                                        10 ítems
                                    </span>
                                </div>
                                <AnswerDistribution answers={answers} />
                            </div>

                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                                    Señales que destacan
                                </h2>
                                <StressAreas answers={answers} />
                            </div>
                        </div>

                        {/* Puntos de acción / Recomendaciones */}
                        <div className="mt-10">
                            <div className="flex gap-2.5 items-center mb-5">
                                <ArrowDownRight className="text-primary w-6 h-6" />
                                <h2 className="font-display text-2xl font-bold text-foreground">
                                    Tu siguiente paso
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-5">
                                {r.tips.map((tip, i) => (
                                    <div
                                        key={tip}
                                        className="border border-border bg-card rounded-xl p-5 shadow-sm hover:border-primary/50 transition-colors"
                                    >
                                        <span className="font-mono text-primary font-bold text-sm">
                                            0{i + 1}
                                        </span>
                                        <p className="mt-3 font-medium text-foreground text-sm leading-relaxed">
                                            {tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer de acción y reinicio */}
                        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                                Este cuestionario no es un test clínico validado y no sustituye un diagnóstico profesional. Si el malestar persiste o afecta tu día a día, consulta con un profesional de la salud.
                            </p>
                            <Button
                                variant="outline"
                                onClick={restart}
                                className="h-12 px-5 font-semibold shrink-0 gap-2"
                            >
                                <RotateCcw size={16} /> Repetir evaluación
                            </Button>
                        </div>
                    </section>
                )}
            </main>

            <footer className="border-t border-border mt-12 bg-card/40">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex justify-between text-xs text-muted-foreground">
                    <span>Evaluación de estrés (PSS-10)</span>
                    <span>Un momento para ti.</span>
                </div>
            </footer>
        </div>
    );
}

