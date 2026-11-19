/* ═══════════════════════════════════════════════════════════════════════════
   PAEM-18 · COPY CLAUDE (propuesta para comparar en la pestaña "★ Copy Claude"
   de /prueba-resultados y en editor-copy-historias.html)
   No cambia el test real: el copy activo sigue en src/content/taller.ts.

   Cómo está pensado, historia por historia:
     1 · Dónde estás: una devolución corta, en sus palabras. Que sienta "me entienden".
     2 · Te identificás: las señales como las vive, lo que de verdad quiere
         ("lo que querés es…") y lo que le cuesta seguir así.
     3 · El regalo: algo que le ayuda hoy mismo, con su fuente.
     4 · La solución: el taller como el camino a lo que quiere, con confianza
         (testimonio, detalles claros) y una invitación fácil a conversar.
   Sin adjetivos con género ("cansado/a"): se dice lo que pasa, no cómo "está" la persona.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Dimension, Zona } from "./taller";

/* ── Historia 2: las señales (título corto + cómo se siente) y el canal de estrés ──
   El texto de la pregunta no cambia: es el mismo del test. */
export const DIMENSIONES_CLAUDE: Dimension[] = [
    {
        id: "dim1",
        part: "A",
        questions: [
            {
                id: 1,
                text: "Siento que las demandas y pendientes de mi día a día superan mi capacidad o mi tiempo para resolverlos.",
                symptom: "El día no te alcanza",
                fragment: "sentís que los pendientes avanzan más rápido que tu tiempo",
            },
            {
                id: 2,
                text: "Siento que los imprevistos o cambios repentinos me desestabilizan y me hacen perder la sensación de control.",
                symptom: "Un imprevisto te desarma el día",
                fragment: "un cambio de planes te descoloca y sentís que se te va el control",
            },
            {
                id: 3,
                text: "Me cuesta concentrarme, tomar decisiones simples o recordar cosas porque siento mi mente saturada.",
                symptom: "Tenés la cabeza llena",
                fragment: "tenés tantas cosas abiertas que te cuesta concentrarte, decidir o acordarte de lo simple",
            },
        ],
        channel: {
            name: "Tu Mente",
            longName: "Tu Mente (Saturación mental)",
            feel: "Terminás de trabajar y tu cabeza sigue repasando todo lo que falta.",
            cost: {
                title: "Lo que te cuesta vivir con la cabeza llena",
                description: "Al principio lo sacás a pura voluntad. Con los meses, las tareas simples te toman el doble, se te olvidan cosas y sentís que trabajás todo el día sin avanzar.",
            },
        },
    },
    {
        id: "dim2",
        part: "A",
        questions: [
            {
                id: 4,
                text: "Vivo con sensación de prisa interna o aceleración, como si me costara bajar la velocidad incluso cuando no hay urgencia.",
                symptom: "Andás con prisa aunque no haya apuro",
                fragment: "sentís una prisa por dentro que no te deja bajar la velocidad, ni cuando todo está tranquilo",
            },
            {
                id: 5,
                text: "Tengo poca paciencia y me irrito o frustro con facilidad ante pequeños retrasos, errores o interrupciones.",
                symptom: "La paciencia se te acaba rápido",
                fragment: "un atraso, un error o una interrupción pequeña te irrita más de lo que te gustaría",
            },
            {
                id: 6,
                text: "Me cuesta bajar revoluciones o desconectarme al terminar el día.",
                symptom: "Te cuesta bajar revoluciones en la noche",
                fragment: "terminás tus obligaciones y aun así no lográs desconectarte",
            },
        ],
        channel: {
            name: "Tus Emociones",
            longName: "Tus Emociones (Reactividad emocional)",
            feel: "Por dentro vas a mil y la paciencia se te acaba rápido, sobre todo al final del día.",
            cost: {
                title: "Lo que te cuesta vivir en modo urgencia",
                description: "La prisa te ayuda a sacar pendientes, pero la pagan tu calma y la gente que más querés. Llegás a tu casa con poca paciencia y sin ganas de disfrutar tu tiempo libre.",
            },
        },
    },
    {
        id: "dim3",
        part: "A",
        questions: [
            {
                id: 7,
                text: "Siento tensión muscular acumulada en mi cuerpo (cuello rígido, hombros levantados, dolor de espalda o mandíbula apretada).",
                symptom: "Tu cuerpo carga la tensión",
                fragment: "sentís el cuello rígido, los hombros arriba, la espalda cargada o la mandíbula apretada",
            },
            {
                id: 8,
                text: "Siento molestias en el cuerpo. Como problemas en el estómago (nudo en el estomago, pesadez), dolor de cabeza o latidos rápidos.",
                symptom: "El estrés se te va al cuerpo",
                fragment: "lo sentís como un nudo en el estómago, dolor de cabeza o el corazón acelerado",
            },
            {
                id: 9,
                text: "Siento que termino la jornada completamente drenado/a de energía, o despierto por la mañana sintiendo que el sueño no me recargó.",
                symptom: "Dormís y te levantás sin energía",
                fragment: "terminás el día sin batería o te despertás sintiendo que dormir no te recargó",
            },
        ],
        channel: {
            name: "Tu Cuerpo",
            longName: "Tu Cuerpo (Desgaste corporal)",
            feel: "Tu cuerpo se está llevando el estrés: en el cuello, en el estómago o en un sueño que no te recarga.",
            cost: {
                title: "La factura que el cuerpo cobra después",
                description: "Es fácil decirse «todavía aguanto», pero el cuerpo lleva la cuenta. Cuando levantarte sin energía y vivir con tensión se vuelve normal, tarde o temprano el cuerpo te obliga a parar.",
            },
        },
    },
    {
        id: "dim4",
        part: "A",
        questions: [
            {
                id: 10,
                text: "Me refugio automáticamente en pantallas, alcohol/sustancias o comida para \"anestesiar\" mi mente y no pensar.",
                symptom: "Buscás apagar la cabeza para no pensar",
                fragment: "al final del día te refugiás en el celular, la comida u otra cosa que te desconecte un rato",
            },
            {
                id: 11,
                text: "Postergo tareas importantes o me aíslo de las personas porque me siento bloqueado/a y sin energía para lidiar con ello.",
                symptom: "Postergás o preferís aislarte",
                fragment: "dejás para después cosas importantes o te alejás de la gente porque sentís que no te queda batería",
            },
            {
                id: 12,
                text: "Me cuesta poner límites o decir que 'no' y termino sacrificando mi descanso y tiempo personal.",
                symptom: "Te cuesta decir que no",
                fragment: "terminás cediendo tus pausas y tu tiempo personal por no poner límites a tiempo",
            },
        ],
        channel: {
            name: "Tus Hábitos y Límites",
            longName: "Tus Hábitos (Reacciones conductuales)",
            feel: "Le cumplís a todo el mundo durante el día y en la noche ya no queda nada para vos.",
            cost: {
                title: "La trampa de aguantar de día y apagarte de noche",
                description: "Cuando cedés tu descanso para no decir que no, llegás a la noche sin energía para nada más que una pantalla. Y las semanas se te van de lunes a viernes, sobreviviendo.",
            },
        },
    },
    {
        id: "dim5",
        part: "B",
        questions: [
            { id: 13, text: "Cuando termino mis obligaciones del día, logro desconectar mi mente por completo y dejar de rumiar o preocuparme por los pendientes." },
            { id: 14, text: "Reconozco rápidamente las señales de tensión en mi cuerpo y sé cómo relajarme para volver a la calma antes de llegar al límite." },
            { id: 15, text: "Sé qué actividades me recargan energía y las incorporo dentro de mi día sin sentir culpa." },
        ],
    },
    {
        id: "dim6",
        part: "B",
        questions: [
            { id: 16, text: "Cuando tengo una montaña de trabajo, cuento con un sistema claro para dividir el caos y avanzar con control." },
            { id: 17, text: "Ante una reunión difícil, imprevisto o reto fuerte, sé cómo usar la presión a mi favor para mantener la claridad sin bloquearme ni explotar." },
            { id: 18, text: "Soy capaz de pedir ayuda práctica, negociar plazos o comunicar mis límites de forma clara y asertiva para evitar que la carga laboral me desborde." },
        ],
    },
];

/* ── Las 4 historias, según la zona ── */
export const ZONAS_CLAUDE: Zona[] = [
    {
        key: "resiliente",
        min: 0,
        max: 25,
        title: "Resiliente",
        colorHex: "#10b981",
        ink: "#047857",
        story1: {
            validation: "Hoy recuperás más energía de la que gastás. Terminás el día y tu cabeza logra soltarlo.",
            action: "Esa reserva es la que te sostiene cuando vienen semanas pesadas. Vale la pena cuidarla.",
        },
        story2: {
            reflectTitle: "Lo que más te pesa, aunque sea poco",
            behindTitle: "¿Por qué hoy estás en equilibrio?",
            behind: [
                "Tenés retos como cualquier persona, pero sabés apagar la cabeza a tiempo y el trabajo no se te mete en el sueño.",
                "Lo que querés es que siga así cuando el trabajo apriete.",
            ],
            causeTitle: "¿Qué cuidar cuando suba la exigencia?",
        },
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "Pausa de 10 minutos sin pantalla",
            helps: "Te quita el cansancio de la tarde, para que llegués a la noche con la cabeza clara y energía para lo tuyo.",
            how: "A mitad de la tarde, dejá el celular en otro lado por 10 minutos. Cerrá los ojos y aflojá los hombros y la mandíbula. Respirá lento y dejá que la cabeza baje el ritmo.",
            why: "Una revisión de estudios sobre pausas cortas encontró que suben la energía y bajan el cansancio durante el día. Hacerla antes de saturarte evita que el cansancio se acumule hasta la noche.",
            time: "10 min",
            when: "A mitad de la tarde",
            source: "Albulescu et al. (2022). PLOS ONE.",
        },
        story4: {
            question: "¿te gustaría mantener esta calma también en tus semanas más pesadas?",
            subtitle: "Para eso tenemos un taller 1 a 1.",
            helps: "En 5 sesiones armás tu propio sistema para cuidar tu energía, así una mala semana no te saca de balance.",
            ctaPrompt: "¿Tenés dudas? Escribinos y lo vemos juntos.",
        },
    },
    {
        key: "fragil",
        min: 26,
        max: 50,
        title: "Frágil",
        colorHex: "#f59e0b",
        ink: "#b45309",
        story1: {
            validation: "Cumplís con todo, pero llegás al viernes con lo justo. Lo que descansás alcanza para volver a arrancar, y no mucho más.",
            action: "Con un margen tan corto, basta una semana pesada para sacarte de balance.",
        },
        story2: {
            reflectTitle: "¿Te pasa esto?",
            behindTitle: "¿Por qué te sentís así?",
            behind: [
                "Sos de las personas que responden: te piden algo y lo sacás, aunque eso le quite tiempo a tu descanso.",
                "Lo que querés es terminar la semana con energía para tu vida, sin sentir que andás siempre al filo.",
            ],
            causeTitle: "¿Qué te cuesta seguir así?",
        },
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "La pausa de 5 segundos antes de decir que sí",
            helps: "Te ayuda a dejar de sumar pendientes que después pagás con tu descanso.",
            how: "Hoy, antes de aceptar algo nuevo o quedarte más tarde, frená 5 segundos. Preguntate: «Si digo que sí a esto, ¿qué voy a dejar de hacer?». Si no podés soltar nada, negociá la fecha o decí que hoy no.",
            why: "El desgaste crece cuando das mucho más de lo que recibís a cambio, semana tras semana. Frenar antes de aceptar te devuelve la decisión.",
            time: "5 segundos",
            when: "Antes de decir que sí",
            source: "Siegrist (1996). Journal of Occupational Health Psychology.",
        },
        story4: {
            question: "¿te gustaría llegar al viernes con energía para disfrutar tu fin de semana?",
            subtitle: "Para eso tenemos un taller 1 a 1.",
            helps: "En 5 sesiones aprendés a ordenar tu carga, poner límites sin culpa y descansar de verdad antes de llegar al límite.",
            ctaPrompt: "¿Querés saber si es para vos? Escribinos.",
        },
    },
    {
        key: "bajo-presion",
        min: 51,
        max: 75,
        title: "Bajo Presión",
        colorHex: "#f97316",
        ink: "#c2410c",
        story1: {
            validation: "Estás gastando más energía de la que recuperás. Terminás el día sin batería, pero la cabeza sigue encendida con los pendientes.",
            action: "El cansancio de hoy se suma al de mañana. Te falta un momento para soltar el día.",
        },
        story2: {
            reflectTitle: "¿Te pasa esto?",
            behindTitle: "¿Por qué te sentís así?",
            behind: [
                "Dejás de trabajar, pero por dentro seguís con los pendientes. Así el cansancio de un día se pasa al siguiente y nunca termina de bajar.",
                "Lo que querés es cerrar el día en paz, dormir bien y tener paciencia para la gente que querés.",
            ],
            causeTitle: "¿Qué te cuesta seguir así?",
        },
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "Cierre de libreta al terminar el día",
            helps: "Saca los pendientes de tu cabeza para que podás estar en tu casa de verdad y dormirte más rápido.",
            how: "Hoy, al terminar de trabajar, anotá en un papel lo que quedó abierto y a qué hora lo vas a retomar mañana. Cerrá la libreta. Soltá el aire lento tres veces, aflojando los hombros.",
            why: "Tu cabeza repasa los pendientes de noche para no olvidarlos. Cuando los ve escritos, con hora para mañana, los puede soltar. En un estudio, quienes escribieron su lista de pendientes antes de dormir se durmieron más rápido.",
            time: "5 min",
            when: "Al terminar de trabajar",
            source: "Scullin et al. (2018). Journal of Experimental Psychology: General.",
        },
        story4: {
            question: "¿te gustaría salir del trabajo y que tu cabeza también salga?",
            subtitle: "Para eso tenemos un taller 1 a 1.",
            helps: "En 5 sesiones aprendés a cerrar el día, bajar la carga y recuperar tu energía, sin tener que cambiar de trabajo.",
            ctaPrompt: "¿Te queda alguna duda? Escribinos, sin compromiso.",
        },
    },
    {
        key: "riesgo-burnout",
        min: 76,
        max: 100,
        title: "Riesgo de Burnout",
        colorHex: "#e11d48",
        ink: "#be123c",
        story1: {
            validation: "Llevás mucho tiempo dando más de lo que tenés, y tu cuerpo ya lo está cobrando. Dormís o parás, y aun así no te recargás.",
            action: "Tu cuerpo te está pidiendo freno. Conviene bajar la alerta ahora, antes de que el agotamiento te obligue a parar.",
        },
        story2: {
            reflectTitle: "¿Te pasa esto?",
            behindTitle: "¿Por qué te sentís así?",
            behind: [
                "Querés descansar y no podés: la cabeza sigue a mil o el cuerpo sigue tenso. Después de tanto tiempo en modo emergencia, tu cuerpo perdió el freno. No es falta de voluntad.",
                "Lo que querés es volver a dormir profundo y sentir energía otra vez.",
            ],
            causeTitle: "¿Qué te cuesta seguir así?",
        },
        story3: {
            kicker: "Un regalo para que probés hoy",
            skill: "El doble suspiro para bajar la alerta",
            helps: "Baja tus pulsaciones y afloja el pecho en pocos minutos, cuando sentís que no das más.",
            how: "Tomá aire hondo por la nariz y, sin soltarlo, hacé una segunda inhalación corta para llenar del todo los pulmones. Después soltá el aire lento y largo por la boca. Repetilo durante 3 minutos.",
            why: "Las dos inhalaciones y la exhalación larga activan el freno natural de tu cuerpo. En un estudio de Stanford, practicarlo 5 minutos al día mejoró el ánimo más que la meditación.",
            time: "3 min",
            when: "Cuando sentís que no das más",
            source: "Balban et al. (2023). Cell Reports Medicine.",
        },
        story4: {
            question: "¿te gustaría salir del modo supervivencia y volver a sentirte con energía?",
            subtitle: "Te acompañamos 1 a 1, paso a paso.",
            helps: "En 5 sesiones aprendés a bajar la alerta de tu cuerpo, ordenar lo que te drena y recuperar tu energía.",
            ctaPrompt: "Cuesta dar el paso. Escribinos, aunque sea para preguntar.",
        },
    },
];

export const FRECUENCIA_CLAUDE = [
    { min: 80, lead: "Casi siempre" },
    { min: 60, lead: "Muchas veces" },
    { min: 40, lead: "A veces" },
    { min: 20, lead: "De vez en cuando" },
    { min: 0, lead: "Rara vez" },
];

/* ── Historia 4: el taller (los datos son los mismos; cambia cómo se cuenta) ── */
export const TALLER_CLAUDE = {
    details: [
        { label: "Formato", value: "5 sesiones, 1 por semana" },
        { label: "Modalidad", value: "1 a 1 en línea, según tu caso" },
        { label: "Duración", value: "1 hora por sesión" },
        { label: "Inversión", value: "$250 por el programa completo" },
    ],
    sessions: [
        {
            num: 1,
            name: "Desconectar",
            subtitle: "Que el trabajo se quede en el trabajo",
            why: "Cerrás el día y tu cabeza también. Los pendientes no llegan a la cena ni a la cama.",
        },
        {
            num: 2,
            name: "Organizar",
            subtitle: "Tu tiempo y tus límites, de vuelta",
            why: "Ordenás los pendientes, decís que no sin culpa y dejás de pagar el trabajo extra con tu descanso.",
        },
        {
            num: 3,
            name: "Recargar",
            subtitle: "Despertarte con energía",
            why: "Soltás la tensión del cuello, la espalda o el estómago, y el sueño vuelve a recargarte.",
        },
        {
            num: 4,
            name: "Regular",
            subtitle: "Bajar la prisa y la irritación en minutos",
            why: "Tenés herramientas para el momento en que el día se complica, y mantenés la paciencia y la claridad.",
        },
        {
            num: 5,
            name: "Integrar",
            subtitle: "Un ritmo que podés sostener",
            why: "Todo queda armado en tu rutina real, para no volver al mismo desgaste en unos meses.",
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
