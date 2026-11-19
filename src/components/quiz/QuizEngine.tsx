"use client";

import { useState } from "react";
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
            <QuizQuestion
                key={currentGlobalIndex}
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={handleBack}
                currentGlobalIndex={currentGlobalIndex}
                totalQuestions={totalQuestions}
                savedAnswer={answers[currentGlobalIndex] !== null ? answers[currentGlobalIndex]! : undefined}
            />
        </div>
    );
};

export default QuizEngine;
