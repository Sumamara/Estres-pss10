"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import QuizWelcome from "./QuizWelcome";
import { quizQuestions } from "./quizData";

const QuizEngine = () => {
    const totalQuestions = quizQuestions.length;

    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(totalQuestions).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [userName, setUserName] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

    const handleStart = (name: string) => {
        setUserName(name);
        setHasStarted(true);
        setStartTime(Date.now());
    };

    const currentQuestion = quizQuestions[currentGlobalIndex];

    const handleAnswer = (answer: number) => {
        const newAnswers = [...answers];
        newAnswers[currentGlobalIndex] = answer;
        setAnswers(newAnswers);

        if (currentGlobalIndex < totalQuestions - 1) {
            setCurrentGlobalIndex(currentGlobalIndex + 1);
        } else {
            if (startTime) {
                setTimeSpentSeconds(Math.round((Date.now() - startTime) / 1000));
            }
            setShowResult(true);
        }
    };

    const handleBack = () => {
        if (currentGlobalIndex > 0) {
            setCurrentGlobalIndex(currentGlobalIndex - 1);
        }
    };

    const handleRetake = () => {
        setAnswers(new Array(totalQuestions).fill(null));
        setCurrentGlobalIndex(0);
        setShowResult(false);
        setHasStarted(false);
    };

    if (!hasStarted) {
        return <QuizWelcome onStart={handleStart} />;
    }

    if (showResult) {
        // En lugar de enviar un objeto de scores por dimensión, pasamos el array de respuestas al PSS-10
        return <QuizResult answers={answers as number[]} onRetake={handleRetake} userName={userName} timeSpentSeconds={timeSpentSeconds} />;
    }

    return (
        <div className="w-full flex justify-center min-h-[450px]">
            <div className="w-full max-w-xl space-y-8 relative px-4">
                {/* Barra de progreso fija: no se desmonta al cambiar de pregunta */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentGlobalIndex === 0}
                        >
                            <ArrowLeft className="mr-1 h-3 w-3" />
                            Anterior
                        </button>
                        <span>Pregunta {currentGlobalIndex + 1} de {totalQuestions}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${((currentGlobalIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                <QuizQuestion
                    key={currentGlobalIndex}
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    currentGlobalIndex={currentGlobalIndex}
                    savedAnswer={answers[currentGlobalIndex] !== null ? answers[currentGlobalIndex]! : undefined}
                />
            </div>
        </div>
    );
};

export default QuizEngine;
