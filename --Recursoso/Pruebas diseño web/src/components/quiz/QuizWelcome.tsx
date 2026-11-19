"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ListChecks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuizWelcomeProps {
    onStart: (name: string) => void;
    /** El nombre ya escrito, cuando se vuelve desde la primera pregunta */
    initialName?: string;
}

/* ── Marca: balanza Carga | Recuperación que se asienta en equilibrio ── */
export const BalanceMark = () => (
    <svg viewBox="0 0 120 70" className="h-12 sm:h-16 w-auto mx-auto" aria-hidden="true">
        {/* Remate, columna (se ensancha hacia abajo) y base en domo */}
        <rect x="57.5" y="2" width="5" height="12" rx="2.5" className="fill-foreground" />
        <path d="M57.6 18 H62.4 L63.6 62 H56.4 Z" className="fill-foreground" />
        <path d="M41 68 Q41 59 60 59 Q79 59 79 68 Z" className="fill-foreground" />

        {/* Brazo y platillos: se asientan de inclinado a nivelado */}
        <g className="welcome-balance-settle">
            <rect x="11" y="13.5" width="98" height="5" rx="2.5" className="fill-foreground" />
            {/* Platillo de Carga */}
            <line x1="15" y1="17" x2="5.5" y2="40" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="15" y1="17" x2="24.5" y2="40" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M2 40 H28 Q27 52 15 52 Q3 52 2 40 Z" fill="#f43f5e" />
            {/* Platillo de Recuperación */}
            <line x1="105" y1="17" x2="95.5" y2="40" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="105" y1="17" x2="114.5" y2="40" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M92 40 H118 Q117 52 105 52 Q93 52 92 40 Z" fill="#10b981" />
        </g>
        {/* Eje central */}
        <circle cx="60" cy="16" r="6" className="fill-foreground" />
    </svg>
);

const QuizWelcome = ({ onStart, initialName = "" }: QuizWelcomeProps) => {
    const [name, setName] = useState(initialName);
    const [showError, setShowError] = useState(false);

    /* El subtítulo nunca es más ancho que el título: se mide el renglón más largo del título
       (cambia con el tamaño de letra y de pantalla) y ese es el ancho máximo del subtítulo */
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [titleWidth, setTitleWidth] = useState<number | null>(null);
    useEffect(() => {
        const h1 = titleRef.current;
        if (!h1) return;
        const measure = () => {
            const range = document.createRange();
            range.selectNodeContents(h1);
            const rows = new Map<number, { left: number; right: number }>();
            for (const r of Array.from(range.getClientRects())) {
                const key = Math.round(r.top);
                const row = rows.get(key);
                rows.set(key, row ? { left: Math.min(row.left, r.left), right: Math.max(row.right, r.right) } : { left: r.left, right: r.right });
            }
            const widest = Math.max(0, ...Array.from(rows.values()).map((v) => v.right - v.left));
            if (widest > 0) setTitleWidth(Math.ceil(widest));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(h1);
        document.fonts?.ready.then(measure).catch(() => {});
        return () => ro.disconnect();
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setShowError(true);
            return;
        }
        onStart(trimmed);
    };

    return (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none">
            <div className="space-y-4 sm:space-y-7 text-center px-6 pt-6 sm:px-10 sm:pt-10 bg-card border rounded-2xl">

                {/* ── MARCA + TITULAR ── */}
                <div className="space-y-3 sm:space-y-4">
                    <BalanceMark />

                    <h1 ref={titleRef} className="text-[1.75rem] sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.15] [text-wrap:balance]">
                        ¿Cómo está tu balance entre{" "}
                        <span className="text-rose-600">carga</span> y{" "}
                        <span className="text-emerald-700">recuperación</span>?
                    </h1>

                    <p
                        className="text-base sm:text-lg text-muted-foreground max-w-[15.25rem] sm:max-w-[19.5rem] md:max-w-[26rem] mx-auto [text-wrap:balance] leading-snug sm:leading-relaxed"
                        style={titleWidth ? { maxWidth: titleWidth } : undefined}
                    >
                        Medí tu carga y tu recuperación. Descubrí por dónde empezar.
                    </p>

                    {/* ── 2 MINUTOS · 18 PREGUNTAS ── */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-background/80 text-xs sm:text-sm font-semibold text-foreground">
                            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                            2 minutos
                        </span>
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-background/80 text-xs sm:text-sm font-semibold text-foreground">
                            <ListChecks className="w-4 h-4 text-primary" aria-hidden="true" />
                            18 preguntas
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground max-w-md mx-auto leading-snug [text-wrap:balance]">
                        Respondé sin pensarlo demasiado. Tu primera respuesta suele ser la más sincera.
                    </p>
                </div>

                {/* ── NOMBRE + INICIO ── */}
                <form onSubmit={handleSubmit} noValidate className="max-w-sm mx-auto space-y-3 sm:space-y-4">
                    <div className="space-y-2 text-left">
                        <label htmlFor="name-input" className="text-sm font-bold text-foreground">
                            ¿Cómo te llamás?
                        </label>
                        <Input
                            id="name-input"
                            autoComplete="given-name"
                            required
                            aria-required="true"
                            aria-invalid={showError || undefined}
                            aria-describedby="name-hint"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (showError && e.target.value.trim()) setShowError(false);
                            }}
                            maxLength={40}
                            className={cn(
                                "h-14 text-base sm:text-lg rounded-xl border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                showError && "border-rose-500 focus-visible:ring-rose-500"
                            )}
                        />
                        <p
                            id="name-hint"
                            role={showError ? "alert" : undefined}
                            className={cn("text-xs", showError ? "text-rose-600 font-semibold" : "text-muted-foreground")}
                        >
                            {showError
                                ? "Escribí tu nombre para empezar."
                                : "Para personalizar tu resultado."}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        Empezar el test
                        <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
                    </Button>
                </form>

                {/* Pie de la tarjeta: una línea del ancho del botón y la firma centrada, con el mismo aire arriba y abajo */}
                <p className="!mt-4 sm:!mt-7 mx-auto max-w-sm border-t border-border/60 py-3 sm:py-5 text-center text-[13px] italic text-muted-foreground">
                    Un test de <span className="not-italic font-semibold text-foreground/80">Inner Base</span>
                </p>
            </div>
        </div>
    );
};

export default QuizWelcome;
