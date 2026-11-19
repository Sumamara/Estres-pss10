export interface QuizQuestion {
    id: number;
    text: string;
    rev: boolean; // Si es true, se puntúa al revés (4 - respuesta)
}

export interface QuizBand {
    max: number;
    key: string;
    name: string;
    color: string;
    ledePoints: { label: string; text: string }[];
    skill: string;
    how: string;
    why: string;
}

export const quizQuestions: QuizQuestion[] = [
    { id: 1, text: "¿Con qué frecuencia te has sentido afectado por algo que ocurrió inesperadamente?", rev: false },
    { id: 2, text: "¿Con qué frecuencia has sentido que no podías controlar las cosas importantes de tu vida?", rev: false },
    { id: 3, text: "¿Con qué frecuencia te has sentido nervioso o estresado?", rev: false },
    { id: 4, text: "¿Con qué frecuencia te has sentido seguro de tu capacidad para manejar tus problemas personales?", rev: true },
    { id: 5, text: "¿Con qué frecuencia has sentido que las cosas te iban bien?", rev: true },
    { id: 6, text: "¿Con qué frecuencia has sentido que no podías con todo lo que tenías que hacer?", rev: false },
    { id: 7, text: "¿Con qué frecuencia has podido controlar las dificultades de tu vida?", rev: true },
    { id: 8, text: "¿Con qué frecuencia has sentido que tenías todo bajo control?", rev: true },
    { id: 9, text: "¿Con qué frecuencia te has sentido enfadado por cosas que estaban fuera de tu control?", rev: false },
    { id: 10, text: "¿Con qué frecuencia has sentido que los problemas se acumulaban tanto que no podías superarlos?", rev: false }
];

export const quizBands: QuizBand[] = [
    {
        max: 13, 
        key: "con-margen", 
        name: "Con margen", 
        color: "text-emerald-600",
        ledePoints: [
            { label: "Dónde estás", text: "Ahora estamos en un rango controlado." },
            { label: "Qué significa", text: "No significa que estés relajado: significa que en este momento tienes la presión bajo control." },
            { label: "Por qué importa ahora", text: "Este es el mejor momento para aprender a manejarlo, porque las habilidades se construyen mejor antes de necesitarlas." },
        ],
        skill: "Ponerle nombre a lo que sientes",
        how: "Cuando notes tensión, escribe una frase concreta: «estoy ansioso por la reunión del jueves», no «estoy mal». Una frase, en el móvil o en papel. Nombrar no es quejarse: es bajarle el volumen.",
        why: "Estudios de neuroimagen (Lieberman et al., 2007) muestran que poner en palabras una emoción con precisión reduce la actividad de la amígdala, la zona que dispara la respuesta de alarma."
    },
    {
        max: 26, 
        key: "en-tension", 
        name: "En tensión", 
        color: "text-amber-500",
        ledePoints: [
            { label: "Dónde estás", text: "Estás en la franja donde vive la mayoría de los profesionales: funcionas, cumples, respondes, pero con el motor revolucionado casi todo el tiempo." },
            { label: "El problema", text: "El problema de esta zona es que se normaliza." },
            { label: "Por qué importa", text: "No duele lo suficiente para actuar, y por eso se sostiene durante años." },
        ],
        skill: "El cierre de jornada",
        how: "Cinco minutos al terminar de trabajar: anota lo que quedó pendiente y cuándo lo retomas. Fecha y hora concretas. Después, cierra. Lo que agota no es el pendiente: es cargarlo sin fecha.",
        why: "La investigación sobre desconexión psicológica del trabajo (Sonnentag y cols.) es consistente: quien no logra soltar el trabajo mentalmente se recupera peor, aunque descanse las mismas horas."
    },
    {
        max: 40, 
        key: "al-limite", 
        name: "Al límite", 
        color: "text-rose-600",
        ledePoints: [
            { label: "Dónde estás", text: "Tu nivel de estrés percibido está alto." },
            { label: "Qué está pasando", text: "Estás gastando más de lo que repones, y eso normalmente se nota antes en el cuerpo y en el sueño que en la cabeza." },
            { label: "Qué toca ahora", text: "Aquí no toca organizarse mejor ni aguantar más: toca bajar la activación primero." },
        ],
        skill: "El suspiro fisiológico",
        how: "Dos inhalaciones seguidas por la nariz (la segunda corta, encima de la primera) y una exhalación larga por la boca. Repite cinco minutos. Es lo más rápido que existe para bajar la activación sin depender de nada ni de nadie.",
        why: "Un ensayo controlado de Stanford (Balban et al., 2023) encontró que cinco minutos diarios de esta respiración mejoraban el estado de ánimo y reduían la frecuencia respiratoria en reposo más que la meditación en el mismo tiempo."
    }
];

export const getStressProfile = (answers: number[]) => {
    // Calculamos puntuación total
    let totalScore = 0;
    
    answers.forEach((ans, index) => {
        const question = quizQuestions[index];
        if (question.rev) {
            totalScore += (4 - ans);
        } else {
            totalScore += ans;
        }
    });

    const score100 = Math.round((totalScore / 40) * 100);

    let band = quizBands[quizBands.length - 1]; // Default to highest
    for (let i = 0; i < quizBands.length; i++) {
        if (totalScore <= quizBands[i].max) {
            band = quizBands[i];
            break;
        }
    }

    return {
        totalScore,
        score100,
        band
    };
};
