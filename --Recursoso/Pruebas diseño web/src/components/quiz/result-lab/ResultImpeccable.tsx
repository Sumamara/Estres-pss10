"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import { DISCLAIMER, type ResultModel } from "./model";
import { TiltBalance, WhatsAppIcon, useRetake } from "./parts";

/* Variante 1 · impeccable
   Mismo mundo visual de la bienvenida (azul, Outfit, la balanza), reducido a 4 bloques:
   tu resultado → tu día a día → una cosa para hoy → tu sesión + WhatsApp. */
export default function ResultImpeccable({ m, onRetake }: { m: ResultModel; onRetake: () => void }) {
    const retake = useRetake(onRetake);

    return (
        <div className="w-full max-w-xl mx-auto px-4 pb-16 text-left animate-in fade-in duration-500 motion-reduce:animate-none">
            {/* ── 1. TU RESULTADO ── */}
            <section className="bg-card border rounded-2xl p-6 sm:p-10 space-y-6" aria-labelledby="imp-h1">
                <TiltBalance load={m.load} recovery={m.recovery} className="h-16 sm:h-20 w-auto text-foreground" />

                <div className="space-y-3">
                    <h1 id="imp-h1" className="text-[1.75rem] sm:text-4xl font-bold tracking-tight leading-[1.15] [text-wrap:balance]">
                        {m.firstName ? `${m.firstName}, estás en zona ` : "Estás en zona "}
                        <span style={{ color: m.zoneInk }}>{m.zoneTitle}</span>
                    </h1>
                    <p className="text-base sm:text-lg text-foreground/85 leading-relaxed [text-wrap:pretty]">{m.validation}</p>
                </div>

                {/* Escala: un solo número, con su significado a cada lado */}
                <div className="space-y-2">
                    <div className="relative pt-7">
                        <span
                            className="absolute top-0 -translate-x-1/2 text-sm font-bold tabular-nums whitespace-nowrap"
                            style={{ left: `clamp(2rem, ${m.score}%, calc(100% - 2rem))`, color: m.zoneInk }}
                        >
                            {m.score} de 100
                        </span>
                        <div className="flex h-2.5 gap-1" aria-hidden="true">
                            {m.zones.map((z) => (
                                <span
                                    key={z.key}
                                    className="flex-1 first:rounded-l-full last:rounded-r-full"
                                    style={{ backgroundColor: z.hex, opacity: z.key === m.zoneKey ? 1 : 0.22 }}
                                />
                            ))}
                        </div>
                        <span
                            className="absolute top-[1.35rem] h-5 w-1.5 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-card"
                            style={{ left: `${m.score}%` }}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Más recuperación</span>
                        <span>Más desgaste</span>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{m.explanation}</p>

                <p className="text-sm text-foreground/80 leading-relaxed border-t border-border/60 pt-4">{DISCLAIMER}</p>
            </section>

            {/* ── 2. TU DÍA A DÍA ── */}
            <section className="pt-12 space-y-4" aria-labelledby="imp-h2a">
                <h2 id="imp-h2a" className="text-2xl font-bold tracking-tight">Cómo se ve en tu día a día</h2>
                <p className="text-lg leading-relaxed text-foreground/90 [text-wrap:pretty]">{m.mirror}</p>
                {m.signals.length > 0 ? (
                    <ul className="divide-y divide-border/70 border-y border-border/70">
                        {m.signals.map((s) => (
                            <li key={s.text} className="py-3.5 flex items-baseline justify-between gap-4">
                                <span className="text-base text-foreground">{s.text}</span>
                                <span className="shrink-0 text-sm font-semibold text-muted-foreground">{s.frequency}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-base text-muted-foreground">
                        Ninguna señal de desgaste aparece con frecuencia en tus respuestas.
                    </p>
                )}
            </section>

            {/* ── 3. UNA COSA PARA HOY ── */}
            <section className="pt-12 space-y-4" aria-labelledby="imp-h2b">
                <h2 id="imp-h2b" className="text-2xl font-bold tracking-tight">Una cosa para hoy</h2>
                <div className="rounded-2xl bg-primary/[0.07] p-6 space-y-2">
                    <p className="text-lg font-semibold text-foreground">{m.today.title}</p>
                    <p className="text-base text-foreground/80 leading-relaxed">{m.today.how}</p>
                </div>
            </section>

            {/* ── 4. TU SESIÓN + WHATSAPP ── */}
            <section className="pt-12 space-y-5" aria-labelledby="imp-h2c">
                <h2 id="imp-h2c" className="text-2xl font-bold tracking-tight">Por dónde empezar en el taller</h2>
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary">
                        {m.session.name}, de 5
                    </p>
                    <p className="text-3xl font-bold tracking-tight font-[Outfit]">{m.session.title}</p>
                    <p className="text-lg text-foreground/85">{m.session.subtitle}</p>
                    <p className="text-base text-muted-foreground leading-relaxed">{m.session.why}</p>
                </div>

                <a
                    href={m.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full h-14 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-lg font-bold transition-transform active:scale-[0.98] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <WhatsAppIcon className="h-5 w-5" />
                    Escribinos por WhatsApp
                </a>
                <p className="text-sm text-muted-foreground text-center">
                    El mensaje ya va escrito con tu resultado. Solo tenés que enviarlo.
                </p>

                <details className="group border-t border-border/70 pt-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                        Ver las 5 sesiones del taller
                        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ol className="mt-2 space-y-3">
                        {m.sessions.map((s) => (
                            <li key={s.num} className="flex gap-3">
                                <span className="w-5 shrink-0 text-sm font-bold tabular-nums text-muted-foreground pt-0.5">{s.num}</span>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {s.name}
                                        {s.isTop && <span className="ml-2 text-sm font-semibold text-primary">Tu prioridad</span>}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{s.subtitle}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </details>

                <details className="group border-t border-border/70 pt-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                        Ver el detalle de tus respuestas
                        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <div className="mt-3 grid gap-6">
                        <DetailGroup title="Lo que te desgasta" note="Más alto, más desgaste" items={m.drains} color="#e11d48" />
                        <DetailGroup title="Lo que te recupera" note="Más alto, mejor" items={m.recharges} color="#059669" />
                    </div>
                </details>
            </section>

            <div className="pt-10 flex justify-center">
                <button
                    type="button"
                    onClick={retake}
                    className="inline-flex items-center gap-2 min-h-[44px] px-3 text-sm text-muted-foreground hover:text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Volver a hacer el test
                </button>
            </div>
        </div>
    );
}

function DetailGroup({
    title,
    note,
    items,
    color,
}: {
    title: string;
    note: string;
    items: { label: string; score: number }[];
    color: string;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-bold">{title}</h3>
                <span className="text-xs text-muted-foreground">{note}</span>
            </div>
            <ul className="space-y-2.5">
                {items.map((it) => (
                    <li key={it.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-foreground">{it.label}</span>
                            <span className="font-semibold tabular-nums">{it.score} %</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                            <div className="h-full rounded-full" style={{ width: `${it.score}%`, backgroundColor: color }} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
