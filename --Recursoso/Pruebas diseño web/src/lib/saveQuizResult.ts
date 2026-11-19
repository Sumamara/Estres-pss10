import { supabase } from "./supabaseClient";
import type { DimensionId } from "@/components/quiz/quizData";

export interface QuizSubmission {
    /** Nombre que la persona escribió en la pantalla inicial */
    userName?: string;
    /** Las 18 respuestas en orden, cada una de 5 a 95 (5, 20, 40, 60, 80, 95) */
    answers: number[];
    /** Índice Global de Carga de Estrés (Parte A, 0–100%) */
    loadIndex: number;
    /** Índice de Capacidad de Regulación (Parte B, 0–100%) */
    regIndex: number;
    /** Balance Neto (Regulación - Carga) */
    netDiff: number;
    /** Canal dominante de desgaste */
    dominantChannel: string;
    /** Puntajes por dimensión (dim1..dim6) */
    dimScores: Record<DimensionId, number>;
    /** Número del cuadrante (1..4) */
    quadrantNumber: 1 | 2 | 3 | 4;
    /** Identificador del cuadrante / estado: resiliente | bajo-presion | fragil | riesgo-burnout */
    bandKey: string;
    /** Nombre visible del estado: Óptimo | Sobrecarga | Vulnerable | Riesgo de Burnout */
    bandName: string;
    /** Clave del estado (resiliente | bajo-presion | fragil | riesgo-burnout) */
    estadoKey?: string;
    /** Nombre del estado (Óptimo | Sobrecarga | Vulnerable | Riesgo de Burnout) */
    estadoNombre?: string;
    /** Nivel de desgaste (0 a 100) */
    desgasteScore?: number;
    /** Tiempo en segundos que le tomó al usuario completar el test */
    timeSpentSeconds?: number;
}

/**
 * Guarda una respuesta completa del protocolo PAEM-18 en Supabase.
 *
 * Nunca lanza: si Supabase no está configurado o la inserción falla, lo
 * registra en consola y sigue. La pantalla de resultados no debe romperse
 * porque la base de datos no esté disponible.
 *
 * Devuelve true solo si la fila se insertó de verdad.
 */
export const saveQuizResult = async (submission: QuizSubmission): Promise<boolean> => {
    if (!supabase) {
        console.info("[PAEM-18] Supabase sin configurar: no se guarda la respuesta.");
        return false;
    }

    const {
        userName,
        answers,
        loadIndex,
        regIndex,
        netDiff,
        dominantChannel,
        dimScores,
        quadrantNumber,
        bandKey,
        bandName,
        timeSpentSeconds,
    } = submission;

    if (answers.length !== 18 || answers.some((a) => a === null || a === undefined)) {
        console.error("[PAEM-18] Respuestas incompletas, no se guarda:", answers);
        return false;
    }

    const row: Record<string, unknown> = {
        nombre: userName?.trim() || null,
        indice_carga: loadIndex,
        indice_regulacion: regIndex,
        balance_neto: netDiff,
        canal_dominante: dominantChannel,
        dim1_mente: dimScores.dim1,
        dim2_emocion: dimScores.dim2,
        dim3_cuerpo: dimScores.dim3,
        dim4_conducta: dimScores.dim4,
        dim5_desconexion: dimScores.dim5,
        dim6_manejo: dimScores.dim6,
        cuadrante_num: quadrantNumber,
        cuadrante_key: bandKey,
        cuadrante_nombre: bandName,
        estado_key: submission.estadoKey ?? bandKey,
        estado_nombre: submission.estadoNombre ?? bandName,
        desgaste_score: submission.desgasteScore ?? null,
        tiempo_segundos: timeSpentSeconds ?? null,
    };

    // p1 … p18
    answers.forEach((answer, i) => {
        row[`p${i + 1}`] = answer;
    });

    try {
        const { error } = await supabase.from("Estres_Lead").insert(row);

        if (error) {
            console.error("[Estres_Lead] No se pudo guardar la respuesta:", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("[Estres_Lead] Error inesperado al guardar:", err);
        return false;
    }
};
