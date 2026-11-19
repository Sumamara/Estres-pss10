"use client";

import { ArrowDown, ArrowUpRight, RotateCcw } from "lucide-react";
import { DISCLAIMER, type ResultModel } from "./model";
import { WhatsAppIcon, useRetake } from "./parts";

/* Variante 2 · design-taste-frontend
   Tipo de sitio: service. Paleta «Rose grey, green» del catálogo de la skill
   (fondo gris rosado plano, tinta café oscuro, un solo verde para el botón principal).
   Tipografía: Schibsted Grotesk. Una sección por pantalla, bordes iguales,
   la acción principal ya en la primera pantalla, sin animaciones al hacer scroll. */

const C = {
    bg: "#ebe5e3",
    surface: "#e1dad7",
    ink: "#2b2622",
    muted: "#5f5652",
    accent: "#0f7d45",
    band: "#2b2622",
    bandInk: "#f3eeec",
    bandMuted: "#c4bab5",
};

const btnBase =
    "inline-flex items-center justify-center gap-2 h-14 px-6 rounded-[10px] text-base font-semibold transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export default function ResultTaste({ m, onRetake }: { m: ResultModel; onRetake: () => void }) {
    const retake = useRetake(onRetake);

    return (
        <div
            className="w-full text-left [&_:is(h1,h2,h3)]:[font-family:inherit] selection:bg-[#0f7d45] selection:text-white"
            style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "'Schibsted Grotesk', system-ui, sans-serif" }}
        >
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap"
            />

            {/* ── PANTALLA 1 · RESULTADO + ACCIÓN ── */}
            <section className="min-h-[100svh] flex flex-col px-5 sm:px-12 py-8 sm:py-12">
                <div className="mx-auto w-full max-w-5xl flex-1 flex flex-col justify-center gap-8">
                    <h1 className="text-[2.6rem] leading-[1.02] sm:text-7xl font-extrabold tracking-[-0.03em] [text-wrap:balance]">
                        {m.firstName ? `${m.firstName}, estás en zona ` : "Estás en zona "}
                        <span style={{ color: m.zoneInk }}>{m.zoneTitle}.</span>
                    </h1>

                    <p className="max-w-2xl text-lg sm:text-xl leading-relaxed [text-wrap:pretty]">{m.validation}</p>

                    <dl className="grid grid-cols-3 max-w-2xl border-t" style={{ borderColor: `${C.ink}26` }}>
                        {[
                            { k: "Carga", v: `${m.load} %` },
                            { k: "Recuperación", v: `${m.recovery} %` },
                            { k: "Balance", v: `${m.score}/100` },
                        ].map((f) => (
                            <div key={f.k} className="pt-4 pr-3">
                                <dt className="text-sm" style={{ color: C.muted }}>{f.k}</dt>
                                <dd className="text-2xl sm:text-3xl font-bold tabular-nums">{f.v}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={m.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${btnBase} text-white hover:shadow-[0_8px_20px_-8px_rgba(15,125,69,0.6)] focus-visible:ring-[#0f7d45]`}
                            style={{ backgroundColor: C.accent }}
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            Escribinos por WhatsApp
                        </a>
                        <button
                            type="button"
                            onClick={() => document.getElementById("taste-dia")?.scrollIntoView({ behavior: "smooth" })}
                            className={`${btnBase} border focus-visible:ring-[#2b2622]`}
                            style={{ borderColor: `${C.ink}40` }}
                        >
                            Ver por dónde empezar
                            <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
                <p className="mx-auto w-full max-w-5xl pt-8 text-sm leading-relaxed" style={{ color: C.muted }}>
                    {DISCLAIMER}
                </p>
            </section>

            {/* ── PANTALLA 2 · TU DÍA A DÍA (la única banda oscura) ── */}
            <section
                id="taste-dia"
                className="min-h-[100svh] flex px-5 sm:px-12 py-16 scroll-mt-24"
                style={{ backgroundColor: C.band, color: C.bandInk }}
            >
                <div className="mx-auto w-full max-w-5xl flex flex-col justify-center gap-10">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em]">Tu día a día, en tus respuestas</h2>
                    <p className="max-w-3xl text-xl sm:text-2xl leading-snug font-medium [text-wrap:pretty]">{m.mirror}</p>
                    {m.signals.length > 0 ? (
                        <ul className="max-w-3xl border-t" style={{ borderColor: `${C.bandInk}33` }}>
                            {m.signals.map((s) => (
                                <li
                                    key={s.text}
                                    className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-4 border-b"
                                    style={{ borderColor: `${C.bandInk}33` }}
                                >
                                    <span className="text-lg">{s.text}</span>
                                    <span className="text-sm font-semibold" style={{ color: C.bandMuted }}>
                                        {s.frequency}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-lg" style={{ color: C.bandMuted }}>
                            Ninguna señal de desgaste aparece con frecuencia en tus respuestas.
                        </p>
                    )}
                </div>
            </section>

            {/* ── PANTALLA 3 · UNA COSA PARA HOY ── */}
            <section className="min-h-[100svh] flex px-5 sm:px-12 py-16">
                <div className="mx-auto w-full max-w-5xl flex flex-col justify-center gap-8">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em]">Una cosa para hoy</h2>
                    <p className="max-w-3xl text-[2rem] sm:text-6xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
                        {m.today.title}
                    </p>
                    <p className="max-w-2xl text-lg sm:text-xl leading-relaxed">{m.today.how}</p>
                </div>
            </section>

            {/* ── PANTALLA 4 · TU SESIÓN + ACCIÓN ── */}
            <section className="min-h-[100svh] flex px-5 sm:px-12 py-16" style={{ backgroundColor: C.surface }}>
                <div className="mx-auto w-full max-w-5xl flex flex-col justify-center gap-8">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.02em] [text-wrap:balance]">
                        Tu sesión clave del taller: {m.session.title}
                    </h2>
                    <p className="max-w-2xl text-lg sm:text-xl leading-relaxed">
                        {m.session.subtitle}. {m.session.why}
                    </p>

                    <ol className="max-w-3xl border-t" style={{ borderColor: `${C.ink}26` }}>
                        {m.sessions.map((s) => (
                            <li
                                key={s.num}
                                className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_12rem_1fr] gap-x-3 py-3.5 border-b"
                                style={{ borderColor: `${C.ink}26` }}
                            >
                                <span className="tabular-nums font-semibold" style={{ color: s.isTop ? C.accent : C.muted }}>
                                    {s.num}
                                </span>
                                <span className={s.isTop ? "font-bold" : "font-semibold"}>
                                    {s.name}
                                    {s.isTop && (
                                        <span className="ml-2 text-sm font-semibold" style={{ color: C.accent }}>
                                            Tu prioridad
                                        </span>
                                    )}
                                </span>
                                <span className="col-start-2 sm:col-start-auto text-base" style={{ color: C.muted }}>
                                    {s.subtitle}
                                </span>
                            </li>
                        ))}
                    </ol>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={m.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${btnBase} text-white hover:shadow-[0_8px_20px_-8px_rgba(15,125,69,0.6)] focus-visible:ring-[#0f7d45]`}
                            style={{ backgroundColor: C.accent }}
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            Pedir información del taller
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <button
                            type="button"
                            onClick={retake}
                            className={`${btnBase} focus-visible:ring-[#2b2622]`}
                            style={{ color: C.muted }}
                        >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Volver a hacer el test
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
