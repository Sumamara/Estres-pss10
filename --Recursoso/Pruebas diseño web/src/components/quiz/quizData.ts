/* ═══════════════════════════════════════════════════════════════════════════
   CÁLCULO DEL TEST (PAEM-18)

   Acá vive la lógica: cómo se puntúan las respuestas y qué contenido le toca a
   cada resultado. El texto de la versión principal sale de src/content/taller.ts;
   los textos que solo usan las versiones anteriores del resultado están más abajo.
   ═══════════════════════════════════════════════════════════════════════════ */

import { DIMENSIONES, ESCALA, TALLER, ZONAS, type DimensionId, type ZoneKey, type Zona } from "@/content/taller";

export type { DimensionId, ZoneKey } from "@/content/taller";

/* ── Tipos que usan las pantallas ──────────────────────────────────────────── */

export interface ScaleOption {
    value: number;
    label: string;
    pct: string;
}

export interface DimensionItem {
    id: number;
    text: string;
}

export interface DimensionDef {
    id: DimensionId;
    part: "A" | "B";
    partTitle?: string;
    partSubtitle?: string;
    number: number;
    title: string;
    shortTitle: string;
    subtitle: string;
    colorHex: string;
    barClass: string;
    badgeClass: string;
    items: DimensionItem[];
}

export interface QuizQuestion {
    id: number;
    text: string;
    dimensionId: DimensionId;
    dimensionNumber: number;
    dimensionTitle: string;
    dimensionShortTitle: string;
    dimensionSubtitle: string;
    part: "A" | "B";
    partLabel: string;
    badgeClass: string;
}

/** El perfil de cada zona (antes "cuadrante"; hoy es la misma zona) */
export interface QuizBand {
    quadrantNumber: 1 | 2 | 3 | 4;
    key: ZoneKey;
    name: string;
    shortName: string;
    badge: string;
    workshopVerdict: string;
    message: string;
    color: string;
    ledePoints: { label: string; text: string }[];
    skill: string;
    how: string;
    why: string;
}

export interface MirrorAlert {
    id: string;
    title: string;
    conditionText: string;
    isActive: boolean;
    activeDesc: string;
    inactiveDesc: string;
}

export interface WorkshopSession {
    num: number;
    title: string;
    subtitle: string;
    needScore: number;
    why: string;
    priority: "Prioridad Alta" | "Recomendada" | "Refuerzo";
}

export interface DimensionScoreDetail {
    id: DimensionId;
    part: "A" | "B";
    number: number;
    title: string;
    shortTitle: string;
    subtitle: string;
    colorHex: string;
    barClass: string;
    badgeClass: string;
    score: number;
    interpretation: string;
}

export interface WearGapZone {
    key: ZoneKey;
    min: number;
    max: number;
    zoneLabel: string;
    shortLabel: string;
    title: string;
    rangeText: string;
    rangeLabel: string;
    description: string;
    desc: string;
    face: string;
    colorHex: string;
    gradient: string;
    badgeClass: string;
    cardClass: string;
}

export interface DailyMirrorProfile {
    headline: string;
    narrative: string;
    topSymptoms: string[];
}

export interface FutureCostProfile {
    channelName: string;
    title: string;
    description: string;
    takeaway: string;
}

/* ── Textos de versiones anteriores del resultado (la versión principal los lee de src/content/taller.ts) ── */

/* Títulos de las dos partes del test */
const PARTES: Record<"A" | "B", { title: string; subtitle: string }> = {
    A: {
        title: "Lo que hoy te desgasta",
        subtitle: "Cómo se manifiesta la presión en tu mente, tus emociones, tu cuerpo y tus hábitos.",
    },
    B: {
        title: "Tus Recursos de Regulación y Recuperación (Lo que te protege)",
        subtitle: "Tu capacidad para apagar la mente, volver a la calma y avanzar bajo presión.",
    },
};

/* Número, nombre, subtítulo y colores de cada dimensión */
const DIM_LEGACY: Record<DimensionId, { number: number; title: string; shortTitle: string; subtitle: string; colorHex: string; barClass: string; badgeClass: string }> = {
    dim1: {
        number: 1,
        title: "1. Tu Mente",
        shortTitle: "1. Mente",
        subtitle: "Saturación mental y sensación de falta de tiempo",
        colorHex: "#e11d48",
        barClass: "from-rose-500 to-rose-600",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    },
    dim2: {
        number: 2,
        title: "2. Reactividad Emocional",
        shortTitle: "2. Emoción",
        subtitle: "Prisa interna, poca paciencia y dificultad para desconectar",
        colorHex: "#ea580c",
        barClass: "from-orange-500 to-amber-600",
        badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    },
    dim3: {
        number: 3,
        title: "3. Desgaste Corporal",
        shortTitle: "3. Cuerpo",
        subtitle: "Tensión muscular, molestias físicas y fatiga",
        colorHex: "#d97706",
        barClass: "from-amber-500 to-yellow-600",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    },
    dim4: {
        number: 4,
        title: "4. Reacciones Conductuales",
        shortTitle: "4. Conducta",
        subtitle: "Escape en pantallas/comida, bloqueo o dificultad para decir que no",
        colorHex: "#7c3aed",
        barClass: "from-purple-500 to-indigo-600",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    },
    dim5: {
        number: 5,
        title: "5. Capacidad de Desconexión y Recuperación",
        shortTitle: "5. Desconexión",
        subtitle: "Apagar la mente, calma corporal y recarga sin culpa",
        colorHex: "#0d9488",
        barClass: "from-teal-500 to-emerald-500",
        badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
    },
    dim6: {
        number: 6,
        title: "6. Manejo de Problemas",
        shortTitle: "6. Manejo",
        subtitle: "Claridad ante problemas difíciles y firmeza para poner límites",
        colorHex: "#059669",
        barClass: "from-emerald-500 to-green-600",
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
};

/* Títulos de "qué hay detrás" y el tercer punto de cada zona (los dos primeros textos están en taller.ts · story2.behind) */
const LEDE_LEGACY: Record<ZoneKey, { labels: [string, string]; third: { label: string; text: string } }> = {
    resiliente: {
        labels: ["Dónde estás hoy", "Qué significa"],
        third: {
            label: "Por qué cuidar esto ahora",
            text: "Las mejores herramientas se entrenan cuando tenés margen y claridad, no cuando ya estás en crisis.",
        },
    },
    fragil: {
        labels: ["Dónde estás hoy", "Qué significa"],
        third: {
            label: "Qué toca hacer ahora",
            text: "Ganar margen: proteger tus pausas y tus límites antes de que la carga suba.",
        },
    },
    "bajo-presion": {
        labels: ["Dónde estás hoy", "Qué significa"],
        third: {
            label: "Por qué importa ahora",
            text: "Recuperar tu freno ahora, con pausas y cierres de jornada, evita que la presión llegue a agotarte.",
        },
    },
    "riesgo-burnout": {
        labels: ["Dónde estás hoy", "Qué está pasando en realidad"],
        third: {
            label: "Qué toca hacer ahora",
            text: "Aquí no sirve «echarle más ganas» ni exigirte más: primero necesitás apagar la alarma física de tu cuerpo y ordenar la carga.",
        },
    },
};

/* Nombre largo, rango, cara, descripción y colores de cada zona */
const ZONE_LEGACY: Record<ZoneKey, { shortLabel: string; zoneLabel: string; rangeText: string; rangeLabel: string; description: string; face: string; gradient: string; badgeClass: string; cardClass: string }> = {
    resiliente: {
        shortLabel: "Resiliente",
        zoneLabel: "Zona Verde · Resiliente",
        rangeText: "0 a 25 pts · Gran Reserva",
        rangeLabel: "0 a 25 pts",
        description: "Tus herramientas de recuperación superan con holgura a tu carga actual. Tu cuerpo y mente logran limpiar la tensión acumulada del día.",
        face: "😊",
        gradient: "from-emerald-500 to-teal-400",
        badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
        cardClass: "border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200",
    },
    fragil: {
        shortLabel: "Frágil",
        zoneLabel: "Zona Ámbar · Frágil",
        rangeText: "26 a 50 pts · Al Límite",
        rangeLabel: "26 a 50 pts",
        description: "Equilibrio funcional pero vulnerable. Gastás casi toda la energía que lográs recuperar; cualquier imprevisto laboral o personal puede romper tu balance.",
        face: "😐",
        gradient: "from-amber-500 to-yellow-500",
        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
        cardClass: "border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200",
    },
    "bajo-presion": {
        shortLabel: "Bajo Presión",
        zoneLabel: "Zona Naranja · Bajo Presión",
        rangeText: "51 a 75 pts · Sobrecarga Activa",
        rangeLabel: "51 a 75 pts",
        description: "Tus demandas cotidianas superan tu capacidad de descarga. El estrés se está acumulando en tu sistema sin tiempo suficiente para regenerar tu energía.",
        face: "😟",
        gradient: "from-orange-500 to-amber-600",
        badgeClass: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25",
        cardClass: "border-orange-500/40 bg-orange-50/80 dark:bg-orange-950/20 text-orange-950 dark:text-orange-200",
    },
    "riesgo-burnout": {
        shortLabel: "Riesgo de Burnout",
        zoneLabel: "Zona Roja · Riesgo de Burnout",
        rangeText: "76 a 100 pts · Agotamiento Crítico",
        rangeLabel: "76 a 100 pts",
        description: "Sobrecarga severa acumulada. Tu freno fisiológico está rebasado y tu sistema opera en agotamiento, forzando a tu cuerpo, sueño y mente a pagar un costo alto.",
        face: "😫",
        gradient: "from-rose-500 to-pink-600",
        badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
        cardClass: "border-rose-500/40 bg-rose-50/80 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200",
    },
};

/* Etiqueta, veredicto y mensaje del perfil de cada zona (antes "cuadrante") */
const BAND_LEGACY: Record<ZoneKey, { badge: string; workshopVerdict: string; message: string; color: string }> = {
    resiliente: {
        badge: "Reserva Saludable • Carga controlada + Buenos recursos",
        workshopVerdict: "Ideal como mantenimiento y perfeccionamiento de descanso profundo",
        message: "Tus demandas actuales están bajo control y contás con buenos hábitos para desconectar y resolver problemas. El taller te servirá para blindar tu tranquilidad antes de etapas de alta exigencia.",
        color: "text-emerald-600",
    },
    fragil: {
        badge: "Margen Corto • Carga y recuperación casi parejas",
        workshopVerdict: "Sí, recomendado para ganar margen y proteger tu descanso",
        message: "Hoy tu energía alcanza, pero con poco margen. Cuidar tu recuperación ahora evita que un imprevisto o una semana pesada te desbalancee.",
        color: "text-amber-500",
    },
    "bajo-presion": {
        badge: "Sobrecarga Activa • La carga supera a la recuperación",
        workshopVerdict: "Sí, muy recomendado para bajar la carga y recuperar tu freno",
        message: "Tus demandas superan lo que lográs recuperar y el desgaste se está acumulando. Necesitás herramientas para soltar la carga cada día.",
        color: "text-indigo-600",
    },
    "riesgo-burnout": {
        badge: "Freno Rebasado • Alta carga diaria + Poca recuperación",
        workshopVerdict: "Altamente Prioritario — Necesitás recuperar tu descanso y bajar la presión",
        message: "Lo que hoy te drena supera por mucho a lo que lográs recuperar. Tu sistema sigue en modo alerta incluso cuando intentás descansar en la noche o el fin de semana.",
        color: "text-rose-600",
    },
};

/* La frase de cierre de cada canal de estrés */
const CHANNEL_TAKEAWAY: Record<string, string> = {
    dim1: "No necesitás trabajar más horas: necesitás aprender a vaciar el ruido mental y ordenar la carga.",
    dim2: "Tu sistema nervioso necesita volver a distinguir entre una urgencia real y un día normal.",
    dim3: "Escuchar al cuerpo hoy te ahorra tener que frenar por agotamiento mañana.",
    dim4: "Poner límites a tiempo es lo único que te devuelve energía real para disfrutar tu vida personal.",
};

/* Alertas espejo (se encienden según las respuestas) */
const ALERTAS = {
    somatizador: {
        title: "Punto Ciego: Tu cuerpo está callando lo que tu mente aguanta",
        conditionText: "Tensión física alta aunque sintás la mente bajo control",
        description: "Aunque sentís que mentalmente tenés todo controlado, tu cuerpo (cuello, espalda, estómago o sueño) está absorbiendo la presión en silencio. Necesitás técnicas directas de descarga física.",
    },
    freno_roto: {
        title: "Punto Ciego: Terminás de trabajar, pero tu cabeza sigue encendida",
        conditionText: "Alta prisa emocional + Dificultad para desconectar al final del día",
        description: "Tu mayor desgaste no ocurre mientras trabajás, sino después: cuando terminás el día tu mente sigue repasando pendientes o preocupaciones, impidiendo que tu cuerpo se recupere de noche.",
    },
    anestesia: {
        title: "Punto Ciego: Escape en pantallas y falta de límites",
        conditionText: "Alto desgaste en hábitos y dificultad para poner límites",
        description: "Estás intentando compensar el agotamiento del día refugiándote en pantallas, postergando o cediendo tu tiempo personal. Eso te da un alivio de 10 minutos, pero te deja más cansado al día siguiente.",
    },
};

/* Relato del día a día (se arma con los fragmentos de tus respuestas más altas) */
const RELATO_TEXTOS = {
    headline: "Lo que tus respuestas revelan sobre tu día a día",
    closingCantDisconnect: "y cuando por fin terminás tus obligaciones del día, tu cabeza sigue dando vueltas a los pendientes sin lograr desconectar de verdad.",
    closingNoRest: "y casi no encontrás momentos de descanso real en los que podás recargar energía sin sentir culpa.",
    closingStretched: "haciendo que sintás que tu energía se estira cada vez más para llegar al final de la semana.",
    calm: "En este momento lográs llevar tus actividades diarias sin sentirte desbordado, manteniendo un buen margen entre las exigencias de afuera y tu calma interna.",
};

/* Etiquetas de nivel */
const NIVELES = {
    load: [
        {
            upTo: 25,
            label: "Bajo Control (0–25%)",
            className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        },
        {
            upTo: 50,
            label: "Tensión Leve (26–50%)",
            className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        },
        {
            upTo: 75,
            label: "Desgaste Moderado (51–75%)",
            className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        },
        {
            upTo: 100,
            label: "Saturación Alta (76–100%)",
            className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        },
    ],
    recovery: [
        {
            below: 40,
            label: "Poca Recuperación (<40%)",
            className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        },
        {
            below: 60,
            label: "Recuperación Parcial (40–59%)",
            className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        },
        {
            below: 101,
            label: "Freno Fuerte (≥60%)",
            className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        },
    ],
    dimensionLoad: { high: "Desgaste Alto", mid: "En Tensión", low: "Bajo Control" },
    dimensionRecovery: { high: "Buen Recurso", mid: "A Medio Camino", low: "Freno Débil" },
    sessionPriority: { high: "Prioridad Alta", mid: "Recomendada", low: "Refuerzo" },
} as const;

/* ── Contenido, en la forma que esperan las pantallas ──────────────────────── */

export const SCALE_OPTIONS: ScaleOption[] = ESCALA;

export const WEAR_GAP_ZONES: WearGapZone[] = ZONAS.map((z) => {
    const l = ZONE_LEGACY[z.key];
    return {
        key: z.key,
        min: z.min,
        max: z.max,
        zoneLabel: l.zoneLabel,
        shortLabel: l.shortLabel,
        title: z.title,
        rangeText: l.rangeText,
        rangeLabel: l.rangeLabel,
        description: l.description,
        desc: l.description,
        face: l.face,
        colorHex: z.colorHex,
        gradient: l.gradient,
        badgeClass: l.badgeClass,
        cardClass: l.cardClass,
    };
});

/** Cada dimensión con sus preguntas; la primera de cada parte lleva el título de la parte */
export const DIMENSIONS_DATA: DimensionDef[] = DIMENSIONES.map((d, i) => {
    const firstOfPart = i === 0 || DIMENSIONES[i - 1].part !== d.part;
    return {
        id: d.id,
        part: d.part,
        ...(firstOfPart ? { partTitle: PARTES[d.part].title, partSubtitle: PARTES[d.part].subtitle } : {}),
        ...DIM_LEGACY[d.id],
        items: d.questions.map((q) => ({ id: q.id, text: q.text })),
    };
});

export const quizQuestions: QuizQuestion[] = DIMENSIONES.flatMap((dim) =>
    dim.questions.map((q) => ({
        id: q.id,
        text: q.text,
        dimensionId: dim.id,
        dimensionNumber: DIM_LEGACY[dim.id].number,
        dimensionTitle: DIM_LEGACY[dim.id].title,
        dimensionShortTitle: DIM_LEGACY[dim.id].shortTitle,
        dimensionSubtitle: DIM_LEGACY[dim.id].subtitle,
        part: dim.part,
        partLabel: PARTES[dim.part].title,
        badgeClass: DIM_LEGACY[dim.id].badgeClass,
    }))
);

/* Las preguntas de carga con su síntoma, por número de pregunta */
const MIRROR_BY_ITEM = Object.fromEntries(
    DIMENSIONES.flatMap((d) => d.questions)
        .filter((q) => q.symptom && q.fragment)
        .map((q) => [q.id, { shortSymptom: q.symptom as string, narrativeFragment: q.fragment as string }])
) as Record<number, { shortSymptom: string; narrativeFragment: string }>;

/* El perfil de una zona, en la forma de los antiguos cuadrantes */
const bandOf = (z: Zona, quadrantNumber: 1 | 2 | 3 | 4): QuizBand => ({
    quadrantNumber,
    key: z.key,
    name: z.title,
    shortName: z.title,
    badge: BAND_LEGACY[z.key].badge,
    workshopVerdict: BAND_LEGACY[z.key].workshopVerdict,
    message: BAND_LEGACY[z.key].message,
    color: BAND_LEGACY[z.key].color,
    ledePoints: [
        { label: LEDE_LEGACY[z.key].labels[0], text: z.story2.behind[0] },
        { label: LEDE_LEGACY[z.key].labels[1], text: z.story2.behind[1] },
        LEDE_LEGACY[z.key].third,
    ],
    skill: z.story3.skill,
    how: z.story3.how,
    why: z.story3.why,
});

/* Lo que se guarda en Supabase sigue con los nombres de antes del cambio "cuadrante = zona",
   para que los datos nuevos coincidan con los ya guardados. Solo se usa al guardar. */
const SAVED_QUADRANT: Record<ZoneKey, { key: string; name: string }> = {
    resiliente: { key: "equilibrio-solido", name: "Equilibrio y Regulación Sólida" },
    fragil: { key: "resiliencia-al-limite", name: "Aguantando a Fuerza de Voluntad" },
    "bajo-presion": { key: "vulnerabilidad-latente", name: "Calma Frágil (Falta de Freno)" },
    "riesgo-burnout": { key: "desbalance-cronico", name: "Desgaste Acumulado · Alerta Roja" },
};

/* ── Perfiles de prueba (pantalla de vista previa) ─────────────────────────── */

export const DEMO_PRESETS: Record<string, { name: string; label: string; scores: number[] }> = {
    alerta_roja: {
        name: "Carlos R.",
        label: "Demo 1: Desbalance Crónico (Freno Roto)",
        scores: [80, 60, 80, 80, 80, 60, 80, 60, 80, 80, 60, 80, 20, 20, 20, 40, 40, 20],
    },
    somatizador: {
        name: "Andrea G.",
        label: "Demo 2: Somatizador Silencioso",
        scores: [20, 20, 40, 40, 40, 20, 80, 80, 80, 40, 20, 60, 40, 20, 40, 60, 60, 40],
    },
    resiliencia_limite: {
        name: "Martín V.",
        label: "Demo 3: Resiliencia al Límite (Sobrecompromiso)",
        scores: [60, 60, 40, 60, 60, 40, 60, 40, 60, 40, 40, 100, 40, 60, 60, 80, 80, 60],
    },
    equilibrio: {
        name: "Sofía L.",
        label: "Demo 4: Equilibrio y Regulación Sólida",
        scores: [20, 20, 20, 20, 20, 0, 20, 0, 20, 20, 0, 20, 80, 80, 80, 80, 80, 80],
    },
};

/* ── El cálculo ────────────────────────────────────────────────────────────── */

export const getStressProfile = (answers: number[]) => {
    // Asegurar 18 valores numéricos (0..100)
    const safeAnswers = Array.from({ length: 18 }, (_, i) =>
        typeof answers[i] === "number" && !Number.isNaN(answers[i]) ? answers[i] : 0
    );

    // Puntaje de cada dimensión: el promedio de sus preguntas
    const dimScores = {} as Record<DimensionId, number>;
    const dimensionsDetail: DimensionScoreDetail[] = DIMENSIONES.map((dim) => {
        const vals = dim.questions.map((q) => safeAnswers[q.id - 1]);
        const avg = Math.round(vals.reduce((acc, v) => acc + v, 0) / dim.questions.length);
        dimScores[dim.id] = avg;

        const words = dim.part === "A" ? NIVELES.dimensionLoad : NIVELES.dimensionRecovery;
        const interpretation = avg >= 60 ? words.high : avg >= 40 ? words.mid : words.low;

        return {
            id: dim.id,
            part: dim.part,
            ...DIM_LEGACY[dim.id],
            score: avg,
            interpretation,
        };
    });

    // Índices principales (0..100%)
    const loadIndex = Math.round((dimScores.dim1 + dimScores.dim2 + dimScores.dim3 + dimScores.dim4) / 4);
    const regIndex = Math.round((dimScores.dim5 + dimScores.dim6) / 2);
    const netDiff = regIndex - loadIndex;
    const rawDiff = loadIndex - regIndex; // Diferencia directa (-100% a +100%)

    // Nivel de desgaste (0 a 100): 0 = mucha reserva, 50 = carga y recuperación parejas, 100 = agotamiento
    const tensionIndex = Math.max(0, Math.min(100, Math.round(50 + rawDiff / 2)));
    const wearGap = tensionIndex;

    // La zona (y su perfil) según el nivel de desgaste
    const zoneIndex = Math.max(0, ZONAS.findIndex((z) => tensionIndex >= z.min && tensionIndex <= z.max));
    const zone = ZONAS[zoneIndex];
    const gapZone: WearGapZone = WEAR_GAP_ZONES[zoneIndex];
    const activeQuadrant = (zoneIndex + 1) as 1 | 2 | 3 | 4;
    const band = bandOf(zone, activeQuadrant);
    const netBalanceLabel = `${zone.title} (${tensionIndex}/100)`;
    const netBalanceClass = {
        resiliente: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
        fragil: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
        "bajo-presion": "text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
        "riesgo-burnout": "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
    }[zone.key];

    // Etiquetas de nivel de carga y de recuperación
    const loadLevel = NIVELES.load.find((l) => loadIndex <= l.upTo) ?? NIVELES.load[NIVELES.load.length - 1];
    const regLevel = NIVELES.recovery.find((l) => regIndex < l.below) ?? NIVELES.recovery[NIVELES.recovery.length - 1];

    // Canal de estrés más alto (entre las 4 dimensiones de carga)
    const dominantDim = DIMENSIONES.filter((d) => d.channel).sort((a, b) => dimScores[b.id] - dimScores[a.id])[0];
    const dominantChannel = `${dominantDim.channel!.longName} (${dimScores[dominantDim.id]}%)`;
    const futureCost: FutureCostProfile = {
        channelName: dominantDim.channel!.name,
        ...dominantDim.channel!.cost,
        takeaway: CHANNEL_TAKEAWAY[dominantDim.id],
    };

    // Relato del día a día: tus respuestas de carga más altas
    const rankedPartA = Array.from({ length: 12 }, (_, idx) => ({
        id: idx + 1,
        score: safeAnswers[idx],
        ...MIRROR_BY_ITEM[idx + 1],
    })).sort((a, b) => b.score - a.score);

    const top3PartA = rankedPartA.filter((item) => item.score >= 40).slice(0, 3);
    const item12 = safeAnswers[11];
    const item13 = safeAnswers[12];
    const item15 = safeAnswers[14];

    let dailyMirror: DailyMirrorProfile;
    if (top3PartA.length >= 2) {
        const closing =
            item13 <= 40
                ? RELATO_TEXTOS.closingCantDisconnect
                : item15 <= 40
                  ? RELATO_TEXTOS.closingNoRest
                  : top3PartA[2]
                    ? `además de que ${top3PartA[2].narrativeFragment}.`
                    : RELATO_TEXTOS.closingStretched;
        dailyMirror = {
            headline: RELATO_TEXTOS.headline,
            narrative: `En tus últimas semanas, ${top3PartA[0].narrativeFragment}; al mismo tiempo, ${top3PartA[1].narrativeFragment}, ${closing}`,
            topSymptoms: top3PartA.map((it) => `${it.shortSymptom} (${it.score}%)`),
        };
    } else {
        dailyMirror = {
            headline: RELATO_TEXTOS.headline,
            narrative: RELATO_TEXTOS.calm,
            topSymptoms: rankedPartA.slice(0, 2).map((it) => `${it.shortSymptom} (${it.score}%)`),
        };
    }

    // Alertas espejo
    const alertConditions: Record<keyof typeof ALERTAS, boolean> = {
        somatizador: dimScores.dim3 >= 60 && dimScores.dim1 <= 40,
        freno_roto: item13 <= 40 && dimScores.dim2 >= 60,
        anestesia: dimScores.dim4 >= 60,
    };
    const mirrorAlerts: MirrorAlert[] = (Object.keys(ALERTAS) as (keyof typeof ALERTAS)[]).map((id) => ({
        id,
        title: ALERTAS[id].title,
        conditionText: ALERTAS[id].conditionText,
        isActive: alertConditions[id],
        activeDesc: ALERTAS[id].description,
        inactiveDesc: "",
    }));
    const activeMirrorAlerts = mirrorAlerts.filter((a) => a.isActive);

    // Las 5 sesiones del taller y cuánto necesitás cada una
    const needScores: Record<number, number> = {
        1: Math.round((100 - item13 + dimScores.dim2) / 2),
        2: Math.round((dimScores.dim1 + item12 + (100 - dimScores.dim6)) / 3),
        3: Math.round((dimScores.dim3 + (100 - dimScores.dim5)) / 2),
        4: Math.round((dimScores.dim2 + dimScores.dim3) / 2),
        5: Math.round((dimScores.dim4 + (100 - dimScores.dim6)) / 2),
    };
    const workshopSessions: WorkshopSession[] = TALLER.sessions.map((s) => {
        const needScore = needScores[s.num];
        const p = NIVELES.sessionPriority;
        return {
            num: s.num,
            title: `Sesión ${s.num} · ${s.name}`,
            subtitle: s.subtitle,
            needScore,
            why: s.why,
            priority: needScore >= 55 ? p.high : needScore >= 35 ? p.mid : p.low,
        };
    });
    const topWorkshopSession: WorkshopSession = [...workshopSessions].sort((a, b) => b.needScore - a.needScore)[0];

    return {
        loadIndex,
        regIndex,
        netDiff,
        rawDiff,
        tensionIndex,
        wearGap,
        gapZone,
        /** Todo el contenido de tu zona (src/content/taller.ts) */
        zone,
        loadLevelLabel: loadLevel.label,
        loadLevelClass: loadLevel.className,
        regLevelLabel: regLevel.label,
        regLevelClass: regLevel.className,
        dominantChannel,
        netBalanceLabel,
        netBalanceClass,
        activeQuadrant,
        band,
        /** Lo que se guarda en Supabase (nombres de antes, para no mezclar datos) */
        savedQuadrant: SAVED_QUADRANT[zone.key],
        dimScores,
        dimensionsDetail,
        dailyMirror,
        futureCost,
        mirrorAlerts,
        activeMirrorAlerts,
        workshopSessions,
        topWorkshopSession,
        totalScore: loadIndex,
        score100: loadIndex,
    };
};
