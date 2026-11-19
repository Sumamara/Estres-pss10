/* ═══════════════════════════════════════════════════════════════════════════
   PAEM-18 · COPY ORIGINAL (respaldo de referencia para comparar en /prueba-resultados)
   Para editar el copy activo (Copy 2 y producción), usá src/content/taller.ts
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Dimension, Zona } from "./taller";

export const ESCALA_ORIGINAL = [
    { value: 5, label: "Casi nunca", pct: "5%" },
    { value: 20, label: "Rara vez", pct: "20%" },
    { value: 40, label: "Ocasionalmente", pct: "40%" },
    { value: 60, label: "Frecuentemente", pct: "60%" },
    { value: 80, label: "Muy frecuentemente", pct: "80%" },
    { value: 95, label: "Casi siempre", pct: "95%" },
];

export const DIMENSIONES_ORIGINAL: Dimension[] = [
    {
        id: "dim1",
        part: "A",
        questions: [
            {
                id: 1,
                text: "Siento que las demandas y pendientes de mi día a día superan mi capacidad o mi tiempo para resolverlos.",
                symptom: "Sentir que el día no alcanza",
                fragment: "sentís que la lista de pendientes va más rápido que tu tiempo",
            },
            {
                id: 2,
                text: "Siento que los imprevistos o cambios repentinos me desestabilizan y me hacen perder la sensación de control.",
                symptom: "Imprevistos que te descolocan",
                fragment: "un cambio de planes o imprevisto te saca de balance y te quita sensación de control",
            },
            {
                id: 3,
                text: "Me cuesta concentrarme, tomar decisiones simples o recordar cosas porque siento mi mente saturada.",
                symptom: "Mente saturada y olvidos",
                fragment: "tenés la cabeza tan llena de cosas que te cuesta concentrarte, decidir o recordar",
            },
        ],
        channel: {
            name: "Tu Mente",
            longName: "Tu Mente (Saturación mental)",
            feel: "Tu cabeza casi no para: entre pendientes y decisiones, es ahí donde más se te acumula el estrés.",
            cost: {
                title: "El riesgo de normalizar la saturación mental",
                description: "Cuando te acostumbrás a vivir con la cabeza llena de pendientes, al principio seguís cumpliendo por pura fuerza de voluntad. Pero si lo sostenés meses, tareas simples empiezan a tomarte el doble de tiempo, aparecen olvidos frecuentes y sentís que trabajás todo el día sin avanzar.",
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
                symptom: "Prisa interna y aceleración",
                fragment: "vivís con sensación de prisa interna o aceleración y te cuesta bajar la velocidad",
            },
            {
                id: 5,
                text: "Tengo poca paciencia y me irrito o frustro con facilidad ante pequeños retrasos, errores o interrupciones.",
                symptom: "Poca paciencia e irritabilidad",
                fragment: "notás que tenés poca paciencia y que los retrasos o interrupciones te irritan",
            },
            {
                id: 6,
                text: "Me cuesta bajar revoluciones o desconectarme al terminar el día.",
                symptom: "Dificultad para desconectar al final del día",
                fragment: "te cuesta bajar revoluciones o desconectarte al terminar tus obligaciones",
            },
        ],
        channel: {
            name: "Reactividad Emocional",
            longName: "Tus Emociones (Reactividad emocional)",
            feel: "La prisa interna, la poca paciencia o la dificultad para bajar revoluciones son donde primero se te nota la presión.",
            cost: {
                title: "El riesgo de vivir siempre en «modo urgencia»",
                description: "Funcionar con prisa interna y poca paciencia parece normal porque te mantiene resolviendo cosas. El costo silencioso es que esa tensión se filtra hacia tus relaciones más cercanas y te quita la capacidad de disfrutar incluso cuando todo está bien.",
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
                symptom: "Tensión en cuello, espalda o mandíbula",
                fragment: "tu cuerpo descarga la presión apretando el cuello, los hombros, la espalda o la mandíbula",
            },
            {
                id: 8,
                text: "Siento molestias en el cuerpo. Como problemas en el estómago (nudo en el estomago, pesadez), dolor de cabeza o latidos rápidos.",
                symptom: "Molestias físicas y estomacales",
                fragment: "tu cuerpo manifiesta la presión con molestias en el estómago, dolor de cabeza o latidos acelerados",
            },
            {
                id: 9,
                text: "Siento que termino la jornada completamente drenado/a de energía, o despierto por la mañana sintiendo que el sueño no me recargó.",
                symptom: "Terminar drenado o sueño sin recarga",
                fragment: "terminás el día completamente sin batería o sentís que el sueño no te recargó",
            },
        ],
        channel: {
            name: "Desgaste Corporal",
            longName: "Tu Cuerpo (Desgaste corporal)",
            feel: "El cuello, el estómago o levantarte sin energía son las señales donde tu cuerpo más resiente la carga.",
            cost: {
                title: "La factura silenciosa que el cuerpo cobra de golpe",
                description: "Tu cabeza puede decirse a sí misma «no pasa nada, todavía aguanto», pero tu cuerpo lleva la cuenta exacta. Cuando despertar cansado, tener el cuello rígido o sentir malestar en el estómago se vuelve costumbre, el cuerpo termina obligándote a parar de golpe.",
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
                symptom: "Escape en pantallas o comida para no pensar",
                fragment: "buscás refugio en pantallas, sustancias o comida para «anestesiar» la mente y no pensar",
            },
            {
                id: 11,
                text: "Postergo tareas importantes o me aíslo de las personas porque me siento bloqueado/a y sin energía para lidiar con ello.",
                symptom: "Bloqueo o ganas de aislarte",
                fragment: "postergás cosas importantes o preferís aislarte porque te sentís sin batería",
            },
            {
                id: 12,
                text: "Me cuesta poner límites o decir que 'no' y termino sacrificando mi descanso y tiempo personal.",
                symptom: "Ceder tu descanso por no poner límites",
                fragment: "te cuesta poner límites o decir que «no» y terminás sacrificando tus pausas y tu tiempo personal",
            },
        ],
        channel: {
            name: "Reacciones Conductuales",
            longName: "Tus Hábitos (Reacciones conductuales)",
            feel: "Se nota al final del día: cuesta poner límites, postergás o buscás escapes para anestesiar la cabeza.",
            cost: {
                title: "La trampa de «aguantar en el día y anestesiarte en la noche»",
                description: "Cuando sacrificás tus pausas por no saber decir que no, llegás a la noche tan vacío de energía que lo único que querés es desconectar con cualquier escape. Sin darte cuenta, las semanas se pasan solo sobreviviendo de lunes a viernes.",
            },
        },
    },
    {
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

export const ZONAS_ORIGINAL: Zona[] = [
    {
        key: "resiliente",
        min: 0,
        max: 25,
        title: "Resiliente",
        colorHex: "#10b981",
        ink: "#047857",
        story1: {
            validation: "Tu recuperación le está ganando a tu carga. Lo que hacés para descansar está funcionando.",
            action: "Tenés reserva para los días exigentes. Seguir cuidando tu recarga es lo que la mantiene.",
        },
        story2: {
            reflectTitle: "Lo que más se asoma en tus respuestas",
            behindTitle: "¿Qué hay detrás de tu equilibrio?",
            behind: [
                "Lográs responder a las exigencias del día sin que el estrés se quede instalado en tu cuerpo ni en tu sueño.",
                "No significa que no tengás retos, sino que hoy sabés apagar la alarma cuando termina el día.",
            ],
            causeTitle: "Qué cuidar para mantenerlo",
        },
        story3: {
            skill: "Pausa de Descanso Profundo (10 min)",
            how: "Reservá 10 minutos a mitad de la tarde para cerrar los ojos, soltar la mandíbula y los hombros, y respirar lento sin pantallas cerca. No busqués dormir: solo permití que tu sistema baje de revoluciones.",
            why: "Hacer una pausa consciente a mitad de jornada evita que el cansancio silencioso se acumule para la noche y mantiene tu claridad mental.",
            helps: "A que el cansancio no se acumule hasta la noche y llegues al final del día con más energía y la cabeza más clara.",
            time: "10 min",
            when: "A mitad de la tarde",
            source: "Albulescu et al. (2022). PLOS ONE.",
        },
        story4: {
            question: "¿querés blindar lo que ya tenés?",
            helps: "A sostener el equilibrio que ya tenés, con herramientas listas para cuando la carga suba.",
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
            validation: "Estás sosteniendo bastante y por ahora te alcanza. El margen es corto: vale la pena cuidarlo.",
            action: "Te recuperás, pero con poco margen. Cuidar tu recarga ahora te prepara para las semanas pesadas.",
        },
        story2: {
            reflectTitle: "¿Te identificás con esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Lo que recuperás alcanza, pero justo: llegás al final de la semana sin mucha energía de sobra.",
                "No estás en crisis, pero tu equilibrio depende de que nada se complique. Un imprevisto o una semana pesada puede inclinar la balanza.",
            ],
            causeTitle: "¿Qué puede causar esto?",
        },
        story3: {
            skill: "La Regla del Intercambio antes de Decir «Sí»",
            how: "Hoy, antes de aceptar un pendiente nuevo o quedarte más tarde, hacé una pausa de 5 segundos y preguntate: «Si le digo que sí a esto, ¿qué voy a posponer o delegar?». Luego dividí tu tarea más pesada en 3 pasos de 15 minutos.",
            why: "Cuando sos muy capaz, tu mayor enemigo no es la falta de habilidad, sino el sobrecompromiso silencioso que vacía tu batería semana tras semana.",
            helps: "A dejar de sumar pendientes sin darte cuenta y a cuidar tu energía de compromisos que no elegiste.",
            time: "Unos segundos",
            when: "Antes de decir que sí",
            source: "Siegrist (1996). Journal of Occupational Health Psychology.",
        },
        story4: {
            question: "¿sentís que es momento de un cambio?",
            helps: "A ganar margen: recuperarte mejor para que una semana pesada no te desbalancee.",
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
            validation: "Estás cargando más de lo que alcanzás a recuperar. No es falta de ganas: te está faltando espacio para soltar.",
            action: "El desgaste se va sumando. Recargar un poco cada día evita que llegue a agotarte.",
        },
        story2: {
            reflectTitle: "¿Te identificás con esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Estás cargando más de lo que alcanzás a recuperar: el cansancio de un día se pasa al siguiente.",
                "No es falta de ganas: a tu rutina le falta espacio para soltar. Si sigue así, el desgaste se va sumando semana a semana.",
            ],
            causeTitle: "¿Qué puede causar esto?",
        },
        story3: {
            skill: "El Ritual de Cierre de Jornada (5 min)",
            how: "Al terminar tus obligaciones de hoy, dedicá 5 minutos a escribir en papel lo que quedó pendiente y a qué hora exacta lo retomarás mañana. Cerrá la libreta y hacé 3 respiraciones profundas soltando los hombros.",
            why: "Lo que más agota a tu cerebro por la noche no es el trabajo pendiente, sino tratar de recordarlo todo sin haberle dado una fecha y un cierre claro.",
            helps: "A soltar los pendientes al terminar el día para que tu cabeza descanse y te cueste menos dormirte.",
            time: "5 min",
            when: "Al terminar tu jornada",
            source: "Scullin et al. (2018). Journal of Experimental Psychology: General.",
        },
        story4: {
            question: "¿sentís que es momento de un cambio?",
            helps: "A frenar el desgaste de cada día: bajar la carga y recargar de verdad antes de que se acumule.",
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
            validation: "Estás dando mucho más de lo que recuperás, y tu cuerpo lo está sintiendo. Notarlo es el primer paso para cuidarte.",
            action: "Descansar ya no alcanza: por eso conviene empezar a recargar con intención, desde hoy.",
        },
        story2: {
            reflectTitle: "¿Te identificás con esto?",
            behindTitle: "¿Qué hay detrás de estas señales?",
            behind: [
                "Estás gastando más energía de la que lográs reponer. Aunque intentés descansar, tu cabeza sigue encendida o tu cuerpo sigue tenso.",
                "Tu «freno» natural está agotado: pasás del acelerador al cansancio extremo sin lograr una recuperación real.",
            ],
            causeTitle: "¿Qué puede causar esto?",
        },
        story3: {
            skill: "El Suspiro Fisiológico (Freno en 3 minutos)",
            how: "Tomá aire dos veces seguidas por la nariz (una inhalación profunda y, sin soltar, una segunda inhalación corta para llenar del todo los pulmones) y luego soltá el aire largo y suave por la boca. Repetí durante 3 minutos.",
            why: "Es una de las formas más rápidas de bajar las pulsaciones y enviarle al cerebro la señal física de que ya puede bajar la guardia.",
            helps: "A bajar las pulsaciones y la tensión en pocos minutos, justo cuando sentís que el estrés te acelera.",
            time: "3 min",
            when: "Cuando sentís el estrés",
            source: "Balban et al. (2023). Cell Reports Medicine.",
        },
        story4: {
            question: "¿sentís que es momento de un cambio?",
            helps: "A salir del modo supervivencia: frenar el agotamiento y recuperar tu energía, paso a paso.",
        },
    },
];

export const FRECUENCIA_ORIGINAL = [
    { min: 80, lead: "Casi siempre" },
    { min: 60, lead: "Muchas veces" },
    { min: 40, lead: "A veces" },
    { min: 0, lead: "De vez en cuando" },
];

export const TALLER_ORIGINAL = {
    details: [
        { label: "Sesiones", value: "5 sesiones prácticas" },
        { label: "Duración", value: "1 h por semana" },
        { label: "Modalidad", value: "1 a 1, en línea" },
        { label: "Inversión", value: "$250" },
    ],
    sessions: [
        {
            num: 1,
            name: "Desconectar",
            subtitle: "Que el estrés no te siga a casa",
            why: "Aprenderás a apagar la mente al terminar el día para dejar de llevar los pendientes a tu descanso.",
        },
        {
            num: 2,
            name: "Organizar",
            subtitle: "Menos carga, menos estrés acumulado",
            why: "Aprenderás a bajarle el volumen a las demandas abrumadoras, ordenar pendientes y poner límites sin culpa.",
        },
        {
            num: 3,
            name: "Recargar",
            subtitle: "Terminá el día con energía",
            why: "Entrenarás pausas de descanso profundo para soltar la tensión del cuerpo y despertar realmente recuperado.",
        },
        {
            num: 4,
            name: "Regular",
            subtitle: "Manejá los picos de estrés en caliente",
            why: "Tendrás herramientas rápidas de respiración y calma para frenar la prisa interna y la irritabilidad en minutos.",
        },
        {
            num: 5,
            name: "Integrar",
            subtitle: "Hábitos reales para no recaer",
            why: "Convertirás todo lo aprendido en un plan simple para tu rutina diaria sin depender de pantallas para escapar.",
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

