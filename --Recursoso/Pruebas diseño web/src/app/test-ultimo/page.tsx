"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuizWelcome from "@/components/quiz/QuizWelcome";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResultMain from "@/components/quiz/QuizResultMain";
import { quizQuestions } from "@/components/quiz/quizData";

/* 3 preguntas representativas:
   0: Parte A · Carga mental
   6: Parte A · Desgaste corporal
   12: Parte B · Capacidad de desconexión */
const SAMPLE_QUESTIONS = [quizQuestions[0], quizQuestions[6], quizQuestions[12]];

export default function TestUltimoPage() {
    const [hasStarted, setHasStarted] = useState(false);
    const [userName, setUserName] = useState("");
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");
    const [showResult, setShowResult] = useState(false);

    const handleStart = (name: string) => {
        setUserName(name);
        setHasStarted(true);
        setIndex(0);
    };

    const handleAnswer = (val: number) => {
        const next = [...answers];
        next[index] = val;
        setAnswers(next);

        if (index < SAMPLE_QUESTIONS.length - 1) {
            setDirection("forward");
            setIndex(index + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        if (index > 0) {
            setDirection("backward");
            setIndex(index - 1);
        } else {
            setHasStarted(false);
        }
    };

    const handleRetake = () => {
        setAnswers([null, null, null]);
        setIndex(0);
        setShowResult(false);
        setHasStarted(false);
    };

    if (showResult) {
        const a0 = answers[0] ?? 40;
        const a1 = answers[1] ?? 40;
        const a2 = answers[2] ?? 60;

        // Expandir las 3 respuestas a las 18 dimensiones para alimentar el motor psicométrico
        const fullAnswers = [
            a0, a0, a0, a0, a0, a0,
            a1, a1, a1, a1, a1, a1,
            a2, a2, a2, a2, a2, a2,
        ];

        return (
            <QuizResultMain
                answers={fullAnswers}
                onRetake={handleRetake}
                userName={userName || "Prueba"}
                persist={false}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="p-4 flex items-center justify-between max-w-3xl w-full mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Volver al menú de pruebas
                </Link>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Test Último · Demo 3 preguntas
                </span>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:px-12 sm:py-8">
                <div className="w-full flex items-center justify-center">
                    {!hasStarted ? (
                        <QuizWelcome onStart={handleStart} initialName={userName} />
                    ) : (
                        <QuizQuestion
                            key={SAMPLE_QUESTIONS[index].id}
                            question={SAMPLE_QUESTIONS[index]}
                            onAnswer={handleAnswer}
                            onBack={handleBack}
                            currentGlobalIndex={index}
                            totalQuestions={SAMPLE_QUESTIONS.length}
                            direction={direction}
                            savedAnswer={answers[index] ?? undefined}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

