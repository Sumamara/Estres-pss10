"use client";

// Aliased: quizData exports it as `QuizQuestion`, which would collide with the
// component declared in this file.
import type { QuizQuestion as StressQuestion } from "./quizData";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import { useState, useEffect } from "react";
interface QuizQuestionProps {
    question: StressQuestion;
    onAnswer: (answer: number) => void;
    onBack: () => void;
    currentGlobalIndex: number;
    totalQuestions: number;
    savedAnswer?: number;
}

const QuizQuestion = ({
    question,
    onAnswer,
    onBack,
    currentGlobalIndex,
    totalQuestions,
    savedAnswer
}: QuizQuestionProps) => {
    const [selectedScore, setSelectedScore] = useState<number | null>(savedAnswer ?? null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setSelectedScore(savedAnswer ?? null);
        setIsAnimating(false);
    }, [currentGlobalIndex, savedAnswer]);

    const handleSelect = (score: number) => {
        if (isAnimating) return;
        setSelectedScore(score);
        setIsAnimating(true);

        // Delay to show the check animation before advancing
        setTimeout(() => {
            onAnswer(score);
        }, 500);
    };

    const options = [
        { value: 0, label: "Nunca" },
        { value: 1, label: "Casi nunca" },
        { value: 2, label: "De vez en cuando" },
        { value: 3, label: "A menudo" },
        { value: 4, label: "Muy a menudo" }
    ];

    return (
        <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-300 space-y-8 text-center relative px-4">
            {/* Progress */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    <button
                        onClick={onBack}
                        className="flex items-center hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentGlobalIndex === 0}
                    >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Anterior
                    </button>
                    <span>Pregunta {currentGlobalIndex + 1} de {totalQuestions}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${((currentGlobalIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                    {question.text}
                </h2>
                <p className="text-muted-foreground">Selecciona la opción que mejor describa tu caso.</p>
            </div>

            {/* Options */}
            <div className="grid gap-3 pt-6">
                {options.map((option) => {
                    const isSelected = selectedScore === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={cn(
                                "group relative flex items-center justify-between w-full rounded-xl border-2 p-4 text-left transition-all duration-300 shadow-sm overflow-hidden",
                                isSelected
                                    ? "bg-primary border-primary text-primary-foreground scale-[1.02] animate-pop"
                                    : "bg-card border-muted hover:border-primary/50 hover:bg-secondary active:scale-[0.98]"
                            )}
                        >
                            <span className={cn(
                                "font-medium text-lg text-center transition-colors flex-1 relative z-10",
                                isSelected ? "text-primary-foreground font-bold" : "text-foreground"
                            )}>
                                {option.label}
                            </span>

                            {/* Check Icon */}
                            {isSelected && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-300">
                                    <Check className="h-6 w-6 text-white" strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

    </div>
    );
};

export default QuizQuestion;
