"use client";

import { SCALE_OPTIONS, type QuizQuestion as StressQuestion } from "./quizData";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface QuizQuestionProps {
    question: StressQuestion;
    onAnswer: (answer: number) => void;
    onBack: () => void;
    currentGlobalIndex: number;
    totalQuestions: number;
    direction?: "forward" | "backward";
    savedAnswer?: number;
}

/* Pausa entre tocar una opción y pasar a la siguiente pregunta */
const ADVANCE_DELAY_MS = 220;

const QuizQuestion = ({
    question,
    onAnswer,
    onBack,
    currentGlobalIndex,
    totalQuestions,
    direction = "forward",
    savedAnswer,
}: QuizQuestionProps) => {
    const [selectedScore, setSelectedScore] = useState<number | null>(savedAnswer ?? null);
    const [isAnimating, setIsAnimating] = useState(false);

    const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const clearAdvance = () => {
        if (advanceTimer.current) {
            clearTimeout(advanceTimer.current);
            advanceTimer.current = null;
        }
    };

    useEffect(() => {
        clearAdvance();
        setSelectedScore(savedAnswer ?? null);
        setIsAnimating(false);
    }, [currentGlobalIndex, savedAnswer]);

    // Lector de pantalla y teclado: al cambiar de pregunta, el foco va al enunciado
    // (sin mover la página ni mostrar ningún borde).
    useEffect(() => {
        headingRef.current?.focus({ preventScroll: true });
    }, [currentGlobalIndex]);

    // Si la pantalla se desmonta con un avance pendiente, se cancela.
    useEffect(() => clearAdvance, []);

    const handleSelect = (score: number) => {
        if (isAnimating) return;
        setSelectedScore(score);
        setIsAnimating(true);
        advanceTimer.current = setTimeout(() => {
            advanceTimer.current = null;
            onAnswer(score);
        }, ADVANCE_DELAY_MS);
    };

    // "Anterior" siempre gana: cancela un avance pendiente.
    const handleBack = () => {
        clearAdvance();
        setIsAnimating(false);
        onBack();
    };

    // Atajos de teclado: 1–6 eligen una opción.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            const n = Number(e.key);
            if (Number.isInteger(n) && n >= 1 && n <= SCALE_OPTIONS.length) {
                e.preventDefault();
                handleSelect(SCALE_OPTIONS[n - 1].value);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    // Flechas: mueven el foco entre opciones (no eligen, para no avanzar sin querer).
    const handleOptionKey = (e: React.KeyboardEvent, idx: number) => {
        const last = SCALE_OPTIONS.length - 1;
        let next: number | null = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = idx === last ? 0 : idx + 1;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = idx === 0 ? last : idx - 1;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = last;
        if (next !== null) {
            e.preventDefault();
            optionRefs.current[next]?.focus();
        }
    };

    const isPartB = question.part === "B";
    const headingId = `pregunta-${question.id}`;
    const selectedIdx = SCALE_OPTIONS.findIndex((o) => o.value === selectedScore);
    const tabStopIdx = selectedIdx >= 0 ? selectedIdx : 0;

    return (
        <div className="w-full max-w-xl space-y-5 sm:space-y-7 text-center relative px-1 sm:px-4">
            {/* ── MARCO Y BARRA DE PROGRESO FIJOS (NUNCA PARPADEAN) ── */}
            <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                    <button
                        onClick={handleBack}
                        className="flex items-center hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] py-2 px-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        aria-label={currentGlobalIndex === 0 ? "Volver a la pantalla del nombre" : "Volver a la pregunta anterior"}
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
                        Anterior
                    </button>
                    <span className="tabular-nums font-semibold" aria-hidden="true">
                        Pregunta {currentGlobalIndex + 1} de {totalQuestions}
                    </span>
                </div>
                <div
                    className="h-2 w-full rounded-full bg-secondary overflow-hidden"
                    role="progressbar"
                    aria-valuenow={currentGlobalIndex + 1}
                    aria-valuemin={1}
                    aria-valuemax={totalQuestions}
                    aria-valuetext={`Pregunta ${currentGlobalIndex + 1} de ${totalQuestions}`}
                    aria-label="Progreso del test"
                >
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-300 ease-out",
                            isPartB ? "bg-emerald-700" : "bg-primary"
                        )}
                        style={{ width: `${((currentGlobalIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            {/* ── CONTENIDO DINÁMICO: VARIANTE 6 (PULSO HÁPTICO & SLIDE DIRECCIONAL) ── */}
            <div
                key={currentGlobalIndex}
                className={cn(
                    "animate-in fade-in duration-200 ease-out space-y-5 sm:space-y-7 motion-reduce:animate-none",
                    direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4"
                )}
            >
                {/* Enunciado de la Pregunta */}
                <div className="space-y-2 sm:space-y-3 text-left sm:text-center">
                    <p
                        className={cn(
                            "text-sm sm:text-base font-semibold [text-wrap:balance]",
                            isPartB ? "text-emerald-700 dark:text-emerald-400" : "text-primary"
                        )}
                    >
                        En las últimas semanas, ¿con qué frecuencia te pasa?
                    </p>

                    <h2
                        id={headingId}
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-xl sm:text-3xl font-bold text-foreground leading-snug [text-wrap:balance] outline-none"
                    >
                        <span className="sr-only">
                            Pregunta {currentGlobalIndex + 1} de {totalQuestions}.{" "}
                        </span>
                        {question.text}
                    </h2>
                </div>

                {/* 6 Opciones con Micro-Compresión Física (scale 0.97) y Check con Resorte */}
                <div
                    role="radiogroup"
                    aria-labelledby={headingId}
                    className="grid gap-2 sm:gap-2.5 sm:pt-2"
                >
                    {SCALE_OPTIONS.map((option, idx) => {
                        const isSelected = selectedScore === option.value;
                        return (
                            <button
                                key={option.value}
                                ref={(el) => {
                                    optionRefs.current[idx] = el;
                                }}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={idx === tabStopIdx ? 0 : -1}
                                onClick={() => handleSelect(option.value)}
                                onKeyDown={(e) => handleOptionKey(e, idx)}
                                className={cn(
                                    "group relative flex items-center justify-between w-full min-h-[54px] sm:min-h-[56px] rounded-xl border px-4 py-3 sm:p-4 text-left overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none transition-all duration-200",
                                    // Micro-compresión háptica al presionar:
                                    "active:scale-[0.97]",
                                    isSelected
                                        ? isPartB
                                            ? "bg-emerald-700 border-emerald-700 text-white scale-[1.02]"
                                            : "bg-primary border-primary text-primary-foreground scale-[1.02]"
                                        : "bg-card border-border/80 hover:border-primary/60 hover:bg-secondary/60 active:scale-[0.99]"
                                )}
                            >
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
                                            "text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg tabular-nums transition-colors",
                                            isSelected
                                                ? "bg-white/20 text-white"
                                                : "bg-muted text-muted-foreground group-hover:bg-background/90 group-hover:text-foreground"
                                        )}
                                    >
                                        {option.pct}
                                    </span>
                                </div>

                                {/* Check Icon con resorte elástico natural */}
                                {isSelected && (
                                    <div
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 animate-in zoom-in-50 duration-200 [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none"
                                        aria-hidden="true"
                                    >
                                        <Check className="h-5 w-5 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuizQuestion;
