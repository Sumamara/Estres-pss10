"use client";

/* ── Resultado principal (las 4 historias de result/ResultStories.tsx) ──
   Muestra las 4 historias (tu zona, ¿te identificás?, algo para hoy y el taller)
   y guarda la respuesta en Supabase una sola vez, igual que la versión anterior. */

import { useEffect, useMemo, useRef } from "react";
import { getStressProfile } from "./quizData";
import { saveQuizResult } from "@/lib/saveQuizResult";
import ResultStories from "./result/ResultStories";
import { buildCopy3ResultModel } from "./result/model";

interface QuizResultMainProps {
    answers: number[];
    onRetake: () => void;
    userName?: string;
    timeSpentSeconds?: number;
    /** false = no guarda en Supabase */
    persist?: boolean;
}

export default function QuizResultMain({ answers, onRetake, userName = "", timeSpentSeconds, persist = true }: QuizResultMainProps) {
    const model = useMemo(() => buildCopy3ResultModel(answers, userName), [answers, userName]);

    /* Guardar en Supabase (una sola vez), con los datos calculados */
    const hasSaved = useRef(false);
    useEffect(() => {
        if (hasSaved.current || !persist) return;
        hasSaved.current = true;
        const p = getStressProfile(answers);

        // Cuadrante 2x2: 1 = Óptimo, 2 = Sobrecarga, 3 = Vulnerable, 4 = Riesgo de Burnout
        const quadNumMap: Record<string, 1 | 2 | 3 | 4> = {
            resiliente: 1,
            "bajo-presion": 2,
            fragil: 3,
            "riesgo-burnout": 4,
        };
        const quadNum = quadNumMap[model.zoneKey] ?? (p.activeQuadrant as 1 | 2 | 3 | 4);

        saveQuizResult({
            userName,
            answers,
            loadIndex: model.load,
            regIndex: model.recovery,
            netDiff: p.netDiff,
            dominantChannel: p.dominantChannel,
            dimScores: p.dimScores,
            quadrantNumber: quadNum,
            bandKey: model.zoneKey,
            bandName: model.zoneTitle,
            estadoKey: model.zoneKey,
            estadoNombre: model.zoneTitle,
            desgasteScore: model.score,
            timeSpentSeconds,
        });
    }, [answers, userName, timeSpentSeconds, persist, model]);

    return (
        <div className="fixed inset-0 z-40 bg-background">
            <ResultStories m={model} onRetake={onRetake} quadrantMode quadrantVariant="unificar-solo-activo" />
        </div>
    );
}
