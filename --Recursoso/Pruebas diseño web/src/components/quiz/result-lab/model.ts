/* ── Laboratorio de resultados: el modelo que comparten las variantes del laboratorio ──
   Parte del modelo de la versión principal (components/quiz/result/model.ts) y le suma
   lo que solo usan las variantes anteriores. */

import { getStressProfile } from "../quizData";
import { buildResultModel as buildMainModel, frequencyWord, type ResultModel as MainModel, type ZoneKey } from "../result/model";
import { WHATSAPP_NUMBER, ZONAS } from "@/content/taller";

export { WHATSAPP_NUMBER } from "@/content/taller";
export type { ZoneKey } from "@/content/taller";

/* Una sola acción para hoy, coherente con la zona (variantes del laboratorio) */
const ZONE_TODAY: Record<ZoneKey, { title: string; how: string }> = {
    resiliente: {
        title: "Protegé lo que ya te funciona.",
        how: "Elegí la pausa o el hábito que más te recarga y ponelo en tu agenda de esta semana, como si fuera una reunión.",
    },
    fragil: {
        title: "Hacé una pausa de 10 minutos a mitad del día.",
        how: "Sin celular. Caminá, respirá o solo mirá por la ventana. Es poco, pero le da a tu cuerpo un momento para soltar.",
    },
    "bajo-presion": {
        title: "Probá la respiración 4-7-8 antes de dormir.",
        how: "Inhalá 4 segundos, sostené 7 y exhalá 8. Repetilo 4 veces. Le avisa a tu cuerpo que ya puede bajar el ritmo.",
    },
    "riesgo-burnout": {
        title: "Contale a alguien de confianza cómo te sentís.",
        how: "Hoy mismo, aunque sea un mensaje corto. Nombrar el cansancio en voz alta ya le quita un poco de peso.",
    },
};

export const DISCLAIMER =
    "Este resultado es una señal para observar tu balance hoy, no un diagnóstico. Si sentís que te sobrepasa, consultá a un profesional de salud.";

/* Colores de zona legibles sobre fondo claro (tonos 700: todos pasan 4.5:1) */
export const ZONE_INK = Object.fromEntries(ZONAS.map((z) => [z.key, z.ink])) as Record<ZoneKey, string>;

export interface ResultModel extends MainModel {
    explanation: string;
    mirror: string;
    signals: { text: string; frequency: string }[];
    today: { title: string; how: string };
    session: { num: number; name: string; title: string; subtitle: string; why: string };
    drains: { label: string; score: number }[];
    recharges: { label: string; score: number }[];
    whatsappUrl: string;
}

export function buildResultModel(answers: number[], userName: string): ResultModel {
    const main = buildMainModel(answers, userName);
    const p = getStressProfile(answers);

    // Señales: solo lo que aparece "Frecuentemente" o más
    const signals = (p.dailyMirror.topSymptoms ?? [])
        .map((raw) => {
            const m = raw.match(/^(.*?)\s*\((\d+)%\)\s*$/);
            return m ? { text: m[1], pct: Number(m[2]) } : null;
        })
        .filter((s): s is { text: string; pct: number } => !!s && s.pct >= 60)
        .map((s) => ({ text: s.text, frequency: frequencyWord(s.pct) }));

    const splitTitle = (t: string) => {
        const [name, title] = t.split(" · ");
        return { name: name ?? t, title: title ?? t };
    };
    const top = splitTitle(p.topWorkshopSession.title);
    const message = `Hola, soy ${main.firstName || "una persona que hizo el test"}. Hice el test de estrés y mi resultado fue "${p.gapZone.title}" (${p.wearGap} de 100). Mi sesión prioritaria del taller es "${top.title}: ${p.topWorkshopSession.subtitle}". Me gustaría recibir información.`;

    return {
        ...main,
        explanation: `Tu carga está en ${p.loadIndex} % y tu recuperación en ${p.regIndex} %. Por eso tu balance da ${p.wearGap} de 100: más cerca de 0 es más recuperación, más cerca de 100 es más desgaste.`,
        mirror: p.dailyMirror.narrative,
        signals,
        today: ZONE_TODAY[main.zoneKey],
        session: { num: p.topWorkshopSession.num, name: top.name, title: top.title, subtitle: p.topWorkshopSession.subtitle, why: p.topWorkshopSession.why },
        drains: [
            { label: "Mente", score: p.dimScores.dim1 },
            { label: "Reactividad emocional", score: p.dimScores.dim2 },
            { label: "Desgaste corporal", score: p.dimScores.dim3 },
            { label: "Reacciones conductuales", score: p.dimScores.dim4 },
        ],
        recharges: [
            { label: "Desconexión y recuperación", score: p.dimScores.dim5 },
            { label: "Manejo de problemas", score: p.dimScores.dim6 },
        ],
        whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    };
}

/* Perfiles de prueba (valores reales de la escala: 5, 20, 40, 60, 80, 95) */
export const LAB_PROFILES: { id: string; label: string; answers: number[] }[] = [
    {
        id: "burnout",
        label: "Riesgo de Burnout",
        answers: [80, 95, 80, 80, 60, 80, 95, 80, 80, 60, 80, 95, 20, 20, 5, 40, 20, 20],
    },
    {
        id: "presion",
        label: "Sobrecarga",
        answers: [60, 80, 60, 60, 60, 60, 80, 60, 60, 80, 60, 60, 60, 60, 60, 60, 80, 60],
    },
    {
        id: "fragil",
        label: "Vulnerable",
        answers: [40, 20, 40, 60, 40, 20, 60, 40, 20, 40, 40, 40, 40, 40, 40, 40, 60, 40],
    },
    {
        id: "resiliente",
        label: "Óptimo",
        answers: [20, 5, 20, 20, 40, 5, 20, 20, 5, 20, 20, 20, 80, 95, 80, 80, 95, 60],
    },
];
