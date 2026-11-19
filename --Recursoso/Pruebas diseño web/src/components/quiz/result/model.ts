/* ── Resultado principal: lo que necesita cada historia, ya calculado ──
   El texto sale de src/content/taller.ts y el cálculo de components/quiz/quizData.ts. */

import { getStressProfile, SCALE_OPTIONS } from "../quizData";
import { DIMENSIONES, FRECUENCIA, TALLER, ZONAS, type ZoneKey } from "@/content/taller";
import { DIMENSIONES_CLAUDE, FRECUENCIA_CLAUDE, TALLER_CLAUDE, ZONAS_CLAUDE } from "@/content/taller.claude";
import { DIMENSIONES_TONO, FRECUENCIA_TONO, TALLER_TONO, ZONAS_TONO } from "@/content/taller.tono";
import type { Dimension, Zona } from "@/content/taller";
import { DIMENSIONES_ORIGINAL, FRECUENCIA_ORIGINAL, TALLER_ORIGINAL, ZONAS_ORIGINAL } from "@/content/taller.original";

export { WHATSAPP_NUMBER } from "@/content/taller";
export type { ZoneKey } from "@/content/taller";

/* Lo que se siente en cada señal: la frase de la pregunta, por su síntoma */
const FEEL_BY_SYMPTOM = Object.fromEntries(
    DIMENSIONES.flatMap((d) => d.questions)
        .filter((q) => q.symptom && q.fragment)
        .map((q) => [q.symptom as string, q.fragment as string])
) as Record<string, string>;
const frequencyLead = (pct: number) => (FRECUENCIA.find((f) => pct >= f.min) ?? FRECUENCIA[FRECUENCIA.length - 1]).lead;
export const frequencyWord = (pct: number) => [...SCALE_OPTIONS].reverse().find((o) => pct >= o.value)?.label ?? "Casi nunca";

export interface ResultModel {
    firstName: string;
    zoneKey: ZoneKey;
    zoneTitle: string;
    /** Color de la zona legible sobre fondo claro */
    zoneInk: string;
    zoneHex: string;
    zones: { key: ZoneKey; title: string; min: number; max: number; hex: string; ink: string }[];
    /** Nivel de desgaste (0 a 100) */
    score: number;
    /** Energía que gastás y que recuperás (0 a 100) */
    load: number;
    recovery: number;

    /** Historia 1: la frase que valida y la nota final */
    validation: string;
    action: string;
    /** Historia 2: tus dos señales más altas, tu canal de estrés, qué hay detrás y qué puede causar */
    reflect: {
        signals: { title: string; body: string }[];
        channel: { name: string; summary: string; feel: string; score: number };
        behind: string;
        cost: { title: string; description: string };
    };
    /** Historias 2 y 4: cómo se nombran las preguntas según tu zona */
    labels: {
        reflectTitle: string;
        behindTitle: string;
        causeTitle: string;
        workshopQuestion: string;
        workshopSubtitle?: string;
        workshopCtaPrompt?: string;
    };
    /** Historia 3: algo que podés hacer hoy */
    step: { kicker?: string; skill: string; how: string; why: string; helps: string; time: string; when: string; source: string };
    /** Historia 4: el taller */
    workshopHelps: string;
    workshopDetails: { label: string; value: string }[];
    testimonial: { name: string; role: string; initials: string; quote: string };
    sessions: { num: number; name: string; subtitle: string; why: string; isTop: boolean }[];
    extraAccordion?: { title: string; body: string; linkText?: string; linkUrl?: string };
    /** Historia 5: pestaña extra de sesión de regalo sin compromiso cuando el estado es crítico (Riesgo de Burnout) */
    giftSession?: Zona["story5"];
}

export function buildResultModel(answers: number[], userName: string): ResultModel {
    const p = getStressProfile(answers);
    const zone = p.zone;
    const firstName = userName.trim().split(/\s+/)[0] ?? "";
    const sessionName = (t: string) => t.split(" · ")[1] ?? t;

    return {
        firstName,
        zoneKey: zone.key,
        zoneTitle: p.gapZone.title,
        zoneInk: zone.ink,
        zoneHex: p.gapZone.colorHex,
        zones: ZONAS.map((z) => ({ key: z.key, title: z.title, min: z.min, max: z.max, hex: z.colorHex, ink: z.ink })),
        score: p.wearGap,
        load: p.loadIndex,
        recovery: p.regIndex,

        validation: zone.story1.validation,
        action: zone.story1.action,
        reflect: {
            signals: (p.dailyMirror.topSymptoms ?? []).slice(0, 2).map((raw) => {
                const mm = raw.match(/^(.*?)\s*\((\d+)%\)\s*$/);
                const pct = mm ? Number(mm[2]) : 0;
                const title = mm ? mm[1] : raw;
                const feel = FEEL_BY_SYMPTOM[title];
                const lead = frequencyLead(pct);
                const sep = lead.endsWith("que") ? " " : ", ";
                return { title, body: feel ? `${lead}${sep}${feel}.` : `Te pasa ${frequencyWord(pct).toLowerCase()}.` };
            }),
            channel: (() => {
                const top = [...p.dimensionsDetail].filter((d) => d.part === "A").sort((a, b) => b.score - a.score)[0];
                const feel = DIMENSIONES.find((d) => d.id === top.id)?.channel?.feel ?? top.subtitle;
                return { name: p.futureCost.channelName, summary: top.subtitle, feel, score: top.score };
            })(),
            behind: zone.story2.behind.join(" "),
            cost: { title: p.futureCost.title, description: p.futureCost.description },
        },
        labels: {
            reflectTitle: zone.story2.reflectTitle,
            behindTitle: zone.story2.behindTitle,
            causeTitle: zone.story2.causeTitle,
            workshopQuestion: zone.story4.question,
            workshopSubtitle: zone.story4.subtitle,
            workshopCtaPrompt: zone.story4.ctaPrompt,
        },
        step: zone.story3,
        workshopHelps: zone.story4.helps,
        workshopDetails: TALLER.details,
        testimonial: TALLER.testimonials[0],
        sessions: p.workshopSessions.map((s) => ({
            num: s.num,
            name: sessionName(s.title),
            subtitle: s.subtitle,
            why: s.why,
            isTop: s.num === p.topWorkshopSession.num,
        })),
        extraAccordion: zone.story4.extraAccordion,
        giftSession: zone.story5,
    };
}

/**
 * Copia 3: calcula el estado por cuadrantes (2×2) con centro en:
 * - Energía que gastás (Carga): 50 %
 * - Energía que recuperás (Óptimo / Recursos): 60 %
 */
export function getQuadrantZoneKey(load: number, recovery: number): ZoneKey {
    if (load < 50 && recovery >= 60) return "resiliente"; // Óptimo
    if (load < 50 && recovery < 60) return "fragil"; // Vulnerable
    if (load >= 50 && recovery >= 60) return "bajo-presion"; // Sobrecarga
    return "riesgo-burnout"; // Riesgo de Burnout (load >= 50 && recovery < 60)
}

export function buildCopy3ResultModel(answers: number[], userName: string): ResultModel {
    const base = buildResultModel(answers, userName);
    const qKey = getQuadrantZoneKey(base.load, base.recovery);
    const zone = ZONAS.find((z) => z.key === qKey) ?? ZONAS[0];

    return {
        ...base,
        zoneKey: zone.key,
        zoneTitle: zone.title,
        zoneInk: zone.ink,
        zoneHex: zone.colorHex,
        validation: zone.story1.validation,
        action: zone.story1.action,
        reflect: {
            ...base.reflect,
            behind: zone.story2.behind.join(" "),
        },
        labels: {
            reflectTitle: zone.story2.reflectTitle,
            behindTitle: zone.story2.behindTitle,
            causeTitle: zone.story2.causeTitle,
            workshopQuestion: zone.story4.question,
            workshopSubtitle: zone.story4.subtitle,
            workshopCtaPrompt: zone.story4.ctaPrompt,
        },
        step: zone.story3,
        workshopHelps: zone.story4.helps,
        extraAccordion: zone.story4.extraAccordion,
        giftSession: zone.story5,
    };
}

/** Un copy alternativo completo (taller.claude.ts, taller.tono.ts…) */
interface CopyContent {
    DIMENSIONES: Dimension[];
    ZONAS: Zona[];
    FRECUENCIA: { min: number; lead: string }[];
    TALLER: typeof TALLER;
}

/** Copy Claude y Copy Tono, para comparar en /prueba-resultados. El cálculo es el mismo del test; solo cambian los textos. */
export const buildClaudeResultModel = (answers: number[], userName: string) =>
    buildCopyResultModel(answers, userName, { DIMENSIONES: DIMENSIONES_CLAUDE, ZONAS: ZONAS_CLAUDE, FRECUENCIA: FRECUENCIA_CLAUDE, TALLER: TALLER_CLAUDE });
export const buildTonoResultModel = (answers: number[], userName: string) =>
    buildCopyResultModel(answers, userName, { DIMENSIONES: DIMENSIONES_TONO, ZONAS: ZONAS_TONO, FRECUENCIA: FRECUENCIA_TONO, TALLER: TALLER_TONO });

function buildCopyResultModel(answers: number[], userName: string, c: CopyContent): ResultModel {
    const base = buildResultModel(answers, userName);
    const p = getStressProfile(answers);
    const zone = c.ZONAS.find((z) => z.key === base.zoneKey) ?? c.ZONAS[0];
    const lead = (pct: number) => (c.FRECUENCIA.find((f) => pct >= f.min) ?? c.FRECUENCIA[c.FRECUENCIA.length - 1]).lead;

    // Cada señal se reconoce por su pregunta (id) y se cuenta con el texto Claude
    const idBySymptom = Object.fromEntries(DIMENSIONES.flatMap((d) => d.questions).filter((q) => q.symptom).map((q) => [q.symptom as string, q.id]));
    const claudeQ = Object.fromEntries(c.DIMENSIONES.flatMap((d) => d.questions).map((q) => [q.id, q]));
    const signals = (p.dailyMirror.topSymptoms ?? []).slice(0, 2).map((raw) => {
        const mm = raw.match(/^(.*?)\s*\((\d+)%\)\s*$/);
        const pct = mm ? Number(mm[2]) : 0;
        const q = claudeQ[idBySymptom[mm ? mm[1] : raw]];
        return q?.symptom && q.fragment ? { title: q.symptom, body: `${lead(pct)}, ${q.fragment}.` } : base.reflect.signals[0];
    });

    const topId = DIMENSIONES.find((d) => d.channel?.name === p.futureCost.channelName)?.id;
    const channel = c.DIMENSIONES.find((d) => d.id === topId)?.channel;

    return {
        ...base,
        validation: zone.story1.validation,
        action: zone.story1.action,
        reflect: {
            signals,
            channel: { ...base.reflect.channel, name: channel?.name ?? base.reflect.channel.name, feel: channel?.feel ?? base.reflect.channel.feel },
            behind: zone.story2.behind.join(" "),
            cost: channel?.cost ?? base.reflect.cost,
        },
        labels: {
            reflectTitle: zone.story2.reflectTitle,
            behindTitle: zone.story2.behindTitle,
            causeTitle: zone.story2.causeTitle,
            workshopQuestion: zone.story4.question,
            workshopSubtitle: zone.story4.subtitle,
            workshopCtaPrompt: zone.story4.ctaPrompt,
        },
        step: zone.story3,
        workshopHelps: zone.story4.helps,
        workshopDetails: c.TALLER.details,
        testimonial: c.TALLER.testimonials[0],
        sessions: base.sessions.map((s) => {
            const t = c.TALLER.sessions.find((x) => x.num === s.num);
            return t ? { ...s, name: t.name, subtitle: t.subtitle, why: t.why } : s;
        }),
    };
}

/** Construye el modelo con el Copy original (taller.original.ts) para comparar lado a lado en /prueba-resultados */
export function buildOriginalResultModel(answers: number[], userName: string): ResultModel {
    const p = getStressProfile(answers);
    const origZone = ZONAS_ORIGINAL.find((z) => z.key === p.zone.key) ?? ZONAS_ORIGINAL[0];
    const origGapZone = ZONAS_ORIGINAL.find((z) => z.key === p.gapZone.key) ?? ZONAS_ORIGINAL[0];
    const firstName = userName.trim().split(/\s+/)[0] ?? "";
    const sessionName = (t: string) => t.split(" · ")[1] ?? t;

    const origQuestions = DIMENSIONES_ORIGINAL.flatMap((d) => d.questions);
    const allQuestions = DIMENSIONES.flatMap((d) => d.questions);
    const origFreqLead = (pct: number) =>
        (FRECUENCIA_ORIGINAL.find((f) => pct >= f.min) ?? FRECUENCIA_ORIGINAL[FRECUENCIA_ORIGINAL.length - 1]).lead;

    // Emparejar señales por su índice de pregunta para mostrar el síntoma/fragmento original equivalente
    const topStressIndices = allQuestions
        .map((q, idx) => ({ idx, val: answers[idx] ?? 0, isStress: idx < 12 }))
        .filter((x) => x.isStress && x.val >= 50)
        .sort((a, b) => b.val - a.val)
        .slice(0, 2);

    const signals = topStressIndices.map(({ idx, val }) => {
        const oq = origQuestions[idx];
        const title = oq?.symptom ?? `Señal ${idx + 1}`;
        const feel = oq?.fragment;
        return {
            title,
            body: feel ? `${origFreqLead(val)}, ${feel}.` : `Te pasa ${frequencyWord(val).toLowerCase()}.`,
        };
    });

    const topDim = [...p.dimensionsDetail].filter((d) => d.part === "A").sort((a, b) => b.score - a.score)[0];
    const origDim = DIMENSIONES_ORIGINAL.find((d) => d.id === topDim.id) ?? DIMENSIONES_ORIGINAL[0];

    return {
        firstName,
        zoneKey: origZone.key,
        zoneTitle: origGapZone.title,
        zoneInk: origZone.ink,
        zoneHex: origGapZone.colorHex,
        zones: ZONAS_ORIGINAL.map((z) => ({ key: z.key, title: z.title, min: z.min, max: z.max, hex: z.colorHex, ink: z.ink })),
        score: p.wearGap,
        load: p.loadIndex,
        recovery: p.regIndex,

        validation: origZone.story1.validation,
        action: origZone.story1.action,
        reflect: {
            signals,
            channel: {
                name: origDim.channel?.name ?? topDim.title,
                summary: topDim.subtitle,
                feel: origDim.channel?.feel ?? topDim.subtitle,
                score: topDim.score,
            },
            behind: origZone.story2.behind.join(" "),
            cost: {
                title: origDim.channel?.cost.title ?? p.futureCost.title,
                description: origDim.channel?.cost.description ?? p.futureCost.description,
            },
        },
        labels: {
            reflectTitle: origZone.story2.reflectTitle,
            behindTitle: origZone.story2.behindTitle,
            causeTitle: origZone.story2.causeTitle,
            workshopQuestion: origZone.story4.question,
        },
        step: origZone.story3,
        workshopHelps: origZone.story4.helps,
        workshopDetails: TALLER_ORIGINAL.details,
        testimonial: TALLER_ORIGINAL.testimonials[0],
        sessions: TALLER_ORIGINAL.sessions.map((s) => ({
            num: s.num,
            name: s.name,
            subtitle: s.subtitle,
            why: s.why,
            isTop: s.num === p.topWorkshopSession.num,
        })),
    };
}
