"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Check, Sparkles, Sliders, Activity, Zap, Layers, Flame, BatteryCharging, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { quizQuestions, SCALE_OPTIONS, type QuizQuestion as StressQuestion } from "@/components/quiz/quizData";

// Usamos las primeras 4 preguntas representativas para la prueba rápida
const SAMPLE_QUESTIONS: StressQuestion[] = quizQuestions.slice(0, 4);

export type VariantId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

interface VariantConfig {
    id: VariantId;
    group: "Básicas (1–5)" | "Sensoriales (6–10)" | "Satisfacción Premium (11–15) ★";
    name: string;
    badge: string;
    delayMs: number;
    frameBehavior: "Remonta todo (parpadeo)" | "Marco Fijo (sin parpadeo)";
    motionType: string;
    description: string;
    satisfactionHook: string;
}

const VARIANTS: VariantConfig[] = [
    // ── BLOQUE 1: BÁSICAS Y ESTRUCTURALES (1 AL 5) ──
    {
        id: 1,
        group: "Básicas (1–5)",
        name: "1. Actual Base",
        badge: "450ms · Original",
        delayMs: 450,
        frameBehavior: "Remonta todo (parpadeo)",
        motionType: "Zoom repetido de toda la tarjeta",
        description: "Comportamiento original: remonta la tarjeta entera en cada click (key en el wrapper exterior), haciendo parpadear el marco y la barra de progreso con 450ms de espera.",
        satisfactionHook: "Fiel a la versión inicial, pero acumula más de 8 segundos de espera inerte a lo largo de las 18 preguntas.",
    },
    {
        id: 2,
        group: "Básicas (1–5)",
        name: "2. Editorial Ágil",
        badge: "220ms · Recomendada",
        delayMs: 220,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Slide horizontal direccional",
        description: "Marco y barra fijos. Al responder, la pregunta avanza deslizándose 14px desde la derecha; al retroceder con 'Anterior', entra desde la izquierda.",
        satisfactionHook: "Sensación de paso de página natural, feedback táctil ágil y continuidad visual limpia.",
    },
    {
        id: 3,
        group: "Básicas (1–5)",
        name: "3. Fluidez Linear",
        badge: "260ms · Cascada",
        delayMs: 260,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Cascada Stagger (Linear / Typeform)",
        description: "Marco y barra fijos. Al cambiar de pregunta, los 6 botones caen en una micro-cascada escalonada (25ms entre cada uno) estilo Typeform / Linear.",
        satisfactionHook: "Sensación sumamente sofisticada y pulida; los elementos entran ordenados orgánicamente.",
    },
    {
        id: 4,
        group: "Básicas (1–5)",
        name: "4. Minimalismo Suizo",
        badge: "150ms · Foco Puro",
        delayMs: 150,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Fade puro (Suizo)",
        description: "Sin ningún movimiento espacial (ni zoom ni traslación). Solo una disolución limpia de opacidad de 150ms. Máxima velocidad de respuesta.",
        satisfactionHook: "Cero fatiga visual en pantallas móviles; ideal si se prioriza responder en el menor tiempo.",
    },
    {
        id: 5,
        group: "Básicas (1–5)",
        name: "5. Actual Optimizada",
        badge: "260ms · Marco Fijo",
        delayMs: 260,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Zoom interior sin parpadeo",
        description: "Tu animación actual pero corregida: el marco exterior y la barra de progreso NUNCA parpadean (se quedan fijos) y el delay se reduce a 260ms.",
        satisfactionHook: "Mantiene la identidad visual de la actual pero elimina el molesto parpadeo y la lentitud.",
    },

    // ── BLOQUE 2: SENSORIALES Y TÁCTILES (6 AL 10) ──
    {
        id: 6,
        group: "Sensoriales (6–10)",
        name: "6. Pulso Háptico & Slide",
        badge: "220ms · Resorte Háptico",
        delayMs: 220,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Micro-compresión física + Spring Check + Slide",
        description: "Al hacer click, el botón se comprime elásticamente (scale 0.97) simulando un switch físico y el checkmark entra con un resorte elástico natural.",
        satisfactionHook: "Recompensa física instantánea en cada pulsación que invita a seguir avanzando con ritmo.",
    },
    {
        id: 7,
        group: "Sensoriales (6–10)",
        name: "7. Linear Momentum & Foco",
        badge: "250ms · Aislamiento Visual",
        delayMs: 250,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Foco aislado + Cascada ultrarrápida 18ms",
        description: "Al presionar, los botones no elegidos se atenúan al 30% de opacidad para celebrar tu elección, y la nueva pregunta entra en cascada de alta velocidad.",
        satisfactionHook: "Confirma visualmente tu decisión con certeza absoluta antes de traer el nuevo set de opciones.",
    },
    {
        id: 8,
        group: "Sensoriales (6–10)",
        name: "8. Glow Biométrico & Reenfoque",
        badge: "240ms · Óptica Wearable",
        delayMs: 240,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Halo luminoso exterior + Reenfoque óptico",
        description: "Inspirado en Oura y Whoop: el botón emite un halo de luz sutil en el borde y la cifra se magnifica; la nueva pregunta emerge desde un micro-desenfoque óptico.",
        satisfactionHook: "Sensación de instrumento biomédico de alta tecnología y precisión clínica.",
    },
    {
        id: 9,
        group: "Sensoriales (6–10)",
        name: "9. Swiss Lift & Morfismo",
        badge: "180ms · Velocidad Pura",
        delayMs: 180,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Botones anclados + Salto vertical del enunciado",
        description: "Los 6 botones no viajan ni se desplazan: quedan fijos en su posición física; únicamente el enunciado superior asciende en un salto vertical suave.",
        satisfactionHook: "Sensación de que el software lee tu mente; elimina toda latencia de desplazamiento de las opciones.",
    },
    {
        id: 10,
        group: "Sensoriales (6–10)",
        name: "10. Liquid Fill (Tinta Líquida)",
        badge: "260ms · Llenado Progresivo",
        delayMs: 260,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Llenado horizontal de tinta líquida + Pop",
        description: "Al pulsar, una barra de tinta se llena horizontalmente de izquierda a derecha en 160ms. Al completarse, se activa el check y la barra superior salta.",
        satisfactionHook: "Genera anticipación y progreso tangible; visualiza físicamente el registro de tu respuesta.",
    },

    // ── BLOQUE 3: SATISFACCIÓN PREMIUM (11 AL 15) ──
    {
        id: 11,
        group: "Satisfacción Premium (11–15) ★",
        name: "11. Balanza Cinética & Flash",
        badge: "210ms · Inercia Analógica",
        delayMs: 210,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Hundimiento elástico + Flash de descompresión",
        description: "Inspirado en perillas analógicas y sintetizadores (Teenage Engineering): el botón se hunde físicamente (scale 0.95) y emite un micro-destello de descompresión al registrar el valor.",
        satisfactionHook: "Sensación táctil de masa y peso mecánico; cada click se siente firme, decisivo y satisfactorio como accionar un switch de alta precisión.",
    },
    {
        id: 12,
        group: "Satisfacción Premium (11–15) ★",
        name: "12. Sonar Ripple & Zen",
        badge: "230ms · Doble Onda Zen",
        delayMs: 230,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Onda concéntrica sonar + Absorción ambiental",
        description: "Inspirado en interfaces de biofeedback zen (Endel / Portal): al tocar, dos ondas concéntricas ultra finas y translúcidas se expanden hacia afuera disipándose en el espacio negativo.",
        satisfactionHook: "Transmite una paz absoluta; tu respuesta se siente acogida y absorbida por el sistema con extrema suavidad.",
    },
    {
        id: 13,
        group: "Satisfacción Premium (11–15) ★",
        name: "13. Destellos Stardust (Micro-Chispas)",
        badge: "220ms · Micro-Celebración",
        delayMs: 220,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Micro-partículas geométricas + Slide suntuoso",
        description: "Micro-celebraciones de Figma y Linear: al confirmar el click, 3 micro-partículas estelares brotan sutilmente del checkmark en un abanico de luz de 180ms.",
        satisfactionHook: "Disparo instantáneo de micro-dopamina; premia el avance del test con un toque lúdico refinado que nunca se siente infantil.",
    },
    {
        id: 14,
        group: "Satisfacción Premium (11–15) ★",
        name: "14. Notch Magnético (Apple Crown)",
        badge: "190ms · Ajuste Magnético",
        delayMs: 190,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Atracción magnética del badge + Muesca lateral",
        description: "Inspirado en la rueda háptica del Apple Watch: la pastilla del porcentaje salta magnéticamente hacia adentro encajando con una muesca táctil en 140ms.",
        satisfactionHook: "Simula dos piezas mecánicas encajando con imanes de neodimio; da una sensación de solidez y ensamblaje impecable.",
    },
    {
        id: 15,
        group: "Satisfacción Premium (11–15) ★",
        name: "15. Pulso Bio-Energético (Batería & Surge)",
        badge: "240ms · Pulso de Voltaje",
        delayMs: 240,
        frameBehavior: "Marco Fijo (sin parpadeo)",
        motionType: "Anillo de energía perimetral + Pulso en barra",
        description: "Directamente ligado a la metáfora del test: al seleccionar tu respuesta, un rayo de luz perimetral recorre el contorno del botón y la barra superior emite un pulso luminoso de recarga.",
        satisfactionHook: "Conecta visceralmente con la temática de registrar energía y recargar tu batería biológica.",
    },
];

export default function PreviewMotionPage() {
    const [activeVariantId, setActiveVariantId] = useState<VariantId>(11);
    const [activeTabGroup, setActiveTabGroup] = useState<"all" | "g1" | "g2" | "g3">("all");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedScore, setSelectedScore] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");
    const [answersHistory, setAnswersHistory] = useState<(number | null)[]>([null, null, null, null]);

    const activeVariant = VARIANTS.find((v) => v.id === activeVariantId) || VARIANTS[0];
    const currentQuestion = SAMPLE_QUESTIONS[currentIndex];
    const totalQuestions = SAMPLE_QUESTIONS.length;

    // Resetear selección al cambiar de variante o índice
    useEffect(() => {
        setSelectedScore(answersHistory[currentIndex]);
        setIsTransitioning(false);
    }, [currentIndex, activeVariantId]);

    const handleSelectOption = (value: number) => {
        if (isTransitioning) return;
        setSelectedScore(value);
        setIsTransitioning(true);

        const updated = [...answersHistory];
        updated[currentIndex] = value;
        setAnswersHistory(updated);

        setTimeout(() => {
            if (currentIndex < totalQuestions - 1) {
                setDirection("forward");
                setCurrentIndex((prev) => prev + 1);
            } else {
                setCurrentIndex(0);
            }
            setIsTransitioning(false);
        }, activeVariant.delayMs);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setDirection("backward");
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setSelectedScore(null);
        setAnswersHistory([null, null, null, null]);
        setIsTransitioning(false);
    };

    const filteredVariants = VARIANTS.filter((v) => {
        if (activeTabGroup === "g1") return v.id <= 5;
        if (activeTabGroup === "g2") return v.id >= 6 && v.id <= 10;
        if (activeTabGroup === "g3") return v.id >= 11;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#0f172a] py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ── HEADER DEL LABORATORIO ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Laboratorio de Animaciones (Impeccable Motion · 15 Variantes)
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground [text-wrap:balance]">
                            Matriz de las 15 Variantes de Transición
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1 max-w-2xl [text-wrap:pretty]">
                            Haz click en las opciones para evaluar la <strong>satisfacción táctil y visual</strong> sin perder la sobriedad premium en cada una.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/preview"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors shadow-xs"
                        >
                            <Activity className="w-3.5 h-3.5 text-primary" />
                            Ver Tacómetro
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Test real
                        </Link>
                    </div>
                </div>

                {/* ── SELECTOR Y FILTROS DE LAS 15 VARIANTES ── */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Pestañas de grupo */}
                        <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/80 text-xs font-bold flex-wrap gap-1">
                            <button
                                type="button"
                                onClick={() => setActiveTabGroup("all")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg transition-all",
                                    activeTabGroup === "all" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Todas (15)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTabGroup("g1")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg transition-all",
                                    activeTabGroup === "g1" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Bloque 1: Básicas (1–5)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTabGroup("g2")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg transition-all",
                                    activeTabGroup === "g2" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Bloque 2: Sensoriales (6–10)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTabGroup("g3")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg transition-all",
                                    activeTabGroup === "g3" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Bloque 3: Satisfacción Premium (11–15) ★
                            </button>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reiniciar simulación
                        </Button>
                    </div>

                    {/* Grid de botones de variantes (con números claros y badges) */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {filteredVariants.map((v) => {
                            const isSelected = v.id === activeVariantId;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveVariantId(v.id);
                                        handleReset();
                                    }}
                                    className={cn(
                                        "p-3 rounded-2xl border text-left transition-all min-h-[94px] flex flex-col justify-between relative",
                                        isSelected
                                            ? "bg-card border-primary ring-2 ring-primary/25 shadow-xs"
                                            : "bg-muted/30 border-transparent hover:bg-card/70 text-muted-foreground"
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-1">
                                            <span className={cn("text-xs font-bold truncate", isSelected ? "text-foreground" : "text-muted-foreground")}>
                                                {v.name}
                                            </span>
                                            {isSelected && (
                                                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-tight mt-1 line-clamp-2">
                                            {v.motionType}
                                        </p>
                                    </div>

                                    <span
                                        className={cn(
                                            "inline-block self-start text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-2 tabular-nums",
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {v.badge}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── TARJETA DE DIAGNÓSTICO EN TIEMPO REAL ── */}
                <div className="bg-card border rounded-2xl p-4 sm:p-5 text-sm space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-foreground text-base">
                                {activeVariant.name}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                                Delay: {activeVariant.delayMs} ms
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                                {activeVariant.group}
                            </span>
                        </div>
                        <span className={cn(
                            "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                            activeVariant.frameBehavior.includes("Fijo")
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        )}>
                            {activeVariant.frameBehavior}
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div>
                            <p className="text-muted-foreground font-medium">
                                <strong className="text-foreground">Mecánica visual:</strong> {activeVariant.description}
                            </p>
                        </div>
                        <div className="bg-primary/[0.04] p-2.5 rounded-xl border border-primary/15">
                            <p className="text-primary/90 font-medium">
                                <strong className="text-primary font-bold">Factor de satisfacción:</strong> {activeVariant.satisfactionHook}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════════════
                    ÁREA DE SIMULACIÓN INTERACTIVA DEL TEST
                    Renderiza el marco según la variante activa
                    ═════════════════════════════════════════════════════════════════ */}
                <div className="flex justify-center pt-2">
                    {/* VARIANTE 1: La actual monta la KEY en el wrapper EXTERIOR (haciendo parpadear marco y barra) */}
                    {activeVariantId === 1 && (
                        <div
                            key={currentIndex}
                            className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-300 space-y-7 text-center relative px-4"
                        >
                            <QuestionProgressBar
                                currentIndex={currentIndex}
                                totalQuestions={totalQuestions}
                                onBack={handleBack}
                                isEnergySurge={false}
                            />

                            <QuestionHeader question={currentQuestion} />

                            <QuestionOptionsList
                                selectedScore={selectedScore}
                                onSelect={handleSelectOption}
                                isTransitioning={isTransitioning}
                                variantId={1}
                            />
                        </div>
                    )}

                    {/* VARIANTES 2 A 15: Marco EXTERIOR FIJO (la barra y marco NUNCA parpadean) */}
                    {activeVariantId !== 1 && (
                        <div className="w-full max-w-xl space-y-7 text-center relative px-4">
                            {/* Barra de progreso fija que avanza con fluidez continua */}
                            <QuestionProgressBar
                                currentIndex={currentIndex}
                                totalQuestions={totalQuestions}
                                onBack={handleBack}
                                isEnergySurge={activeVariantId === 15 && isTransitioning}
                            />

                            {/* Contenido interno que cambia según la variante */}
                            <div className="relative">
                                {/* VARIANTE 2: Slide Horizontal Direccional */}
                                {activeVariantId === 2 && (
                                    <div
                                        key={currentIndex}
                                        className={cn(
                                            "animate-in fade-in duration-200 ease-out space-y-7",
                                            direction === "forward" ? "slide-in-from-right-5" : "slide-in-from-left-5"
                                        )}
                                    >
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={2}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 3: Fluidez Linear con Cascada Stagger */}
                                {activeVariantId === 3 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in duration-200">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={3}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 4: Minimalismo Suizo con Fade Puro */}
                                {activeVariantId === 4 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in duration-150">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={4}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 5: Actual Optimizada (Zoom interior sin parpadeo de marco) */}
                                {activeVariantId === 5 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in zoom-in-95 duration-250">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={5}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 6: Pulso Háptico & Slide Elástico */}
                                {activeVariantId === 6 && (
                                    <div
                                        key={currentIndex}
                                        className={cn(
                                            "animate-in fade-in duration-220 ease-out space-y-7",
                                            direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4"
                                        )}
                                    >
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={6}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 7: Linear Momentum & Foco Aislado */}
                                {activeVariantId === 7 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in duration-200">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={7}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 8: Glow Biométrico & Reenfoque Óptico */}
                                {activeVariantId === 8 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in duration-240 blur-[0.5px]">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={8}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 9: Swiss Lift (Botones anclados + Salto vertical del enunciado) */}
                                {activeVariantId === 9 && (
                                    <div key={currentIndex} className="space-y-7">
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-180">
                                            <QuestionHeader question={currentQuestion} />
                                        </div>
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={9}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 10: Liquid Fill (Llenado progresivo de tinta) */}
                                {activeVariantId === 10 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in duration-200">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={10}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 11: Balanza Cinética & Flash de Inercia */}
                                {activeVariantId === 11 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in zoom-in-95 duration-210 ease-out">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={11}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 12: Sonar Ripple & Zen */}
                                {activeVariantId === 12 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in duration-230">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={12}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 13: Destellos Stardust (Micro-Chispas) */}
                                {activeVariantId === 13 && (
                                    <div
                                        key={currentIndex}
                                        className={cn(
                                            "animate-in fade-in duration-220 ease-out space-y-7",
                                            direction === "forward" ? "slide-in-from-right-3" : "slide-in-from-left-3"
                                        )}
                                    >
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={13}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 14: Notch Magnético (Ajuste en muesca) */}
                                {activeVariantId === 14 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in slide-in-from-bottom-2 duration-190">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={14}
                                        />
                                    </div>
                                )}

                                {/* VARIANTE 15: Pulso Bio-Energético (Batería & Surge) */}
                                {activeVariantId === 15 && (
                                    <div key={currentIndex} className="space-y-7 animate-in fade-in zoom-in-98 duration-240">
                                        <QuestionHeader question={currentQuestion} />
                                        <QuestionOptionsList
                                            selectedScore={selectedScore}
                                            onSelect={handleSelectOption}
                                            isTransitioning={isTransitioning}
                                            variantId={15}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── TABLA COMPARATIVA DE LAS 15 VARIANTES AL PIE ── */}
                <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-xs">
                    <h3 className="font-extrabold text-foreground text-base">
                        Matriz de Comparación Técnica (Las 15 Variantes)
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-border/80 text-muted-foreground font-bold">
                                    <th className="py-2.5 pr-4">#</th>
                                    <th className="py-2.5 pr-4">Variante</th>
                                    <th className="py-2.5 px-4">Latencia</th>
                                    <th className="py-2.5 px-4">Marco Exterior</th>
                                    <th className="py-2.5 px-4">Efecto Visual</th>
                                    <th className="py-2.5 pl-4">Factor de Satisfacción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {VARIANTS.map((v) => (
                                    <tr
                                        key={v.id}
                                        className={cn(
                                            "transition-colors",
                                            v.id === activeVariantId ? "bg-primary/5 font-semibold" : "text-muted-foreground"
                                        )}
                                    >
                                        <td className="py-3 pr-2 font-mono font-bold text-foreground">
                                            {v.id}
                                        </td>
                                        <td className="py-3 pr-4 font-bold text-foreground">
                                            {v.name}
                                        </td>
                                        <td className="py-3 px-4 tabular-nums font-mono">
                                            {v.delayMs} ms
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[11px] font-bold",
                                                v.frameBehavior.includes("Fijo")
                                                    ? "bg-emerald-500/10 text-emerald-700"
                                                    : "bg-amber-500/10 text-amber-700"
                                            )}>
                                                {v.frameBehavior.includes("Fijo") ? "Fijo" : "Parpadea"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {v.motionType}
                                        </td>
                                        <td className="py-3 pl-4 text-foreground/90 text-xs">
                                            {v.satisfactionHook}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTES AUXILIARES DEL SANDBOX
   ───────────────────────────────────────────────────────────────────────────── */

function QuestionProgressBar({
    currentIndex,
    totalQuestions,
    onBack,
    isEnergySurge,
}: {
    currentIndex: number;
    totalQuestions: number;
    onBack: () => void;
    isEnergySurge?: boolean;
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                <button
                    onClick={onBack}
                    className="flex items-center hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] py-2 px-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    disabled={currentIndex === 0}
                    aria-label="Volver a la pregunta anterior"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Anterior
                </button>
                <span className="tabular-nums font-bold">
                    Pregunta {currentIndex + 1} de {totalQuestions}
                </span>
            </div>

            <div
                className="h-2 w-full rounded-full bg-secondary overflow-hidden"
                role="progressbar"
                aria-valuenow={currentIndex + 1}
                aria-valuemin={1}
                aria-valuemax={totalQuestions}
                aria-label="Progreso de la evaluación"
            >
                <div
                    className={cn(
                        "h-full rounded-full bg-primary transition-all duration-300 ease-out",
                        isEnergySurge && "shadow-[0_0_14px_rgba(37,99,235,0.9)] brightness-125"
                    )}
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
            </div>
        </div>
    );
}

function QuestionHeader({ question }: { question: StressQuestion }) {
    const isPartB = question.part === "B";
    return (
        <div className="space-y-3 pt-1 text-left sm:text-center">
            <p
                className={cn(
                    "text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300",
                    isPartB ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
                )}
            >
                Piensa en las últimas semanas
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug [text-wrap:balance]">
                {question.text}
            </h2>
        </div>
    );
}

function QuestionOptionsList({
    selectedScore,
    onSelect,
    isTransitioning,
    variantId,
}: {
    selectedScore: number | null;
    onSelect: (val: number) => void;
    isTransitioning: boolean;
    variantId: VariantId;
}) {
    return (
        <div className="grid gap-2.5 pt-2">
            {SCALE_OPTIONS.map((option, idx) => {
                const isSelected = selectedScore === option.value;
                const isOtherSelected = selectedScore !== null && !isSelected;

                // Estilos específicos para cada variante
                const staggerDelay =
                    variantId === 3
                        ? `${idx * 25}ms`
                        : variantId === 7
                        ? `${idx * 18}ms`
                        : undefined;

                const staggerStyle = staggerDelay
                    ? {
                          animationDelay: staggerDelay,
                          animationFillMode: "both" as const,
                      }
                    : undefined;

                return (
                    <button
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        style={staggerStyle}
                        className={cn(
                            "group relative flex items-center justify-between w-full min-h-[56px] rounded-xl border p-4 text-left shadow-2xs overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",

                            // Transiciones básicas
                            variantId !== 9 && "transition-all duration-200",
                            (variantId === 3 || variantId === 7) && "animate-in fade-in slide-in-from-bottom-2 duration-200",

                            // Variante 6: Micro-compresión háptica
                            variantId === 6 && "active:scale-[0.97]",

                            // Variante 7: Foco aislado (los otros se atenúan al 30%)
                            variantId === 7 && isOtherSelected && "opacity-30 scale-[0.99] transition-opacity duration-150",

                            // Variante 8: Glow Biométrico
                            variantId === 8 && isSelected && "ring-2 ring-primary/50 shadow-[0_0_16px_rgba(59,130,246,0.25)]",

                            // Variante 11: Hundimiento de inercia analógica
                            variantId === 11 && "active:scale-[0.95] active:rotate-[-0.3deg] transition-transform duration-100",

                            // Variante 14: Notch Magnético
                            variantId === 14 && isSelected && "ring-2 ring-primary/30 scale-[0.99]",

                            // Variante 15: Pulso Bio-Energético
                            variantId === 15 && isSelected && "ring-2 ring-emerald-500/60 shadow-[0_0_18px_rgba(16,185,129,0.35)]",

                            // Estado Seleccionado vs Normal
                            isSelected
                                ? cn(
                                      "bg-primary border-primary text-primary-foreground",
                                      variantId === 6 ? "scale-[1.02]" : "scale-[1.01]"
                                  )
                                : "bg-card border-border/80 hover:border-primary/60 hover:bg-secondary/60 active:scale-[0.99]"
                        )}
                    >
                        {/* VARIANTE 10: Barra de tinta líquida */}
                        {variantId === 10 && isSelected && isTransitioning && (
                            <span
                                className="absolute inset-0 bg-white/20 dark:bg-white/10 z-0 animate-in slide-in-from-left duration-200 pointer-events-none"
                                style={{ width: "100%" }}
                            />
                        )}

                        {/* VARIANTE 11: Flash de descompresión cinética */}
                        {variantId === 11 && isSelected && isTransitioning && (
                            <span className="absolute inset-0 bg-white/30 dark:bg-white/20 z-0 animate-out fade-out duration-200 pointer-events-none" />
                        )}

                        {/* VARIANTE 12: Sonar Ripple concéntrico */}
                        {variantId === 12 && isSelected && isTransitioning && (
                            <>
                                <span className="absolute inset-0 rounded-xl border-2 border-primary/60 animate-ping opacity-35 pointer-events-none" />
                                <span className="absolute inset-[-4px] rounded-2xl border border-primary/25 animate-pulse pointer-events-none" />
                            </>
                        )}

                        {/* VARIANTE 14: Muesca lateral notch */}
                        {variantId === 14 && isSelected && (
                            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-foreground/90 z-20 animate-in slide-in-from-left duration-150" />
                        )}

                        {/* VARIANTE 15: Anillo de energía bio-eléctrica */}
                        {variantId === 15 && isSelected && isTransitioning && (
                            <span className="absolute inset-0 rounded-xl border-2 border-emerald-300 animate-pulse pointer-events-none" />
                        )}

                        <div className="flex items-center justify-between w-full pr-8 relative z-10">
                            <span
                                className={cn(
                                    "font-semibold text-base sm:text-lg transition-colors",
                                    isSelected ? "text-white font-bold" : "text-foreground"
                                )}
                            >
                                {option.label}
                            </span>
                            <span
                                className={cn(
                                    "text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg tabular-nums transition-all",
                                    isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-muted text-muted-foreground group-hover:bg-background/90 group-hover:text-foreground",
                                    variantId === 8 && isSelected && "scale-110 shadow-xs",
                                    variantId === 14 && isSelected && "-translate-x-2 font-black shadow-xs"
                                )}
                            >
                                {option.pct}
                            </span>
                        </div>

                        {/* Check Icon con variantes específicas */}
                        {isSelected && (
                            <div
                                className={cn(
                                    "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                                    variantId === 6
                                        ? "animate-in zoom-in-50 duration-200 cubic-bezier(0.34, 1.56, 0.64, 1)"
                                        : "animate-in fade-in zoom-in duration-200"
                                )}
                            >
                                <Check className="h-5 w-5 text-white" strokeWidth={3} />

                                {/* VARIANTE 13: Micro-chispas stardust que brotan del checkmark */}
                                {variantId === 13 && isTransitioning && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <span className="absolute -top-3 -right-2 w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                                        <span className="absolute -bottom-2 -left-3 w-1.5 h-1.5 rounded-full bg-sky-200 animate-ping delay-75" />
                                        <span className="absolute top-1 -left-4 w-1 h-1 rounded-full bg-white animate-ping delay-100" />
                                    </div>
                                )}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
