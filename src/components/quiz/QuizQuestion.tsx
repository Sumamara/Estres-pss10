"use client";

// Aliased: quizData exports it as `QuizQuestion`, which would collide with the
// component declared in this file.
import type { QuizQuestion as StressQuestion } from "./quizData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
interface QuizQuestionProps {
    question: StressQuestion;
    onAnswer: (answer: number) => void;
    currentGlobalIndex: number;
    savedAnswer?: number;
}

const QuizQuestion = ({
    question,
    onAnswer,
    currentGlobalIndex,
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
        <div className="w-full animate-in fade-in duration-200 space-y-8">
            <div className="space-y-3 pt-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Piensa en el último mes
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                    {question.text}
                </h2>
            </div>

            {/* Options */}
            <div className="grid gap-3 pt-2">
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
