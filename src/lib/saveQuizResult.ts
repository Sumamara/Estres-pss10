import { supabase } from "./supabaseClient";

export interface QuizSubmission {
    /** Nombre que la persona escribió en la pantalla inicial */
    userName?: string;
    /** Las 10 respuestas en orden, cada una de 0 a 4 */
    answers: number[];
    /** Puntuación total ya calculada (0–40, con las inversas aplicadas) */
    totalScore: number;
    /** Identificador de la banda: con-margen | en-tension | al-limite */
    bandKey: string;
    /** Nombre visible de la banda: Con margen | En tensión | Al límite */
    bandName: string;
    /** Tiempo en segundos que le tomó al usuario completar el test */
    timeSpentSeconds?: number;
}

/**
 * Guarda una respuesta completa en Supabase.
 *
 * Nunca lanza: si Supabase no está configurado o la inserción falla, lo
 * registra en consola y sigue. La pantalla de resultados no debe romperse
 * porque la base de datos no esté disponible.
 *
 * Devuelve true solo si la fila se insertó de verdad.
 */
export const saveQuizResult = async (submission: QuizSubmission): Promise<boolean> => {
    if (!supabase) {
        console.info("[PSS-10] Supabase sin configurar: no se guarda la respuesta.");
        return false;
    }

    const { userName, answers, totalScore, bandKey, bandName, timeSpentSeconds } = submission;

    // Sanity check: el esquema exige las 10 columnas NOT NULL
    if (answers.length !== 10 || answers.some((a) => a === null || a === undefined)) {
        console.error("[PSS-10] Respuestas incompletas, no se guarda:", answers);
        return false;
    }

    const row: Record<string, unknown> = {
        nombre: userName?.trim() || null,
        puntuacion_total: totalScore,
        banda_key: bandKey,
        banda_nombre: bandName,
        tiempo_segundos: timeSpentSeconds ?? null,
    };

    // p1 … p10
    answers.forEach((answer, i) => {
        row[`p${i + 1}`] = answer;
    });

    try {
        const { error } = await supabase.from("Estres_PSS10").insert(row);

        if (error) {
            console.error("[PSS-10] No se pudo guardar la respuesta:", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("[PSS-10] Error inesperado al guardar:", err);
        return false;
    }
};
