"use client";

import { useEffect, useRef, useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResultMain from "./QuizResultMain";
import QuizWelcome, { BalanceMark } from "./QuizWelcome";
import { quizQuestions } from "./quizData";

/* ── Progreso guardado en el navegador de la persona ──
   Si la página se recarga (por ejemplo, al volver desde otro chat en WhatsApp),
   el test sigue donde quedó. Se borra al llegar al resultado o al reiniciar. */
const STORAGE_KEY = "paem18-progreso-v1";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000;

/* Duración de la pantalla "Listo, {nombre}. Calculando tu balance…" */
const FINISH_DELAY_MS = 1600;

interface SavedProgress {
    userName: string;
    answers: (number | null)[];
    index: number;
    /** Tiempo activo acumulado respondiendo, en ms (no cuenta el tiempo fuera). */
    activeMs: number;
    savedAt: number;
}

const readProgress = (total: number): SavedProgress | null => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as SavedProgress;
        const valid =
            typeof data.userName === "string" &&
            Array.isArray(data.answers) &&
            data.answers.length === total &&
            Number.isInteger(data.index) &&
            data.index >= 0 &&
            data.index < total &&
            Date.now() - data.savedAt < STORAGE_TTL_MS;
        if (!valid) {
            window.localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const writeProgress = (data: SavedProgress) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Navegación privada o almacenamiento lleno: el test sigue funcionando sin guardar.
    }
};

const clearProgress = () => {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Sin acceso al almacenamiento: no hay nada que borrar.
    }
};

const QuizEngine = () => {
    const totalQuestions = quizQuestions.length;

    const [isReady, setIsReady] = useState(false);
    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(totalQuestions).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [userName, setUserName] = useState("");
    const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");

    // Tiempo activo: lo acumulado antes + el tramo actual desde segmentStart
    const activeBaseMs = useRef(0);
    const segmentStart = useRef<number>(0);
    const elapsedMs = () => activeBaseMs.current + (Date.now() - segmentStart.current);

    // Al abrir: retomar si hay progreso guardado
    useEffect(() => {
        const saved = readProgress(totalQuestions);
        if (saved) {
            setUserName(saved.userName);
            setAnswers(saved.answers);
            setCurrentGlobalIndex(saved.index);
            activeBaseMs.current = saved.activeMs;
            segmentStart.current = Date.now();
            setHasStarted(true);
        }
        setIsReady(true);
    }, [totalQuestions]);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [currentGlobalIndex, showResult, isFinishing]);

    const handleStart = (name: string) => {
        setUserName(name);
        setHasStarted(true);
        activeBaseMs.current = 0;
        segmentStart.current = Date.now();
        setDirection("forward");
        writeProgress({
            userName: name,
            answers,
            index: 0,
            activeMs: 0,
            savedAt: Date.now(),
        });
    };

    const currentQuestion = quizQuestions[currentGlobalIndex];

    const handleAnswer = (answer: number) => {
        setDirection("forward");
        const newAnswers = [...answers];
        newAnswers[currentGlobalIndex] = answer;
        setAnswers(newAnswers);

        if (currentGlobalIndex < totalQuestions - 1) {
            const nextIndex = currentGlobalIndex + 1;
            setCurrentGlobalIndex(nextIndex);
            writeProgress({
                userName,
                answers: newAnswers,
                index: nextIndex,
                activeMs: elapsedMs(),
                savedAt: Date.now(),
            });
        } else {
            setTimeSpentSeconds(Math.round(elapsedMs() / 1000));
            clearProgress();
            setIsFinishing(true);
            setTimeout(() => {
                setIsFinishing(false);
                setShowResult(true);
            }, FINISH_DELAY_MS);
        }
    };

    // En la primera pregunta, "Anterior" vuelve a la pantalla del nombre (las respuestas se mantienen)
    const handleBack = () => {
        setDirection("backward");
        if (currentGlobalIndex > 0) setCurrentGlobalIndex(currentGlobalIndex - 1);
        else setHasStarted(false);
    };

    const handleRetake = () => {
        clearProgress();
        setAnswers(new Array(totalQuestions).fill(null));
        setCurrentGlobalIndex(0);
        setShowResult(false);
        setHasStarted(false);
    };

    // Evita mostrar la bienvenida un instante antes de retomar un test guardado
    if (!isReady) return null;

    if (!hasStarted) {
        return <QuizWelcome onStart={handleStart} initialName={userName} />;
    }

    if (isFinishing) {
        const firstName = userName.trim();
        return (
            <div
                className="w-full max-w-xl flex flex-col items-center justify-center text-center gap-5 min-h-[50vh] animate-in fade-in duration-300 motion-reduce:animate-none"
                role="status"
            >
                <BalanceMark />
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        {firstName ? `Listo, ${firstName}.` : "Listo."}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">Calculando tu balance…</p>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <QuizResultMain
                answers={answers as number[]}
                onRetake={handleRetake}
                userName={userName}
                timeSpentSeconds={timeSpentSeconds}
            />
        );
    }

    return (
        <div className="w-full flex justify-center min-h-[450px]">
            <QuizQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={handleBack}
                currentGlobalIndex={currentGlobalIndex}
                totalQuestions={totalQuestions}
                direction={direction}
                savedAnswer={answers[currentGlobalIndex] !== null ? answers[currentGlobalIndex]! : undefined}
            />
        </div>
    );
};

export default QuizEngine;
