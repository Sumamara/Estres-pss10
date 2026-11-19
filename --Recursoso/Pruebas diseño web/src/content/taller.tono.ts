/* ═══════════════════════════════════════════════════════════════════════════
   PAEM-18 · COPY TONO (propuesta para comparar en la pestaña "★ Copy Tono"
   de /prueba-resultados y en editor-copy-historias.html)
   No cambia el test real: el copy activo sigue en src/content/taller.ts.

   Escrito con la guía de tono de Inner Base (21-empresa-tono-de-voz):
     · Amigo experto: sabe del tema, pero habla al mismo nivel.
     · Primero valida, después propone.
     · Cada dato lleva su fuente (autor y año). Sin fuente, no hay dato.
     · Sin promesas absolutas: "herramientas para…", "ayuda a…", "suele…".
     · Vocabulario de marca: herramientas, evidencia, practicar, bienestar.
     · Vos (es una conversación 1 a 1) y sin adjetivos con género.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Dimension, Zona } from "./taller";

/* ── Historia 2: las señales (título corto + cómo se siente) y el canal de estrés ──
   El texto de la pregunta no cambia: es el mismo del test. */
export const DIMENSIONES_TONO: Dimension[] = [
    {
        id: "dim1",
        part: "A",
        questions: [
            {
                id: 1,
                text: "Siento que las demandas y pendientes de mi día a día superan mi capacidad o mi tiempo para resolverlos.",
                symptom: "Sentís que el día no alcanza",
                fragment: "sentís que los pendientes avanzan más rápido que tu tiempo",
            },
            {
                id: 2,
                text: "Siento que los imprevistos o cambios repentinos me desestabilizan y me hacen perder la sensación de control.",
                symptom: "Los imprevistos te descolocan",
                fragment: "un cambio de planes te saca de balance y te quita la sensación de control",
            },
            {
                id: 3,
                text: "Me cuesta concentrarme, tomar decisiones simples o recordar cosas porque siento mi mente saturada.",
                symptom: "Mente saturada",
                fragment: "tenés tantas cosas abiertas que te cuesta concentrarte, decidir o recordar",
            },
        ],
        channel: {
            name: "Tu Mente",
            longName: "Tu Mente (Saturación mental)",
            feel: "Tu cabeza sigue procesando pendientes aunque ya terminaste. Ahí es donde más se te acumula el estrés.",
            cost: {
                title: "Lo que cuesta normalizar la saturación mental",
                description: "Al principio se compensa con fuerza de voluntad. Si se sostiene por meses, las tareas simples suelen tomar más tiempo, aparecen olvidos y queda la sensación de trabajar todo el día sin avanzar.",
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
                symptom: "Prisa interna",
                fragment: "sentís una prisa por dentro que no te deja bajar la velocidad, aunque no haya urgencia",
            },
            {
                id: 5,
                text: "Tengo poca paciencia y me irrito o frustro con facilidad ante pequeños retrasos, errores o interrupciones.",
                symptom: "Poca paciencia",
                fragment: "los atrasos, errores o interrupciones pequeñas te irritan más de lo que te gustaría",
            },
            {
                id: 6,
                text: "Me cuesta bajar revoluciones o desconectarme al terminar el día.",
                symptom: "Te cuesta desconectar al final del día",
                fragment: "terminás tus obligaciones y aun así te cuesta bajar revoluciones",
            },
        ],
        channel: {
            name: "Tus Emociones",
            longName: "Tus Emociones (Reactividad emocional)",
            feel: "La presión se te nota primero en la prisa interna y en la paciencia, sobre todo al final del día.",
            cost: {
                title: "Lo que cuesta vivir en modo urgencia",
                description: "La prisa ayuda a resolver pendientes, pero esa tensión se filtra a tus relaciones cercanas y te quita espacio para disfrutar, incluso cuando todo está bien.",
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
                symptom: "Tensión en el cuerpo",
                fragment: "sentís el cuello rígido, los hombros arriba, la espalda cargada o la mandíbula apretada",
            },
            {
                id: 8,
                text: "Siento molestias en el cuerpo. Como problemas en el estómago (nudo en el estomago, pesadez), dolor de cabeza o latidos rápidos.",
                symptom: "Molestias físicas",
                fragment: "el estrés se te nota como un nudo en el estómago, dolor de cabeza o latidos rápidos",
            },
            {
                id: 9,
                text: "Siento que termino la jornada completamente drenado/a de energía, o despierto por la mañana sintiendo que el sueño no me recargó.",
                symptom: "Un sueño que no recarga",
                fragment: "terminás el día sin energía o te despertás sintiendo que dormir no te recargó",
            },
        ],
        channel: {
            name: "Tu Cuerpo",
            longName: "Tu Cuerpo (Desgaste corporal)",
            feel: "Tu cuerpo es donde más se nota la carga: en la tensión, en las molestias o en un sueño que no repara.",
            cost: {
                title: "La factura que el cuerpo cobra después",
                description: "Es común decirse «todavía aguanto», pero el cuerpo lleva la cuenta. Cuando despertar sin energía o vivir con tensión se vuelve costumbre, el cuerpo puede terminar obligándote a parar.",
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
                symptom: "Buscás desconectar para no pensar",
                fragment: "al final del día buscás refugio en pantallas, comida u otra cosa que te apague la cabeza un rato",
            },
            {
                id: 11,
                text: "Postergo tareas importantes o me aíslo de las personas porque me siento bloqueado/a y sin energía para lidiar con ello.",
                symptom: "Postergar o aislarte",
                fragment: "dejás cosas importantes para después o preferís aislarte porque sentís que no te queda energía",
            },
            {
                id: 12,
                text: "Me cuesta poner límites o decir que 'no' y termino sacrificando mi descanso y tiempo personal.",
                symptom: "Te cuesta poner límites",
                fragment: "te cuesta decir que no y terminás cediendo tus pausas y tu tiempo personal",
            },
        ],
        channel: {
            name: "Tus Hábitos y Límites",
            longName: "Tus Hábitos (Reacciones conductuales)",
            feel: "Se nota al final del día: cuesta poner límites, postergás o buscás algo que te desconecte.",
            cost: {
                title: "La trampa de aguantar de día y desconectarte de noche",
                description: "Cuando cedés tus pausas por no decir que no, llegás a la noche sin energía y lo único que querés es desconectarte. Así las semanas se pasan sobreviviendo de lunes a viernes.",
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
export const ZONAS_TONO: Zona[] = [
    {
        key: "resiliente",
        min: 0,
        max: 25,
        title: "Resiliente",
        colorHex: "#10b981",
        ink: "#047857",
        story1: {
            validation: "Hoy recuperás más energía de la que gastás. Tu forma de descansar está funcionando.",
            action: "Esa reserva es tu margen para las semanas pesadas. Vale la pena cuidarla.",
        },
        story2: {
            reflectTitle: "Lo que más se asoma en tus respuestas",
            behindTitle: "¿Qué sostiene tu equilibrio?",
            behind: [
                "Tenés exigencias como cualquier persona. Lo que hacés distinto es desconectar al terminar el día, y eso protege tu sueño y tu cuerpo.",
                "Lo que te importa ahora es sostener ese ritmo cuando la carga suba.",
            ],
            causeTitle: "¿Qué conviene cuidar?",
        },
        story3: {
            kicker: "Una herramienta para probar hoy",
            skill: "Pausa de 10 minutos sin pantalla",
            helps: "Ayuda a que el cansancio de la tarde no llegue entero a la noche.",
            how: "A mitad de la tarde, dejá el celular en otro lado por 10 minutos. Cerrá los ojos y aflojá los hombros y la mandíbula. Respirá lento y dejá que la cabeza baje el ritmo.",
            why: "Una revisión de estudios sobre micropausas encontró que las pausas cortas durante el día aumentan la energía y reducen la fatiga. Por eso conviene hacerla a mitad de la tarde, antes de que el cansancio se acumule.",
            time: "10 min",
            when: "A mitad de la tarde",
            source: "Albulescu et al. (2022). PLOS ONE.",
        },
        story4: {
            question: "¿te gustaría tener herramientas para mantener este equilibrio cuando la carga suba?",
            subtitle: "Para eso diseñamos un taller 1 a 1.",
            helps: "En 5 sesiones armás tu propio sistema, basado en evidencia, para cuidar tu energía en las semanas exigentes.",
            ctaPrompt: "¿Tenés preguntas? Escribinos y lo conversamos.",
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
            validation: "Estás sosteniendo bastante y por ahora te alcanza. El margen es corto: lo que descansás apenas cubre lo que gastás.",
            action: "Con tan poco margen, una semana pesada puede inclinar la balanza. Cuidarlo desde ya te prepara para eso.",
        },
        story2: {
            reflectTitle: "¿Te identificás con esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Vas sumando compromisos, los sacás adelante y lo pagás con tu descanso. Siegrist (1996) lo describe como un desequilibrio entre el esfuerzo que das y lo que recibís, y es uno de los modelos de desgaste laboral más estudiados.",
                "Lo que buscás es llegar al final de la semana con energía para tu vida personal.",
            ],
            causeTitle: "¿Qué pasa si sigue así?",
        },
        story3: {
            kicker: "Una herramienta para probar hoy",
            skill: "La pausa de 5 segundos antes de decir que sí",
            helps: "Te da un momento para decidir antes de sumar otro compromiso.",
            how: "Hoy, antes de aceptar algo nuevo o quedarte más tarde, frená 5 segundos. Preguntate: «Si digo que sí a esto, ¿qué voy a posponer o delegar?». Si no podés soltar nada, negociá la fecha o decí que hoy no.",
            why: "Según el modelo de Siegrist, el desgaste aumenta cuando el esfuerzo que das supera por mucho tiempo lo que recibís a cambio. Frenar antes de aceptar es una forma concreta de cuidar ese balance.",
            time: "5 segundos",
            when: "Antes de decir que sí",
            source: "Siegrist (1996). Journal of Occupational Health Psychology.",
        },
        story4: {
            question: "¿te gustaría ganar margen para que una semana pesada no te desbalancee?",
            subtitle: "Para eso diseñamos un taller 1 a 1.",
            helps: "En 5 sesiones practicás herramientas para ordenar tu carga, poner límites sin culpa y recuperarte mejor.",
            ctaPrompt: "¿Querés saber si es para vos? Escribinos y lo vemos.",
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
            validation: "Estás gastando más energía de la que recuperás. No es falta de ganas: a tu día le falta un momento para soltar.",
            action: "Si sigue así, el cansancio de un día se suma al siguiente. Recuperar un poco cada día ayuda a frenar esa suma.",
        },
        story2: {
            reflectTitle: "¿Te identificás con esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Terminás de trabajar, pero tu cabeza sigue repasando pendientes. Mientras eso pasa, tu cuerpo no termina de bajar la guardia y el descanso rinde menos.",
                "Lo que buscás es cerrar el día en paz y dormir de una forma que sí te recargue.",
            ],
            causeTitle: "¿Qué pasa si sigue así?",
        },
        story3: {
            kicker: "Una herramienta para probar hoy",
            skill: "Cierre de jornada en una libreta",
            helps: "Saca los pendientes de tu cabeza para que te cueste menos dormirte.",
            how: "Hoy, al terminar de trabajar, anotá en un papel lo que quedó abierto y a qué hora lo vas a retomar mañana. Cerrá la libreta. Soltá el aire lento tres veces, aflojando los hombros.",
            why: "En un estudio de Scullin y su equipo, las personas que escribieron su lista de pendientes antes de dormir se durmieron más rápido que las que escribieron sobre lo que ya habían terminado. Ponerlos en papel le avisa a tu cabeza que ya no tiene que sostenerlos.",
            time: "5 min",
            when: "Al terminar de trabajar",
            source: "Scullin et al. (2018). Journal of Experimental Psychology: General.",
        },
        story4: {
            question: "¿te gustaría terminar tu jornada y desconectar de verdad?",
            subtitle: "Para eso diseñamos un taller 1 a 1.",
            helps: "En 5 sesiones practicás herramientas para cerrar el día, bajar la carga y recuperar energía, sin tener que cambiar de trabajo.",
            ctaPrompt: "¿Tenés preguntas? Escribinos, sin compromiso.",
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
            validation: "Estás dando mucho más de lo que recuperás, y tu cuerpo lo está sintiendo. Notarlo ya es un primer paso.",
            action: "En este punto, descansar más no siempre alcanza. Conviene empezar a bajar la alerta desde hoy.",
        },
        story2: {
            reflectTitle: "¿Te identificás con esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Intentás descansar y la cabeza sigue encendida o el cuerpo sigue tenso. Después de mucho tiempo bajo presión, tu sistema nervioso se acostumbra a estar en alerta y le cuesta frenar. No es falta de voluntad.",
                "Lo que buscás es volver a dormir profundo y sentir que tu energía se recupera.",
            ],
            causeTitle: "¿Qué pasa si sigue así?",
        },
        story3: {
            kicker: "Una herramienta para probar hoy",
            skill: "El suspiro fisiológico",
            helps: "Ayuda a bajar las pulsaciones y la tensión en pocos minutos.",
            how: "Tomá aire hondo por la nariz y, sin soltarlo, hacé una segunda inhalación corta para llenar del todo los pulmones. Después soltá el aire lento y largo por la boca. Repetilo durante 3 minutos.",
            why: "En un estudio de la Universidad de Stanford, practicar esta respiración 5 minutos al día mejoró el ánimo más que la meditación de atención plena. La exhalación larga le indica a tu cuerpo que puede bajar la guardia.",
            time: "3 min",
            when: "Cuando sentís que el estrés sube",
            source: "Balban et al. (2023). Cell Reports Medicine.",
        },
        story4: {
            question: "¿te gustaría salir del modo supervivencia, paso a paso?",
            subtitle: "Te acompañamos 1 a 1 en un taller práctico.",
            helps: "En 5 sesiones practicás herramientas para bajar la alerta de tu cuerpo, ordenar lo que te drena y recuperar energía.",
            ctaPrompt: "Sabemos que cuesta dar el paso. Escribinos, aunque sea para preguntar.",
        },
    },
];

export const FRECUENCIA_TONO = [
    { min: 80, lead: "Casi siempre" },
    { min: 60, lead: "Muchas veces" },
    { min: 40, lead: "A veces" },
    { min: 20, lead: "De vez en cuando" },
    { min: 0, lead: "Rara vez" },
];

/* ── Historia 4: el taller (los datos son los mismos; cambia cómo se cuenta) ── */
export const TALLER_TONO = {
    details: [
        { label: "Sesiones", value: "5 sesiones prácticas, 1 por semana" },
        { label: "Duración", value: "1 hora por sesión" },
        { label: "Modalidad", value: "1 a 1, en línea" },
        { label: "Inversión", value: "$250 por el programa completo" },
    ],
    sessions: [
        {
            num: 1,
            name: "Desconectar",
            subtitle: "Cerrar la jornada también en tu cabeza",
            why: "Practicás herramientas para apagar la mente al terminar el día y no llevarte los pendientes al descanso.",
        },
        {
            num: 2,
            name: "Organizar",
            subtitle: "Menos carga y límites más claros",
            why: "Ordenás tus pendientes, negociás plazos y practicás cómo decir que no sin culpa.",
        },
        {
            num: 3,
            name: "Recargar",
            subtitle: "Pausas que sí recuperan",
            why: "Entrenás pausas de descanso profundo para soltar la tensión del cuerpo y dormir mejor.",
        },
        {
            num: 4,
            name: "Regular",
            subtitle: "Bajar la prisa en el momento",
            why: "Herramientas de respiración y calma para frenar la prisa interna y la irritabilidad cuando el día se complica.",
        },
        {
            num: 5,
            name: "Integrar",
            subtitle: "Un plan que entra en tu rutina",
            why: "Convertís lo aprendido en hábitos simples que podés sostener en tu semana real.",
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
