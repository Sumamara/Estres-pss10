/* ═══════════════════════════════════════════════════════════════════════════
   PAEM-18 · CONTENIDO PRINCIPAL (COPY 2 · ACTIVO EN PRODUCCIÓN Y EN ★ COPY 2)

   Todo lo que edites en este archivo cambia de inmediato en:
     1. El resultado principal del test (/)
     2. La pestaña "★ Copy 2" de /prueba-resultados

   El copy anterior quedó guardado intacto en src/content/taller.original.ts
   (y lo podés comparar en vivo en la pestaña "Copy original" de /prueba-resultados).
   ═══════════════════════════════════════════════════════════════════════════ */

export type ZoneKey = "resiliente" | "fragil" | "bajo-presion" | "riesgo-burnout";
export type DimensionId = "dim1" | "dim2" | "dim3" | "dim4" | "dim5" | "dim6";

/* ═══════════════════════════════════════════════════════════════════════════
   PASO 2 · LAS PREGUNTAS
   Todas se responden con esta escala. El valor es el puntaje de esa respuesta (de 5 a 95).
   ═══════════════════════════════════════════════════════════════════════════ */

export const ESCALA = [
    { value: 5, label: "Casi nunca", pct: "5%" },
    { value: 20, label: "Rara vez", pct: "20%" },
    { value: 40, label: "Ocasionalmente", pct: "40%" },
    { value: 60, label: "Frecuentemente", pct: "60%" },
    { value: 80, label: "Muy frecuentemente", pct: "80%" },
    { value: 95, label: "Casi siempre", pct: "95%" },
];

export interface Pregunta {
    id: number;
    text: string;
    symptom?: string;
    fragment?: string;
}
export interface Canal {
    name: string;
    longName: string;
    feel: string;
    cost: { title: string; description: string };
}
export interface Dimension {
    id: DimensionId;
    part: "A" | "B";
    questions: Pregunta[];
    channel?: Canal;
}

export const DIMENSIONES: Dimension[] = [
    {
        // ── 1. Tu Mente · Saturación mental y sensación de falta de tiempo ──
        id: "dim1",
        part: "A",
        questions: [
            {
                id: 1,
                text: "Siento que las demandas y pendientes de mi día a día superan mi capacidad o mi tiempo para resolverlos.",
                symptom: "Sentís que el día no alcanza",
                fragment: "cerrás el día sintiendo que la lista de pendientes va más rápido que tu tiempo",
            },
            {
                id: 2,
                text: "Siento que los imprevistos o cambios repentinos me desestabilizan y me hacen perder la sensación de control.",
                symptom: "Un imprevisto te desarma el día",
                fragment: "un cambio de planes te saca de balance y te quita la sensación de control",
            },
            {
                id: 3,
                text: "Me cuesta concentrarme, tomar decisiones simples o recordar cosas porque siento mi mente saturada.",
                symptom: "Mente saturada",
                fragment: "tenés la cabeza tan llena de cosas que te cuesta concentrarte, decidir o recordar lo simple",
            },
        ],
        channel: {
            name: "Tu Mente",
            longName: "Tu Mente (Saturación mental)",
            feel: "Aunque terminés de trabajar, tu cabeza sigue dándole vueltas a todo lo que falta hacer.",
            cost: {
                title: "Lo que cuesta normalizar la saturación mental",
                description: "Al principio seguís cumpliendo a pura fuerza de voluntad. Con los meses, cualquier tarea simple te toma el doble de esfuerzo, aparecen olvidos frecuentes y sentís que trabajás todo el día sin avanzar.",
            },
        },
    },
    {
        // ── 2. Reactividad Emocional ──
        id: "dim2",
        part: "A",
        questions: [
            {
                id: 4,
                text: "Vivo con sensación de prisa interna o aceleración, como si me costara bajar la velocidad incluso cuando no hay urgencia.",
                symptom: "Vivís con prisa aunque no haya apuro",
                fragment: "andás con una prisa interna que no te deja bajar la velocidad ni cuando todo está tranquilo",
            },
            {
                id: 5,
                text: "Tengo poca paciencia y me irrito o frustro con facilidad ante pequeños retrasos, errores o interrupciones.",
                symptom: "Tenés la paciencia al límite",
                fragment: "notás que tenés poca paciencia y que los retrasos o interrupciones te irritan",
            },
            {
                id: 6,
                text: "Me cuesta bajar revoluciones o desconectarme al terminar el día.",
                symptom: "Te cuesta desconectar la mente en la noche",
                fragment: "terminás tus obligaciones del día y aun así te cuesta bajar revoluciones y desconectarte",
            },
        ],
        channel: {
            name: "Tus Emociones",
            longName: "Tus Emociones (Reactividad emocional)",
            feel: "Sentís que andas acelerado y poca paciencia, sobre todo al final del día.",
            cost: {
                title: "Lo que cuesta vivir en modo urgencia",
                description: "Vivir apurado te sirve para sacar pendientes, pero el precio lo pagan tu tranquilidad y tus relaciones más cercanas. Terminás irritable con quienes más querés y sin calma para disfrutar tu tiempo libre."
            },
        },
    },
    {
        // ── 3. Desgaste Corporal ──
        id: "dim3",
        part: "A",
        questions: [
            {
                id: 7,
                text: "Siento tensión muscular acumulada en mi cuerpo (cuello rígido, hombros levantados, dolor de espalda o mandíbula apretada).",
                symptom: "Tu cuerpo guarda toda la tensión",
                fragment: "sentís la presión en el cuello rígido, los hombros, la espalda o la mandíbula apretada",
            },
            {
                id: 8,
                text: "Siento molestias en el cuerpo. Como problemas en el estómago (nudo en el estomago, pesadez), dolor de cabeza o latidos rápidos.",
                symptom: "El cuerpo te pasa factura",
                fragment: "el estrés se te va directo al cuerpo con pesadez o nudo en el estómago, dolor de cabeza o latidos rápidos",
            },
            {
                id: 9,
                text: "Siento que termino la jornada completamente drenado/a de energía, o despierto por la mañana sintiendo que el sueño no me recargó.",
                symptom: "Te sentís cansado",
                fragment: "terminás el día sin energía o te despertás por la mañana sintiendo que el sueño no te recargó",
            },
        ],
        channel: {
            name: "Tu Cuerpo",
            longName: "Tu Cuerpo (Desgaste corporal)",
            feel: "Tu cuerpo está absorbiendo el estrés: en la tensión, en las molestias o en un sueño que no repara.",
            cost: {
                title: "La factura que el cuerpo termina cobrando",
                description: "Uno suele decirse «no pasa nada, todavía aguanto», pero el cuerpo lleva la cuenta. Cuando levantarte cansado o vivir contracturado se vuelve tu estado normal, el cuerpo en algún momento te obliga a frenar de golpe.",
            },
        },
    },
    {
        // ── 4. Reacciones Conductuales ──
        id: "dim4",
        part: "A",
        questions: [
            {
                id: 10,
                text: "Me refugio automáticamente en pantallas, alcohol/sustancias o comida para \"anestesiar\" mi mente y no pensar.",
                symptom: "Buscás anestesiar la mente para no pensar",
                fragment: "llegás tan saturado que te refugiás en pantallas, comida o algo que te apague la cabeza un rato",
            },
            {
                id: 11,
                text: "Postergo tareas importantes o me aíslo de las personas porque me siento bloqueado/a y sin energía para lidiar con ello.",
                symptom: "Te bloqueás o preferís aislarte",
                fragment: "postergás cosas importantes o te aislás de los demás porque sentís que ya no tenés batería",
            },
            {
                id: 12,
                text: "Me cuesta poner límites o decir que 'no' y termino sacrificando mi descanso y tiempo personal.",
                symptom: "Te cuesta decir que no y cedés tu descanso",
                fragment: "terminás sacrificando tus pausas y tu tiempo personal por no saber poner límites a tiempo",
            },
        ],
        channel: {
            name: "Tus Hábitos y Límites",
            longName: "Tus Hábitos (Reacciones conductuales)",
            feel: "Terminás el día con la batería en cero y sin energía para hacer lo que te gusta.",
            cost: {
                title: "Quedarte sin energía para lo que de verdad querés",
                description: "Llegás a la noche tan vacío de energía que lo único que querés es desconectar con cualquier escape. Sin darte cuenta, las semanas se te pasan solo sobreviviendo de lunes a viernes, sin tiempo ni batería para disfrutar lo tuyo.",
            },
        },
    },
    {
        // ── 5. Capacidad de Desconexión y Recuperación ──
        id: "dim5",
        part: "B",
        questions: [
            {
                id: 13,
                text: "Cuando termino mis obligaciones del día, logro desconectar mi mente por completo y dejar de rumiar o preocuparme por los pendientes.",
            },
            {
                id: 14,
                text: "Reconozco rápidamente las señales de tensión en mi cuerpo y sé cómo relajarme para volver a la calma antes de llegar al límite.",
            },
            {
                id: 15,
                text: "Sé qué actividades me recargan energía y las incorporo dentro de mi día sin sentir culpa.",
            },
        ],
    },
    {
        // ── 6. Competencia de Manejo y Flexibilidad ──
        id: "dim6",
        part: "B",
        questions: [
            {
                id: 16,
                text: "Cuando tengo una montaña de trabajo, cuento con un sistema claro para dividir el caos y avanzar con control.",
            },
            {
                id: 17,
                text: "Ante una reunión difícil, imprevisto o reto fuerte, sé cómo usar la presión a mi favor para mantener la claridad sin bloquearme ni explotar.",
            },
            {
                id: 18,
                text: "Soy capaz de pedir ayuda práctica, negociar plazos o comunicar mis límites de forma clara y asertiva para evitar que la carga laboral me desborde.",
            },
        ],
    },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PASO 4 · LAS 4 HISTORIAS DEL RESULTADO (SEGÚN LA ZONA)
     story1 · Dónde estás hoy (devolución corta, directa y validante)
     story2 · Identificación profunda (tus señales, por qué te pasa y cuánto te cuesta)
     story3 · Un regalo para hoy (una herramienta rápida que te alivia ya)
     story4 · La solución (cómo el taller te ayuda a lograr lo que querés)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface Zona {
    key: ZoneKey;
    min: number;
    max: number;
    title: string;
    colorHex: string;
    ink: string;
    story1: { validation: string; action: string };
    story2: { reflectTitle: string; behindTitle: string; behind: string[]; causeTitle: string };
    story3: { kicker?: string; skill: string; how: string; why: string; helps: string; time: string; when: string; source: string };
    story4: {
        question: string;
        subtitle?: string;
        helps: string;
        ctaPrompt?: string;
        extraAccordion?: { title: string; body: string; linkText?: string; linkUrl?: string };
    };
    story5?: {
        kicker: string;
        headline: string;
        empathy: string;
        giftLabel: string;
        giftBody: string;
        stepsTitle: string;
        steps: string[];
        ctaPrompt: string;
        ctaLabel: string;
        whatsappText: string;
    };
}

export const ZONAS: Zona[] = [
    {
        key: "resiliente",
        min: 0,
        max: 25,
        title: "Óptimo",
        colorHex: "#10b981",
        ink: "#047857",
        // Historia 1 · Dónde estás hoy (corto y directo)
        story1: {
            validation: "Hoy recuperás más energía de la que gastás. Tu forma de descansar está funcionando.",
            action: "Esa reserva es tu margen para las semanas pesadas. Vale la pena cuidarla.",
        },
        // Historia 2 · Identificación
        story2: {
            reflectTitle: "Lo que muestran tus respuestas",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Tenés retos como cualquier persona, pero sabés apagar la cabeza a tiempo y no dejás que el trabajo se te meta en el sueño ni en el cuerpo.",
                "Ese margen que hoy tenés es lo que te permite disfrutar tu tiempo libre sin culpa.",
            ],
            causeTitle: "¿Qué cuidar cuando suba la exigencia?",
        },
        // Historia 3 · Un regalo para hoy (Reto / Meta)
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "Elegí una meta que querás cumplir y dale 15 minutos hoy",
            helps: "Aprovecha que hoy tenés claridad y buena energía para avanzar en algo que te ilusione a vos, no solo en los pendientes del día.",
            how: "Preguntate hoy: «¿Qué meta o reto personal me gustaría cumplir en los próximos meses?». Elegí una acción pequeña que puedas hacer en 15 minutos. Agendala y hacela hoy mismo antes de revisar tus pendientes de siempre.",
            why: "Cuando tu energía está en equilibrio, tu mente tiene espacio para crecer. Poner tu atención en una meta propia con un paso concreto hoy multiplica tu motivación y tu enfoque.",
            time: "15 min",
            when: "Hoy mismo",
            source: "Locke & Latham (2002). American Psychologist.",
        },
        // Historia 4 · La solución (El taller)
        story4: {
            question: "¿querés herramientas para aprovechar la calma y mejorar lo que ya tenés?",
            subtitle: "Te ayudamos a lograrlo paso a paso en nuestro taller",
            helps: "En 5 sesiones armás tu propio sistema para cuidar tu energía y potenciar tu enfoque, así ni las semanas más pesadas te sacan de balance.",
            ctaPrompt: "¿Querés ver si este taller es para vos? Escribinos y lo conversamos.",
            extraAccordion: {
                title: "¿Me siento bien con el estrés, qué más puedo hacer?",
                body: "Te recomendamos llenar la encuesta del taller de habilidades para que descubrás qué te beneficia más aprender en este momento.",
                linkText: "taller de habilidades",
                linkUrl: "https://inner-base.com/habilidadesangulares",
            },
        },
    },
    {
        key: "fragil",
        min: 26,
        max: 50,
        title: "Vulnerable",
        colorHex: "#f59e0b",
        ink: "#b45309",
        // Historia 1 · Dónde estás hoy (corto y directo)
        story1: {
            validation: "Venís cumpliendo con todo, pero tu margen es corto. Probablemente solés llegar al final de la semana con lo justo y lo que descansás apenas te alcanza para volver a arrancar.",
            action: "Cualquier imprevisto o semana pesada te puede sacar de balance.",
        },
        // Historia 2 · Identificación
        story2: {
            reflectTitle: "¿Te está pasando esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Como sos capaz y responsable, seguís sumando cosas y sacándolas adelante, pero lo estás pagando con tu reserva de energía.",
                "Lo que en el fondo querés es terminar el día tranquilo, con cabeza y energía para tu vida personal, sin sentir que estás siempre al filo.",
            ],
            causeTitle: "¿Cuánto te cuesta seguir así?",
        },
        // Historia 3 · Un regalo para hoy
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "La pausa de 5 segundos antes de decir que sí",
            helps: "Te da un momento para decidir antes de agregar más carga con pendientes que después pagás con tu descanso.",
            how: "Hoy, antes de aceptar algo nuevo o quedarte más tarde, frená 5 segundos. Preguntate: «Si digo que sí a esto, ¿qué voy a posponer o delegar?». Si no podés soltar nada, negociá la fecha o decí que hoy no.",
            why: "Cuando tu margen de energía está justo, el desgaste viene por seguir sumando compromisos en automático sin soltar ninguno.",
            time: "5 segundos",
            when: "Antes de decir que sí",
            source: "Siegrist (1996). Journal of Occupational Health Psychology.",
        },
        // Historia 4 · La solución (El taller)
        story4: {
            question: "¿sentís que es momento de un cambio?",
            subtitle: "Te ayudamos a lograrlo paso a paso en nuestro taller",
            helps: "En 5 sesiones prácticas aprendés a organizar tu día para volver a sentir que tenés tiempo y energía de sobra para vos y lo que más disfrutás.",
            ctaPrompt: "¿Querés saber cómo funcionaría en tu caso? Escribinos y te contamos.",
        },
    },
    {
        key: "bajo-presion",
        min: 51,
        max: 75,
        title: "Sobrecarga",
        colorHex: "#f97316",
        ink: "#c2410c",
        // Historia 1 · Dónde estás hoy (corto y directo)
        story1: {
            validation: "Estás gastando más energía de la que lográs recuperar. Probablemente solés terminar el día con cansancio, pero tu cabeza sigue encendida y el desgaste se te acumula.",
            action: "El desgaste ya se siente acumulado. Recargar un poco cada día evita que llegue a agotarte.",
        },
        // Historia 2 · Identificación
        story2: {
            reflectTitle: "¿Te está pasando esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Llevás semanas juntando el cansancio de un día con el del siguiente porque, aunque dejés de trabajar, por dentro seguís pensando en los pendientes.",
                "Lo que más necesitás hoy es volver a cerrar el día en paz, lograr un sueño que sí te recargue y recuperar tu paciencia y tu claridad.",
            ],
            causeTitle: "¿Cuánto te cuesta seguir así?",
        },
        // Historia 3 · Un regalo para hoy
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "Cierre de libreta al terminar tu día",
            helps: "Te saca los pendientes de la cabeza para que puedas descansar, estar presente en tu casa y dormirte más rápido.",
            how: "Hoy al terminar de trabajar, anotá en un papel lo que quedó abierto y a qué hora exacta lo vas a retomar mañana. Cerrá la libreta y soltá el aire tres veces bien lento aflojando los hombros.",
            why: "Tu cerebro te repite los pendientes de noche porque teme que los olvidés. Cuando los ve escritos con hora para mañana, entiende que ya puede descansar.",
            time: "5 min",
            when: "Al terminar de trabajar",
            source: "Scullin et al. (2018). Journal of Experimental Psychology: General.",
        },
        // Historia 4 · La solución (El taller)
        story4: {
            question: "¿sentís que es momento de un cambio?",
            subtitle: "Te ayudamos a lograrlo paso a paso en nuestro taller",
            helps: "En 5 sesiones prácticas aprendés a desconectar la mente al salir de trabajar, volver a descansar profundo y recuperar tu energía y tu calma de todos los días.",
            ctaPrompt: "¿Te gustaría ver si este taller es para vos? Conversemos sin compromiso.",
        },
    },
    {
        key: "riesgo-burnout",
        min: 76,
        max: 100,
        title: "Riesgo de Burnout",
        colorHex: "#e11d48",
        ink: "#be123c",
        // Historia 1 · Dónde estás hoy (corto y directo)
        story1: {
            validation: "Llevás mucho tiempo sosteniendo de más y tu cuerpo ya te está pasando la factura. Probablemente solés sentir que, aunque parés o durmás, nada te termina de recargar.",
            action: "En este estado, descansar ya no alcanza por sí solo. Conviene empezar a bajar la alerta de tu cuerpo con intención, desde hoy.",
        },
        // Historia 2 · Identificación
        story2: {
            reflectTitle: "¿Te está pasando esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Entendemos lo frustrante que es querer descansar y sentir que la cabeza sigue a mil o el cuerpo sigue tenso. Tu sistema nervioso se acostumbró a vivir en emergencia y perdió el freno.",
                "Lo que necesitás ahora es apagar esa alerta física, volver a dormir profundo y recuperar tu vitalidad paso a paso.",
            ],
            causeTitle: "¿Cuánto te cuesta seguir así?",
        },
        // Historia 3 · Un regalo para hoy
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "El doble suspiro para apagar la alerta",
            helps: "Baja tus pulsaciones y afloja la tensión del pecho en 3 minutos cuando sentís que estás al límite.",
            how: "Tomá aire hondo por la nariz y, sin soltarlo, hacé una segunda inhalación cortita para llenar del todo los pulmones. Después soltá el aire lento y largo por la boca. Repetilo durante 3 minutos.",
            why: "Ese doble respiro seguido de una exhalación larga activa el freno natural de tu sistema nervioso y baja la aceleración física en pocos minutos.",
            time: "3 min",
            when: "Cuando sentís que no das más",
            source: "Balban et al. (2023). Cell Reports Medicine.",
        },
        // Historia 4 · La solución (El taller)
        story4: {
            question: "¿sentís que es momento de un cambio?",
            subtitle: "Te ayudamos a lograrlo paso a paso en nuestro taller",
            helps: "En 5 sesiones personalizadas aprendés a apagar el estado de alerta de tu cuerpo, ordenar lo que te drena y volver a sentirte con energía.",
            ctaPrompt: "Sabemos que dar el paso cuesta cuando venís con tanto cansancio. Escribinos y vemos cómo ayudarte.",
        },
        // Historia 5 · Pestaña extra para estado crítico (Regalo genuino de 1 sesión sin compromiso)
        story5: {
            kicker: "Un regalo genuino para vos",
            headline: "nadie merece vivir con una carga como la que estás sintiendo hoy.",
            empathy:
                "Sabemos lo pesado que es seguir cumpliendo con todo por fuera mientras por dentro sentís que el cuerpo te pasa factura, que la cabeza no se apaga y que ni durmiendo terminás de recuperar fuerzas.",
            giftLabel: "1 sesión gratuita · Sin ningún compromiso",
            giftBody:
                "Por eso queremos hacerte un regalo genuino: una sesión 1 a 1 sin costo y sin compromiso para escucharte, ayudarte a soltar presión y que te llevés un primer alivio real para esta misma semana.",
            stepsTitle: "¿Cómo funciona esta sesión de regalo?",
            steps: [
                "Sin ventas ni compromiso: es un espacio real para darte claridad y ayudarte a bajar la carga hoy.",
                "Enfocada en lo que más te pesa: revisamos juntos qué te está drenando más energía y qué podés soltar primero.",
                "A tu ritmo: nos escribís por WhatsApp y nos ponemos de acuerdo con el día y la hora que mejor te queden.",
            ],
            ctaPrompt: "Si te interesa recibirla, tocá el botón de WhatsApp y coordinamos la fecha:",
            ctaLabel: "Coordinar mi sesión de regalo",
            whatsappText: "Hice el test de estrés y salí en Riesgo de Burnout. Me gustaría aceptar el regalo de la sesión sin compromiso y ponernos de acuerdo con la fecha.",
        },
    },
];

/* Historia 2: cuánto te pasa cada señal, dicho con palabras ("Te suele pasar que sentís que…").
   Se usa la primera cuyo mínimo alcanza tu respuesta. */
export const FRECUENCIA = [
    { min: 60, lead: "Te suele pasar que" },
    { min: 40, lead: "A veces te pasa que" },
    { min: 20, lead: "De vez en cuando te pasa que" },
    { min: 0, lead: "Rara vez te pasa que" },
];

/* Historia 4: el taller (igual para todas las zonas) */
export const TALLER = {
    details: [
        { label: "Formato", value: "5 sesiones prácticas (1 por semana)" },
        { label: "Modalidad", value: "1 a 1 en línea, adaptado a tu caso" },
        { label: "Duración", value: "1 hora por sesión" },
        { label: "Inversión", value: "$250 (programa completo)" },
    ],
    sessions: [
        {
            num: 1,
            name: "Desconectar",
            subtitle: "Salir mentalmente del trabajo",
            why: "Para que cierres tu jornada y tu cabeza también se apague, sin llevarte los pendientes a la cena ni a la cama.",
        },
        {
            num: 2,
            name: "Organizar",
            subtitle: "Recuperá el control de tu tiempo y tus límites",
            why: "Para ordenar la montaña de pendientes, decir que no sin culpa y dejar de pagar el trabajo extra con tu descanso.",
        },
        {
            num: 3,
            name: "Recargar",
            subtitle: "Volvé a sentirte con energía todo el día",
            why: "Aprender a tener una rutina para que escuchés a tu cuerpo y aprendás cuándo descansar para maximizar la energía.",
        },
        {
            num: 4,
            name: "Regular",
            subtitle: "Aprender a regular los picos de estrés",
            why: "Herramientas para saber qué hacer en momentos de crisis y en picos de carga.",
        },
        {
            num: 5,
            name: "Integrar",
            subtitle: "Garantizar que podás usar las herramientas en tu día a día",
            why: "Resumen y práctica con situaciones diarias para asegurar que lo podás usar en tu día a día.",
        },
    ],
    testimonials: [
        {
            name: "María Vargas",
            role: "Ingeniera de alimentos",
            initials: "MV",
            quote: "Súper recomendado. Vivía en modo supervivencia y ya era normal para mí. Gracias a las herramientas del taller logré incorporar hábitos que me permitieron salir del bucle de estado de alerta en el que vivía.",
        },
    ],
};

/* Historia 4: el botón "Conversemos por WhatsApp" (leído desde .env.local: NEXT_PUBLIC_WHATSAPP_NUMBER) */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
